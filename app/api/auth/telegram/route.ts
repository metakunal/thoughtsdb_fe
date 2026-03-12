import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// Verifies the data hash Telegram sends back is legitimate
function verifyTelegramAuth(data: Record<string, string>, botToken: string): boolean {
  const { hash, ...rest } = data;

  const checkString = Object.keys(rest)
    .sort()
    .map((k) => `${k}=${rest[k]}`)
    .join("\n");

  const secretKey = crypto
    .createHash("sha256")
    .update(botToken)
    .digest();

  const hmac = crypto
    .createHmac("sha256", secretKey)
    .update(checkString)
    .digest("hex");

  return hmac === hash;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const data: Record<string, string> = {};
  searchParams.forEach((value, key) => { data[key] = value; });

  console.log("Auth data received:", JSON.stringify(data));
  console.log("BOT_TOKEN exists:", !!process.env.BOT_TOKEN);
  console.log("BOT_TOKEN length:", process.env.BOT_TOKEN?.length);

  const isValid = verifyTelegramAuth(data, process.env.BOT_TOKEN!);
  console.log("Hash valid:", isValid);

  if (!isValid) {
    return NextResponse.json({ error: "Invalid auth" }, { status: 401 });
  }

  // Auth is valid — set a session cookie with the telegram user ID
  const response = NextResponse.redirect(new URL("/", req.url));
  response.cookies.set("tg_user_id", data.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  response.cookies.set("tg_first_name", data.first_name || "", {
    httpOnly: false, // readable by client for display
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}