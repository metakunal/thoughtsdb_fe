import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(req: NextRequest) {
  const { pin } = await req.json();

  if (!pin) return NextResponse.json({ error: "Missing pin" }, { status: 400 });

  // Find valid unused pin
  const { data, error } = await supabase
    .from("pins")
    .select("telegram_id, expires_at, used")
    .eq("pin", pin)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Invalid PIN" }, { status: 401 });
  }

  if (data.used) {
    return NextResponse.json({ error: "PIN already used" }, { status: 401 });
  }

  if (new Date(data.expires_at) < new Date()) {
    return NextResponse.json({ error: "PIN expired" }, { status: 401 });
  }

  // Mark pin as used
  await supabase.from("pins").update({ used: true }).eq("pin", pin);

  // Get user's first name
  const { data: user } = await supabase
    .from("users")
    .select("first_name")
    .eq("telegram_id", data.telegram_id)
    .single();

  const response = NextResponse.json({ ok: true });

  response.cookies.set("tg_user_id", data.telegram_id, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  response.cookies.set("tg_first_name", user?.first_name || "", {
    httpOnly: false,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  return response;
}