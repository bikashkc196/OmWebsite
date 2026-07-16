// frontend/components/ui/Navbar.jsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../hooks/useCart";
import {
  Home,
  ShoppingCart,
  CalendarPlus,
  Wrench,
  Package,
  User,
  Lock,
  Crown,
  LogOut,
  ChevronDown,
  Zap,
} from "lucide-react";

const userNavLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/products", label: "Shop", icon: ShoppingCart },
  { href: "/book", label: "Book Repair", icon: CalendarPlus },
  { href: "/my-repairs", label: "My Repairs", icon: Wrench },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-50 bg-bg/80 backdrop-blur-xl
    border-b border-line"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div
              className="w-9 h-9 bg-gradient-to-br from-brand-purple to-brand-orange
            rounded-xl flex items-center justify-center shadow-md
            group-hover:scale-110 transition-transform"
            >
              <Wrench size={18} className="text-white" />
            </div>
            <div className="leading-tight">
              <p className="font-display text-ink text-sm tracking-wide">OM Mobile</p>
              <p className="text-xs text-brand-purple font-medium">Repair Center</p>
            </div>
          </Link>
          {/* ── Desktop Nav Links ── */}
          <div className="hidden md:flex items-center gap-1">
            {userNavLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl
                  text-sm font-medium transition-all duration-200
                  ${
                    isActive
                      ? "bg-brand-purple/10 text-brand-purple"
                      : "text-ink-soft hover:bg-surface hover:text-ink"
                  }`}
                >
                  <Icon size={16} />
                  {link.label}
                </Link>
              );
            })}
          </div>
          {/* ── Right Side ── */}
          <div className="flex items-center gap-2">
            {/* Book Now CTA */}
            <Link
              href="/book"
              className="hidden md:flex items-center gap-1.5 px-4 py-2
              bg-gradient-to-r from-brand-purple to-brand-orange text-white
              text-sm font-semibold rounded-xl shadow-md shadow-brand-purple/20
              hover:shadow-brand-orange/30 hover:scale-105 transition-all"
            >
              <Zap size={14} /> Book Now
            </Link>
            {/* Cart Icon */}
            {user && (
              <Link
                href="/cart"
                className="relative p-2 hover:bg-surface rounded-xl transition"
              >
                <ShoppingCart size={20} className="text-ink-soft" />
                {cartCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-5 h-5
                  bg-brand-orange text-white text-xs font-bold rounded-full
                  flex items-center justify-center shadow animate-glow"
                  >
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>
            )}
            {/* User Avatar Dropdown */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl
                  hover:bg-surface transition-all group"
                >
                  <div
                    className="w-8 h-8 bg-gradient-to-br from-brand-purple
                  to-brand-orange rounded-lg flex items-center justify-center
                  text-white text-sm font-bold shadow-sm"
                  >
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:block text-sm font-medium text-ink">
                    {user.name?.split(" ")[0]}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-ink-soft transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {/* Dropdown */}
                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-52 bg-surface rounded-2xl
                  shadow-xl border border-line py-2 animate-scale-in origin-top-right z-50"
                  >
                    <div className="px-4 py-3 border-b border-line">
                      <p className="text-sm font-semibold text-ink">
                        {user.name}
                      </p>
                      <p className="text-xs text-ink-soft mt-0.5">
                        {user.email}
                      </p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/my-repairs"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm
                        text-ink-soft hover:bg-surface2 hover:text-ink transition"
                      >
                        <Wrench size={15} /> My Repairs
                      </Link>
                      <Link
                        href="/products"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm
                        text-ink-soft hover:bg-surface2 hover:text-ink transition"
                      >
                        <ShoppingCart size={15} /> Shop
                      </Link>
                      <Link
                        href="/cart"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm
                        text-ink-soft hover:bg-surface2 hover:text-ink transition"
                      >
                        <ShoppingCart size={15} /> Cart
                        {cartCount > 0 && (
                          <span
                            className="ml-auto bg-brand-orange text-white text-xs
                          font-bold w-5 h-5 rounded-full flex items-center justify-center"
                          >
                            {cartCount}
                          </span>
                        )}
                      </Link>
                      <Link
                        href="/my-orders"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm
                        text-ink-soft hover:bg-surface2 hover:text-ink transition"
                      >
                        <Package size={15} /> My Orders
                      </Link>
                      <Link
                        href="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm
                        text-ink-soft hover:bg-surface2 hover:text-ink transition"
                      >
                        <User size={15} /> My Profile
                      </Link>
                      <Link
                        href="/change-password"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm
                        text-ink-soft hover:bg-surface2 hover:text-ink transition"
                      >
                        <Lock size={15} /> Change Password
                      </Link>
                      {user.role === "admin" && (
                        <Link
                          href="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm
                          text-brand-purple hover:bg-brand-purple/10 transition"
                        >
                          <Crown size={15} /> Admin Panel
                        </Link>
                      )}
                    </div>
                    <div className="border-t border-line pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setDropdownOpen(false);
                        }}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm
                        text-red-400 hover:bg-red-500/10 transition w-full text-left"
                      >
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            {/* Mobile Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-xl text-ink-soft hover:bg-surface transition"
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
      </div>
      {/* ── Mobile Menu ── */}
      {menuOpen && (
        <div className="md:hidden pb-4 pt-2 space-y-1 animate-fade-in px-4">
          {userNavLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl
              text-sm font-medium transition
              ${
                pathname === link.href
                  ? "bg-brand-purple/10 text-brand-purple"
                  : "text-ink-soft hover:bg-surface"
              }`}
              >
                <Icon size={16} /> {link.label}
              </Link>
            );
          })}
          <Link
            href="/cart"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 px-4 py-3 rounded-xl
            text-sm font-medium text-ink-soft hover:bg-surface transition"
          >
            <ShoppingCart size={16} /> Cart {cartCount > 0 && `(${cartCount})`}
          </Link>
          <div className="pt-2 border-t border-line">
            <button
              onClick={() => {
                logout();
                setMenuOpen(false);
              }}
              className="flex items-center gap-2 px-4 py-3 rounded-xl
              text-sm font-medium text-red-400 hover:bg-red-500/10 transition w-full"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
