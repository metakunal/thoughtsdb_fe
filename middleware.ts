import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow these through always
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const userId = req.cookies.get("tg_user_id")?.value;
  const isLoginPage = pathname === "/login";

  console.log("Middleware path:", pathname, "userId:", userId, "cookies:", req.cookies.getAll().map(c => c.name).join(", "));

  if (!userId && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (userId && isLoginPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};