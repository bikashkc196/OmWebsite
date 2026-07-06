// backend/routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
  getDashboardStats,
  getAllBookingsAdmin,
  updateBookingStatusAdmin,
  deleteBookingAdmin,
  getBookingByIdAdmin,
  getBookingDevicePassword,
  addPartToBooking,
  removePartFromBooking,
  getAllUsersAdmin,
  deleteUserAdmin,
  toggleUserStatus,
} = require("../controllers/adminController");
router.use(protect, adminOnly); // All routes are admin-only
// ── Dashboard ──
router.get("/stats", getDashboardStats);
// ── Bookings ──
router.get("/bookings", getAllBookingsAdmin);
router.get("/bookings/:id", getBookingByIdAdmin);
router.get("/bookings/:id/device-password", getBookingDevicePassword);
router.put("/bookings/:id/status", updateBookingStatusAdmin);
router.delete("/bookings/:id", deleteBookingAdmin);
// ── Booking Parts (Inventory Usage) ──
router.post("/bookings/:id/parts", addPartToBooking);
router.delete("/bookings/:id/parts/:partId", removePartFromBooking);
// ── Users ──
router.get("/users", getAllUsersAdmin);
router.delete("/users/:id", deleteUserAdmin);
router.patch("/users/:id/toggle-status", toggleUserStatus);
module.exports = router;
