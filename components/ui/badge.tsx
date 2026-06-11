import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "gold" | "green" | "muted" | "red";
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full min-w-0 items-center gap-1 overflow-hidden rounded-full border px-2.5 py-1 text-xs font-semibold",
        variant === "default" && "border-white/12 bg-white/8 text-foreground",
        variant === "gold" && "border-gold/35 bg-gold/15 text-foam",
        variant === "green" && "border-emerald-400/30 bg-emerald-500/12 text-emerald-200",
        variant === "muted" && "border-white/10 bg-white/5 text-muted-foreground",
        variant === "red" && "border-red-400/30 bg-red-500/12 text-red-200",
        className
      )}
      {...props}
    />
  );
}
