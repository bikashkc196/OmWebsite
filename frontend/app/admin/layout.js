// frontend/app/admin/layout.js
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import AdminSidebar from "../../components/ui/AdminSidebar";
import Spinner from "../../components/ui/Spinner";
export default function AdminLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login");
      } else if (user.role !== "admin") {
        router.replace("/");
      }
    }
  }, [user, loading, router]);
  // ── Loading State ──
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center
        bg-bg"
      >
        <div className="text-center">
          <Spinner size="xl" color="blue" />
          <p className="mt-4 text-ink-soft font-medium">
            Loading admin panel...
          </p>
        </div>
      </div>
    );
  }
  // ── Access Denied ──
  if (!user || user.role !== "admin") {
    return (
      <div
        className="min-h-screen flex items-center justify-center
        bg-bg"
      >
        <div className="text-center">
          <p className="text-6xl mb-4">🔒</p>
          <h2 className="text-xl text-ink mb-2 tracking-wide">
            Access Denied
          </h2>
          <p className="text-ink-soft text-sm">
            You don't have permission to view this page.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex min-h-screen bg-bg">
      {/* Sidebar */}
      <AdminSidebar />
      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
