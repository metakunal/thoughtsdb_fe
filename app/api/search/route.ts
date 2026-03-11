import { NextRequest, NextResponse } from "next/server";
import { searchSaves } from "@/lib/search";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");
  const userId = searchParams.get("userId");

  if (!query || !userId) {
    return NextResponse.json({ error: "Missing q or userId" }, { status: 400 });
  }

  try {
    const results = await searchSaves(userId, query);
    return NextResponse.json({ results });
  } catch (err: any) {
    console.error("Search API error:", err.message);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}