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
    blue: "bg-blue-50   text-blue-700",
    green: "bg-green-50  text-green-700",
    yellow: "bg-yellow-50 text-yellow-700",
    red: "bg-red-50    text-red-700",
    purple: "bg-purple-50 text-purple-700",
  };
  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-gray-100
      p-6 hover:shadow-md transition-all duration-300 group"
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
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}%
          </span>
        )}
      </div>
      {/* Value */}
      <div className="mb-1">
        <span className="text-3xl font-extrabold text-gray-800">
          {prefix}
          {typeof value === "number" ? value.toLocaleString("en-NP") : value}
          {suffix}
        </span>
      </div>
      {/* Title */}
      <p className="text-sm text-gray-500 font-medium">{title}</p>
    </div>
  );
}
