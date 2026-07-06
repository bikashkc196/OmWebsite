// backend/routes/analyticsRoutes.js
const express = require("express");
const router = express.Router();
const { getOverview } = require("../controllers/analyticsController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
router.get("/overview", protect, adminOnly, getOverview);
module.exports = router;
