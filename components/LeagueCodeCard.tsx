import { Copy, ShieldCheck } from "lucide-react";
import { league } from "@/lib/league";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function LeagueCodeCard() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="relative p-5">
        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gold/20 blur-2xl" />
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-foam">
              <ShieldCheck className="h-4 w-4 text-gold" />
              Kod prywatnej ligi
            </div>
            <p className="mt-2 break-all font-mono text-lg font-bold text-primary">{league.inviteCode}</p>
            <p className="mt-1 text-sm text-muted-foreground">Tylko dla znajomych z Gwardia Piwo.</p>
          </div>
          <Button aria-label="Kopiuj kod ligi" size="icon" variant="secondary">
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
