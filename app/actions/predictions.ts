"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { MATCH_LOCK_MINUTES, MAX_MATCH_GOALS } from "@/lib/rules";

const scoreSchema = z.object({
  fixtureId: z.string().uuid(),
  scoreA: z.coerce.number().int().min(0).max(MAX_MATCH_GOALS),
  scoreB: z.coerce.number().int().min(0).max(MAX_MATCH_GOALS),
  winnerTeamId: z.string().uuid().optional().nullable()
});

const groupSchema = z.object({
  groupId: z.string().uuid(),
  orderedTeamIds: z.array(z.string().uuid()).length(4)
});

const tournamentSchema = z.object({
  leagueId: z.string().uuid(),
  championTeamId: z.string().uuid(),
  runnerUpTeamId: z.string().uuid(),
  thirdPlaceTeamId: z.string().uuid()
}).refine((data) => new Set([data.championTeamId, data.runnerUpTeamId, data.thirdPlaceTeamId]).size === 3, {
  message: "Podium teams must be different."
});

function isMissingColumnError(error: unknown) {
  return Boolean(
    error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code?: string }).code === "42703"
  );
}

export async function saveMatchPredictionAction(input: z.input<typeof scoreSchema>) {
  const data = scoreSchema.parse(input);
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims.sub;

  if (!userId) {
    throw new Error("Not authenticated.");
  }

  const { data: fixture, error: fixtureError } = await supabase
    .from("fixtures")
    .select("id, starts_at")
    .eq("id", data.fixtureId)
    .single();

  if (fixtureError) throw fixtureError;
  const lockAt = new Date(new Date(fixture.starts_at).getTime() - MATCH_LOCK_MINUTES * 60 * 1000);
  if (lockAt <= new Date()) {
    throw new Error(`Prediction is locked ${MATCH_LOCK_MINUTES} minutes before match start.`);
  }

  const { error } = await supabase.from("match_predictions").upsert(
    {
      fixture_id: data.fixtureId,
      user_id: userId,
      score_a: data.scoreA,
      score_b: data.scoreB,
      winner_team_id: data.winnerTeamId ?? null,
      status: "saved"
    },
    { onConflict: "fixture_id,user_id" }
  );

  if (error) throw error;
  revalidatePath("/predictions/group-matches");
  revalidatePath("/predictions/knockout");
  revalidatePath("/dashboard");
}

export type MatchSaveState = { status: "idle" | "success" | "error"; message?: string };

// Turns a stale-tab save into a friendly inline message instead of an unhandled
// throw. The deadline is still enforced server-side (saveMatchPredictionAction +
// RLS use the server clock), so this only changes how a rejected save is shown:
// the user sees "deadline minął, odśwież" rather than a Next error screen.
function toFriendlyMatchError(error: unknown): string {
  const raw = error instanceof Error ? error.message : "";
  if (/locked/i.test(raw)) return "Typ zamknięty — minął deadline. Odśwież stronę.";
  if (/not authenticated/i.test(raw)) return "Sesja wygasła — zaloguj się ponownie.";
  return "Nie udało się zapisać typu. Możliwe, że minął deadline — odśwież stronę.";
}

export async function saveMatchPredictionState(_prev: MatchSaveState, formData: FormData): Promise<MatchSaveState> {
  try {
    await saveMatchPredictionAction({
      fixtureId: String(formData.get("fixtureId") ?? ""),
      scoreA: String(formData.get("scoreA") ?? ""),
      scoreB: String(formData.get("scoreB") ?? "")
    });
    return { status: "success", message: "Zapisano typ." };
  } catch (error) {
    return { status: "error", message: toFriendlyMatchError(error) };
  }
}

export async function saveGroupStandingPredictionAction(input: z.input<typeof groupSchema>) {
  const data = groupSchema.parse(input);
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims.sub;

  if (!userId) {
    throw new Error("Not authenticated.");
  }

  const { data: group, error: groupError } = await supabase
    .from("world_cup_groups")
    .select("id, standings_deadline")
    .eq("id", data.groupId)
    .single();

  if (groupError) throw groupError;
  if (new Date(group.standings_deadline) <= new Date()) {
    throw new Error("Group standings prediction window is locked.");
  }

  const { data: prediction, error } = await supabase
    .from("group_standing_predictions")
    .upsert(
      {
        group_id: data.groupId,
        user_id: userId,
        status: "saved"
      },
      { onConflict: "group_id,user_id" }
    )
    .select("id")
    .single();

  if (error) throw error;

  await supabase.from("group_standing_prediction_items").delete().eq("prediction_id", prediction.id);

  const { error: itemsError } = await supabase.from("group_standing_prediction_items").insert(
    data.orderedTeamIds.map((teamId, index) => ({
      prediction_id: prediction.id,
      team_id: teamId,
      predicted_position: index + 1
    }))
  );

  if (itemsError) throw itemsError;
  revalidatePath("/predictions/groups");
  revalidatePath("/dashboard");
}

export async function saveTournamentPredictionFormAction(formData: FormData) {
  const data = tournamentSchema.parse({
    leagueId: String(formData.get("leagueId") ?? ""),
    championTeamId: String(formData.get("championTeamId") ?? ""),
    runnerUpTeamId: String(formData.get("runnerUpTeamId") ?? ""),
    thirdPlaceTeamId: String(formData.get("thirdPlaceTeamId") ?? "")
  });

  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims.sub;

  if (!userId) {
    throw new Error("Not authenticated.");
  }

  const { data: deadline, error: deadlineError } = await supabase
    .from("world_cup_groups")
    .select("standings_deadline")
    .order("standings_deadline", { ascending: true })
    .limit(1)
    .single();

  if (deadlineError) throw deadlineError;
  if (new Date(deadline.standings_deadline) <= new Date()) {
    throw new Error("Podium picks are locked.");
  }

  // Canonical podium columns (runner_up/third_place) drive scoring. We also
  // mirror the legacy finalist_a/finalist_b columns so the row stays valid if
  // those columns are still NOT NULL on older databases.
  const fullPayload: Record<string, unknown> = {
    league_id: data.leagueId,
    user_id: userId,
    champion_team_id: data.championTeamId,
    runner_up_team_id: data.runnerUpTeamId,
    third_place_team_id: data.thirdPlaceTeamId,
    finalist_a_team_id: data.runnerUpTeamId,
    finalist_b_team_id: data.thirdPlaceTeamId,
    status: "saved"
  };

  // Fallback for a database where migration 0004 has not been applied yet and
  // the podium columns do not exist.
  const legacyPayload: Record<string, unknown> = {
    league_id: data.leagueId,
    user_id: userId,
    champion_team_id: data.championTeamId,
    finalist_a_team_id: data.runnerUpTeamId,
    finalist_b_team_id: data.thirdPlaceTeamId,
    status: "saved"
  };

  let lastError: unknown = null;
  for (const payload of [fullPayload, legacyPayload]) {
    const { error } = await supabase.from("tournament_predictions").upsert(payload, { onConflict: "league_id,user_id" });
    if (!error) {
      lastError = null;
      break;
    }
    lastError = error;
    if (!isMissingColumnError(error)) break;
  }

  if (lastError) throw lastError;
  revalidatePath("/predictions/knockout");
  revalidatePath("/dashboard");
  redirect("/predictions/knockout");
}
