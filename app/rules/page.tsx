import { Beer, LockKeyhole, ShieldCheck, Trophy } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { LeagueCodeCard } from "@/components/LeagueCodeCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GROUP_STANDINGS_DEADLINE_LABEL, MATCH_LOCK_MINUTES, rulesSummary } from "@/lib/rules";

export default function RulesPage() {
  return (
    <AppShell>
      <div className="space-y-5">
        <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
          <div>
            <p className="text-sm font-semibold uppercase text-gold">Gwardia Piwo</p>
            <h1 className="mt-2 text-3xl font-black sm:text-4xl">Regulamin i zasady typowania</h1>
            <p className="mt-2 max-w-3xl text-muted-foreground">
              Wszystkie deadline&apos;y są egzekwowane po stronie aplikacji i bazy danych. Przed zamknięciem typy znajomych są prywatne.
            </p>
          </div>
          <LeagueCodeCard />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-gold/35 bg-gold/10">
            <CardContent className="p-5">
              <LockKeyhole className="h-6 w-6 text-gold" />
              <p className="mt-4 text-sm text-muted-foreground">Tabele grup</p>
              <p className="mt-1 text-lg font-bold">{GROUP_STANDINGS_DEADLINE_LABEL}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <ShieldCheck className="h-6 w-6 text-emerald-300" />
              <p className="mt-4 text-sm text-muted-foreground">Mecze</p>
              <p className="mt-1 text-lg font-bold">{MATCH_LOCK_MINUTES} minut przed startem</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <Beer className="h-6 w-6 text-gold" />
              <p className="mt-4 text-sm text-muted-foreground">Dostęp</p>
              <p className="mt-1 text-lg font-bold">Tylko prywatna liga</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {rulesSummary.map((section) => (
            <Card key={section.title}>
              <CardHeader className="flex flex-row items-center justify-between gap-3">
                <CardTitle>{section.title}</CardTitle>
                <Badge variant="gold">
                  <Trophy className="h-3.5 w-3.5" />
                  GP 2026
                </Badge>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {section.items.map((item) => (
                    <li key={item} className="rounded-md border border-white/8 bg-white/5 p-3">
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="pitch-panel">
          <CardContent className="p-5">
            <p className="font-semibold text-foam">Zasada fair play</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Po locku nie ma ręcznej edycji typów przez uczestników. Ewentualne korekty techniczne wykonuje admin i powinny zostać zapisane w logach synchronizacji.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
