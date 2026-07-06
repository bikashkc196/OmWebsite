const mongoose = require("mongoose");
const { encrypt, decrypt } = require("../utils/crypto");
const bookingSchema = new mongoose.Schema(
  {
    // ── User Reference ──
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },
    // ── Device Info ──
    deviceType: {
      type: String,
      required: [true, "Device type is required"],
      enum: {
        values: ["smartphone", "tablet", "laptop", "smartwatch", "other"],
        message: "{VALUE} is not a valid device type",
      },
    },
    deviceBrand: {
      type: String,
      required: [true, "Device brand is required"],
      trim: true,
      maxlength: [50, "Brand name too long"],
    },
    deviceModel: {
      type: String,
      required: [true, "Device model is required"],
      trim: true,
      maxlength: [100, "Model name too long"],
    },
    deviceColor: {
      type: String,
      trim: true,
      default: "Not specified",
    },
    // Encrypted at rest (AES-256-GCM) — excluded from queries by default,
    // only ever decrypted via booking.getDevicePassword() on an explicit admin request.
    devicePassword: {
      type: String,
      default: "Not provided",
      select: false,
    },
    // ── Issue Info ──
    issueCategory: {
      type: String,
      required: [true, "Issue category is required"],
      enum: [
        "screen_replacement",
        "battery_replacement",
        "water_damage",
        "charging_port",
        "software_issue",
        "camera_repair",
        "speaker_repair",
        "motherboard_repair",
        "other",
      ],
    },
    issueDescription: {
      type: String,
      required: [true, "Issue description is required"],
      minlength: [10, "Please describe the issue in at least 10 characters"],
      maxlength: [1000, "Description too long"],
      trim: true,
    },
    // ── Booking Schedule ──
    bookingDate: {
      type: Date,
      required: [true, "Booking date is required"],
    },
    timeSlot: {
      type: String,
      required: [true, "Time slot is required"],
      enum: {
        values: [
          "07:00-09:00",
          "11:30-13:00",
          "13:30-15:00",
          "15:30-17:00",
          "17:30-19:00",
        ],
        message: "{VALUE} is not a valid time slot",
      },
    },
    // ── Booking Status & Lifecycle ──
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "in_progress",
        "waiting_for_parts",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },
    statusHistory: [
      {
        status: String,
        changedAt: { type: Date, default: Date.now },
        changedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        note: String,
      },
    ],
    // ── Parts Used (deducted from Inventory) ──
    partsUsed: [
      {
        inventoryItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Inventory",
          required: true,
        },
        partName: { type: String, required: true },
        partCode: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        unitPrice: { type: Number, default: 0 },
        usedAt: { type: Date, default: Date.now },
      },
    ],
    // ── Admin Fields ──
    adminNote: {
      type: String,
      trim: true,
      maxlength: [500, "Admin note too long"],
    },
    estimatedCost: {
      type: Number,
      default: 0,
      min: [0, "Cost cannot be negative"],
    },
    finalCost: {
      type: Number,
      default: 0,
    },
    technicianName: {
      type: String,
      trim: true,
    },
    // ── Repair Completion ──
    completedAt: {
      type: Date,
    },
    cancelledAt: {
      type: Date,
    },
    cancellationReason: {
      type: String,
      trim: true,
    },
    // ── Booking Reference Number ──
    bookingRef: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);
// ── Indexes for performance ──
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ bookingDate: 1, timeSlot: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ bookingRef: 1 });
// ── Auto-generate booking reference ──
bookingSchema.pre("save", async function (next) {
  if (this.isNew) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.bookingRef = `OM-${timestamp}-${random}`;
    // Push initial status to history
    this.statusHistory.push({
      status: "pending",
      note: "Booking created",
    });
  }
  // Track status completion time
  if (this.isModified("status")) {
    if (this.status === "completed") this.completedAt = new Date();
    if (this.status === "cancelled") this.cancelledAt = new Date();
  }
  // Encrypt the device unlock password at rest (skip if already encrypted)
  if (this.isModified("devicePassword")) {
    const looksEncrypted =
      typeof this.devicePassword === "string" &&
      this.devicePassword.split(":").length === 3;
    if (!looksEncrypted) {
      this.devicePassword = encrypt(this.devicePassword);
    }
  }
  next();
});
// ── Decrypt device password (explicit, admin-only use — never exposed via toJSON) ──
bookingSchema.methods.getDevicePassword = function () {
  if (!this.devicePassword) return null;
  try {
    return decrypt(this.devicePassword);
  } catch {
    return null; // legacy plaintext value predating encryption, or corrupt data
  }
};
// ── Virtual: formatted booking date ──
bookingSchema.virtual("formattedDate").get(function () {
  return this.bookingDate?.toLocaleDateString("en-IN", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
});
// ── Virtual: is upcoming ──
bookingSchema.virtual("isUpcoming").get(function () {
  return (
    this.bookingDate >= new Date() &&
    !["completed", "cancelled"].includes(this.status)
  );
});
bookingSchema.set("toJSON", { virtuals: true });
bookingSchema.set("toObject", { virtuals: true });
module.exports = mongoose.model("Booking", bookingSchema);
