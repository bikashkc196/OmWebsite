// frontend/middleware.js
import { NextResponse } from "next/server";
const userProtectedRoutes = [
  "/",
  "/book",
  "/my-repairs",
  "/cart",
  "/checkout",
  "/my-orders",
  "/profile",
  "/change-password", // ✅ NEW
];
const adminProtectedRoutes = [
  "/admin",
  "/admin/bookings",
  "/admin/inventory",
  "/admin/products",
  "/admin/orders",
  "/admin/analytics", // ✅ NEW
];
const guestOnlyRoutes = ["/login", "/register"];
export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("om_token")?.value;
  const role = request.cookies.get("om_role")?.value;
  const isUserRoute = userProtectedRoutes.some(
    (r) => pathname === r || pathname.startsWith(r + "/"),
  );
  const isAdminRoute = adminProtectedRoutes.some((r) => pathname.startsWith(r));
  const isGuestRoute = guestOnlyRoutes.includes(pathname);
  if (!token && (isUserRoute || isAdminRoute)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (token && isGuestRoute) {
    return NextResponse.redirect(
      new URL(role === "admin" ? "/admin" : "/", request.url),
    );
  }
  if (token && isAdminRoute && role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (token && role === "admin" && isUserRoute) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }
  return NextResponse.next();
}
export const config = {
  matcher: [
    "/",
    "/book/:path*",
    "/my-repairs/:path*",
    "/cart/:path*",
    "/checkout/:path*",
    "/my-orders/:path*",
    "/profile/:path*",
    "/change-password/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};
