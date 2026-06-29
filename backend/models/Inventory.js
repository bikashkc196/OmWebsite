const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    partName: { type: String, required: true, trim: true },
    partCode: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: [
        "screen",
        "battery",
        "charging_port",
        "camera",
        "speaker",
        "motherboard",
        "display",
        "other",
      ],
      required: true,
    },
    compatibleDevices: [{ type: String }],
    quantity: { type: Number, required: true, min: 2 },
    lowStockThreshold: { type: Number, default: 5 },
    costPrice: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    supplier: { type: String },
    isLowStock: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

// Auto-calcualtion low stock status in save
inventorySchema.pre("save", function (next) {
  this.isLowStock = this.quantity <= this.lowStockThreshold;
  next();
});

module.exports = mongoose.model("Inventory", inventorySchema);
