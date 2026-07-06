// backend/controllers/analyticsController.js
const Booking = require("../models/Booking");
const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");
const Inventory = require("../models/Inventory");
// ─────────────────────────────────────────
// @GET    /api/analytics/overview
// @Access Admin only
// @Desc   Full analytics overview
// ─────────────────────────────────────────
const getOverview = async (req, res) => {
  try {
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);
    // ── This month range ──
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
    );
    // ── Last month range ──
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(
      now.getFullYear(),
      now.getMonth(),
      0,
      23,
      59,
      59,
    );
    // ─── Booking Stats ───
    const totalBookings = await Booking.countDocuments();
    const todayBookings = await Booking.countDocuments({
      createdAt: { $gte: todayStart, $lte: todayEnd },
    });
    const monthBookings = await Booking.countDocuments({
      createdAt: { $gte: monthStart, $lte: monthEnd },
    });
    const lastMonthBookings = await Booking.countDocuments({
      createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd },
    });
    const bookingsByStatus = await Booking.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    // ─── Booking Revenue ───
    const bookingRevenue = await Booking.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: null,
          total: { $sum: "$finalCost" },
          avg: { $avg: "$finalCost" },
        },
      },
    ]);
    // ─── Order Stats ───
    const totalOrders = await Order.countDocuments();
    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: todayStart, $lte: todayEnd },
    });
    const monthOrders = await Order.countDocuments({
      createdAt: { $gte: monthStart, $lte: monthEnd },
    });
    const pendingOrders = await Order.countDocuments({ status: "pending" });
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    // ─── Order Revenue ───
    const orderRevenue = await Order.aggregate([
      {
        $match: {
          status: { $in: ["delivered", "shipped", "processing", "confirmed"] },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
          avg: { $avg: "$totalAmount" },
        },
      },
    ]);
    // ─── Combined Revenue ───
    const totalRevenue =
      (bookingRevenue[0]?.total || 0) + (orderRevenue[0]?.total || 0);
    // ─── User Stats ───
    const totalUsers = await User.countDocuments({ role: "user" });
    const newUsersToday = await User.countDocuments({
      role: "user",
      createdAt: { $gte: todayStart },
    });
    const newUsersMonth = await User.countDocuments({
      role: "user",
      createdAt: { $gte: monthStart },
    });
    // ─── Product Stats ───
    const totalProducts = await Product.countDocuments({ isActive: true });
    const lowStockItems = await Inventory.countDocuments({ isLowStock: true });
    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          name: { $first: "$items.name" },
          totalSold: { $sum: "$items.quantity" },
          revenue: {
            $sum: { $multiply: ["$items.priceAtOrder", "$items.quantity"] },
          },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]);
    // ─── Monthly Revenue Chart (last 6 months) ───
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);
    const monthlyBookingRevenue = await Booking.aggregate([
      { $match: { status: "completed", createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: { $sum: "$finalCost" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);
    const monthlyOrderRevenue = await Order.aggregate([
      {
        $match: {
          status: { $in: ["delivered", "shipped", "processing"] },
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: { $sum: "$totalAmount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);
    // Build 6-month labels
    const MONTH_NAMES = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthlyChart = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const yr = d.getFullYear();
      const mo = d.getMonth() + 1;
      const bk = monthlyBookingRevenue.find(
        (m) => m._id.year === yr && m._id.month === mo,
      );
      const or = monthlyOrderRevenue.find(
        (m) => m._id.year === yr && m._id.month === mo,
      );
      monthlyChart.push({
        label: MONTH_NAMES[mo - 1],
        bookingRevenue: bk?.revenue || 0,
        orderRevenue: or?.revenue || 0,
        totalRevenue: (bk?.revenue || 0) + (or?.revenue || 0),
        bookingCount: bk?.count || 0,
        orderCount: or?.count || 0,
      });
    }
    // ─── Top Issues (from bookings) ───
    const topIssues = await Booking.aggregate([
      { $group: { _id: "$issueCategory", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);
    // ─── Recent Activity ───
    const recentBookings = await Booking.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5);
    const recentOrders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5);
    res.json({
      success: true,
      analytics: {
        // Summary
        totalRevenue,
        bookingRevenue: bookingRevenue[0]?.total || 0,
        orderRevenue: orderRevenue[0]?.total || 0,
        avgBookingValue: Math.round(bookingRevenue[0]?.avg || 0),
        avgOrderValue: Math.round(orderRevenue[0]?.avg || 0),
        // Bookings
        totalBookings,
        todayBookings,
        monthBookings,
        lastMonthBookings,
        bookingsByStatus,
        // Orders
        totalOrders,
        todayOrders,
        monthOrders,
        pendingOrders,
        ordersByStatus,
        // Users
        totalUsers,
        newUsersToday,
        newUsersMonth,
        // Products
        totalProducts,
        lowStockItems,
        topProducts,
        // Charts
        monthlyChart,
        // Issues & Recent
        topIssues,
        recentBookings,
        recentOrders,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
module.exports = { getOverview };
