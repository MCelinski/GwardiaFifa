import { AppShell } from "@/components/AppShell";
import { DeadlineBanner } from "@/components/DeadlineBanner";
import { EmptyState } from "@/components/EmptyState";
import { GroupPredictionCard } from "@/components/GroupPredictionCard";
import { GroupTableCard } from "@/components/GroupTableCard";
import { getGroupStandings, getGroupTables } from "@/lib/backend/predictions-view";
import { GROUP_STANDINGS_DEADLINE_LABEL } from "@/lib/rules";

function isEditable(status: string) {
  return !["locked", "scored"].includes(status);
}

export default async function GroupStandingsPage() {
  const [tables, editable] = await Promise.all([getGroupTables(), getGroupStandings()]);
  const editorByGroup = new Map(editable.map((group) => [group.groupId, group]));

  return (
    <AppShell>
      <div className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase text-gold">12 grup · 48 drużyn</p>
            <h1 className="mt-2 text-3xl font-black">Tabele grup na żywo</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Realne tabele liczone z wyników meczów. Pod każdą grupą sprawdzisz swój typ i symulację punktów, gdyby faza
              grupowa skończyła się teraz.
            </p>
          </div>
        </div>

        <DeadlineBanner>
          Typy końcowych tabel grup zamknięto {GROUP_STANDINGS_DEADLINE_LABEL}. Oficjalne punkty doliczą się po zakończeniu
          całej fazy grupowej.
        </DeadlineBanner>

        {tables.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {tables.map((group) => {
              const editor = editorByGroup.get(group.groupId);
              return isEditable(group.status) && editor ? (
                <GroupPredictionCard key={group.groupId} group={editor} />
              ) : (
                <GroupTableCard key={group.groupId} group={group} />
              );
            })}
          </div>
        ) : (
          <EmptyState title="Brak grup do pokazania." detail="Admin musi zaimportowac oficjalny terminarz World Cup 2026." />
        )}
      </div>
    </AppShell>
  );
}
