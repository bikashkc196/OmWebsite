// frontend/app/admin/analytics/page.js
"use client";
import { useEffect, useState, useCallback } from "react";
import api from "../../../lib/api";
import Spinner from "../../../components/ui/Spinner";
import Link from "next/link";
const MONTH_COLORS = [
  "bg-sky-500",
  "bg-indigo-500",
  "bg-brand-purple",
  "bg-pink-500",
  "bg-brand-orange",
  "bg-green-500",
];
const CARD_COLORS = {
  green: "bg-green-500/15",
  blue: "bg-sky-500/15",
  purple: "bg-brand-purple/15",
  indigo: "bg-indigo-500/15",
  pink: "bg-pink-500/15",
};
export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/analytics/overview");
      if (res.data.success) setAnalytics(res.data.analytics);
    } catch (err) {
      console.error("Analytics error:", err);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <Spinner size="xl" color="blue" />
          <p className="mt-4 text-ink-soft">Loading analytics...</p>
        </div>
      </div>
    );
  }
  if (!analytics) {
    return (
      <div className="text-center py-20">
        <p className="text-5xl mb-3">😕</p>
        <p className="text-ink-soft">Failed to load analytics</p>
        <button
          onClick={fetchAnalytics}
          className="mt-4 text-brand-purple text-sm font-semibold hover:underline"
        >
          Try Again
        </button>
      </div>
    );
  }
  // Find max revenue for chart scaling
  const maxRevenue = Math.max(
    ...(analytics.monthlyChart?.map((m) => m.totalRevenue) || [1]),
  );
  // Build status maps
  const bookingStatusMap = {};
  analytics.bookingsByStatus?.forEach((s) => {
    bookingStatusMap[s._id] = s.count;
  });
  const orderStatusMap = {};
  analytics.ordersByStatus?.forEach((s) => {
    orderStatusMap[s._id] = s.count;
  });
  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl text-ink tracking-wide">
            📊 Analytics
          </h1>
          <p className="text-ink-soft text-sm mt-1">
            Complete business overview — bookings + orders
          </p>
        </div>
        <button
          onClick={fetchAnalytics}
          className="flex items-center gap-2 text-sm font-semibold text-brand-purple
          border border-brand-purple/30 px-4 py-2 rounded-xl hover:bg-brand-purple/10 transition"
        >
          🔄 Refresh
        </button>
      </div>
      {/* ── Revenue Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          {
            label: "Total Revenue",
            value: analytics.totalRevenue,
            icon: "💰",
            color: "green",
            prefix: "Rs. ",
          },
          {
            label: "Booking Revenue",
            value: analytics.bookingRevenue,
            icon: "🔧",
            color: "blue",
            prefix: "Rs. ",
          },
          {
            label: "Order Revenue",
            value: analytics.orderRevenue,
            icon: "📦",
            color: "purple",
            prefix: "Rs. ",
          },
          {
            label: "Total Users",
            value: analytics.totalUsers,
            icon: "👥",
            color: "indigo",
            prefix: "",
          },
        ].map((card) => (
          <div
            key={card.label}
            className="bg-surface rounded-2xl border border-line shadow-sm p-5 hover:shadow-md transition"
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`w-10 h-10 rounded-xl ${CARD_COLORS[card.color]}
              flex items-center justify-center text-xl`}
              >
                {card.icon}
              </div>
              <p className="text-xs font-semibold text-ink-soft uppercase tracking-wider">
                {card.label}
              </p>
            </div>
            <p className="text-2xl font-display text-ink tracking-wide">
              {card.prefix}
              {card.value?.toLocaleString("en-NP")}
            </p>
          </div>
        ))}
      </div>
      {/* ── Today & Month Summary ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Today's Bookings",
            value: analytics.todayBookings,
            icon: "📋",
          },
          {
            label: "Today's Orders",
            value: analytics.todayOrders,
            icon: "🛒",
          },
          {
            label: "This Month Bookings",
            value: analytics.monthBookings,
            icon: "📅",
          },
          {
            label: "This Month Orders",
            value: analytics.monthOrders,
            icon: "📬",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-surface rounded-2xl border border-line shadow-sm p-4 text-center"
          >
            <p className="text-2xl mb-1">{s.icon}</p>
            <p className="text-xl font-display text-ink tracking-wide">
              {s.value || 0}
            </p>
            <p className="text-xs text-ink-soft font-medium mt-0.5">
              {s.label}
            </p>
          </div>
        ))}
      </div>
      {/* ── Revenue Chart (Last 6 Months) ── */}
      <div className="bg-surface rounded-2xl border border-line shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-bold text-ink">
              📈 Revenue — Last 6 Months
            </h2>
            <p className="text-xs text-ink-soft mt-0.5">
              Combined booking & order revenue in Rs
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-sky-500" />
              <span className="text-ink-soft">Bookings</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-brand-purple" />
              <span className="text-ink-soft">Orders</span>
            </div>
          </div>
        </div>
        {/* Bar Chart */}
        <div className="flex items-end gap-3 h-44 px-2">
          {analytics.monthlyChart?.map((month, idx) => {
            const bkHeight =
              maxRevenue > 0
                ? Math.max((month.bookingRevenue / maxRevenue) * 100, 2)
                : 2;
            const orHeight =
              maxRevenue > 0
                ? Math.max((month.orderRevenue / maxRevenue) * 100, 2)
                : 2;
            return (
              <div
                key={month.label}
                className="flex-1 flex flex-col items-center gap-1 group"
              >
                {/* Tooltip */}
                <div
                  className="opacity-0 group-hover:opacity-100 transition absolute
                -mt-12 bg-surface2 border border-line text-ink text-xs rounded-lg px-2 py-1 pointer-events-none z-10 whitespace-nowrap"
                >
                  Rs. {month.totalRevenue.toLocaleString("en-NP")}
                </div>
                <div className="w-full flex gap-0.5 items-end h-36 relative">
                  {/* Booking bar */}
                  <div
                    style={{ height: `${bkHeight}%` }}
                    className="flex-1 bg-sky-500 rounded-t-lg transition-all duration-500 hover:bg-sky-400"
                    title={`Booking: Rs. ${month.bookingRevenue.toLocaleString("en-NP")}`}
                  />
                  {/* Order bar */}
                  <div
                    style={{ height: `${orHeight}%` }}
                    className="flex-1 bg-brand-purple rounded-t-lg transition-all duration-500 hover:opacity-80"
                    title={`Order: Rs. ${month.orderRevenue.toLocaleString("en-NP")}`}
                  />
                </div>
                <p className="text-xs text-ink-soft font-medium">
                  {month.label}
                </p>
              </div>
            );
          })}
        </div>
        {/* Monthly data table */}
        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-line">
                {[
                  "Month",
                  "Booking Rev",
                  "Order Rev",
                  "Total",
                  "Bookings",
                  "Orders",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-3 py-2 text-left font-semibold text-ink-soft"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {analytics.monthlyChart?.map((m) => (
                <tr
                  key={m.label}
                  className="border-b border-line hover:bg-surface2"
                >
                  <td className="px-3 py-2 font-semibold text-ink">
                    {m.label}
                  </td>
                  <td className="px-3 py-2 text-sky-300 font-medium">
                    Rs. {m.bookingRevenue.toLocaleString("en-NP")}
                  </td>
                  <td className="px-3 py-2 text-brand-purple font-medium">
                    Rs. {m.orderRevenue.toLocaleString("en-NP")}
                  </td>
                  <td className="px-3 py-2 font-bold text-brand-orange">
                    Rs. {m.totalRevenue.toLocaleString("en-NP")}
                  </td>
                  <td className="px-3 py-2 text-ink-soft">{m.bookingCount}</td>
                  <td className="px-3 py-2 text-ink-soft">{m.orderCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Booking Status Breakdown ── */}
        <div className="bg-surface rounded-2xl border border-line shadow-sm p-6">
          <h2 className="text-base font-bold text-ink mb-4">
            📋 Booking Status Breakdown
          </h2>
          <div className="space-y-2.5">
            {[
              { key: "pending", label: "Pending", color: "bg-yellow-400" },
              { key: "confirmed", label: "Confirmed", color: "bg-sky-400" },
              {
                key: "in_progress",
                label: "In Progress",
                color: "bg-brand-purple",
              },
              {
                key: "waiting_for_parts",
                label: "Waiting Parts",
                color: "bg-brand-orange",
              },
              { key: "completed", label: "Completed", color: "bg-green-500" },
              { key: "cancelled", label: "Cancelled", color: "bg-red-400" },
            ].map((s) => {
              const count = bookingStatusMap[s.key] || 0;
              const total = analytics.totalBookings || 1;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={s.key}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-ink-soft font-medium">{s.label}</span>
                    <span className="font-bold text-ink">
                      {count}
                      <span className="text-ink-soft font-normal ml-1">
                        ({pct}%)
                      </span>
                    </span>
                  </div>
                  <div className="h-2 bg-surface2 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${s.color} rounded-full transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* ── Order Status Breakdown ── */}
        <div className="bg-surface rounded-2xl border border-line shadow-sm p-6">
          <h2 className="text-base font-bold text-ink mb-4">
            📦 Order Status Breakdown
          </h2>
          <div className="space-y-2.5">
            {[
              { key: "pending", label: "Pending", color: "bg-yellow-400" },
              { key: "confirmed", label: "Confirmed", color: "bg-sky-400" },
              {
                key: "processing",
                label: "Processing",
                color: "bg-indigo-400",
              },
              { key: "shipped", label: "Shipped", color: "bg-brand-purple" },
              { key: "delivered", label: "Delivered", color: "bg-green-500" },
              { key: "cancelled", label: "Cancelled", color: "bg-red-400" },
            ].map((s) => {
              const count = orderStatusMap[s.key] || 0;
              const total = analytics.totalOrders || 1;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={s.key}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-ink-soft font-medium">{s.label}</span>
                    <span className="font-bold text-ink">
                      {count}
                      <span className="text-ink-soft font-normal ml-1">
                        ({pct}%)
                      </span>
                    </span>
                  </div>
                  <div className="h-2 bg-surface2 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${s.color} rounded-full transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* ── Top Repair Issues ── */}
        <div className="bg-surface rounded-2xl border border-line shadow-sm p-6">
          <h2 className="text-base font-bold text-ink mb-4">
            🔧 Top Repair Issues
          </h2>
          {analytics.topIssues?.length === 0 ? (
            <p className="text-ink-soft text-sm text-center py-6">
              No data yet
            </p>
          ) : (
            <div className="space-y-3">
              {analytics.topIssues?.map((issue, idx) => {
                const maxCount = analytics.topIssues[0]?.count || 1;
                const pct = Math.round((issue.count / maxCount) * 100);
                return (
                  <div key={issue._id}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-ink-soft font-medium capitalize">
                        {idx + 1}. {issue._id?.replace(/_/g, " ")}
                      </span>
                      <span className="font-bold text-ink">
                        {issue.count}
                      </span>
                    </div>
                    <div className="h-2 bg-surface2 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${MONTH_COLORS[idx % MONTH_COLORS.length]} rounded-full`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {/* ── Top Selling Products ── */}
        <div className="bg-surface rounded-2xl border border-line shadow-sm p-6">
          <h2 className="text-base font-bold text-ink mb-4">
            🏆 Top Selling Products
          </h2>
          {analytics.topProducts?.length === 0 ? (
            <p className="text-ink-soft text-sm text-center py-6">
              No orders yet
            </p>
          ) : (
            <div className="space-y-3">
              {analytics.topProducts?.map((p, idx) => (
                <div
                  key={p._id?.toString()}
                  className="flex items-center gap-3 p-3 bg-surface2 rounded-xl"
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center
                  text-white text-xs font-bold flex-shrink-0
                  ${idx === 0 ? "bg-yellow-400" : idx === 1 ? "bg-ink-soft" : idx === 2 ? "bg-brand-orange" : "bg-sky-400"}`}
                  >
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink truncate">
                      {p.name}
                    </p>
                    <p className="text-xs text-ink-soft">{p.totalSold} sold</p>
                  </div>
                  <p className="text-sm font-bold text-brand-orange flex-shrink-0">
                    Rs. {p.revenue?.toLocaleString("en-NP")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* ── Recent Activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-surface rounded-2xl border border-line shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-line">
            <h2 className="text-sm font-bold text-ink">
              🕐 Recent Bookings
            </h2>
            <Link
              href="/admin/bookings"
              className="text-xs text-brand-purple font-semibold hover:underline"
            >
              View All →
            </Link>
          </div>
          <div className="divide-y divide-line">
            {analytics.recentBookings?.map((b) => (
              <div
                key={b._id}
                className="px-5 py-3 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-ink">
                    {b.user?.name || "N/A"}
                  </p>
                  <p className="text-xs text-ink-soft capitalize">
                    {b.issueCategory?.replace(/_/g, " ")} • {b.deviceType}
                  </p>
                </div>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                    b.status === "completed"
                      ? "bg-green-500/15 text-green-300"
                      : b.status === "cancelled"
                        ? "bg-red-500/15 text-red-300"
                        : b.status === "in_progress"
                          ? "bg-brand-purple/15 text-brand-purple"
                          : "bg-yellow-500/15 text-yellow-300"
                  }`}
                >
                  {b.status?.replace(/_/g, " ")}
                </span>
              </div>
            ))}
          </div>
        </div>
        {/* Recent Orders */}
        <div className="bg-surface rounded-2xl border border-line shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-line">
            <h2 className="text-sm font-bold text-ink">
              📦 Recent Orders
            </h2>
            <Link
              href="/admin/orders"
              className="text-xs text-brand-purple font-semibold hover:underline"
            >
              View All →
            </Link>
          </div>
          <div className="divide-y divide-line">
            {analytics.recentOrders?.map((o) => (
              <div
                key={o._id}
                className="px-5 py-3 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-ink">
                    {o.user?.name || "N/A"}
                  </p>
                  <p className="text-xs font-mono text-ink-soft">
                    {o.orderRef}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-brand-orange">
                    Rs. {o.totalAmount?.toLocaleString("en-NP")}
                  </p>
                  <span
                    className={`text-xs font-semibold capitalize ${
                      o.status === "delivered"
                        ? "text-green-400"
                        : o.status === "cancelled"
                          ? "text-red-400"
                          : "text-yellow-400"
                    }`}
                  >
                    {o.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* ── User Growth Card ── */}
      <div className="bg-surface rounded-2xl border border-line shadow-sm p-6">
        <h2 className="text-base font-bold text-ink mb-4">
          👥 User Summary
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: "Total Users",
              value: analytics.totalUsers,
              icon: "👥",
              bg: "bg-sky-500/10",
              text: "text-sky-300",
            },
            {
              label: "New Today",
              value: analytics.newUsersToday,
              icon: "✨",
              bg: "bg-green-500/10",
              text: "text-green-300",
            },
            {
              label: "New This Month",
              value: analytics.newUsersMonth,
              icon: "📅",
              bg: "bg-brand-purple/10",
              text: "text-brand-purple",
            },
          ].map((s) => (
            <div
              key={s.label}
              className={`${s.bg} rounded-xl p-4 border border-line`}
            >
              <p className="text-2xl mb-1">{s.icon}</p>
              <p className={`text-2xl font-extrabold ${s.text}`}>
                {s.value || 0}
              </p>
              <p className="text-xs text-ink-soft font-medium mt-0.5">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
