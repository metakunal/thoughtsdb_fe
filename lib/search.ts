import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function getEmbedding(
  text: string,
  inputType: "search_document" | "search_query" = "search_document",
  retries = 3
): Promise<number[] | null> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch("https://api.cohere.com/v2/embed", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          texts: [text],
          model: "embed-english-v3.0",
          input_type: inputType,
          embedding_types: ["float"],
        }),
      });
      const data = await response.json();
      return data.embeddings.float[0];
    } catch (err) {
      if (i === retries - 1) {
        console.error("Embedding failed after retries:", err instanceof Error ? err.message : String(err));
        return null;
      }
      await new Promise((r) => setTimeout(r, (i + 1) * 1000));
    }
  }
  return null;
}

export async function searchSaves(
  userId: string,
  query: string,
  count = 5
) {
  const embedding = await getEmbedding(query, "search_query");

  if (!embedding) {
    throw new Error("Failed to generate query embedding");
  }

  const { data, error } = await supabase.rpc("search_saves", {
    query_embedding: embedding,
    match_user_id: userId,
    match_count: count,
  });

  if (error) throw error;
  return data;
}