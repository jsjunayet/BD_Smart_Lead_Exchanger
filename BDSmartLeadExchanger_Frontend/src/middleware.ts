import { NextResponse } from "next/server";
import { getCurrentUser } from "./services/authService";

export async function middleware(req) {
  const token = await getCurrentUser();
  console.log(token, "tjere aaa");
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

  return NextResponse.next();
}

// Apply to dashboard routes only
export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};
