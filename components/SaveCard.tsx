"use client";

import { useState } from "react";

interface Save {
  id: string;
  title: string | null;
  summary: string | null;
  source_type: string | null;
  tags: string[] | null;
  raw_text: string | null;
  created_at: string;
}

const TYPE_COLORS: Record<string, string> = {
  tweet:    "text-sky-400 border-sky-400/40",
  article:  "text-amber-400 border-amber-400/40",
  book:     "text-emerald-400 border-emerald-400/40",
  reminder: "text-red-400 border-red-400/40",
  quote:    "text-violet-400 border-violet-400/40",
  video:    "text-pink-400 border-pink-400/40",
  other:    "text-[#555] border-[#333]",
};

interface Props {
  save: Save;
  index: number;
}

export default function SaveCard({ save, index }: Props) {
  const [expanded, setExpanded] = useState(false);

  const colorClass = TYPE_COLORS[save.source_type || "other"] || TYPE_COLORS.other;
  const date = new Date(save.created_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div
      className="save-card bg-[#0c0c0c] p-6 cursor-pointer transition-colors animate-fade-up"
      style={{ animationDelay: `${index * 30}ms`, animationFillMode: "both" }}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Top row */}
      <div className="flex items-center justify-between mb-4">
        <span className={`font-mono text-[9px] tracking-[0.2em] uppercase border px-2 py-0.5 ${colorClass}`}>
          {save.source_type || "other"}
        </span>
        <span className="font-mono text-[10px] text-[#333]">{date}</span>
      </div>

      {/* Title */}
      <h3 className="font-serif text-[15px] text-[#e2d9c8] leading-snug mb-2 font-normal">
        {save.title || "Untitled"}
      </h3>

      {/* Summary */}
      {save.summary && (
        <p className="text-[13px] text-[#666] leading-relaxed mb-3">
          {save.summary}
        </p>
      )}

      {/* Raw text (expanded) */}
      {expanded && save.raw_text && (
        <div className="mt-3 pt-3 border-t border-[#1a1a1a]">
          <p className="font-mono text-[11px] text-[#555] leading-loose whitespace-pre-wrap break-words">
            {save.raw_text}
          </p>
        </div>
      )}

      {/* Tags */}
      {save.tags && save.tags.length > 0 && (
        <div className="flex gap-2 flex-wrap mt-4">
          {save.tags.map(tag => (
            <span key={tag} className="font-mono text-[9px] text-[#3a3a3a] tracking-wider">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Expand hint */}
      <div className="mt-4 font-mono text-[9px] text-[#2a2a2a] tracking-widest">
        {expanded ? "▲ COLLAPSE" : "▼ EXPAND"}
      </div>
    </div>
  );
}