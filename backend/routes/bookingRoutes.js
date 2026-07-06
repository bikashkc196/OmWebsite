const express = require("express");
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getBookingById,
  getAllBookings,
  updateBookingStatus,
  cancelBooking,
  getAvailableSlotsForDate,
  getBookingStats,
  getBookingByRef,
} = require("../controllers/bookingController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
  validateBooking,
  validateStatusUpdate,
} = require("../middleware/validateMiddleware");
// ── Public-ish (require login) ──────────────────────────────
// Check available slots for a date
router.get("/slots/available", protect, getAvailableSlotsForDate);
// Stats — admin only
router.get("/stats", protect, adminOnly, getBookingStats);
// My bookings — logged in user
router.get("/my", protect, getMyBookings);
// Get by reference number
router.get("/ref/:ref", protect, getBookingByRef);
// Create booking
router.post("/", protect, validateBooking, createBooking);
// Get all bookings — admin only (with filters & pagination)
router.get("/", protect, adminOnly, getAllBookings);
// Get single booking by ID
router.get("/:id", protect, getBookingById);
// Update status — admin only
router.patch(
  "/:id/status",
  protect,
  adminOnly,
  validateStatusUpdate,
  updateBookingStatus,
);
// Cancel booking — user (own booking)
router.patch("/:id/cancel", protect, cancelBooking);
module.exports = router;
