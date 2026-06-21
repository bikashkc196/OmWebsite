const express = require("express");
const router = express.Router();

const {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
} = require("../controllers/bookingController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/", protect, createBooking);
router.get("/my", protect, getMyBookings);
router.get("/", protect, adminOnly, getAllBookings);
router.patch("/:id/status", protect, adminOnly, updateBookingStatus);

module.exports = router;
