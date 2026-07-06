// backend/routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrdersAdmin,
  updateOrderStatusAdmin,
  getOrderStats,
} = require("../controllers/orderController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
router.use(protect); // All order routes require login
// ── User Routes ──────────────────────────
router.post("/", placeOrder);
router.get("/my", getMyOrders);
router.get("/:id", getOrderById);
router.patch("/:id/cancel", cancelOrder);
// ── Admin Routes ─────────────────────────
router.get("/admin/all", adminOnly, getAllOrdersAdmin);
router.get("/admin/stats", adminOnly, getOrderStats);
router.patch("/admin/:id/status", adminOnly, updateOrderStatusAdmin);
module.exports = router;
