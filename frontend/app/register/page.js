"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import Spinner from "../../components/ui/Spinner";
const initialForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};
export default function RegisterPage() {
  const { register } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };
  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Full name is required";
    if (!form.email.match(/^\S+@\S+\.\S+$/))
      newErrors.email = "Enter a valid email";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    if (form.password.length < 6)
      newErrors.password = "Minimum 6 characters required";
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    return newErrors;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      const { confirmPassword, ...payload } = form;
      // ✅ role is always "user" on register — admin is DB-only
      const user = await register({ ...payload, role: "user" });
      toast.success(`Welcome to OM Mobile Repair, ${user.name}! 🎉`);
      router.push("/");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Registration failed. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };
  const inputFields = [
    {
      id: "name",
      label: "Full Name",
      type: "text",
      placeholder: "John Doe",
      icon: "👤",
    },
    {
      id: "email",
      label: "Email Address",
      type: "email",
      placeholder: "john@example.com",
      icon: "📧",
    },
    {
      id: "phone",
      label: "Phone Number",
      type: "tel",
      placeholder: "+977 98-0000-0000",
      icon: "📞",
    },
  ];
  return (
    <div
      className="min-h-screen bg-bg
      flex items-center justify-center px-4 py-12 relative overflow-hidden"
    >
      {/* Animated blobs */}
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
            <span className="text-4xl">🔧</span>
          </div>
          <h1 className="text-3xl text-ink tracking-wide">Create Account</h1>
          <p className="text-ink-soft mt-1 text-sm">
            Join OM Mobile Repair — Book repairs in minutes
          </p>
        </div>
        {/* Card */}
        <div className="glass-card p-8">
          {/* ✅ Role Badge — read only, always "user" */}
          <div
            className="flex items-center justify-center gap-2 mb-5 py-2.5 px-4
            bg-brand-purple/10 border border-brand-purple/25 rounded-xl"
          >
            <span>👤</span>
            <span className="text-ink-soft text-sm font-medium">
              Registering as{" "}
              <span className="text-ink font-bold">Customer</span>
            </span>
            <span
              className="ml-auto text-xs bg-brand-purple/20 text-brand-purple
              px-2 py-0.5 rounded-full border border-brand-purple/30"
            >
              User
            </span>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Standard Fields */}
            {inputFields.map(({ id, label, type, placeholder, icon }) => (
              <div key={id}>
                <label htmlFor={id} className="label-style text-ink-soft">
                  {label}
                </label>
                <div className="relative mt-1">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base">
                    {icon}
                  </span>
                  <input
                    id={id}
                    type={type}
                    value={form[id]}
                    onChange={(e) => update(id, e.target.value)}
                    placeholder={placeholder}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white/5
                      border text-ink placeholder-ink-soft/50 text-sm
                      focus:outline-none focus:ring-2 focus:ring-brand-purple transition
                      ${errors[id] ? "border-red-400" : "border-white/15"}`}
                  />
                </div>
                {errors[id] && (
                  <p className="text-red-300 text-xs mt-1 flex items-center gap-1">
                    ⚠️ {errors[id]}
                  </p>
                )}
              </div>
            ))}
            {/* Password */}
            <div>
              <label className="label-style text-ink-soft">Password</label>
              <div className="relative mt-1">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2">
                  🔑
                </span>
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  placeholder="Min. 6 characters"
                  className={`w-full pl-10 pr-12 py-3 rounded-xl bg-white/5
                    border text-ink placeholder-ink-soft/50 text-sm
                    focus:outline-none focus:ring-2 focus:ring-brand-purple transition
                    ${errors.password ? "border-red-400" : "border-white/15"}`}
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
              {/* Password Strength Meter */}
              {form.password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((lvl) => (
                      <div
                        key={lvl}
                        className={`h-1 flex-1 rounded-full transition-all duration-300
                          ${
                            form.password.length >= lvl * 3
                              ? lvl <= 1
                                ? "bg-red-400"
                                : lvl <= 2
                                  ? "bg-yellow-400"
                                  : lvl <= 3
                                    ? "bg-brand-purple"
                                    : "bg-emerald-400"
                              : "bg-white/10"
                          }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-ink-soft mt-1">
                    {form.password.length < 6
                      ? "Too short"
                      : form.password.length < 9
                        ? "Weak"
                        : form.password.length < 12
                          ? "Good"
                          : "Strong 💪"}
                  </p>
                </div>
              )}
              {errors.password && (
                <p className="text-red-300 text-xs mt-1">
                  ⚠️ {errors.password}
                </p>
              )}
            </div>
            {/* Confirm Password */}
            <div>
              <label className="label-style text-ink-soft">
                Confirm Password
              </label>
              <div className="relative mt-1">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2">
                  🔐
                </span>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => update("confirmPassword", e.target.value)}
                  placeholder="Repeat your password"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white/5
                    border text-ink placeholder-ink-soft/50 text-sm
                    focus:outline-none focus:ring-2 focus:ring-brand-purple transition
                    ${errors.confirmPassword ? "border-red-400" : "border-white/15"}`}
                />
                {form.confirmPassword && (
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm">
                    {form.password === form.confirmPassword ? "✅" : "❌"}
                  </span>
                )}
              </div>
              {errors.confirmPassword && (
                <p className="text-red-300 text-xs mt-1">
                  ⚠️ {errors.confirmPassword}
                </p>
              )}
            </div>
            {/* Terms */}
            <p className="text-xs text-ink-soft/80 text-center pt-1">
              By registering, you agree to our{" "}
              <span className="text-brand-purple underline cursor-pointer">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="text-brand-purple underline cursor-pointer">
                Privacy Policy
              </span>
            </p>
            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-brand-purple to-brand-orange
                text-white font-semibold rounded-xl shadow-lg
                hover:shadow-brand-purple/30 hover:scale-[1.02] active:scale-[0.98]
                transition-all duration-200 disabled:opacity-60
                disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <Spinner size="sm" color="white" /> Creating Account...
                </>
              ) : (
                "🚀 Create Account"
              )}
            </button>
          </form>
          <p className="text-center text-ink-soft mt-6 text-sm">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-ink font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
