// backend/controllers/cartController.js
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// ─────────────────────────────────────────
// @GET    /api/cart
// @Access User (protected)
// @Desc   Get user's cart
// ─────────────────────────────────────────
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
      "name price discountPrice images stock isActive category quality brand",
    );

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Remove items where product is inactive or deleted
    cart.items = cart.items.filter(
      (item) => item.product && item.product.isActive,
    );
    await cart.save();

    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────
// @POST   /api/cart/add
// @Access User (protected)
// @Desc   Add item to cart
// ─────────────────────────────────────────
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res
        .status(400)
        .json({ success: false, message: "Product ID is required" });
    }

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} item(s) available in stock`,
      });
    }

    // Effective price (discount if available)
    const effectivePrice =
      product.discountPrice && product.discountPrice < product.price
        ? product.discountPrice
        : product.price;

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Check if already in cart
    const existingIdx = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (existingIdx >= 0) {
      const newQty = cart.items[existingIdx].quantity + parseInt(quantity);
      if (newQty > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more than ${product.stock} of this item`,
        });
      }
      cart.items[existingIdx].quantity = newQty;
    } else {
      cart.items.push({
        product: productId,
        quantity: parseInt(quantity),
        priceAtAdd: effectivePrice,
      });
    }

    await cart.save();
    await cart.populate(
      "items.product",
      "name price discountPrice images stock isActive category quality brand",
    );

    res.json({ success: true, message: "Added to cart!", cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────
// @PATCH  /api/cart/update
// @Access User (protected)
// @Desc   Update quantity of cart item
// ─────────────────────────────────────────
const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      return res
        .status(400)
        .json({ success: false, message: "productId and quantity required" });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    const idx = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (idx === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Item not in cart" });
    }

    if (parseInt(quantity) <= 0) {
      // Remove item if qty is 0 or less
      cart.items.splice(idx, 1);
    } else {
      const product = await Product.findById(productId);
      if (parseInt(quantity) > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} item(s) in stock`,
        });
      }
      cart.items[idx].quantity = parseInt(quantity);
    }

    await cart.save();
    await cart.populate(
      "items.product",
      "name price discountPrice images stock isActive category quality brand",
    );

    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────
// @DELETE /api/cart/remove/:productId
// @Access User (protected)
// @Desc   Remove item from cart
// ─────────────────────────────────────────
const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== req.params.productId,
    );

    await cart.save();
    await cart.populate(
      "items.product",
      "name price discountPrice images stock isActive category quality brand",
    );

    res.json({ success: true, message: "Item removed", cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────
// @DELETE /api/cart/clear
// @Access User (protected)
// @Desc   Clear entire cart
// ─────────────────────────────────────────
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ success: true, message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
