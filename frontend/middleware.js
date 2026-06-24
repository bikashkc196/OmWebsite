import { NextResponse } from "next/server";

// Define protected route patterns
const userProtectedRoutes = ["/", "/book", "/my-repairs"];
const adminProtectedRoutes = ["/admin", "/admin/bookings", "/admin/inventory"];
const guestOnlyRoutes = ["/login", "/register"];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Read token from cookies (we'll store it there too)
  const token = request.cookies.get("om_token")?.value;
  const role = request.cookies.get("om_role")?.value;

  const isUserRoute = userProtectedRoutes.some(
    (r) => pathname === r || pathname.startsWith(r + "/"),
  );
  const isAdminRoute = adminProtectedRoutes.some((r) => pathname.startsWith(r));
  const isGuestRoute = guestOnlyRoutes.includes(pathname);

  // 🔒 Redirect unauthenticated users away from protected routes
  if (!token && (isUserRoute || isAdminRoute)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 🔒 Redirect authenticated guests away from login/register
  if (token && isGuestRoute) {
    return NextResponse.redirect(
      new URL(role === "admin" ? "/admin" : "/", request.url),
    );
  }

  // 🔒 Block non-admins from admin routes
  if (token && isAdminRoute && role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 🔒 Redirect admins away from user routes
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
    "/admin/:path*",
    "/login",
    "/register",
  ],
};
