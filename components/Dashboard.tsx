"use client";

import { useState, useEffect, useTransition, useMemo } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { 
  Search, 
  LayoutGrid, 
  History, 
  Settings, 
  LogOut, 
  Plus, 
  Command as CommandIcon,
  Twitter,
  FileText,
  BookOpen,
  Bell,
  Quote,
  Video,
  Layers,
  SearchX,
  User,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import SaveCard from "./SaveCard";
import { Input } from "./ui/Input";

const FILTERS = [
  { id: "all",      label: "All Saves",   icon: Layers },
  { id: "tweet",    label: "Tweets",      icon: Twitter },
  { id: "article",  label: "Articles",    icon: FileText },
  { id: "book",     label: "Books",       icon: BookOpen },
  { id: "reminder", label: "Reminders",   icon: Bell },
  { id: "quote",    label: "Quotes",      icon: Quote },
  { id: "video",    label: "Videos",      icon: Video },
] as const;

type Filter = (typeof FILTERS)[number]["id"];

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
  const [searchResults, setSearchResults] = useState<Save[] | null>(null);
  const [mode, setMode] = useState<"recent" | "search">("recent");
  const [isPending, startTransition] = useTransition();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Keyboard shortcut for Cmd+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsCommandPaletteOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const saves = useMemo(() => {
    const baseSaves = mode === "search" && searchResults !== null ? searchResults : initialSaves;
    if (filter === "all") return baseSaves;
    return baseSaves.filter((s) => s.source_type === filter);
  }, [filter, mode, initialSaves, searchResults]);

  async function handleSearch(e?: React.FormEvent) {
    e?.preventDefault();
    if (!query.trim()) {
      setMode("recent");
      setSearchResults(null);
      return;
    }

    startTransition(async () => {
      setMode("search");
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(query)}&userId=${userId}`
      );
      const data = await res.json();
      setSearchResults(data.results || []);
    });
  }

  function clearSearch() {
    setQuery("");
    setMode("recent");
    setSearchResults(null);
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-zinc-100 selection:bg-white/10">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/[0.04] flex flex-col fixed inset-y-0 left-0 z-50 bg-[#0a0a0a]/50 backdrop-blur-xl">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-white to-zinc-400 flex items-center justify-center shadow-lg shadow-white/10">
              <span className="text-[#0a0a0a] font-bold text-sm italic">B</span>
            </div>
            <span className="font-semibold tracking-tight">Brain</span>
          </div>

          <div className="space-y-1">
            <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">Library</p>
            {FILTERS.map((f) => {
              const Icon = f.icon;
              return (
                <button
                  key={f.id}
                  onClick={() => {
                    setFilter(f.id);
                    if (mode === "search") clearSearch();
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group",
                    filter === f.id 
                      ? "bg-white/[0.05] text-white shadow-sm shadow-white/5" 
                      : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.02]"
                  )}
                >
                  <Icon className={cn(
                    "w-4 h-4 transition-colors",
                    filter === f.id ? "text-white" : "text-zinc-600 group-hover:text-zinc-400"
                  )} />
                  {f.label}
                  {filter === f.id && (
                    <motion.div 
                      layoutId="active-pill" 
                      className="ml-auto w-1 h-4 rounded-full bg-white" 
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-12 space-y-1">
            <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">Preferences</p>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.02] transition-all group">
              <History className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400" />
              Recent
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.02] transition-all group">
              <Settings className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400" />
              Settings
            </button>
          </div>
        </div>

        <div className="mt-auto p-4 border-t border-white/[0.04]">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/[0.02] transition-colors group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-b from-zinc-700 to-zinc-900 border border-white/10 flex items-center justify-center text-xs font-medium text-zinc-400">
              {firstName?.[0] || <User className="w-4 h-4" />}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-medium text-zinc-200 truncate">{firstName}</p>
              <p className="text-[10px] text-zinc-500 truncate">Pro Plan</p>
            </div>
            <a href="/api/auth/logout" className="p-1.5 text-zinc-600 hover:text-zinc-300 transition-colors">
              <LogOut className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/[0.04] px-8 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
            {/* Breadcrumbs / View Title */}
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className="text-zinc-500">Library</span>
              <ChevronRight className="w-3 h-3 text-zinc-700" />
              <span className="text-zinc-200">{FILTERS.find(f => f.id === filter)?.label}</span>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-zinc-500 group-focus-within:text-white transition-colors" />
              </div>
              <form onSubmit={handleSearch}>
                <Input
                  className="pl-11 pr-16 bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05] focus:bg-white/[0.05] focus:border-white/10 h-10 rounded-full transition-all"
                  placeholder="Ask anything..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </form>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-white/10 bg-white/5">
                  <CommandIcon className="w-2.5 h-2.5 text-zinc-500" />
                  <span className="text-[10px] font-mono font-medium text-zinc-500">K</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <button className="flex items-center gap-2 bg-white text-[#0a0a0a] px-4 py-2 rounded-full text-xs font-bold hover:bg-zinc-200 transition-colors shadow-lg shadow-white/5">
              <Plus className="w-3.5 h-3.5" />
              Capture
            </button>
          </div>
        </header>

        <div className="px-8 py-8 flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Results Title */}
            <div className="flex items-end justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">
                  {mode === "search" ? "Search Results" : "Recent Thinking"}
                </h1>
                <p className="text-zinc-500 text-sm">
                  {isPending ? "Analyzing semantic space..." : 
                   mode === "search" ? `Found ${saves.length} connections for "${query}"` : 
                   `Your latest ${saves.length} saves across all categories`}
                </p>
              </div>

              {mode === "search" && (
                <button 
                  onClick={clearSearch}
                  className="text-xs font-medium text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <SearchX className="w-3.5 h-3.5" />
                  Clear Search
                </button>
              )}
            </div>

            {/* Grid */}
            <LayoutGroup>
              <motion.div 
                layout
                className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-min"
              >
                <AnimatePresence mode="popLayout">
                  {saves.map((save, i) => (
                    <SaveCard key={save.id} save={save} index={i} />
                  ))}
                </AnimatePresence>
              </motion.div>
            </LayoutGroup>

            {/* Empty State */}
            {!isPending && saves.length === 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-32 text-center"
              >
                <div className="w-16 h-16 rounded-3xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center mb-6">
                  <SearchX className="w-8 h-8 text-zinc-700" />
                </div>
                <h3 className="text-xl font-semibold text-zinc-200 mb-2">No results found</h3>
                <p className="text-zinc-500 max-w-xs mx-auto text-sm leading-relaxed">
                  We couldn&apos;t find any matches for your query. Try different keywords or check your spelling.
                </p>
                <button 
                  onClick={clearSearch}
                  className="mt-8 px-6 py-2 rounded-full border border-white/10 text-xs font-medium hover:bg-white/5 transition-colors"
                >
                  Back to Recent
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      {/* Command Palette Overlay (Mock) */}
      <AnimatePresence>
        {isCommandPaletteOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsCommandPaletteOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="relative w-full max-w-2xl bg-[#141414] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-4 border-b border-white/5 flex items-center gap-3">
                <Search className="w-5 h-5 text-zinc-500" />
                <input 
                  autoFocus
                  className="bg-transparent border-none outline-none flex-1 text-lg text-white placeholder:text-zinc-600"
                  placeholder="Type a command or search..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                      setIsCommandPaletteOpen(false);
                    }
                  }}
                />
              </div>
              <div className="p-2">
                <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-600">Common Actions</p>
                <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 transition-colors text-left group">
                  <Plus className="w-4 h-4 text-zinc-500 group-hover:text-white" />
                  <span className="text-sm font-medium text-zinc-300 group-hover:text-white">Create new save</span>
                  <span className="ml-auto text-[10px] font-mono text-zinc-600">C</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 transition-colors text-left group">
                  <LayoutGrid className="w-4 h-4 text-zinc-500 group-hover:text-white" />
                  <span className="text-sm font-medium text-zinc-300 group-hover:text-white">Change view mode</span>
                  <span className="ml-auto text-[10px] font-mono text-zinc-600">V</span>
                </button>
              </div>
              <div className="p-3 bg-white/[0.02] border-t border-white/5 flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-mono">
                  <span className="px-1 py-0.5 rounded border border-white/10 bg-white/5">ENT</span>
                  <span>to select</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-mono">
                  <span className="px-1 py-0.5 rounded border border-white/10 bg-white/5">ESC</span>
                  <span>to close</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
