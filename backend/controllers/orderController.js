// backend/controllers/orderController.js
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
// ─────────────────────────────────────────
// @POST   /api/orders
// @Access User (protected)
// @Desc   Place a new order from cart
// ─────────────────────────────────────────
const placeOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod = "cash_on_delivery" } = req.body;
    // Validate shipping address
    const { fullName, phone, address, city, district } = shippingAddress || {};
    if (!fullName || !phone || !address || !city || !district) {
      return res.status(400).json({
        success: false,
        message: "All shipping address fields are required",
      });
    }
    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
    );
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty",
      });
    }
    // Validate stock & build order items
    const orderItems = [];
    let subtotal = 0;
    for (const item of cart.items) {
      const product = item.product;
      if (!product || !product.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product "${item.product?.name || "Unknown"}" is no longer available`,
        });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} unit(s) of "${product.name}" left in stock`,
        });
      }
      const price =
        product.discountPrice && product.discountPrice < product.price
          ? product.discountPrice
          : product.price;
      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images?.[0]?.url || "",
        quantity: item.quantity,
        priceAtOrder: price,
      });
      subtotal += price * item.quantity;
    }
    // Delivery charge (free above Rs 2000)
    const deliveryCharge = subtotal >= 2000 ? 0 : 150;
    const totalAmount = subtotal + deliveryCharge;
    // Create the order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      subtotal,
      deliveryCharge,
      totalAmount,
    });
    // Deduct stock from products
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity, soldCount: item.quantity },
      });
    }
    // Clear the cart
    cart.items = [];
    await cart.save();
    await order.populate("items.product", "name images");
    res.status(201).json({
      success: true,
      message: "Order placed successfully! 🎉",
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// ─────────────────────────────────────────
// @GET    /api/orders/my
// @Access User (protected)
// @Desc   Get logged-in user's orders
// ─────────────────────────────────────────
const getMyOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const total = await Order.countDocuments({ user: req.user._id });
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product", "name images category")
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));
    res.json({
      success: true,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// ─────────────────────────────────────────
// @GET    /api/orders/:id
// @Access User (own) | Admin (any)
// @Desc   Get single order
// ─────────────────────────────────────────
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("items.product", "name images category");
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    // Non-admin can only view own order
    if (
      req.user.role !== "admin" &&
      order.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// ─────────────────────────────────────────
// @PATCH  /api/orders/:id/cancel
// @Access User (own order, pending only)
// @Desc   Cancel an order
// ─────────────────────────────────────────
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    if (!["pending", "confirmed"].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled at this stage",
      });
    }
    const { reason } = req.body;
    order.status = "cancelled";
    order.cancellationReason = reason || "Cancelled by user";
    order.statusHistory.push({
      status: "cancelled",
      note: reason || "Cancelled by user",
      changedBy: req.user._id,
    });
    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity, soldCount: -item.quantity },
      });
    }
    await order.save();
    res.json({ success: true, message: "Order cancelled successfully", order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// ─────────────────────────────────────────
// @GET    /api/orders/admin/all
// @Access Admin only
// @Desc   Get all orders with filters & pagination
// ─────────────────────────────────────────
const getAllOrdersAdmin = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      search,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [{ orderRef: { $regex: search, $options: "i" } }];
    }
    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .populate("user", "name email phone")
      .populate("items.product", "name images")
      .sort({ [sortBy]: order === "asc" ? 1 : -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));
    res.json({
      success: true,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// ─────────────────────────────────────────
// @PATCH  /api/orders/admin/:id/status
// @Access Admin only
// @Desc   Update order status
// ─────────────────────────────────────────
const updateOrderStatusAdmin = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const validStatuses = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!status || !validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    order.status = status;
    if (adminNote) order.adminNote = adminNote;
    order.statusHistory.push({
      status,
      note: adminNote || `Status updated to ${status}`,
      changedBy: req.user._id,
    });
    // If admin cancels — restore stock
    if (status === "cancelled") {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity, soldCount: -item.quantity },
        });
      }
    }
    await order.save();
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// ─────────────────────────────────────────
// @GET    /api/orders/admin/stats
// @Access Admin only
// @Desc   Order revenue stats
// ─────────────────────────────────────────
const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: "pending" });
    const deliveredOrders = await Order.countDocuments({ status: "delivered" });
    const cancelledOrders = await Order.countDocuments({ status: "cancelled" });
    const revenueData = await Order.aggregate([
      {
        $match: {
          status: { $in: ["delivered", "shipped", "processing", "confirmed"] },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          avgOrder: { $avg: "$totalAmount" },
        },
      },
    ]);
    const recentOrders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5);
    res.json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        deliveredOrders,
        cancelledOrders,
        totalRevenue: revenueData[0]?.totalRevenue || 0,
        avgOrderValue: Math.round(revenueData[0]?.avgOrder || 0),
        recentOrders,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
module.exports = {
  placeOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrdersAdmin,
  updateOrderStatusAdmin,
  getOrderStats,
};
