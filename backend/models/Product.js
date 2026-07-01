// backend/models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [150, "Name too long"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [1000, "Description too long"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    discountPrice: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: true,
      enum: ["android", "iphone", "accessories", "tablet", "laptop", "other"],
    },
    brand: {
      type: String,
      trim: true,
    },
    quality: {
      type: String,
      enum: ["original", "premium", "standard", "economy"],
      default: "standard",
    },
    compatibility: {
      type: String,
      trim: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    images: [
      {
        url: { type: String, required: true }, // Cloudinary URL
        alt: { type: String, default: "" },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    tags: [{ type: String }],
    ratings: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },
    soldCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

// Indexes for fast filtering
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ quality: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ name: "text", description: "text", brand: "text" });

// Virtual: is in stock
productSchema.virtual("inStock").get(function () {
  return this.stock > 0;
});

// Virtual: discount percentage
productSchema.virtual("discountPercent").get(function () {
  if (this.discountPrice && this.discountPrice < this.price) {
    return Math.round(((this.price - this.discountPrice) / this.price) * 100);
  }
  return 0;
});

// Virtual: effective price (discounted or original)
productSchema.virtual("effectivePrice").get(function () {
  return this.discountPrice && this.discountPrice < this.price
    ? this.discountPrice
    : this.price;
});

productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Product", productSchema);
