"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { MATCH_LOCK_MINUTES } from "@/lib/rules";

const scoreSchema = z.object({
  fixtureId: z.string().uuid(),
  scoreA: z.coerce.number().int().min(0).max(99),
  scoreB: z.coerce.number().int().min(0).max(99),
  winnerTeamId: z.string().uuid().optional().nullable()
});

const groupSchema = z.object({
  groupId: z.string().uuid(),
  orderedTeamIds: z.array(z.string().uuid()).length(4)
});

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
