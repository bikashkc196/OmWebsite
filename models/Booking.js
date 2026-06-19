const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deviceType: {
      type: String,
      required: true,
      enum: ["smartphone", "tablet", "laptop", "smartwatch", "other"],
    },
    deviceBrand: { type: String, required: true, trim: true },
    deviceModel: { type: String, required: true, trim: true },
    issueDescription: { type: String, required: true, trim: true },
    issueCategory: {
      type: String,
      enum: [
        "screen_replacement",
        "battery_replacement",
        "water_damage",
        "charging_port",
        "software_issues",
        "camera_repair",
        "speaker_repair",
        "other",
      ],
    },
    bookingDate: {
      type: Date,
      required: true,
    },
    tumeSlot: {
      type: String,
      enum: [
        "09:00-11:00",
        "11:00-13:00",
        "13:00-15:00",
        "15:00-17:00",
        "17:00-19:00",
      ],
      required: true,
    },
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
    estimatedCost: { type: Number, default: 0 },
    adminNote: { type: String },
    repairImages: [{ type: String }], // URLS from Cloudinary
  },
  { timestamps: true },
);

module.exports = mongoose.model("Booking", bookingSchema);
