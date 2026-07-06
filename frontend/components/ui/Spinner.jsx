export default function Spinner({ size = "md", color = "blue" }) {
  const sizes = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-4",
    xl: "w-16 h-16 border-4",
  };
  const colors = {
    blue: "border-blue-600",
    white: "border-white",
    gray: "border-gray-400",
  };
  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizes[size]} ${colors[color]} rounded-full
          border-t-transparent animate-spin`}
      />
    </div>
  );
}
