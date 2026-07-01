// frontend/components/ui/AdminSidebar.jsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { href: "/admin", icon: "📊", label: "Dashboard" },
  { href: "/admin/bookings", icon: "📋", label: "Bookings" },
  { href: "/admin/inventory", icon: "📦", label: "Inventory" },
  { href: "/admin/products", icon: "🛒", label: "Products" },
  { href: "/admin/users", icon: "👥", label: "Users" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside
      className="w-64 min-h-screen bg-gray-900 text-white flex
      flex-col shadow-2xl"
    >
      {/* ── Logo ── */}
      <div className="px-6 py-6 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 bg-blue-600 rounded-xl flex
            items-center justify-center text-xl shadow-lg"
          >
            🔧
          </div>
          <div>
            <p className="font-extrabold text-white text-sm leading-tight">
              OM Mobile
            </p>
            <p className="text-xs text-blue-400 font-medium">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl
                text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
              {isActive && (
                <span
                  className="ml-auto w-1.5 h-1.5 bg-white
                  rounded-full"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── User Info + Logout ── */}
      <div className="px-4 py-5 border-t border-gray-700">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div
            className="w-9 h-9 bg-gradient-to-br from-blue-500
            to-purple-600 rounded-full flex items-center justify-center
            text-sm font-bold text-white shadow"
          >
            {user?.name?.charAt(0).toUpperCase() || "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {user?.name || "Admin"}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {user?.email || "admin@example.com"}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2.5
            rounded-xl text-sm font-medium text-gray-400
            hover:bg-red-500/10 hover:text-red-400 transition-all"
        >
          <span>🚪</span> Logout
        </button>
      </div>
    </aside>
  );
}
