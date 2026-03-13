"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PinLogin() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

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
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      <input
        className="bg-[#141414] border border-[#1e1e1e] text-[#e2d9c8] px-4 py-3 font-mono text-2xl tracking-[0.5em] text-center focus:outline-none focus:border-[#e2d9c8] transition-colors"
        value={pin}
        onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
        placeholder="000000"
        maxLength={6}
        autoFocus
      />
      {error && (
        <p className="font-mono text-xs text-red-400 text-center">{error}</p>
      )}
      <button
        type="submit"
        disabled={pin.length !== 6 || loading}
        className="bg-[#e2d9c8] text-[#0c0c0c] font-mono text-xs tracking-widest uppercase py-3 disabled:opacity-30 hover:bg-white transition-colors"
      >
        {loading ? "Verifying..." : "Enter Brain"}
      </button>
    </form>
  );
}