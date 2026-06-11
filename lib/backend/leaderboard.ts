import { createClient } from "@/lib/supabase/server";

export type LeaderboardUser = {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  label: string;
  points: {
    total: number;
    groupMatches: number;
    groupStandings: number;
    knockout: number;
    bonus: number;
    last: number;
  };
};

export async function getLeaderboard(leagueId?: string | null): Promise<LeaderboardUser[]> {
  if (!leagueId) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leaderboard")
    .select("*")
    .eq("league_id", leagueId)
    .order("total_points", { ascending: false });

  if (error || !data?.length) {
    return [];
  }

  return data.map((row, index) => ({
    id: row.user_id,
    name: row.display_name,
    handle: `@${row.display_name.toLowerCase().replace(/\s+/g, "")}`,
    avatar: row.avatar_initials,
    label: index === 0 ? "Lider Gwardii" : index < 3 ? "Pretendent" : index < 6 ? "Solidny Typiarz" : "Turysta",
    points: {
      total: row.total_points,
      groupMatches: row.group_match_points,
      groupStandings: row.group_standings_points,
      knockout: row.knockout_points,
      bonus: row.bonus_points,
      last: row.last_points_gained
    }
  }));
}
