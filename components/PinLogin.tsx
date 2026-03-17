"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PinLogin() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ pin }),
      });

      if (res.ok) {
        window.location.href = "/";
      } else {
        const data = await res.json();
        setError(data.error || "Invalid PIN");
        setLoading(false);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
      <div className="relative group">
        <input
          className={cn(
            "w-full bg-white/[0.03] border border-white/[0.08] text-white px-4 py-4 rounded-2xl font-mono text-3xl tracking-[0.6em] text-center focus:outline-none focus:ring-2 focus:ring-white/20 transition-all placeholder:text-zinc-800",
            error && "border-red-500/50 focus:ring-red-500/20"
          )}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="000000"
          maxLength={6}
          autoFocus
          disabled={loading}
        />
        {error && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -bottom-6 left-0 right-0 font-mono text-[10px] text-red-400 text-center uppercase tracking-wider"
          >
            {error}
          </motion.p>
        )}
      </div>

      <button
        type="submit"
        disabled={pin.length !== 6 || loading}
        className={cn(
          "relative group overflow-hidden bg-white text-[#0a0a0a] font-bold text-xs tracking-[0.2em] uppercase py-4 rounded-2xl transition-all duration-300",
          "disabled:opacity-30 disabled:cursor-not-allowed",
          !loading && pin.length === 6 && "hover:bg-zinc-200 active:scale-95 shadow-xl shadow-white/10"
        )}
      >
        <span className="flex items-center justify-center gap-2">
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              Access Brain
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </span>
      </button>
    </form>
  );
}
