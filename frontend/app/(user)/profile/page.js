// frontend/app/(user)/profile/page.js
"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import { useOrder } from "../../../hooks/useOrder";
import { useBooking } from "../../../hooks/useBooking";
import Link from "next/link";
import Spinner from "../../../components/ui/Spinner";
const STAT_COLORS = {
  purple: { icon: "bg-brand-purple/15", text: "text-brand-purple" },
  orange: { icon: "bg-brand-orange/15", text: "text-brand-orange" },
};
export default function ProfilePage() {
  const { user, updateProfile, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const { getMyOrders } = useOrder();
  const { fetchMyBookings } = useBooking();
  const [form, setForm] = useState({ name: "", phone: "" });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [stats, setStats] = useState({ orders: 0, bookings: 0 });
  const [statsLoading, setStatsLoading] = useState(true);
  // Pre-fill form with current user data
  useEffect(() => {
    if (user) {
      setForm({ name: user.name || "", phone: user.phone || "" });
    }
  }, [user]);
  // Fetch quick stats
  useEffect(() => {
    const fetchStats = async () => {
      setStatsLoading(true);
      const [ordersData, bookingsData] = await Promise.all([
        getMyOrders({ limit: 1 }),
        fetchMyBookings({ limit: 1 }),
      ]);
      setStats({
        orders: ordersData?.total || 0,
        bookings: bookingsData?.total || 0,
      });
      setStatsLoading(false);
    };
    fetchStats();
  }, []);
  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.phone.trim()) errs.phone = "Phone is required";
    else if (!/^\d{10}$/.test(form.phone.replace(/\s/g, "")))
      errs.phone = "Enter a valid 10-digit phone number";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await updateProfile({ name: form.name.trim(), phone: form.phone.trim() });
      toast.success("Profile updated successfully! ✅");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };
  if (authLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-bg">
        <Spinner size="xl" color="blue" />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-bg py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* ── Header ── */}
        <div>
          <h1 className="text-2xl text-ink tracking-wide">
            👤 My Profile
          </h1>
          <p className="text-ink-soft text-sm mt-1">
            Manage your account details
          </p>
        </div>
        {/* ── Profile Card ── */}
        <div className="bg-surface rounded-2xl border border-line shadow-sm overflow-hidden">
          {/* Avatar Banner */}
          <div className="bg-gradient-to-r from-brand-purple to-brand-orange h-24 relative">
            <div className="absolute -bottom-8 left-6">
              <div
                className="w-16 h-16 bg-surface rounded-2xl shadow-lg
              flex items-center justify-center border-4 border-surface"
              >
                <span className="text-2xl font-extrabold text-brand-purple">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
          <div className="pt-12 px-6 pb-6">
            <h2 className="text-lg font-extrabold text-ink">
              {user?.name}
            </h2>
            <p className="text-sm text-ink-soft">{user?.email}</p>
            <span
              className={`mt-1 inline-block text-xs font-semibold px-2.5 py-0.5
            rounded-full border ${
              user?.role === "admin"
                ? "bg-brand-purple/15 text-brand-purple border-brand-purple/30"
                : "bg-sky-500/15 text-sky-300 border-sky-500/30"
            }`}
            >
              {user?.role === "admin" ? "🛡️ Admin" : "👤 User"}
            </span>
            <p className="text-xs text-ink-soft mt-2">
              Member since{" "}
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-NP", {
                    month: "long",
                    year: "numeric",
                  })
                : "—"}
            </p>
          </div>
        </div>
        {/* ── Quick Stats ── */}
        <div className="grid grid-cols-2 gap-4">
          {[
            {
              label: "My Bookings",
              value: stats.bookings,
              icon: "📋",
              href: "/my-repairs",
              color: "purple",
            },
            {
              label: "My Orders",
              value: stats.orders,
              icon: "📦",
              href: "/my-orders",
              color: "orange",
            },
          ].map((s) => {
            const c = STAT_COLORS[s.color];
            return (
              <Link
                key={s.label}
                href={s.href}
                className="bg-surface rounded-2xl border border-line shadow-sm p-5
              hover:shadow-md hover:border-brand-purple/30 hover:-translate-y-0.5 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl ${c.icon} flex items-center justify-center text-xl`}
                  >
                    {s.icon}
                  </div>
                  <div>
                    <p className="text-xs text-ink-soft font-medium">{s.label}</p>
                    {statsLoading ? (
                      <div className="h-5 w-8 bg-surface2 rounded animate-pulse mt-0.5" />
                    ) : (
                      <p className="text-xl font-extrabold text-ink">
                        {s.value}
                      </p>
                    )}
                  </div>
                </div>
                <p
                  className={`text-xs ${c.text} font-semibold mt-2 group-hover:underline`}
                >
                  View all →
                </p>
              </Link>
            );
          })}
        </div>
        {/* ── Edit Profile Form ── */}
        <div className="bg-surface rounded-2xl border border-line shadow-sm p-6">
          <h3 className="text-base font-bold text-ink mb-5">
            ✏️ Edit Profile
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email (read-only) */}
            <div>
              <label className="block text-xs font-semibold text-ink-soft mb-1">
                Email Address
                <span className="ml-2 text-ink-soft/60 font-normal">
                  (cannot be changed)
                </span>
              </label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full border border-line bg-surface2 rounded-xl
                px-3 py-2.5 text-sm text-ink-soft/60 cursor-not-allowed"
              />
            </div>
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-ink-soft mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => {
                  setForm({ ...form, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: "" });
                }}
                placeholder="e.g. Ram Bahadur Thapa"
                className={`w-full border rounded-xl px-3 py-2.5 text-sm
                bg-surface2 text-ink
                focus:outline-none focus:ring-2 focus:ring-brand-purple transition
                ${errors.name ? "border-red-400" : "border-line"}`}
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1">⚠️ {errors.name}</p>
              )}
            </div>
            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-ink-soft mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => {
                  setForm({ ...form, phone: e.target.value });
                  if (errors.phone) setErrors({ ...errors, phone: "" });
                }}
                placeholder="e.g. 9841234567"
                className={`w-full border rounded-xl px-3 py-2.5 text-sm
                bg-surface2 text-ink
                focus:outline-none focus:ring-2 focus:ring-brand-purple transition
                ${errors.phone ? "border-red-400" : "border-line"}`}
              />
              {errors.phone && (
                <p className="text-red-400 text-xs mt-1">⚠️ {errors.phone}</p>
              )}
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() =>
                  setForm({ name: user?.name || "", phone: user?.phone || "" })
                }
                className="flex-1 py-2.5 border border-line text-ink-soft
                rounded-xl text-sm font-medium hover:bg-surface2 transition"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-2.5 bg-gradient-to-r from-brand-purple to-brand-orange text-white rounded-xl
                text-sm font-semibold hover:scale-[1.02] transition shadow-md
                shadow-brand-purple/20 disabled:opacity-60 disabled:cursor-not-allowed
                flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Spinner size="sm" color="white" /> Saving...
                  </>
                ) : (
                  "💾 Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
        {/* ── Quick Links ── */}
        <div className="bg-surface rounded-2xl border border-line shadow-sm p-5">
          <h3 className="text-sm font-bold text-ink mb-3">
            ⚙️ Account Settings
          </h3>
          <div className="space-y-2">
            <Link
              href="/change-password"
              className="flex items-center justify-between px-4 py-3 bg-surface2
              rounded-xl hover:bg-brand-purple/10 hover:text-brand-purple transition group"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">🔒</span>
                <div>
                  <p className="text-sm font-semibold text-ink group-hover:text-brand-purple">
                    Change Password
                  </p>
                  <p className="text-xs text-ink-soft">
                    Update your login password
                  </p>
                </div>
              </div>
              <span className="text-ink-soft/50 group-hover:text-brand-purple">→</span>
            </Link>
            <Link
              href="/my-orders"
              className="flex items-center justify-between px-4 py-3 bg-surface2
              rounded-xl hover:bg-brand-orange/10 hover:text-brand-orange transition group"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">📦</span>
                <div>
                  <p className="text-sm font-semibold text-ink group-hover:text-brand-orange">
                    My Orders
                  </p>
                  <p className="text-xs text-ink-soft">
                    Track your product orders
                  </p>
                </div>
              </div>
              <span className="text-ink-soft/50 group-hover:text-brand-orange">
                →
              </span>
            </Link>
            <Link
              href="/my-repairs"
              className="flex items-center justify-between px-4 py-3 bg-surface2
              rounded-xl hover:bg-green-500/10 hover:text-green-400 transition group"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">🔧</span>
                <div>
                  <p className="text-sm font-semibold text-ink group-hover:text-green-400">
                    My Repairs
                  </p>
                  <p className="text-xs text-ink-soft">View repair bookings</p>
                </div>
              </div>
              <span className="text-ink-soft/50 group-hover:text-green-400">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
