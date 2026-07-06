// frontend/app/admin/users/page.js
"use client";
import { useEffect, useState, useCallback } from "react";
import { useAdmin } from "../../../hooks/useAdmin";
import { useToast } from "../../../context/ToastContext";
import Spinner from "../../../components/ui/Spinner";
export default function AdminUsersPage() {
  const { getAllUsers, deleteUser, loading } = useAdmin();
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [confirmId, setConfirmId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  // ── Fetch Users ──
  const fetchUsers = useCallback(async () => {
    setPageLoading(true);
    const data = await getAllUsers();
    if (data) {
      setUsers(data.users || []);
      setFiltered(data.users || []);
    }
    setPageLoading(false);
  }, [getAllUsers]);
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  // ── Search Filter ──
  useEffect(() => {
    if (!search.trim()) {
      setFiltered(users);
      return;
    }
    const q = search.toLowerCase();
    setFiltered(
      users.filter(
        (u) =>
          u.name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          u.phone?.toLowerCase().includes(q),
      ),
    );
  }, [search, users]);
  // ── Delete User ──
  const handleDelete = async (userId) => {
    setDeletingId(userId);
    const res = await deleteUser(userId);
    if (res) {
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      toast.success("User deleted successfully 🗑️");
    } else {
      toast.error("Failed to delete user ❌");
    }
    setDeletingId(null);
    setConfirmId(null);
  };
  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Spinner size="xl" color="blue" />
          <p className="mt-4 text-gray-500">Loading users...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">
            👥 All Users
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage registered users</p>
        </div>
        <button
          onClick={fetchUsers}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600
            text-white text-sm font-semibold rounded-xl
            hover:bg-blue-700 transition shadow-sm"
        >
          🔄 Refresh
        </button>
      </div>
      {/* ── Search ── */}
      <div
        className="bg-white rounded-2xl border border-gray-100
        shadow-sm p-4"
      >
        <div className="relative">
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2
            text-gray-400 text-sm"
          >
            🔍
          </span>
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200
              rounded-xl text-sm focus:outline-none focus:ring-2
              focus:ring-blue-500 bg-gray-50"
          />
        </div>
      </div>
      {/* ── Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Total Users",
            value: users.length,
            icon: "👥",
            color: "blue",
          },
          {
            label: "Admins",
            value: users.filter((u) => u.role === "admin").length,
            icon: "🛡️",
            color: "purple",
          },
          {
            label: "Regular Users",
            value: users.filter((u) => u.role !== "admin").length,
            icon: "👤",
            color: "green",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl border border-gray-100
              shadow-sm p-4 flex items-center gap-4"
          >
            <span className="text-2xl">{stat.icon}</span>
            <div>
              <p className="text-2xl font-extrabold text-gray-800">
                {stat.value}
              </p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
      {/* ── Users Grid ── */}
      {filtered.length === 0 ? (
        <div
          className="text-center py-20 bg-white rounded-2xl
          border border-gray-100"
        >
          <p className="text-5xl mb-3">👤</p>
          <p className="text-gray-500 font-medium">No users found</p>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 sm:grid-cols-2
          xl:grid-cols-3 gap-4"
        >
          {filtered.map((user) => (
            <div
              key={user._id}
              className="bg-white rounded-2xl border border-gray-100
                shadow-sm p-5 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                {/* Avatar + Info */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 bg-gradient-to-br
                    from-blue-400 to-purple-500 rounded-full flex
                    items-center justify-center text-white font-bold
                    text-sm flex-shrink-0 shadow"
                  >
                    {user.name?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                </div>
                {/* Role Badge */}
                <span
                  className={`text-xs font-semibold px-2.5 py-1
                  rounded-full border
                  ${
                    user.role === "admin"
                      ? "bg-purple-100 text-purple-700 border-purple-200"
                      : "bg-green-100 text-green-700 border-green-200"
                  }`}
                >
                  {user.role === "admin" ? "🛡️ Admin" : "👤 User"}
                </span>
              </div>
              {/* Details */}
              <div className="space-y-2 mb-4">
                {user.phone && (
                  <div
                    className="flex items-center gap-2 text-xs
                    text-gray-500"
                  >
                    <span>📞</span> {user.phone}
                  </div>
                )}
                <div
                  className="flex items-center gap-2 text-xs
                  text-gray-500"
                >
                  <span>📅</span> Joined{" "}
                  {new Date(user.createdAt).toLocaleDateString("en-NP", {
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </div>
              {/* Delete Button */}
              {user.role !== "admin" && (
                <button
                  onClick={() => setConfirmId(user._id)}
                  className="w-full py-2 border border-red-200 text-red-500
                    text-xs font-semibold rounded-xl hover:bg-red-50
                    transition"
                >
                  🗑️ Delete User
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      {/* ── Confirm Delete Modal ── */}
      {confirmId && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm
          flex items-center justify-center z-50 p-4"
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-6
            max-w-sm w-full"
          >
            <div className="text-center mb-5">
              <div className="text-5xl mb-3">⚠️</div>
              <h3 className="text-lg font-bold text-gray-800">Delete User?</h3>
              <p className="text-sm text-gray-500 mt-1">
                This will permanently delete the user and all their data. This
                action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmId(null)}
                className="flex-1 px-4 py-2.5 border border-gray-200
                  text-gray-700 rounded-xl text-sm font-medium
                  hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmId)}
                disabled={deletingId === confirmId}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white
                  rounded-xl text-sm font-semibold hover:bg-red-600
                  transition disabled:opacity-60"
              >
                {deletingId === confirmId ? (
                  <span className="flex items-center justify-center gap-2">
                    <Spinner size="sm" color="white" /> Deleting...
                  </span>
                ) : (
                  "Yes, Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
