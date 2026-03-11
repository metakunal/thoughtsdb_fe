import { createClient } from "@supabase/supabase-js";
import Dashboard from "@/components/Dashboard";

// Server component — fetches initial data before render
export default async function Page() {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  const { data: recentSaves } = await supabase
    .from("saves")
    .select("id, title, summary, source_type, tags, raw_text, created_at")
    .order("created_at", { ascending: false })
    .limit(20);

  return <Dashboard initialSaves={recentSaves || []} />;
}