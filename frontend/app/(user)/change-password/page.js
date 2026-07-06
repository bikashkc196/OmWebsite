// frontend/app/(user)/change-password/page.js
"use client";
import { useState } from "react";
import api from "../../../lib/api";
import { useToast } from "../../../context/ToastContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Spinner from "../../../components/ui/Spinner";
export default function ChangePasswordPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [showPwd, setShowPwd] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const validate = () => {
    const errs = {};
    if (!form.currentPassword)
      errs.currentPassword = "Current password is required";
    if (!form.newPassword) errs.newPassword = "New password is required";
    else if (form.newPassword.length < 8)
      errs.newPassword = "Minimum 8 characters required";
    if (form.newPassword !== form.confirmPassword)
      errs.confirmPassword = "Passwords do not match";
    if (
      form.currentPassword &&
      form.newPassword &&
      form.currentPassword === form.newPassword
    )
      errs.newPassword = "New password must be different from current password";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await api.put("/auth/change-password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword,
      });
      toast.success("Password changed successfully! 🔒");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => router.push("/profile"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };
  const fields = [
    {
      key: "currentPassword",
      label: "Current Password",
      placeholder: "Enter your current password",
      showKey: "current",
    },
    {
      key: "newPassword",
      label: "New Password",
      placeholder: "Min. 8 characters",
      showKey: "new",
    },
    {
      key: "confirmPassword",
      label: "Confirm New Password",
      placeholder: "Repeat the new password",
      showKey: "confirm",
    },
  ];
  // Password strength indicator
  const pwd = form.newPassword;
  const strength = !pwd
    ? 0
    : pwd.length < 6
      ? 1
      : pwd.length < 8
        ? 2
        : /[A-Z]/.test(pwd) && /[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)
          ? 4
          : /[A-Z]/.test(pwd) || /[0-9]/.test(pwd)
            ? 3
            : 2;
  const strengthLabel = ["", "Too Weak", "Weak", "Good", "Strong"];
  const strengthColor = [
    "",
    "bg-red-400",
    "bg-orange-400",
    "bg-yellow-400",
    "bg-green-500",
  ];
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div>
          <Link
            href="/profile"
            className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1 mb-3"
          >
            ← Back to Profile
          </Link>
          <h1 className="text-2xl font-extrabold text-gray-800">
            🔒 Change Password
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Keep your account secure with a strong password
          </p>
        </div>
        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((f) => (
              <div key={f.key}>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  {f.label} *
                </label>
                <div className="relative">
                  <input
                    type={showPwd[f.showKey] ? "text" : "password"}
                    value={form[f.key]}
                    onChange={(e) => {
                      setForm({ ...form, [f.key]: e.target.value });
                      if (errors[f.key]) setErrors({ ...errors, [f.key]: "" });
                    }}
                    placeholder={f.placeholder}
                    className={`w-full border rounded-xl px-3 py-2.5 pr-10 text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500 transition
                    ${errors[f.key] ? "border-red-400" : "border-gray-200"}`}
                  />
                  {/* Show/hide toggle */}
                  <button
                    type="button"
                    onClick={() =>
                      setShowPwd({
                        ...showPwd,
                        [f.showKey]: !showPwd[f.showKey],
                      })
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400
                    hover:text-gray-600 text-sm transition"
                  >
                    {showPwd[f.showKey] ? "🙈" : "👁️"}
                  </button>
                </div>
                {errors[f.key] && (
                  <p className="text-red-500 text-xs mt-1">
                    ⚠️ {errors[f.key]}
                  </p>
                )}
                {/* Strength Bar — only for new password */}
                {f.key === "newPassword" && form.newPassword && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all ${
                            i <= strength
                              ? strengthColor[strength]
                              : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p
                      className={`text-xs font-semibold ${
                        strength === 4
                          ? "text-green-600"
                          : strength === 3
                            ? "text-yellow-600"
                            : "text-red-500"
                      }`}
                    >
                      {strengthLabel[strength]}
                    </p>
                  </div>
                )}
                {/* Match indicator for confirm */}
                {f.key === "confirmPassword" && form.confirmPassword && (
                  <p
                    className={`text-xs mt-1 font-medium ${
                      form.newPassword === form.confirmPassword
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {form.newPassword === form.confirmPassword
                      ? "✅ Passwords match"
                      : "❌ Passwords do not match"}
                  </p>
                )}
              </div>
            ))}
            {/* Tips */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
              <p className="text-xs font-semibold text-blue-700 mb-1">
                💡 Strong Password Tips
              </p>
              <ul className="text-xs text-blue-600 space-y-0.5 list-disc pl-4">
                <li>At least 8 characters long</li>
                <li>Include uppercase & lowercase letters</li>
                <li>Include numbers and special characters (!@#$)</li>
                <li>Avoid using your name or email</li>
              </ul>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold
              text-sm hover:bg-blue-700 transition shadow-md shadow-blue-200
              disabled:opacity-60 disabled:cursor-not-allowed
              flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Spinner size="sm" color="white" /> Changing Password...
                </>
              ) : (
                "🔒 Change Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
