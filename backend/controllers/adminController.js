// backend/controllers/adminController.js
const Booking = require("../models/Booking");
const User = require("../models/User");
const Inventory = require("../models/Inventory");

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
      .populate("statusHistory.changedBy", "name");

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
// @PUT    /api/admin/bookings/:id/status
// @Access Admin only
// @Desc   Update booking status + optional note & cost
// ─────────────────────────────────────────
const updateBookingStatusAdmin = async (req, res) => {
  try {
    const { status, adminNote, estimatedCost, finalCost, technicianName } =
      req.body;

    const validStatuses = [
      "pending",
      "confirmed",
      "in_progress",
      "waiting_for_parts",
      "completed",
      "cancelled",
    ];

    if (!status || !validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    // Update fields
    booking.status = status;
    if (adminNote !== undefined) booking.adminNote = adminNote;
    if (estimatedCost !== undefined) booking.estimatedCost = estimatedCost;
    if (finalCost !== undefined) booking.finalCost = finalCost;
    if (technicianName !== undefined) booking.technicianName = technicianName;

    // Track status history
    booking.statusHistory.push({
      status,
      changedBy: req.user._id,
      note: adminNote || `Status changed to ${status}`,
    });

    await booking.save();

    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
  updateBookingStatusAdmin,
  deleteBookingAdmin,
  getAllUsersAdmin,
  deleteUserAdmin,
  toggleUserStatus,
};
