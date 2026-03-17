import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-xl border border-white/[0.08] bg-[#1a1a1a] px-4 py-2 text-sm text-white",
        "placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all",
        "hover:bg-[#1e1e1e] hover:border-white/10",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
