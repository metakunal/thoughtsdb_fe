"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Twitter, 
  FileText, 
  BookOpen, 
  Bell, 
  Quote, 
  Video, 
  MoreHorizontal, 
  ChevronDown, 
  Calendar,
  Hash,
  Trash2,
  Edit2,
  LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "./ui/Card";
import { Badge } from "./ui/Badge";

interface Save {
  id: string;
  title: string | null;
  summary: string | null;
  source_type: string | null;
  tags: string[] | null;
  raw_text: string | null;
  created_at: string;
}

const TYPE_CONFIG: Record<string, { icon: LucideIcon; color: string; bg: string }> = {
  tweet:    { icon: Twitter,    color: "text-sky-400",    bg: "bg-sky-400/10" },
  article:  { icon: FileText,   color: "text-amber-400",  bg: "bg-amber-400/10" },
  book:     { icon: BookOpen,   color: "text-emerald-400",bg: "bg-emerald-400/10" },
  reminder: { icon: Bell,       color: "text-red-400",    bg: "bg-red-400/10" },
  quote:    { icon: Quote,      color: "text-violet-400", bg: "bg-violet-400/10" },
  video:    { icon: Video,      color: "text-pink-400",   bg: "bg-pink-400/10" },
  other:    { icon: MoreHorizontal, color: "text-zinc-400", bg: "bg-zinc-400/10" },
};

interface Props {
  save: Save;
  index: number;
}

export default function SaveCard({ save, index }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const config = TYPE_CONFIG[save.source_type || "other"] || TYPE_CONFIG.other;
  const Icon = config.icon;

  const date = new Date(save.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.05, 
        ease: [0.23, 1, 0.32, 1] 
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      layout
    >
      <Card
        className={cn(
          "group h-full flex flex-col cursor-pointer",
          expanded && "border-white/20 ring-1 ring-white/10"
        )}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="p-5 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={cn("p-1.5 rounded-lg", config.bg)}>
                <Icon className={cn("w-3.5 h-3.5", config.color)} />
              </div>
              <span className="text-[10px] font-medium tracking-wide uppercase text-zinc-500">
                {save.source_type || "other"}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-zinc-600">
                <Calendar className="w-3 h-3" />
                <span className="text-[10px] font-mono">{date}</span>
              </div>
              
              {/* Quick Actions */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button className="p-1.5 rounded-md hover:bg-white/5 text-zinc-500 hover:text-white transition-colors">
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button className="p-1.5 rounded-md hover:bg-red-500/10 text-zinc-500 hover:text-red-400 transition-colors">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3 className={cn(
              "font-semibold text-zinc-100 leading-snug mb-2 group-hover:text-white transition-colors",
              expanded ? "text-lg" : "text-[15px]"
            )}>
              {save.title || "Untitled Thought"}
            </h3>

            {save.summary && (
              <p className={cn(
                "text-zinc-400 leading-relaxed font-normal",
                expanded ? "text-sm mb-4" : "text-xs line-clamp-3 mb-3"
              )}>
                {save.summary}
              </p>
            )}

            <AnimatePresence>
              {expanded && save.raw_text && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 pt-4 border-t border-white/5">
                    <p className="text-zinc-500 text-xs leading-relaxed font-mono whitespace-pre-wrap selection:bg-white/10">
                      {save.raw_text}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-white/[0.04] flex items-center justify-between">
            <div className="flex items-center gap-1.5 overflow-hidden">
              {save.tags && save.tags.length > 0 ? (
                save.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-zinc-500 px-2 py-0">
                    <Hash className="w-2 h-2 mr-0.5" />
                    {tag}
                  </Badge>
                ))
              ) : (
                <span className="text-[10px] text-zinc-700 font-mono tracking-tight italic">no tags</span>
              )}
            </div>

            <div className={cn(
              "p-1 rounded-full bg-white/5 text-zinc-500 transition-transform duration-300",
              expanded && "rotate-180 bg-white/10 text-white"
            )}>
              <ChevronDown className="w-3 h-3" />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
