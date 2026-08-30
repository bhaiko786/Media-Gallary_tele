import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get("media_auth_token");
  const { pathname } = request.nextUrl;
  const protectedPaths = ["/dashboard", "/upload", "/import", "/view"];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  if (isProtected && !authCookie) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/upload/:path*", "/import/:path*", "/view/:path*"],
};
