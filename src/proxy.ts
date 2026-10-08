import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const ROLE_PREFIX: Record<string, string> = {
  "/passenger": "PASSENGER",
  "/rider": "RIDER",
  "/admin": "SUPER_ADMIN",
};

export default auth((req) => {
  const { nextUrl } = req;
  const role = (req.auth?.user as any)?.role;
  const loggedIn = !!req.auth;

  for (const [prefix, required] of Object.entries(ROLE_PREFIX)) {
    if (nextUrl.pathname.startsWith(prefix)) {
      if (!loggedIn) {
        return NextResponse.redirect(new URL("/login", nextUrl));
      }
      if (role !== required) {
        return NextResponse.redirect(new URL("/login", nextUrl));
      }
    }
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/passenger/:path*", "/rider/:path*", "/admin/:path*"],
};
