import { Lock } from "lucide-react";

export function DeadlineBanner({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-gold/25 bg-gold/10 p-4 text-sm text-foam">
      <Lock className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
      <span>{children}</span>
    </div>
  );
}
