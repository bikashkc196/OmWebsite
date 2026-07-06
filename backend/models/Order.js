// backend/models/Order.js
const mongoose = require("mongoose");
const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: { type: String, required: true },
  image: { type: String, default: "" },
  quantity: { type: Number, required: true, min: 1 },
  priceAtOrder: { type: Number, required: true },
});
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderRef: {
      type: String,
      unique: true,
    },
    items: [orderItemSchema],
    // ── Shipping Info ──
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      district: { type: String, required: true },
    },
    // ── Payment ──
    paymentMethod: {
      type: String,
      enum: ["cash_on_delivery", "esewa", "khalti"],
      default: "cash_on_delivery",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    // ── Pricing ──
    subtotal: { type: Number, required: true },
    deliveryCharge: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    // ── Order Status ──
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    statusHistory: [
      {
        status: String,
        note: String,
        changedAt: { type: Date, default: Date.now },
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    // ── Admin Notes ──
    adminNote: { type: String, trim: true },
    cancelledAt: { type: Date },
    deliveredAt: { type: Date },
    cancellationReason: { type: String },
  },
  { timestamps: true },
);
// Indexes
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ orderRef: 1 });
// Auto-generate order reference
orderSchema.pre("save", function (next) {
  if (this.isNew) {
    const ts = Date.now().toString(36).toUpperCase();
    const rnd = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.orderRef = `ORD-${ts}-${rnd}`;
    this.statusHistory.push({
      status: "pending",
      note: "Order placed",
    });
  }
  if (this.isModified("status")) {
    if (this.status === "delivered") this.deliveredAt = new Date();
    if (this.status === "cancelled") this.cancelledAt = new Date();
  }
  next();
});
// Virtual: total items count
orderSchema.virtual("totalItems").get(function () {
  return this.items.reduce((sum, i) => sum + i.quantity, 0);
});
orderSchema.set("toJSON", { virtuals: true });
orderSchema.set("toObject", { virtuals: true });
module.exports = mongoose.model("Order", orderSchema);
