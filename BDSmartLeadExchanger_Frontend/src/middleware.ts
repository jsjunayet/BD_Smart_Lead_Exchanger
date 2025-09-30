import { NextResponse } from "next/server";
import { getSingleuser } from "./services/userService";

export async function middleware(req) {
  // const token = await getCurrentUser();
  const { data: token } = await getSingleuser();
  // console.log(data, "datajfdsalfjd");

  const { pathname } = req.nextUrl;

  // Public routes (skip check)
  if (pathname.startsWith("/login") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // If not logged in → redirect
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Admin route protection
  if (
    pathname.startsWith("/admin") &&
    !["admin", "superAdmin"].includes(token.role)
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // User route protection
  if (pathname.startsWith("/user") && token.role !== "user") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // **NEW: Wallet balance check for users**
  // If user has 0 wallet balance and is trying to access any user route except deposit page
  if (
    token.role === "user" &&
    token.wallet <= 0 &&
    pathname.startsWith("/user") &&
    !pathname.startsWith("/user/dashboard/deposit") &&
    !pathname.startsWith("/user/logout") // Allow logout
  ) {
    return NextResponse.redirect(new URL("/user/dashboard/deposit", req.url));
  }

  return NextResponse.next();
}

// Apply to dashboard routes only
export const config = {
  matcher: [
    "/admin/:path*",
    "/user/:path*",
    // Add specific routes you want to protect with wallet check
  ],
};
