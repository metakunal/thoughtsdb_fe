import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const userId = req.cookies.get("tg_user_id")?.value;
  const isLoginPage = req.nextUrl.pathname === "/login";
  const isApiRoute = req.nextUrl.pathname.startsWith("/api");

  // Allow API routes through always
  if (isApiRoute) return NextResponse.next();

  // Redirect to login if no session
  if (!userId && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Redirect away from login if already authenticated
  if (userId && isLoginPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};