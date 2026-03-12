import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Dashboard from "@/components/Dashboard";

export default async function Page() {
  const cookieStore = cookies();
  const userId = cookieStore.get("tg_user_id")?.value;
  const firstName = cookieStore.get("tg_first_name")?.value;

  if (!userId) redirect("/login");

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  const { data: recentSaves } = await supabase
    .from("saves")
    .select("id, title, summary, source_type, tags, raw_text, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <Dashboard
      initialSaves={recentSaves || []}
      userId={userId}
      firstName={firstName || ""}
    />
  );
}