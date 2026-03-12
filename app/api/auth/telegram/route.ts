import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

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

export async function POST(req: NextRequest) {
  const data = await req.json();

  console.log("Telegram auth received:", JSON.stringify(data));
  console.log("BOT_TOKEN exists:", !!process.env.BOT_TOKEN);

  const isValid = verifyTelegramAuth(data, process.env.BOT_TOKEN!);
  console.log("Hash valid:", isValid);

  if (!isValid) {
    return NextResponse.json({ error: "Invalid auth" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });

  response.cookies.set("tg_user_id", String(data.id), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  response.cookies.set("tg_first_name", data.first_name || "", {
    httpOnly: false,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  return response;
}