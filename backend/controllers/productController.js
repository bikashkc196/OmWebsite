// backend/controllers/productController.js
const Product = require("../models/Product");
// ─────────────────────────────────────────
// @GET    /api/products
// @Access Public
// @Desc   Get all products with filters, sort & pagination
// ─────────────────────────────────────────
const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      quality,
      sortBy = "price",
      order = "asc",
      search,
      minPrice,
      maxPrice,
      featured,
    } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (quality) filter.quality = quality;
    if (featured === "true") filter.isFeatured = true;
    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    // Text search
    if (search) {
      filter.$text = { $search: search };
    }
    // Build sort object
    const sortOptions = {};
    if (sortBy === "price") {
      sortOptions.price = order === "desc" ? -1 : 1;
    } else if (sortBy === "quality") {
      // Quality order: original > premium > standard > economy
      // We do a manual sort after fetching
      sortOptions.quality = 1;
    } else if (sortBy === "newest") {
      sortOptions.createdAt = -1;
    } else if (sortBy === "popular") {
      sortOptions.soldCount = -1;
    } else if (sortBy === "rating") {
      sortOptions["ratings.average"] = -1;
    } else {
      sortOptions[sortBy] = order === "desc" ? -1 : 1;
    }
    const total = await Product.countDocuments(filter);
    let products = await Product.find(filter)
      .sort(sortOptions)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));
    // Manual quality sort if needed
    if (sortBy === "quality") {
      const qualityOrder = { original: 1, premium: 2, standard: 3, economy: 4 };
      products = products.sort(
        (a, b) =>
          (qualityOrder[a.quality] || 5) - (qualityOrder[b.quality] || 5),
      );
    }
    res.json({
      success: true,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// ─────────────────────────────────────────
// @GET    /api/products/featured
// @Access Public
// @Desc   Get featured products
// ─────────────────────────────────────────
const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true, isFeatured: true })
      .sort({ createdAt: -1 })
      .limit(8);
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// ─────────────────────────────────────────
// @GET    /api/products/:id
// @Access Public
// @Desc   Get single product by ID
// ─────────────────────────────────────────
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || !product.isActive) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// ─────────────────────────────────────────
// @POST   /api/products
// @Access Admin only
// @Desc   Create a new product
// ─────────────────────────────────────────
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
// ─────────────────────────────────────────
// @PUT    /api/products/:id
// @Access Admin only
// @Desc   Update a product
// ─────────────────────────────────────────
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
// ─────────────────────────────────────────
// @DELETE /api/products/:id
// @Access Admin only
// @Desc   Delete a product (soft delete)
// ─────────────────────────────────────────
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true },
    );
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// ─────────────────────────────────────────
// @PATCH  /api/products/:id/toggle-featured
// @Access Admin only
// @Desc   Toggle featured status
// ─────────────────────────────────────────
const toggleFeatured = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    product.isFeatured = !product.isFeatured;
    await product.save();
    res.json({ success: true, isFeatured: product.isFeatured });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// ─────────────────────────────────────────
// @GET    /api/products/admin/all
// @Access Admin only
// @Desc   Get ALL products (including inactive)
// ─────────────────────────────────────────
const getAllProductsAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
      ];
    }
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));
    res.json({
      success: true,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
module.exports = {
  getProducts,
  getFeaturedProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleFeatured,
  getAllProductsAdmin,
};
