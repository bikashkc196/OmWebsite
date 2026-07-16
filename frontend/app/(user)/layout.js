"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/ui/Navbar";
import Footer from "../../components/ui/Footer";
import Spinner from "../../components/ui/Spinner";
export default function UserLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading) {
      if (!user) router.push("/login");
      else if (user.role === "admin") router.push("/admin");
    }
  }, [user, loading, router]);
  // Full-page loader
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center space-y-4">
          <Spinner size="xl" color="blue" />
          <p className="text-ink-soft text-sm font-medium">
            Loading your account...
          </p>
        </div>
      </div>
    );
  }
  if (!user || user.role === "admin") return null;
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
