// backend/controllers/adminController.js
const Booking = require("../models/Booking");
const User = require("../models/User");
const Inventory = require("../models/Inventory");
const {
  deductInventoryQuantity,
  restockInventoryQuantity,
} = require("../utils/inventoryHelpers");
const { applyStatusChange } = require("../utils/bookingStatusHelpers");
// ─────────────────────────────────────────
// @GET    /api/admin/stats
// @Access Admin only
// @Desc   Get dashboard statistics
// ─────────────────────────────────────────
const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const todayEnd = new Date(now.setHours(23, 59, 59, 999));
    // Total counts
    const totalBookings = await Booking.countDocuments();
    const totalUsers = await User.countDocuments({ role: "user" });
    const pendingBookings = await Booking.countDocuments({ status: "pending" });
    const confirmedBookings = await Booking.countDocuments({
      status: "confirmed",
    });
    const inProgressBookings = await Booking.countDocuments({
      status: "in_progress",
    });
    const completedBookings = await Booking.countDocuments({
      status: "completed",
    });
    const cancelledBookings = await Booking.countDocuments({
      status: "cancelled",
    });
    const todayBookings = await Booking.countDocuments({
      createdAt: { $gte: todayStart, $lte: todayEnd },
    });
    // Revenue from completed bookings
    const revenueData = await Booking.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$finalCost" },
          avgCost: { $avg: "$finalCost" },
        },
      },
    ]);
    // Low stock count
    const lowStockCount = await Inventory.countDocuments({ isLowStock: true });
    // Recent 5 bookings
    const recentBookings = await Booking.find()
      .populate("user", "name email phone")
      .sort({ createdAt: -1 })
      .limit(5);
    // Top issues
    const topIssues = await Booking.aggregate([
      { $group: { _id: "$issueCategory", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);
    res.json({
      success: true,
      stats: {
        totalBookings,
        totalUsers,
        pendingBookings,
        confirmedBookings,
        inProgressBookings,
        completedBookings,
        cancelledBookings,
        todayBookings,
        totalRevenue: revenueData[0]?.totalRevenue || 0,
        avgRevenue: Math.round(revenueData[0]?.avgCost || 0),
        lowStockCount,
        recentBookings,
        topIssues,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// ─────────────────────────────────────────
// @GET    /api/admin/bookings
// @Access Admin only
// @Desc   Get all bookings with filters & pagination
// ─────────────────────────────────────────
const getAllBookingsAdmin = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      search,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { deviceBrand: { $regex: search, $options: "i" } },
        { deviceModel: { $regex: search, $options: "i" } },
        { bookingRef: { $regex: search, $options: "i" } },
      ];
    }
    const total = await Booking.countDocuments(filter);
    const bookings = await Booking.find(filter)
      .populate("user", "name email phone")
      .sort({ [sortBy]: order === "asc" ? 1 : -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));
    res.json({
      success: true,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      bookings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// ─────────────────────────────────────────
// @GET    /api/admin/bookings/:id
// @Access Admin only
// @Desc   Get single booking by ID
// ─────────────────────────────────────────
const getBookingByIdAdmin = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("statusHistory.changedBy", "name")
      .populate(
        "partsUsed.inventoryItem",
        "partName partCode category quantity sellingPrice",
      );
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }
    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// ─────────────────────────────────────────
// @GET    /api/admin/bookings/:id/device-password
// @Access Admin only
// @Desc   Explicitly reveal the device unlock password (excluded by default)
// ─────────────────────────────────────────
const getBookingDevicePassword = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).select(
      "+devicePassword",
    );
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }
    res.json({
      success: true,
      devicePassword: booking.getDevicePassword() || "Not provided",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// ─────────────────────────────────────────
// @POST   /api/admin/bookings/:id/parts
// @Access Admin only
// @Desc   Use an inventory part on a repair booking (deducts stock)
// ─────────────────────────────────────────
const addPartToBooking = async (req, res) => {
  try {
    const { inventoryItemId, quantity } = req.body;
    const qty = Number(quantity);
    if (!inventoryItemId || !qty || qty < 1) {
      return res.status(400).json({
        success: false,
        message: "inventoryItemId and a quantity of at least 1 are required",
      });
    }
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }
    if (booking.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cannot use parts on a cancelled booking",
      });
    }
    // Atomic deduct — avoids a race where two concurrent requests both read
    // sufficient stock and over-deduct below zero.
    let item;
    try {
      item = await deductInventoryQuantity(inventoryItemId, qty);
    } catch (err) {
      return res
        .status(err.statusCode || 500)
        .json({ success: false, message: err.message });
    }
    // Record on booking (snapshot of part details at time of use)
    booking.partsUsed.push({
      inventoryItem: item._id,
      partName: item.partName,
      partCode: item.partCode,
      quantity: qty,
      unitPrice: item.sellingPrice,
    });
    await booking.save();
    await booking.populate(
      "partsUsed.inventoryItem",
      "partName partCode category quantity sellingPrice",
    );
    res.status(201).json({
      success: true,
      message: `${qty} x "${item.partName}" deducted from inventory`,
      booking,
      inventoryItem: item,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// ─────────────────────────────────────────
// @DELETE /api/admin/bookings/:id/parts/:partId
// @Access Admin only
// @Desc   Undo a part usage on a booking (restocks inventory)
// ─────────────────────────────────────────
const removePartFromBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }
    const part = booking.partsUsed.id(req.params.partId);
    if (!part) {
      return res
        .status(404)
        .json({ success: false, message: "Part usage entry not found" });
    }
    // Restock inventory atomically (if the item still exists)
    await restockInventoryQuantity(part.inventoryItem, part.quantity);
    part.deleteOne();
    await booking.save();
    await booking.populate(
      "partsUsed.inventoryItem",
      "partName partCode category quantity sellingPrice",
    );
    res.json({
      success: true,
      message: "Part usage removed and stock restored",
      booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// ─────────────────────────────────────────
// @PUT    /api/admin/bookings/:id/status
// @Access Admin only
// @Desc   Update booking status + optional note & cost
// ─────────────────────────────────────────
const updateBookingStatusAdmin = async (req, res) => {
  try {
    const { status, adminNote, estimatedCost, finalCost, technicianName } =
      req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }
    await applyStatusChange(booking, {
      status,
      adminNote,
      estimatedCost,
      finalCost,
      technicianName,
      changedBy: req.user._id,
    });
    res.json({ success: true, booking });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ success: false, message: error.message });
  }
};
// ─────────────────────────────────────────
// @DELETE /api/admin/bookings/:id
// @Access Admin only
// @Desc   Delete a booking
// ─────────────────────────────────────────
const deleteBookingAdmin = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }
    res.json({ success: true, message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// ─────────────────────────────────────────
// @GET    /api/admin/users
// @Access Admin only
// @Desc   Get all users (excluding admins)
// ─────────────────────────────────────────
const getAllUsersAdmin = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// ─────────────────────────────────────────
// @DELETE /api/admin/users/:id
// @Access Admin only
// @Desc   Delete a user
// ─────────────────────────────────────────
const deleteUserAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (user.role === "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Cannot delete admin accounts" });
    }
    await User.findByIdAndDelete(req.params.id);
    // Also delete all bookings of this user
    await Booking.deleteMany({ user: req.params.id });
    res.json({ success: true, message: "User and all their bookings deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// ─────────────────────────────────────────
// @PATCH  /api/admin/users/:id/toggle-status
// @Access Admin only
// @Desc   Activate / Deactivate a user
// ─────────────────────────────────────────
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    user.isActive = !user.isActive;
    await user.save();
    res.json({
      success: true,
      message: `User ${user.isActive ? "activated" : "deactivated"} successfully`,
      isActive: user.isActive,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
module.exports = {
  getDashboardStats,
  getAllBookingsAdmin,
  getBookingByIdAdmin,
  getBookingDevicePassword,
  updateBookingStatusAdmin,
  deleteBookingAdmin,
  addPartToBooking,
  removePartFromBooking,
  getAllUsersAdmin,
  deleteUserAdmin,
  toggleUserStatus,
};
