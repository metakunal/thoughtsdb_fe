"use client";

import { useState, useEffect, useTransition } from "react";
import SaveCard from "./SaveCard";

const FILTERS = ["all", "tweet", "article", "book", "reminder", "quote", "video", "other"] as const;
type Filter = (typeof FILTERS)[number];

interface Save {
  id: string;
  title: string | null;
  summary: string | null;
  source_type: string | null;
  tags: string[] | null;
  raw_text: string | null;
  created_at: string;
}

interface Props {
  initialSaves: Save[];
  userId: string;
  firstName: string;
}

export default function Dashboard({ initialSaves, userId, firstName }: Props) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [saves, setSaves] = useState<Save[]>(initialSaves);
  const [mode, setMode] = useState<"recent" | "search">("recent");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (mode === "recent") {
      setSaves(
        filter === "all"
          ? initialSaves
          : initialSaves.filter((s) => s.source_type === filter)
      );
    }
  }, [filter, mode, initialSaves]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) {
      setMode("recent");
      setSaves(initialSaves);
      return;
    }

    startTransition(async () => {
      setMode("search");
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(query)}&userId=${userId}`
      );
      const data = await res.json();
      setSaves(data.results || []);
    });
  }

  function clearSearch() {
    setQuery("");
    setMode("recent");
    setSaves(initialSaves);
  }

  const resultLabel = isPending
    ? "Searching..."
    : mode === "search"
    ? `${saves.length} result${saves.length !== 1 ? "s" : ""} for "${query}"`
    : `${saves.length} recent saves`;

  return (
    <div className="min-h-screen bg-[#0c0c0c]">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-[#1e1e1e] bg-[#0c0c0c]/95 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center gap-8">
          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xl text-[#e2d9c8]">◈</span>
            <span className="font-mono text-[11px] tracking-[0.25em] text-[#444] uppercase">
              Second Brain
            </span>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex flex-1 gap-2">
            <input
              className="search-input flex-1 bg-[#141414] border border-[#1e1e1e] text-[#e2d9c8] px-4 py-2.5 text-sm font-serif placeholder:text-[#333] transition-colors"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search your saved knowledge..."
            />
            {mode === "search" && (
              <button
                type="button"
                onClick={clearSearch}
                className="px-4 py-2.5 border border-[#1e1e1e] text-[#555] font-mono text-xs hover:text-[#e2d9c8] hover:border-[#333] transition-colors"
              >
                Clear
              </button>
            )}
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#e2d9c8] text-[#0c0c0c] font-mono text-xs tracking-widest uppercase font-medium hover:bg-white transition-colors"
            >
              Search
            </button>
          </form>

          {/* User info + logout */}
          <div className="flex items-center gap-4 shrink-0">
            <span className="font-mono text-[11px] text-[#444] hidden sm:block">
              {firstName}
            </span>
            <a
              href="/api/auth/logout"
              className="font-mono text-[10px] text-[#333] tracking-widest uppercase hover:text-[#666] transition-colors"
            >
              Logout
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Filter bar */}
        <div className="flex gap-2 flex-wrap mb-8">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                if (mode === "search") clearSearch();
              }}
              className={`font-mono text-[10px] tracking-widest uppercase px-3 py-1.5 border transition-colors ${
                filter === f
                  ? "border-[#e2d9c8] text-[#e2d9c8]"
                  : "border-[#1e1e1e] text-[#444] hover:border-[#333] hover:text-[#666]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Results meta */}
        <div className="mb-6">
          <span className="font-mono text-[11px] text-[#444] tracking-widest uppercase">
            {resultLabel}
          </span>
        </div>

        {/* Empty state */}
        {!isPending && saves.length === 0 && (
          <div className="py-24 text-center">
            <p className="font-mono text-sm text-[#333]">
              {mode === "search"
                ? `Nothing found for "${query}"`
                : "Nothing saved yet. Send something to your bot."}
            </p>
          </div>
        )}

        {/* Cards grid */}
        <div
          className="grid gap-px bg-[#1a1a1a]"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}
        >
          {saves.map((save, i) => (
            <SaveCard key={save.id} save={save} index={i} />
          ))}
        </div>
      </main>
    </div>
  );
}