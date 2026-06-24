"use client";
import StatusTimeline from "./StatusTimeline";

const DEVICE_ICON = {
  smartphone: "📱",
  tablet: "📟",
  laptop: "💻",
  smartwatch: "⌚",
  other: "🔌",
};

export default function BookingModal({ booking, onClose }) {
  if (!booking) return null;

  const details = [
    { label: "Booking Ref", value: booking.bookingRef, mono: true },
    { label: "Device Type", value: booking.deviceType },
    {
      label: "Brand & Model",
      value: `${booking.deviceBrand} ${booking.deviceModel}`,
    },
    { label: "Device Color", value: booking.deviceColor },
    {
      label: "Issue Category",
      value: booking.issueCategory?.replace(/_/g, " "),
    },
    {
      label: "Booking Date",
      value: new Date(booking.bookingDate).toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    },
    { label: "Time Slot", value: booking.timeSlot },
    { label: "Technician", value: booking.technicianName || "Not assigned" },
  ];

  const costs = [
    { label: "Estimated Cost", value: booking.estimatedCost },
    { label: "Final Cost", value: booking.finalCost },
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl
        max-h-[90vh] overflow-y-auto animate-fade-up z-10"
      >
        {/* Header */}
        <div
          className="sticky top-0 bg-white border-b border-gray-100
          px-6 py-4 flex items-center justify-between rounded-t-3xl z-10"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 bg-blue-50 rounded-xl
              flex items-center justify-center text-xl"
            >
              {DEVICE_ICON[booking.deviceType] || "📱"}
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Booking Details</h2>
              <p className="text-xs text-gray-500 font-mono">
                {booking.bookingRef}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center
              rounded-full bg-gray-100 hover:bg-gray-200 transition
              text-gray-600 font-bold text-sm"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Details Grid */}
          <div>
            <h3
              className="text-sm font-semibold mb-3 uppercase
              tracking-wider text-gray-400"
            >
              Booking Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {details.map(({ label, value, mono }) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3.5">
                  <p className="text-xs text-gray-400 font-medium mb-1">
                    {label}
                  </p>
                  <p
                    className={`text-sm font-semibold text-gray-800 capitalize
                    ${mono ? "font-mono text-blue-700" : ""}`}
                  >
                    {value || "—"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Issue Description */}
          <div>
            <h3
              className="text-xs font-semibold text-gray-400 uppercase
              tracking-wider mb-2"
            >
              Issue Description
            </h3>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                {booking.issueDescription}
              </p>
            </div>
          </div>

          {/* Admin Note */}
          {booking.adminNote && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <p className="text-xs font-semibold text-blue-600 mb-1.5">
                💬 Technician Note
              </p>
              <p className="text-sm text-blue-800">{booking.adminNote}</p>
            </div>
          )}

          {/* Cost Breakdown */}
          {(booking.estimatedCost > 0 || booking.finalCost > 0) && (
            <div>
              <h3
                className="text-xs font-semibold text-gray-400 uppercase
                tracking-wider mb-3"
              >
                Cost Breakdown
              </h3>
              <div className="bg-gray-50 rounded-xl overflow-hidden">
                {costs.map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex justify-between items-center
                      px-4 py-3 border-b border-gray-100 last:border-0"
                  >
                    <span className="text-sm text-gray-600">{label}</span>
                    <span className="font-bold text-gray-900">
                      {value > 0 ? `₹${value.toLocaleString("en-IN")}` : "—"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status Timeline */}
          <div>
            <h3
              className="text-xs font-semibold text-gray-400 uppercase
              tracking-wider mb-4"
            >
              Repair Progress
            </h3>
            <StatusTimeline status={booking.status} />
          </div>

          {/* Status History */}
          {booking.statusHistory?.length > 0 && (
            <div>
              <h3
                className="text-xs font-semibold text-gray-400 uppercase
                tracking-wider mb-3"
              >
                Activity Log
              </h3>
              <div className="space-y-2">
                {[...booking.statusHistory].reverse().map((h, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 text-sm
                      bg-gray-50 rounded-xl px-4 py-3"
                  >
                    <span className="text-gray-400 font-mono text-xs mt-0.5 shrink-0">
                      {new Date(h.changedAt).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <div>
                      <span className="capitalize font-semibold text-gray-800">
                        {h.status.replace(/_/g, " ")}
                      </span>
                      {h.note && (
                        <p className="text-gray-500 text-xs mt-0.5">{h.note}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
