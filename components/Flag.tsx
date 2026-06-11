/* eslint-disable @next/next/no-img-element */
import { flagUrl } from "@/lib/flags";
import { cn } from "@/lib/utils";

// Renders a country flag image. Falls back to the short code in a small badge
// when the code is unknown (e.g. TBD knockout placeholders).
export function Flag({ code, name, className }: { code?: string | null; name?: string; className?: string }) {
  const url = flagUrl(code);
  const base = "inline-block shrink-0 overflow-hidden rounded-[3px] ring-1 ring-black/30";

  if (!url) {
    return (
      <span className={cn(base, "grid place-items-center bg-white/8 text-[9px] font-bold text-muted-foreground", className)}>
        {(code ?? "").slice(0, 2)}
      </span>
    );
  }

  return (
    <img
      src={url}
      alt={name ? `Flaga: ${name}` : ""}
      loading="lazy"
      className={cn(base, "bg-white/10 object-cover", className)}
    />
  );
}
