// frontend/components/ui/StatusBadge.jsx
"use client";
const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    classes: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
    dot: "bg-yellow-400",
  },
  confirmed: {
    label: "Confirmed",
    classes: "bg-sky-500/15 text-sky-300 border-sky-500/30",
    dot: "bg-sky-400",
  },
  in_progress: {
    label: "In Progress",
    classes: "bg-brand-purple/15 text-brand-purple border-brand-purple/30",
    dot: "bg-brand-purple",
  },
  waiting_for_parts: {
    label: "Waiting for Parts",
    classes: "bg-brand-orange/15 text-brand-orange border-brand-orange/30",
    dot: "bg-brand-orange",
  },
  completed: {
    label: "Completed",
    classes: "bg-green-500/15 text-green-300 border-green-500/30",
    dot: "bg-green-400",
  },
  cancelled: {
    label: "Cancelled",
    classes: "bg-red-500/15 text-red-300 border-red-500/30",
    dot: "bg-red-400",
  },
};
export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status?.toLowerCase()] || {
    label: status || "Unknown",
    classes: "bg-ink-soft/15 text-ink-soft border-ink-soft/30",
    dot: "bg-ink-soft",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1
      rounded-full text-xs font-semibold border ${config.classes}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${config.dot}
        animate-pulse`}
      />
      {config.label}
    </span>
  );
}
