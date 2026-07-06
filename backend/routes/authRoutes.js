// backend/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
// Throttle brute-force login attempts: 10 tries per IP per 15 minutes.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts. Please try again in 15 minutes.",
  },
});
router.post("/register", register);
router.post("/login", loginLimiter, login);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile); // ✅ NEW
router.put("/change-password", protect, changePassword); // ✅ NEW
module.exports = router;
