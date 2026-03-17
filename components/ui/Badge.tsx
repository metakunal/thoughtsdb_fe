import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline" | "secondary";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-white/[0.08] text-white/70 border-white/[0.1]",
    outline: "bg-transparent border-white/[0.1] text-white/50",
    secondary: "bg-white/[0.05] text-white/60",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium tracking-tight transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
