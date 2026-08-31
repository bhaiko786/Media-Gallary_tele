import { auth } from "@/lib/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const protectedPaths = ["/dashboard", "/upload", "/import", "/view"];
  const isProtected = protectedPaths.some((p) => req.nextUrl.pathname.startsWith(p));

  if (isProtected && !isLoggedIn) {
    return Response.redirect(new URL("/auth/login", req.nextUrl));
  }
});

export const config = {
  matcher: ["/dashboard/:path*", "/upload/:path*", "/import/:path*", "/view/:path*"],
};