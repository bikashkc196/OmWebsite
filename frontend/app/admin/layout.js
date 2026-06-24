"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../../components/ui/Spinner";

const adminNavLinks = [
  { href: "/admin", label: "Dashboard", icon: "📊", exact: true },
  { href: "/admin/bookings", label: "Bookings", icon: "📋" },
  { href: "/admin/inventory", label: "Inventory", icon: "📦" },
];

export default function AdminLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user) router.push("/login");
      else if (user.role !== "admin") router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center space-y-4">
          <Spinner size="xl" color="white" />
          <p className="text-gray-400 text-sm">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") return null;

  const isActive = (href, exact) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <div className="min-h-screen flex bg-gray-950">
      {/* ── Sidebar ── */}
      <aside
        className={`${sidebarOpen ? "w-64" : "w-20"} transition-all duration-300
        bg-gray-900 border-r border-gray-800 flex flex-col sticky top-0 h-screen`}
      >
        {/* Sidebar Header */}
        <div
          className="flex items-center justify-between px-4 h-16
          border-b border-gray-800"
        >
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500
                rounded-lg flex items-center justify-center text-sm shadow"
              >
                🔧
              </div>
              <div className="leading-tight">
                <p className="text-white text-xs font-bold">OM Repair</p>
                <p className="text-blue-400 text-[10px]">Admin Panel</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg text-gray-400 hover:text-white
              hover:bg-gray-800 transition text-sm"
          >
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {adminNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              title={!sidebarOpen ? link.label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl
                text-sm font-medium transition-all duration-200
                ${
                  isActive(link.href, link.exact)
                    ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
            >
              <span className="text-lg flex-shrink-0">{link.icon}</span>
              {sidebarOpen && <span>{link.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-gray-800">
          {sidebarOpen && (
            <div className="flex items-center gap-2.5 px-3 py-2 mb-2">
              <div
                className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500
                rounded-lg flex items-center justify-center text-white
                text-sm font-bold"
              >
                {user.name?.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-white text-xs font-semibold truncate">
                  {user.name}
                </p>
                <p className="text-purple-400 text-[10px]">👑 Administrator</p>
              </div>
            </div>
          )}
          <button
            onClick={logout}
            title={!sidebarOpen ? "Sign Out" : undefined}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl
              text-sm font-medium text-red-400 hover:bg-red-500/10
              hover:text-red-300 transition"
          >
            <span className="text-lg flex-shrink-0">🚪</span>
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header
          className="h-16 bg-gray-900/50 border-b border-gray-800
          flex items-center justify-between px-6 sticky top-0 z-10 backdrop-blur-xl"
        >
          <div>
            <h2 className="text-white font-semibold text-sm capitalize">
              {pathname === "/admin"
                ? "Dashboard Overview"
                : pathname.replace("/admin/", "").replace(/-/g, " ")}
            </h2>
            <p className="text-gray-500 text-xs">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-gray-400 text-xs">System Online</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-950 p-6 text-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
}
