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
router.put("/bookings/:id/status", updateBookingStatusAdmin);
router.delete("/bookings/:id", deleteBookingAdmin);

// ── Users ──
router.get("/users", getAllUsersAdmin);
router.delete("/users/:id", deleteUserAdmin);
router.patch("/users/:id/toggle-status", toggleUserStatus);

module.exports = router;
