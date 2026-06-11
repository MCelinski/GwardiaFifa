import { Beer, Shield, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

export function GwardiaPiwoCrest({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <div
      className={cn(
        "relative grid place-items-center rounded-lg border border-gold/40 bg-gradient-to-br from-gold/25 via-emerald-500/12 to-black shadow-glow",
        compact ? "h-10 w-10" : "h-20 w-20",
        className
      )}
      aria-label="Gwardia Piwo crest placeholder"
    >
      <Shield className={cn("absolute text-gold/80", compact ? "h-8 w-8" : "h-16 w-16")} strokeWidth={1.3} />
      <Beer className={cn("z-10 text-foam", compact ? "h-4 w-4" : "h-7 w-7")} />
      <Trophy className={cn("absolute bottom-2 z-10 text-gold", compact ? "h-3 w-3" : "h-4 w-4")} />
    </div>
  );
}
