const express = require("express");
const router = express.Router();
const {
  getInventory,
  createItem,
  updateItem,
  deleteItem,
  getLowStockAlerts,
} = require("../controllers/inventoryController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
router.use(protect, adminOnly); //All inventory routes are admin-only
router.get("/", getInventory);
router.post("/", createItem);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);
router.get("/lowstock", getLowStockAlerts);
module.exports = router;
