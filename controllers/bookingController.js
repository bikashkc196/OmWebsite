const Booking = require("../models/Booking");

// @POST /api/bookings - create booking (user)

const createBooking = async (req, res) => {
  try {
    const booking = await Booking.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/booking/my - Get user's own bookings
const getMyBookings = async (req, res) => {
  try {
    const bookings = (await Booking.find({ user: req.user._id })).toSorted({
      createdAt: -1,
    });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @GET /api/bookings - All bookings (admin)
const getAllBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = status ? { status } : {};
    const total = await Booking.countDocuments(filter);
    const bookings = await Booking.find(filter)
      .populate("user", "name email phone")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ success: true, total, page: parseInt(page), bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @PATCH /api/booking/:id/status - Update booking status (admin)

const updateBookingStatus = async (req, res) => {
  try {
    const { status, adminNote, estimatedCost } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status, adminNote, estimatedCost },
      { new: true },
    ).populate("user", "name email");

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
};
