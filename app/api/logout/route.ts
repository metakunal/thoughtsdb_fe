import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", req.url));
  response.cookies.delete("tg_user_id");
  response.cookies.delete("tg_first_name");
  return response;
}