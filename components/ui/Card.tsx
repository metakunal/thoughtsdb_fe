"use client";

import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden rounded-xl border border-white/[0.08] bg-[#141414] shadow-2xl transition-all duration-300",
        "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/[0.02] before:to-transparent before:pointer-events-none",
        "hover:border-white/[0.15] hover:shadow-white/[0.02] hover:bg-[#1a1a1a]",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

export { Card };
