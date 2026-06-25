// frontend/components/ui/StatusBadge.jsx
"use client";

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    classes: "bg-yellow-100 text-yellow-800 border-yellow-200",
    dot: "bg-yellow-500",
  },
  confirmed: {
    label: "Confirmed",
    classes: "bg-blue-100 text-blue-800 border-blue-200",
    dot: "bg-blue-500",
  },
  "in-progress": {
    label: "In Progress",
    classes: "bg-purple-100 text-purple-800 border-purple-200",
    dot: "bg-purple-500",
  },
  completed: {
    label: "Completed",
    classes: "bg-green-100 text-green-800 border-green-200",
    dot: "bg-green-500",
  },
  cancelled: {
    label: "Cancelled",
    classes: "bg-red-100 text-red-800 border-red-200",
    dot: "bg-red-500",
  },
};

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status?.toLowerCase()] || {
    label: status || "Unknown",
    classes: "bg-gray-100 text-gray-800 border-gray-200",
    dot: "bg-gray-500",
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
