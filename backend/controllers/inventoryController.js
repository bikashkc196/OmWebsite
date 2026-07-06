const Inventory = require("../models/Inventory");
const getInventory = async (req, res) => {
  try {
    const { lowStock } = req.query;
    const filter = lowStock === "true" ? { isLowStock: true } : {};
    const items = await Inventory.find(filter).sort({ updatedAt: -1 });
    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const createItem = async (req, res) => {
  try {
    const item = await Inventory.create(req.body);
    res.status(201).json({ success: true, item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updateItem = async (req, res) => {
  try {
    const item = await Inventory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ message: "Item not found" });
    // findByIdAndUpdate skips document middleware, so isLowStock (set in the
    // pre("save") hook) would otherwise go stale — re-save to recalculate it.
    await item.save();
    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const deleteItem = async (req, res) => {
  try {
    await Inventory.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Item deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getLowStockAlerts = async (req, res) => {
  try {
    const alerts = await Inventory.find({ isLowStock: true }).select(
      "partName partCode quantity lowStockThreshold category",
    );
    res.json({ success: true, count: alerts.length, alerts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  getInventory,
  createItem,
  updateItem,
  deleteItem,
  getLowStockAlerts,
};
