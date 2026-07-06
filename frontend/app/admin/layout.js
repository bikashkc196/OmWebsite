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
        bg-gray-50"
      >
        <div className="text-center">
          <Spinner size="xl" color="blue" />
          <p className="mt-4 text-gray-500 font-medium">
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
        bg-gray-50"
      >
        <div className="text-center">
          <p className="text-6xl mb-4">🔒</p>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-500 text-sm">
            You don't have permission to view this page.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar />
      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
