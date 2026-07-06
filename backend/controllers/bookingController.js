const Booking = require("../models/Booking");
const {
  isSlotAvailable,
  getAvailableSlots,
  isValidBookingDate,
  buildBookingFilter,
} = require("../utils/bookingHelpers");
const { restockPartsForBooking } = require("../utils/inventoryHelpers");
const { applyStatusChange } = require("../utils/bookingStatusHelpers");
// ─────────────────────────────────────────
// @POST   /api/bookings
// @Access User (protected)
// @Desc   Create a new repair booking
// ─────────────────────────────────────────
const createBooking = async (req, res) => {
  try {
    const {
      deviceType,
      deviceBrand,
      deviceModel,
      deviceColor,
      devicePassword,
      issueCategory,
      issueDescription,
      bookingDate,
      timeSlot,
    } = req.body;
    // ── 1. Validate booking date ──
    const dateValidation = isValidBookingDate(bookingDate);
    if (!dateValidation.valid) {
      return res.status(400).json({
        success: false,
        message: dateValidation.message,
      });
    }
    // ── 2. Check slot availability ──
    const slotAvailable = await isSlotAvailable(bookingDate, timeSlot);
    if (!slotAvailable) {
      return res.status(409).json({
        success: false,
        message: `Time slot ${timeSlot} is fully booked for this date. Please choose another slot.`,
      });
    }
    // ── 3. Check if user already has a booking on same date/slot ──
    const dayStart = new Date(bookingDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(bookingDate);
    dayEnd.setHours(23, 59, 59, 999);
    const duplicateBooking = await Booking.findOne({
      user: req.user._id,
      bookingDate: { $gte: dayStart, $lte: dayEnd },
      timeSlot,
      status: { $nin: ["cancelled"] },
    });
    if (duplicateBooking) {
      return res.status(409).json({
        success: false,
        message: "You already have a booking for this date and time slot.",
      });
    }
    // ── 4. Create booking (retry on the astronomically-rare bookingRef collision —
    //      it's regenerated fresh on every save attempt) ──
    let booking;
    const MAX_REF_RETRIES = 3;
    for (let attempt = 1; attempt <= MAX_REF_RETRIES; attempt++) {
      try {
        booking = await Booking.create({
          user: req.user._id,
          deviceType,
          deviceBrand,
          deviceModel,
          deviceColor,
          devicePassword,
          issueCategory,
          issueDescription,
          bookingDate: new Date(bookingDate),
          timeSlot,
        });
        break;
      } catch (err) {
        const isRefCollision =
          err.code === 11000 && err.keyPattern?.bookingRef;
        if (!isRefCollision || attempt === MAX_REF_RETRIES) throw err;
      }
    }
    // ── 5. Populate user info for response ──
    await booking.populate("user", "name email phone");
    res.status(201).json({
      success: true,
      message: "Booking confirmed successfully!",
      booking,
    });
  } catch (error) {
    console.error("createBooking error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create booking",
    });
  }
};
// ─────────────────────────────────────────
// @GET    /api/bookings/my
// @Access User (protected)
// @Desc   Get all bookings of logged-in user
// ─────────────────────────────────────────
const getMyBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = { user: req.user._id };
    if (status) filter.status = status;
    const total = await Booking.countDocuments(filter);
    const bookings = await Booking.find(filter)
      .sort({ createdAt: -1 })
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
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ─────────────────────────────────────────
// @GET    /api/bookings/:id
// @Access User (own) | Admin (any)
// @Desc   Get a single booking by ID
// ─────────────────────────────────────────
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("statusHistory.changedBy", "name");
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }
    // Non-admin can only view own bookings
    if (
      req.user.role !== "admin" &&
      booking.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied: Not your booking",
      });
    }
    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ─────────────────────────────────────────
