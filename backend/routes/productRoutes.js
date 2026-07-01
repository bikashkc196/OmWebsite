// backend/routes/productRoutes.js
const express = require("express");
const router = express.Router();
const {
  getProducts,
  getFeaturedProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleFeatured,
  getAllProductsAdmin,
} = require("../controllers/productController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// ── Public Routes ──────────────────────────────────────────────
router.get("/", getProducts);
router.get("/featured", getFeaturedProducts);

// ── Admin Only ─────────────────────────────────────────────────
router.get("/admin/all", protect, adminOnly, getAllProductsAdmin);
router.post("/", protect, adminOnly, createProduct);
router.patch("/:id/toggle-featured", protect, adminOnly, toggleFeatured);
router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

// ── Public (must be last to avoid conflict) ────────────────────
router.get("/:id", getProductById);

module.exports = router;
