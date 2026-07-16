"use client";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [role, setRole] = useState("user"); // ✅ Role toggle state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(email, password);
      // ✅ Guard: selected role must match actual role from DB
      if (user.role !== role) {
        setError(
          role === "admin"
            ? "⛔ You are not authorized to login as Admin."
            : "⛔ Admin accounts must use the Admin login.",
        );
        setLoading(false);
        return;
      }
      // ✅ Redirect based on role
      if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className="min-h-screen bg-bg
      flex items-center justify-center px-4 py-12 relative overflow-hidden"
    >
      {/* Animated blobs — matching register page */}
      <div className="absolute inset-0 grid-overlay" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-purple/20 rounded-full filter blur-3xl animate-blob" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-orange/15 rounded-full filter blur-3xl animate-blob animation-delay-2000" />
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-brand-purple/10 rounded-full filter blur-3xl animate-blob animation-delay-4000" />
      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-20 h-20
            bg-gradient-to-br from-brand-purple to-brand-orange rounded-2xl shadow-2xl shadow-brand-purple/30 mb-4 hover:scale-110 transition-transform"
          >
            <span className="text-4xl">{role === "admin" ? "🛡️" : "🔧"}</span>
          </div>
          <h1 className="text-3xl text-ink tracking-wide">
            {role === "admin" ? "Admin Login" : "Welcome Back"}
          </h1>
          <p className="text-ink-soft mt-1 text-sm">
            {role === "admin"
              ? "Access the OM Mobile admin panel"
              : "Sign in to your OM Mobile account"}
          </p>
        </div>
        {/* Card */}
        <div className="glass-card p-8">
          {/* ✅ Role Toggle */}
          <div
            className="flex items-center bg-white/5 rounded-xl p-1 mb-6
            border border-white/10"
          >
            <button
              type="button"
              onClick={() => {
                setRole("user");
                setError("");
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg
                text-sm font-semibold transition-all duration-200
                ${
                  role === "user"
                    ? "bg-brand-purple text-white shadow-lg"
                    : "text-ink-soft hover:text-ink"
                }`}
            >
              👤 User Login
            </button>
            <button
              type="button"
              onClick={() => {
                setRole("admin");
                setError("");
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg
                text-sm font-semibold transition-all duration-200
                ${
                  role === "admin"
                    ? "bg-brand-orange text-white shadow-lg"
                    : "text-ink-soft hover:text-ink"
                }`}
            >
              🛡️ Admin Login
            </button>
          </div>
          {/* Error */}
          {error && (
            <div
              className="mb-5 p-3 bg-red-500/15 border border-red-400/30
              rounded-xl text-red-300 text-sm text-center font-medium"
            >
              {error}
            </div>
          )}
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-ink-soft mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base">
                  📧
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5
                    border border-white/15 text-ink placeholder-ink-soft/50
                    text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple
                    transition"
                />
              </div>
            </div>
            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-ink-soft mb-1.5">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2">
                  🔑
                </span>
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 pr-14 py-3 rounded-xl bg-white/5
                    border border-white/15 text-ink placeholder-ink-soft/50
                    text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple
                    transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2
                    text-ink-soft hover:text-ink transition text-xs font-medium"
                >
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            {/* Admin notice */}
            {role === "admin" && (
              <div
                className="p-3 bg-brand-orange/10 border border-brand-orange/30
                rounded-xl text-brand-orange text-xs text-center"
              >
                🛡️ Admin accounts are created by the system only.
              </div>
            )}
            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 text-white font-semibold rounded-xl
                shadow-lg transition-all duration-200 flex items-center
                justify-center gap-2 mt-2 disabled:opacity-60
                disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]
                ${
                  role === "admin"
                    ? "bg-gradient-to-r from-brand-orange to-brand-purple hover:shadow-brand-orange/30"
                    : "bg-gradient-to-r from-brand-purple to-brand-orange hover:shadow-brand-purple/30"
                }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Signing in...
                </span>
              ) : (
                `Sign in as ${role === "admin" ? "Admin 🛡️" : "User →"}`
              )}
            </button>
          </form>
          {/* Register Link — only for users */}
          {role === "user" && (
            <p className="text-center text-ink-soft mt-6 text-sm">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-ink font-semibold hover:underline"
              >
                Create one
              </Link>
            </p>
          )}
          {/* Admin: no self-register hint */}
          {role === "admin" && (
            <p className="text-center text-ink-soft/60 mt-6 text-xs">
              Admin access is granted by the system administrator only.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
