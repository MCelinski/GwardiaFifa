import { getLeaderboard, type LeaderboardUser } from "@/lib/backend/leaderboard";
import { getPlayerProfiles, type PlayerProfile } from "@/lib/backend/friends";
import { getPrimaryLeague } from "@/lib/backend/league";
import { createClient } from "@/lib/supabase/server";

// Season wrap-up data for the /wyniki page and the dashboard results banner.
// Composes the existing leaderboard + player-profile helpers with a few light
// aggregate queries, so there is a single source of truth for "the tournament
// is over, here is the podium + fun facts".

export type Superlative = {
  emoji: string;
  label: string;
  hint: string;
  playerName: string;
};

export type SeasonFacts = {
  matchesPlayed: number;
  totalPredictions: number;
  exactHits: number; // idealne wyniki (5 pkt) w całym sezonie
  goldMargin: number | null; // przewaga punktowa zwycięzcy nad wiceliderem
};

export type ResultsData = {
  isTournamentOver: boolean;
  champion: { name: string; flag: string } | null;
  podium: LeaderboardUser[]; // top 3
  standings: LeaderboardUser[]; // pełna tabela
  profiles: PlayerProfile[]; // do statystyk / superlatywów
  superlatives: Superlative[];
  championPickers: string[]; // kto trafił mistrza (wizjonerzy)
  facts: SeasonFacts;
};

function readTeam(value: unknown): { name: string | null; flag_code: string | null } | null {
  const team = Array.isArray(value) ? value[0] : value;
  return team && typeof team === "object" ? (team as { name: string | null; flag_code: string | null }) : null;
}

function readDisplayName(value: unknown): string | null {
  const profile = Array.isArray(value) ? value[0] : value;
  return profile && typeof profile === "object" ? ((profile as { display_name?: string }).display_name ?? null) : null;
}

export async function getResultsData(): Promise<ResultsData> {
  const empty: ResultsData = {
    isTournamentOver: false,
    champion: null,
    podium: [],
    standings: [],
    profiles: [],
    superlatives: [],
    championPickers: [],
    facts: { matchesPlayed: 0, totalPredictions: 0, exactHits: 0, goldMargin: null }
  };

  const league = await getPrimaryLeague();
  if (!league?.id) return empty;

  const supabase = await createClient();

  const [standings, profiles, finalResult, matchesCount, predsCount, exactCount] = await Promise.all([
    getLeaderboard(league.id),
    getPlayerProfiles(),
    supabase
      .from("fixtures")
      .select(
        "status, winner_team_id, score_a, score_b, team_a_id, team_b_id, team_a:team_a_id(name, flag_code), team_b:team_b_id(name, flag_code)"
      )
      .eq("league_id", league.id)
      .eq("stage", "knockout")
      .eq("round", "FINAL")
      .order("starts_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase.from("fixtures").select("id", { count: "exact", head: true }).eq("league_id", league.id).eq("status", "finished"),
    supabase.from("match_predictions").select("id", { count: "exact", head: true }).eq("status", "scored"),
    supabase.from("match_predictions").select("id", { count: "exact", head: true }).eq("status", "scored").eq("points", 5)
  ]);

  const finalFx = finalResult.data as
    | {
        status: string;
        winner_team_id: string | null;
        score_a: number | null;
        score_b: number | null;
        team_a_id: string;
        team_b_id: string;
        team_a: unknown;
        team_b: unknown;
      }
    | null;

  const isTournamentOver = finalFx?.status === "finished";

  let champion: ResultsData["champion"] = null;
  let championTeamId: string | null = null;
  if (isTournamentOver && finalFx) {
    championTeamId =
      finalFx.winner_team_id ?? ((finalFx.score_a ?? 0) > (finalFx.score_b ?? 0) ? finalFx.team_a_id : finalFx.team_b_id);
    const champTeam = championTeamId === finalFx.team_a_id ? readTeam(finalFx.team_a) : readTeam(finalFx.team_b);
    if (champTeam?.name) champion = { name: champTeam.name, flag: champTeam.flag_code ?? "" };
  }

  // Wizjonerzy mistrza — po minięciu deadline'u RLS pozwala członkom ligi
  // widzieć cudze typy turniejowe, więc lista jest kompletna.
  let championPickers: string[] = [];
  if (championTeamId) {
    const { data: picks } = await supabase
      .from("tournament_predictions")
      .select("champion_team_id, profiles:user_id(display_name)")
      .eq("league_id", league.id)
      .eq("champion_team_id", championTeamId);
    championPickers = (picks ?? [])
      .map((row) => readDisplayName((row as { profiles: unknown }).profiles))
      .filter((name): name is string => Boolean(name));
  }

  // Każdy superlatyw (odznaka) jest przyznawany dokładnie jednemu graczowi
  // w assignBadges(), więc wystarczy je spłaszczyć.
  const superlatives: Superlative[] = [];
  for (const profile of profiles) {
    for (const badge of profile.badges) {
      superlatives.push({ emoji: badge.emoji, label: badge.label, hint: badge.hint, playerName: profile.name });
    }
  }

  const podium = standings.slice(0, 3);
  const goldMargin = podium.length >= 2 ? podium[0].points.total - podium[1].points.total : null;

  return {
    isTournamentOver,
    champion,
    podium,
    standings,
    profiles,
    superlatives,
    championPickers,
    facts: {
      matchesPlayed: matchesCount.count ?? 0,
      totalPredictions: predsCount.count ?? 0,
      exactHits: exactCount.count ?? 0,
      goldMargin
    }
  };
}
