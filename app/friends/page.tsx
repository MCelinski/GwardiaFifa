import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";
import { PlayerProfileCard } from "@/components/PlayerProfileCard";
import { getPlayerProfiles } from "@/lib/backend/friends";

export default async function FriendsPage() {
  const profiles = await getPlayerProfiles();

  return (
    <AppShell>
      <div className="space-y-5">
        <div>
          <p className="text-sm font-semibold uppercase text-gold">Liga Gwardia Piwo</p>
          <h1 className="mt-2 text-3xl font-black">Profile uczestników</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Każdy widzi każdego. Statystyki liczone z rozegranych meczów — trafność, idealne wyniki, średnia punktów
            i parę odznak dla najlepszych (i najgorszych).
          </p>
        </div>

        {profiles.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {profiles.map((profile) => (
              <PlayerProfileCard key={profile.id} profile={profile} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Brak uczestników."
            detail="Profile pojawią się, gdy gracze dołączą do ligi i zaczną typować mecze."
          />
        )}
      </div>
    </AppShell>
  );
}
