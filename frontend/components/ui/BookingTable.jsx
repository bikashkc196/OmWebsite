// frontend/components/ui/BookingTable.jsx
"use client";
import { useState } from "react";
import StatusBadge from "../../components/ui/StatusBadge";
import Spinner from "../../components/ui/Spinner";
const STATUS_OPTIONS = [
  "pending",
  "confirmed",
  "in_progress",
  "waiting_for_parts",
  "completed",
  "cancelled",
];
const formatStatusLabel = (s) =>
  s
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
export default function BookingTable({
  bookings = [],
  onStatusChange,
  onDelete,
  onView,
  loading = false,
}) {
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const handleStatusChange = async (bookingId, newStatus) => {
    setUpdatingId(bookingId);
    await onStatusChange?.(bookingId, newStatus);
    setUpdatingId(null);
  };
  const handleDelete = async (bookingId) => {
    setDeletingId(bookingId);
    await onDelete?.(bookingId);
    setDeletingId(null);
    setConfirmId(null);
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Spinner size="lg" color="blue" />
          <p className="mt-3 text-sm text-ink-soft">Loading bookings...</p>
        </div>
      </div>
    );
  }
  if (bookings.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-5xl mb-3">📭</p>
        <p className="text-ink-soft font-medium">No bookings found</p>
        <p className="text-sm text-ink-soft/70 mt-1">
          Try adjusting your search or filter
        </p>
      </div>
    );
  }
  return (
    <>
      {/* ── Table ── */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface2 border-b border-line">
              {[
                "#",
                "Customer",
                "Device",
                "Service",
                "Date",
                "Price",
                "Status",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold
                    text-ink-soft uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {bookings.map((booking, idx) => (
              <tr
                key={booking._id}
                className="hover:bg-surface2 transition-colors group"
              >
                {/* Index */}
                <td className="px-4 py-3 text-ink-soft/60 font-mono text-xs">
                  {idx + 1}
                </td>
                {/* Customer */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 bg-gradient-to-br
                      from-brand-purple to-brand-orange rounded-full flex
                      items-center justify-center text-white text-xs
                      font-bold flex-shrink-0"
                    >
                      {booking.user?.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div>
                      <p className="font-semibold text-ink text-sm">
                        {booking.user?.name || "N/A"}
                      </p>
                      <p className="text-xs text-ink-soft">
                        {booking.user?.email || ""}
                      </p>
                    </div>
                  </div>
                </td>
                {/* Device */}
                <td className="px-4 py-3">
                  <p className="font-medium text-ink">
                    {booking.deviceType || "N/A"}
                  </p>
                  <p className="text-xs text-ink-soft">
                    {booking.deviceModel || ""}
                  </p>
                </td>
                {/* Service */}
                <td className="px-4 py-3">
                  <span
                    className="inline-block bg-brand-purple/10 text-brand-purple
                    text-xs font-medium px-2.5 py-1 rounded-lg"
                  >
                    {booking.serviceType || "N/A"}
                  </span>
                </td>
                {/* Date */}
                <td className="px-4 py-3 text-ink-soft text-xs">
                  {booking.preferredDate
                    ? new Date(booking.preferredDate).toLocaleDateString(
                        "en-NP",
                        { day: "numeric", month: "short", year: "numeric" },
                      )
                    : "N/A"}
                </td>
                {/* Price */}
                <td className="px-4 py-3 font-semibold text-brand-orange">
                  Rs. {booking.estimatedCost?.toLocaleString("en-NP") || "—"}
                </td>
                {/* Status */}
                <td className="px-4 py-3">
                  {updatingId === booking._id ? (
                    <Spinner size="sm" color="blue" />
                  ) : (
                    <select
                      value={booking.status || "pending"}
                      onChange={(e) =>
                        handleStatusChange(booking._id, e.target.value)
                      }
                      className="text-xs border border-line rounded-lg
                        px-2 py-1.5 bg-surface2 text-ink focus:outline-none
                        focus:ring-2 focus:ring-brand-purple cursor-pointer
                        font-medium"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {formatStatusLabel(s)}
                        </option>
                      ))}
                    </select>
                  )}
                </td>
                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {/* View */}
                    <button
                      onClick={() => onView?.(booking)}
                      className="p-1.5 text-brand-purple hover:bg-brand-purple/10
                        rounded-lg transition"
                      title="View Details"
                    >
                      👁️
                    </button>
                    {/* Delete */}
                    <button
                      onClick={() => setConfirmId(booking._id)}
                      className="p-1.5 text-red-400 hover:bg-red-500/10
                        rounded-lg transition"
                      title="Delete Booking"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* ── Delete Confirm Modal ── */}
      {confirmId && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm
          flex items-center justify-center z-50 p-4"
        >
          <div
            className="bg-surface border border-line rounded-2xl shadow-2xl p-6 max-w-sm
            w-full animate-fade-in"
          >
            <div className="text-center mb-5">
              <div className="text-5xl mb-3">🗑️</div>
              <h3 className="text-lg font-display text-ink tracking-wide">
                Delete Booking?
              </h3>
              <p className="text-sm text-ink-soft mt-1">
                This action cannot be undone. The booking will be permanently
                removed.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmId(null)}
                className="flex-1 px-4 py-2.5 border border-line
                  text-ink rounded-xl text-sm font-medium
                  hover:bg-surface2 transition"
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
    </>
  );
}
