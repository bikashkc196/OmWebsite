// frontend/app/admin/page.js
"use client";
import { useEffect, useState } from "react";
import { useAdmin } from "../../hooks/useAdmin";
import AdminStatCard from "../../components/ui/AdminStatCard";
import StatusBadge from "../../components/ui/StatusBadge";
import Spinner from "../../components/ui/Spinner";
import Link from "next/link";

export default function AdminDashboard() {
  const { getStats, getAllBookings, loading } = useAdmin();
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setPageLoading(true);
      const [statsData, bookingsData] = await Promise.all([
        getStats(),
        getAllBookings({ limit: 5, sort: "-createdAt" }),
      ]);
      if (statsData) setStats(statsData);
      if (bookingsData) setRecentBookings(bookingsData.bookings || []);
      setPageLoading(false);
    };
    fetchData();
  }, []);

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Spinner size="xl" color="blue" />
          <p className="mt-4 text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">
            📊 Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <div
          className="text-sm text-gray-400 bg-white px-4 py-2
          rounded-xl border border-gray-200 shadow-sm"
        >
          🗓️{" "}
          {new Date().toLocaleDateString("en-NP", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4
        gap-5"
      >
        <AdminStatCard
          title="Total Bookings"
          value={stats?.totalBookings ?? 0}
          icon="📋"
          color="blue"
          trend={stats?.bookingTrend ?? null}
        />
        <AdminStatCard
          title="Total Revenue"
          value={stats?.totalRevenue ?? 0}
          icon="💰"
          color="green"
          prefix="Rs "
          trend={stats?.revenueTrend ?? null}
        />
        <AdminStatCard
          title="Pending Repairs"
          value={stats?.pendingBookings ?? 0}
          icon="⏳"
          color="yellow"
        />
        <AdminStatCard
          title="Total Users"
          value={stats?.totalUsers ?? 0}
          icon="👥"
          color="purple"
          trend={stats?.userTrend ?? null}
        />
      </div>

      {/* ── Second Row Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <AdminStatCard
          title="Completed Repairs"
          value={stats?.completedBookings ?? 0}
          icon="✅"
          color="green"
        />
        <AdminStatCard
          title="In Progress"
          value={stats?.inProgressBookings ?? 0}
          icon="🔧"
          color="purple"
        />
        <AdminStatCard
          title="Cancelled"
          value={stats?.cancelledBookings ?? 0}
          icon="❌"
          color="red"
        />
      </div>

      {/* ── Recent Bookings ── */}
      <div
        className="bg-white rounded-2xl shadow-sm border
        border-gray-100 overflow-hidden"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4
          border-b border-gray-100"
        >
          <h2 className="text-base font-bold text-gray-800">
            🕐 Recent Bookings
          </h2>
          <Link
            href="/admin/bookings"
            className="text-sm text-blue-600 font-medium hover:underline"
          >
            View All →
          </Link>
        </div>

        {/* Table */}
        {recentBookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-2">📭</p>
            <p className="text-gray-400 text-sm">No recent bookings</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["Customer", "Device", "Service", "Date", "Status"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-5 py-3 text-left text-xs font-semibold
                        text-gray-500 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentBookings.map((b) => (
                  <tr
                    key={b._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-5 py-3 font-medium text-gray-800">
                      {b.user?.name || "N/A"}
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {b.deviceType} — {b.deviceModel}
                    </td>
                    <td className="px-5 py-3 text-gray-600">{b.serviceType}</td>
                    <td className="px-5 py-3 text-gray-500 text-xs">
                      {b.preferredDate
                        ? new Date(b.preferredDate).toLocaleDateString(
                            "en-NP",
                            { day: "numeric", month: "short" },
                          )
                        : "N/A"}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={b.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
