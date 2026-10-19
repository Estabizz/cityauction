import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_NAME, isAdmin, verifyToken } from "@/lib/session-token";

// Gate the private areas before they render:
// - /admin/** and /api/admin/** need an ADMIN or SUPER_ADMIN session
// - /dashboard/** and /api/user/** need any signed-in session
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const session = token ? await verifyToken(token) : null;

  const isApi = pathname.startsWith("/api/");
  const needsAdmin = pathname.startsWith("/admin") || pathname.startsWith("/api/admin");

  if (session && (!needsAdmin || isAdmin(session))) {
    return NextResponse.next();
  }

  if (isApi) {
    return NextResponse.json(
      { success: false, error: session ? "Admin access required." : "Please sign in." },
      { status: session ? 403 : 401 }
    );
  }

  // Signed in but not an admin: send them to their own dashboard.
  if (session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const login = new URL("/login", request.url);
  login.searchParams.set("next", pathname + search);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/api/admin/:path*", "/api/user/:path*"],
};