// @GET    /api/bookings
// @Access Admin only
// @Desc   Get all bookings with filters & pagination
// ─────────────────────────────────────────
const getAllBookings = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;
    // Build dynamic filter
    const filter = buildBookingFilter(req.query);
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
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ─────────────────────────────────────────
// @PATCH  /api/bookings/:id/status
// @Access Admin only
// @Desc   Update booking status + admin note
// ─────────────────────────────────────────
const updateBookingStatus = async (req, res) => {
  try {
    const { status, adminNote, estimatedCost, finalCost, technicianName } =
      req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }
    await applyStatusChange(booking, {
      status,
      adminNote,
      estimatedCost,
      finalCost,
      technicianName,
      changedBy: req.user._id,
    });
    await booking.populate("user", "name email phone");
    res.json({
      success: true,
      message: `Booking status updated to "${status}"`,
      booking,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};
// ─────────────────────────────────────────
// @PATCH  /api/bookings/:id/cancel
// @Access User (own booking only)
// @Desc   Cancel a booking (user action)
// ─────────────────────────────────────────
const cancelBooking = async (req, res) => {
  try {
    const { reason } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }
    // Owner check
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only cancel your own bookings",
      });
    }
    // Cannot cancel if already in progress or completed
    if (["in_progress", "completed", "cancelled"].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a booking with status "${booking.status}"`,
      });
    }
    booking.status = "cancelled";
    booking.cancellationReason = reason || "Cancelled by user";
    booking.statusHistory.push({
      status: "cancelled",
      changedBy: req.user._id,
      note: reason || "Cancelled by user",
    });
    // Put back any parts already logged against this booking before it's closed out.
    await restockPartsForBooking(booking);
    await booking.save();
    res.json({
      success: true,
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ─────────────────────────────────────────
// @GET    /api/bookings/slots/available
// @Access User (protected)
// @Desc   Get available time slots for a date
// ─────────────────────────────────────────
const getAvailableSlotsForDate = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date query parameter is required",
      });
    }
    // Validate date
    const dateValidation = isValidBookingDate(date);
    if (!dateValidation.valid) {
      return res.status(400).json({
        success: false,
        message: dateValidation.message,
      });
    }
    const availability = await getAvailableSlots(date);
    res.json({
      success: true,
      date,
      availability,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ─────────────────────────────────────────
// @GET    /api/bookings/stats
// @Access Admin only
// @Desc   Booking statistics for dashboard
// ─────────────────────────────────────────
const getBookingStats = async (req, res) => {
  try {
    // Aggregate stats
    const stats = await Booking.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
    // Total revenue from completed bookings
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
    // Bookings in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentBookings = await Booking.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });
    // Most common issue category
    const topIssues = await Booking.aggregate([
      {
        $group: {
          _id: "$issueCategory",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);
    // Today's bookings
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    const todayCount = await Booking.countDocuments({
      bookingDate: { $gte: todayStart, $lte: todayEnd },
    });
    // Format status counts
    const statusCounts = {};
    stats.forEach((s) => {
      statusCounts[s._id] = s.count;
    });
    const totalBookings = Object.values(statusCounts).reduce(
      (a, b) => a + b,
      0,
    );
    res.json({
      success: true,
      stats: {
        total: totalBookings,
        byStatus: statusCounts,
        recentBookings,
        todayBookings: todayCount,
        revenue: {
          total: revenueData[0]?.totalRevenue || 0,
          average: Math.round(revenueData[0]?.avgCost || 0),
        },
        topIssues,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ─────────────────────────────────────────
// @GET    /api/bookings/ref/:ref
// @Access User (protected)
// @Desc   Find booking by reference number
// ─────────────────────────────────────────
const getBookingByRef = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      bookingRef: req.params.ref.toUpperCase(),
    }).populate("user", "name email phone");
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `No booking found with reference: ${req.params.ref}`,
      });
    }
    // Non-admins can only see own bookings
    if (
      req.user.role !== "admin" &&
      booking.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }
    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  getAllBookings,
  updateBookingStatus,
  cancelBooking,
  getAvailableSlotsForDate,
  getBookingStats,
  getBookingByRef,
};
