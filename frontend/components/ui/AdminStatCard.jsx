// frontend/components/ui/AdminStatCard.jsx
"use client";
export default function AdminStatCard({
  title,
  value,
  icon,
  color = "skyblue",
  trend = null,
  suffix = "",
  prefix = "",
}) {
  const colorMap = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    yellow: "from-yellow-500 to-yellow-600",
    red: "from-red-500 to-red-600",
    purple: "from-purple-500 to-purple-600",
  };
  const bgMap = {
    blue: "bg-sky-500/15   text-sky-300",
    green: "bg-green-500/15  text-green-300",
    yellow: "bg-yellow-500/15 text-yellow-300",
    red: "bg-red-500/15    text-red-300",
    purple: "bg-brand-purple/15 text-brand-purple",
  };
  return (
    <div
      className="bg-surface rounded-2xl shadow-sm border border-line
      p-6 hover:shadow-md hover:border-brand-purple/30 transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-4">
        {/* Icon */}
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br
          ${colorMap[color]} flex items-center justify-center text-2xl
          shadow-lg group-hover:scale-110 transition-transform`}
        >
          {icon}
        </div>
        {/* Trend Badge */}
        {trend !== null && (
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full
            ${
              trend >= 0
                ? "bg-green-500/15 text-green-300"
                : "bg-red-500/15 text-red-300"
            }`}
          >
            {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}%
          </span>
        )}
      </div>
      {/* Value */}
      <div className="mb-1">
        <span className="text-3xl font-display text-ink tracking-wide">
          {prefix}
          {typeof value === "number" ? value.toLocaleString("en-NP") : value}
          {suffix}
        </span>
      </div>
      {/* Title */}
      <p className="text-sm text-ink-soft font-medium">{title}</p>
    </div>
  );
}
