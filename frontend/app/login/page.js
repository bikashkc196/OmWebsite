"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import Link from "next/link";

export default function LoginPage() {
  const { login } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}! 👋`);

      // Role-based redirect

      user.role === "admin" ? router.push("/admin") : router.push("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center px-4">
      {/* Decorative Blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-indigo-500 filter blur-xl opacity-20 animate-blob animation-delay-2000" />

      <div className="relative w-full max-w-md">
        {/* logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-2xl mb-4">
            <span className="text-4xl">🔧</span>
          </div>
          <h1 className="text-3xl font-bold text-white">
            OM Mobile Repair Center
          </h1>
          <p className="text-blue-200 mt-1">Sign in to your account</p>
        </div>
        {/* Form Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                placeholder="your@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">
                Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30
                  text-white placeholder-blue-300 focus:outline-none focus:ring-2
                  focus:ring-blue-400 transition"
                placeholder="********"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500
                text-white font-semibold rounded-xl shadow-lg hover:shadow-blue-500/30
                hover:scale-[1.02] active:scale-[0.98] transition-all duration-200
                disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>
          <p className="text-center text-blue-200 mt-6 text-sm">
            Don't have an account? {""}
            <Link
              href="/register"
              className="text-white font-semibold hover:underline"
            >
              Create One
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
