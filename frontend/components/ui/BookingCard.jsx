"use client";
import { useState } from "react";
import StatusTimeline from "./StatusTimeline";
import ConfirmDialog from "./ConfirmDialog";
import { useBooking } from "../../hooks/useBooking";
import { formatNPR } from "../../lib/currency";
import {
  Clock,
  CheckCircle2,
  Wrench,
  PackageCheck,
  PartyPopper,
  XCircle,
  Smartphone,
  Tablet,
  Laptop,
  Watch,
  Cable,
  Calendar,
  Hash,
  Wallet,
  MessageSquare,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

const STATUS_BADGE = {
  pending: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
  confirmed: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  in_progress: "bg-brand-purple/15 text-brand-purple border-brand-purple/30",
  waiting_for_parts: "bg-brand-orange/15 text-brand-orange border-brand-orange/30",
  completed: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  cancelled: "bg-red-500/15 text-red-300 border-red-500/30",
};
const STATUS_ICON = {
  pending: Clock,
  confirmed: CheckCircle2,
  in_progress: Wrench,
  waiting_for_parts: PackageCheck,
  completed: PartyPopper,
  cancelled: XCircle,
};
const DEVICE_ICON = {
  smartphone: Smartphone,
  tablet: Tablet,
  laptop: Laptop,
  smartwatch: Watch,
  other: Cable,
};

export default function BookingCard({ booking, onCancelled }) {
  const { cancelBooking } = useBooking();
  const [expanded, setExpanded] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const canCancel = ["pending", "confirmed"].includes(booking.status);
  const StatusIcon = STATUS_ICON[booking.status] || Clock;
  const DeviceIcon = DEVICE_ICON[booking.deviceType] || Smartphone;

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
        className={`bg-surface rounded-2xl border transition-all duration-300
        shadow-sm hover:shadow-md overflow-hidden hover-lift
        ${
          booking.status === "cancelled"
            ? "border-red-500/20 opacity-80"
            : booking.status === "completed"
              ? "border-emerald-500/20"
              : "border-line"
        }`}
      >
        {/* ── Card Header ── */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            {/* Device Info */}
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl flex items-center
                justify-center flex-shrink-0
                ${
                  booking.status === "completed"
                    ? "bg-emerald-500/15 text-emerald-300"
                    : booking.status === "cancelled"
                      ? "bg-red-500/15 text-red-400"
                      : "bg-brand-purple/15 text-brand-purple"
                }`}
              >
                <DeviceIcon size={22} />
              </div>
              <div>
                <h3 className="font-bold text-ink text-base">
                  {booking.deviceBrand} {booking.deviceModel}
                </h3>
                <p className="text-ink-soft text-xs mt-0.5 capitalize">
                  {booking.issueCategory?.replace(/_/g, " ")}
                </p>
              </div>
            </div>
            {/* Status Badge */}
            <span
              className={`badge border text-xs font-semibold capitalize gap-1
              ${STATUS_BADGE[booking.status]}`}
            >
              <StatusIcon size={12} /> {booking.status.replace(/_/g, " ")}
            </span>
          </div>
          {/* Booking Meta Info */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
            <div className="bg-surface2 rounded-xl p-3">
              <p className="text-xs text-ink-soft font-medium flex items-center gap-1">
                <Calendar size={12} /> Date
              </p>
              <p className="text-sm font-semibold text-ink mt-0.5">
                {new Date(booking.bookingDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="bg-surface2 rounded-xl p-3">
              <p className="text-xs text-ink-soft font-medium flex items-center gap-1">
                <Clock size={12} /> Slot
              </p>
              <p className="text-sm font-semibold text-ink mt-0.5">
                {booking.timeSlot}
              </p>
            </div>
            <div className="bg-surface2 rounded-xl p-3">
              <p className="text-xs text-ink-soft font-medium flex items-center gap-1">
                <Hash size={12} /> Ref
              </p>
              <p className="text-sm font-semibold text-ink mt-0.5 font-mono">
                {booking.bookingRef}
              </p>
            </div>
          </div>
          {/* Estimated Cost — Nepali Rupees */}
          {booking.estimatedCost > 0 && (
            <div className="mt-3 flex items-center gap-2 text-sm">
              <span className="text-ink-soft flex items-center gap-1">
                <Wallet size={14} /> Estimated Cost:
              </span>
              <span className="font-bold text-ink">
                {formatNPR(booking.estimatedCost)}
              </span>
            </div>
          )}
          {/* Admin Note */}
          {booking.adminNote && (
            <div
              className="mt-3 bg-brand-purple/10 border border-brand-purple/20
              rounded-xl px-4 py-3"
            >
              <p className="text-xs text-brand-purple font-semibold mb-1 flex items-center gap-1">
                <MessageSquare size={12} /> Technician Note
              </p>
              <p className="text-sm text-ink">{booking.adminNote}</p>
            </div>
          )}
          {/* Cancellation Reason */}
          {booking.status === "cancelled" && booking.cancellationReason && (
            <div
              className="mt-3 bg-red-500/10 border border-red-500/20
              rounded-xl px-4 py-3"
            >
              <p className="text-xs text-red-400 font-semibold mb-1">
                Cancellation Reason
              </p>
              <p className="text-sm text-red-300">
                {booking.cancellationReason}
              </p>
            </div>
          )}
        </div>
        {/* ── Card Footer ── */}
        <div
          className="border-t border-line px-5 py-3 flex items-center
          justify-between gap-3 flex-wrap"
        >
          {/* Expand Toggle */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-sm text-brand-purple
              font-medium hover:text-brand-orange transition"
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {expanded ? "Hide" : "Show"} Status Timeline
          </button>
          <div className="flex gap-2 items-center">
            {/* Booked At */}
            <span className="text-xs text-ink-soft">
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
                className="text-xs text-red-400 hover:text-red-300
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
            className="px-5 pb-5 border-t border-line pt-4
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
