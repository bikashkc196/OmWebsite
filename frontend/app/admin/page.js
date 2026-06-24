"use client";
import { useEffect, useState } from "react";
import api from "../../lib/api";
import { useToast } from "../../context/ToastContext";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  in_progress: "bg-purple-100 text-purple-800",
  waiting_for_parts: "bg-orange-100 text-orange-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const ALL_STATUSES = [
  "pending",
  "confirmed",
  "in_progress",
  "waiting_for_parts",
  "completed",
  "cancelled",
];

export default function AdminDashboard() {
  const { toast } = useToast();
  const [bookings, setBookings] = useState([]);
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [bookRes, alertRes] = await Promise.all([
        api.get("/bookings"),
        api.get("/inventory/alerts/low-stock"),
      ]);
      setBookings(bookRes.data.bookings);
      setLowStockAlerts(alertRes.data.alerts);

      // Calculate stats
      const b = bookRes.data.bookings;
      setStats({
        total: b.length,
        pending: b.filter((x) => x.status === "pending").length,
        inProgress: b.filter((x) => x.status === "in_progress").length,
        completed: b.filter((x) => x.status === "completed").length,
      });

      // Show low stock toast alert
      if (alertRes.data.count > 0) {
        toast.warning(
          `⚠️ ${alertRes.data.count} inventory item(s) are running low!`,
        );
      }
    } catch {
      toast.error("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (bookingId, newStatus, adminNote = "") => {
    try {
      await api.patch(`/bookings/${bookingId}/status`, {
        status: newStatus,
        adminNote,
      });
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: newStatus } : b,
        ),
      );
      toast.success(`Status updated to "${newStatus.replace(/_/g, " ")}"`);
    } catch {
      toast.error("Failed to update status.");
    }
  };

  const statCards = [
    {
      label: "Total Bookings",
      value: stats.total,
      color: "from-blue-500 to-blue-600",
      icon: "📋",
    },
    {
      label: "Pending",
      value: stats.pending,
      color: "from-yellow-400 to-yellow-500",
      icon: "⏳",
    },
    {
      label: "In Progress",
      value: stats.inProgress,
      color: "from-purple-500 to-purple-600",
      icon: "🔧",
    },
    {
      label: "Completed",
      value: stats.completed,
      color: "from-emerald-500 to-emerald-600",
      icon: "✅",
    },
  ];

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Manage bookings and monitor repair operations
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`bg-gradient-to-br ${card.color} text-white rounded-2xl p-5 shadow-lg`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white/80 text-sm">{card.label}</p>
                <p className="text-4xl font-bold mt-1">{card.value ?? "—"}</p>
              </div>
              <span className="text-3xl">{card.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Low Stock Alerts */}
      {lowStockAlerts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <h2 className="font-semibold text-amber-800 flex items-center gap-2 mb-3">
            ⚠️ Low Stock Alerts ({lowStockAlerts.length})
          </h2>
          <div className="flex flex-wrap gap-2">
            {lowStockAlerts.map((item) => (
              <span
                key={item._id}
                className="bg-amber-100 text-amber-700 text-xs font-medium
                  px-3 py-1.5 rounded-full border border-amber-200"
              >
                {item.partName} — {item.quantity} left
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Recent Bookings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
              <tr>
                {[
                  "Customer",
                  "Device",
                  "Issue",
                  "Date",
                  "Status",
                  "Action",
                ].map((h) => (
                  <th key={h} className="px-5 py-3 text-left">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bookings.map((b) => (
                <tr key={b._id} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-4 font-medium text-gray-800">
                    {b.user?.name}
                  </td>
                  <td className="px-5 py-4 text-gray-600">
                    {b.deviceBrand} {b.deviceModel}
                  </td>
                  <td className="px-5 py-4 text-gray-600 capitalize">
                    {b.issueCategory?.replace(/_/g, " ")}
                  </td>
                  <td className="px-5 py-4 text-gray-600">
                    {new Date(b.bookingDate).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize
                      ${statusColors[b.status]}`}
                    >
                      {b.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <select
                      value={b.status}
                      onChange={(e) => updateStatus(b._id, e.target.value)}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1.5
                        focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer"
                    >
                      {ALL_STATUSES.map((s) => (
                        <option key={s} value={s} className="capitalize">
                          {s.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
