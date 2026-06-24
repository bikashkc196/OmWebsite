"use client";
import { useState } from "react";
import StatusTimeline from "./StatusTimeline";
import ConfirmDialog from "./ConfirmDialog";
import { useBooking } from "../../hooks/useBooking";

const STATUS_BADGE = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  in_progress: "bg-purple-100 text-purple-800 border-purple-200",
  waiting_for_parts: "bg-orange-100 text-orange-800 border-orange-200",
  completed: "bg-emerald-100 text-emerald-800 border-emerald-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
};

const STATUS_ICON = {
  pending: "⏳",
  confirmed: "✅",
  in_progress: "🔧",
  waiting_for_parts: "📦",
  completed: "🎉",
  cancelled: "❌",
};

const DEVICE_ICON = {
  smartphone: "📱",
  tablet: "📟",
  laptop: "💻",
  smartwatch: "⌚",
  other: "🔌",
};

export default function BookingCard({ booking, onCancelled }) {
  const { cancelBooking } = useBooking();
  const [expanded, setExpanded] = useState(false);
  const [showCancel, setShowCancel] = useState(false);

  const canCancel = ["pending", "confirmed"].includes(booking.status);

  const handleCancel = async (reason) => {
    const success = await cancelBooking(booking._id, reason);
    if (success) {
      setShowCancel(false);
      onCancelled?.();
    }
  };

  return (
    <>
      <div
        className={`bg-white rounded-2xl border transition-all duration-300
        shadow-sm hover:shadow-md overflow-hidden
        ${
          booking.status === "cancelled"
            ? "border-red-100 opacity-80"
            : booking.status === "completed"
              ? "border-emerald-100"
              : "border-gray-100"
        }`}
      >
        {/* ── Card Header ── */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            {/* Device Info */}
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl flex items-center
                justify-center text-2xl flex-shrink-0
                ${
                  booking.status === "completed"
                    ? "bg-emerald-50"
                    : booking.status === "cancelled"
                      ? "bg-red-50"
                      : "bg-blue-50"
                }`}
              >
                {DEVICE_ICON[booking.deviceType] || "📱"}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">
                  {booking.deviceBrand} {booking.deviceModel}
                </h3>
                <p className="text-gray-500 text-xs mt-0.5 capitalize">
                  {booking.issueCategory?.replace(/_/g, " ")}
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <span
              className={`badge border text-xs font-semibold capitalize
              ${STATUS_BADGE[booking.status]}`}
            >
              {STATUS_ICON[booking.status]} {booking.status.replace(/_/g, " ")}
            </span>
          </div>

          {/* Booking Meta Info */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 font-medium">📅 Date</p>
              <p className="text-sm font-semibold text-gray-800 mt-0.5">
                {new Date(booking.bookingDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 font-medium">🕐 Slot</p>
              <p className="text-sm font-semibold text-gray-800 mt-0.5">
                {booking.timeSlot}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 font-medium">🔖 Ref</p>
              <p className="text-sm font-semibold text-gray-800 mt-0.5 font-mono">
                {booking.bookingRef}
              </p>
            </div>
          </div>

          {/* Estimated Cost */}
          {booking.estimatedCost > 0 && (
            <div className="mt-3 flex items-center gap-2 text-sm">
              <span className="text-gray-500">💰 Estimated Cost:</span>
              <span className="font-bold text-gray-900">
                ₹{booking.estimatedCost.toLocaleString("en-IN")}
              </span>
            </div>
          )}

          {/* Admin Note */}
          {booking.adminNote && (
            <div
              className="mt-3 bg-blue-50 border border-blue-100
              rounded-xl px-4 py-3"
            >
              <p className="text-xs text-blue-600 font-semibold mb-1">
                💬 Technician Note
              </p>
              <p className="text-sm text-blue-800">{booking.adminNote}</p>
            </div>
          )}

          {/* Cancellation Reason */}
          {booking.status === "cancelled" && booking.cancellationReason && (
            <div
              className="mt-3 bg-red-50 border border-red-100
              rounded-xl px-4 py-3"
            >
              <p className="text-xs text-red-500 font-semibold mb-1">
                Cancellation Reason
              </p>
              <p className="text-sm text-red-700">
                {booking.cancellationReason}
              </p>
            </div>
          )}
        </div>

        {/* ── Card Footer ── */}
        <div
          className="border-t border-gray-50 px-5 py-3 flex items-center
          justify-between gap-3 flex-wrap"
        >
          {/* Expand Toggle */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-sm text-blue-600
              font-medium hover:text-blue-800 transition"
          >
            {expanded ? "▲ Hide" : "▼ Show"} Status Timeline
          </button>

          <div className="flex gap-2">
            {/* Booked At */}
            <span className="text-xs text-gray-400">
              Booked{" "}
              {new Date(booking.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
              })}
            </span>

            {/* Cancel Button */}
            {canCancel && (
              <button
                onClick={() => setShowCancel(true)}
                className="text-xs text-red-500 hover:text-red-700
                  font-medium transition ml-2"
              >
                Cancel Booking
              </button>
            )}
          </div>
        </div>

        {/* ── Expandable Timeline ── */}
        {expanded && (
          <div
            className="px-5 pb-5 border-t border-gray-50 pt-4
            animate-fade-in"
          >
            <StatusTimeline status={booking.status} />
          </div>
        )}
      </div>

      {/* Cancel Dialog */}
      <ConfirmDialog
        isOpen={showCancel}
        title="Cancel Booking?"
        message={`Are you sure you want to cancel your ${booking.deviceBrand} ${booking.deviceModel} repair booking?`}
        confirmLabel="Yes, Cancel Booking"
        cancelLabel="Keep Booking"
        confirmStyle="danger"
        showReason={true}
        onConfirm={handleCancel}
        onCancel={() => setShowCancel(false)}
      />
    </>
  );
}
