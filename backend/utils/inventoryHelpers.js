const Inventory = require("../models/Inventory");

class InsufficientStockError extends Error {
  constructor(message, available) {
    super(message);
    this.statusCode = 400;
    this.available = available;
  }
}
class ItemNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

// Recompute isLowStock after an atomic $inc, which bypasses the model's pre-save hook.
const syncLowStock = async (item) => {
  const isLowStock = item.quantity <= item.lowStockThreshold;
  if (item.isLowStock !== isLowStock) {
    await Inventory.updateOne({ _id: item._id }, { isLowStock });
    item.isLowStock = isLowStock;
  }
};

// Atomically deduct `quantity` from an inventory item in a single DB operation, so two
// concurrent requests can never both pass a "is there enough stock" check and over-deduct.
const deductInventoryQuantity = async (inventoryItemId, quantity) => {
  const item = await Inventory.findOneAndUpdate(
    { _id: inventoryItemId, quantity: { $gte: quantity } },
    { $inc: { quantity: -quantity } },
    { new: true },
  );
  if (item) {
    await syncLowStock(item);
    return item;
  }
  const existing = await Inventory.findById(inventoryItemId);
  if (!existing) throw new ItemNotFoundError("Inventory item not found");
  throw new InsufficientStockError(
    `Insufficient stock for "${existing.partName}". Only ${existing.quantity} left.`,
    existing.quantity,
  );
};

// Atomically add `quantity` back to an inventory item (restock/undo). No-ops if the item
// was since deleted.
const restockInventoryQuantity = async (inventoryItemId, quantity) => {
  const item = await Inventory.findByIdAndUpdate(
    inventoryItemId,
    { $inc: { quantity } },
    { new: true },
  );
  if (item) await syncLowStock(item);
  return item;
};

// Restock every part logged against a booking (used when a booking is cancelled after
// parts were already deducted) and clear the booking's parts ledger.
const restockPartsForBooking = async (booking) => {
  if (!booking.partsUsed?.length) return;
  for (const part of booking.partsUsed) {
    await restockInventoryQuantity(part.inventoryItem, part.quantity);
  }
  booking.partsUsed = [];
};

module.exports = {
  deductInventoryQuantity,
  restockInventoryQuantity,
  restockPartsForBooking,
  InsufficientStockError,
  ItemNotFoundError,
};
