import { CalendarClock } from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { TournamentPicksCard } from "@/components/TournamentPicksCard";
import { Card, CardContent } from "@/components/ui/card";
import { getTournamentPredictionState } from "@/lib/backend/tournament";

export default async function KnockoutPage() {
  const tournamentPickState = await getTournamentPredictionState();

  return (
    <AppShell>
      <div className="space-y-5">
        <div>
          <p className="text-sm font-semibold uppercase text-gold">Faza pucharowa</p>
          <h1 className="mt-2 text-3xl font-black">Typy podium turnieju</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Tutaj typujesz podium całego turnieju — mistrza, wicemistrza i trzecie miejsce. Pojedyncze mecze pucharowe
            obstawiasz w zakładce „Mecze”, gdy znane są obie drużyny.
          </p>
        </div>

        <TournamentPicksCard state={tournamentPickState} />

        <Card>
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarClock className="h-4 w-4 text-gold" />
              Mecze fazy pucharowej obstawisz w zakładce „Mecze”.
            </p>
            <Link
              href="/predictions/group-matches"
              className="rounded-md border border-white/10 bg-white/8 px-3 py-2 text-sm font-medium text-foam transition hover:bg-white/12"
            >
              Przejdź do meczów
            </Link>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
