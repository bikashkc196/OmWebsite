"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

const userNavLinks = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/book", label: "Book Repair", icon: "📅" },
  { href: "/my-repairs", label: "My Repairs", icon: "🔧" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl
      border-b border-gray-100 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div
              className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600
              rounded-xl flex items-center justify-center shadow-md
              group-hover:scale-110 transition-transform"
            >
              <span className="text-lg">🔧</span>
            </div>
            <div className="leading-tight">
              <p className="font-bold text-gray-900 text-sm">OM Mobile</p>
              <p className="text-xs text-blue-600 font-medium">Repair Center</p>
            </div>
          </Link>

          {/* ── Desktop Nav Links ── */}
          <div className="hidden md:flex items-center gap-1">
            {userNavLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl
                    text-sm font-medium transition-all duration-200
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                >
                  <span>{link.icon}</span>
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* ── Right Side ── */}
          <div className="flex items-center gap-3">
            {/* Book Now CTA */}
            <Link
              href="/book"
              className="hidden md:flex items-center gap-2 px-4 py-2
                bg-gradient-to-r from-blue-600 to-indigo-600 text-white
                text-sm font-semibold rounded-xl shadow-md
                hover:shadow-blue-300 hover:scale-105 transition-all"
            >
              ⚡ Book Now
            </Link>

            {/* User Avatar Dropdown */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl
                    hover:bg-gray-100 transition-all group"
                >
                  <div
                    className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500
                    rounded-lg flex items-center justify-center text-white
                    text-sm font-bold shadow-sm"
                  >
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-700">
                    {user.name?.split(" ")[0]}
                  </span>
                  <span className="text-gray-400 text-xs">▾</span>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-52 bg-white rounded-2xl
                    shadow-xl border border-gray-100 py-2 animate-fade-in z-50"
                  >
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-50">
                      <p className="text-sm font-semibold text-gray-800">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {user.email}
                      </p>
                      <span
                        className={`mt-1.5 badge text-xs
                        ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {user.role === "admin" ? "👑 Admin" : "👤 User"}
                      </span>
                    </div>
                    {/* Dropdown Links */}
                    <div className="py-1">
                      <Link
                        href="/my-repairs"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm
                          text-gray-700 hover:bg-gray-50 transition"
                      >
                        🔧 My Repairs
                      </Link>
                      {user.role === "admin" && (
                        <Link
                          href="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm
                            text-purple-700 hover:bg-purple-50 transition"
                        >
                          👑 Admin Panel
                        </Link>
                      )}
                    </div>
                    {/* Logout */}
                    <div className="border-t border-gray-50 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setDropdownOpen(false);
                        }}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm
                          text-red-600 hover:bg-red-50 transition w-full text-left"
                      >
                        🚪 Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-xl text-gray-600
                hover:bg-gray-100 transition"
            >
              <div
                className={`w-5 h-0.5 bg-current mb-1 transition-all
                ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`}
              />
              <div
                className={`w-5 h-0.5 bg-current mb-1 transition-all
                ${menuOpen ? "opacity-0" : ""}`}
              />
              <div
                className={`w-5 h-0.5 bg-current transition-all
                ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        {menuOpen && (
          <div className="md:hidden pb-4 pt-2 space-y-1 animate-fade-in">
            {userNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl
                  text-sm font-medium transition
                  ${
                    pathname === link.href
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
              >
                {link.icon} {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-gray-100">
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-3 rounded-xl
                  text-sm font-medium text-red-600 hover:bg-red-50 transition w-full"
              >
                🚪 Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
