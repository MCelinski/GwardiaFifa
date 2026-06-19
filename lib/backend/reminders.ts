import { createAdminClient } from "@/lib/supabase/server";
import { league } from "@/lib/league";
import { MATCH_LOCK_MINUTES } from "@/lib/rules";
import { formatWarsawDateTime } from "@/lib/time";
import type { StoredPushSubscription } from "@/lib/notifications/web-push";

// Builds the recipient list for the daily betting reminder. Runs server-side from the
// cron via the service-role admin client (bypasses RLS, no user session).
//
// Window: every fixture whose betting deadline (starts_at - MATCH_LOCK_MINUTES) falls in
// (now, now + 24h] that the user has NOT predicted yet. Because the cron only fires once
// each evening, every deadline is covered exactly once — including overnight kickoffs,
// which get a "bet before bed" nudge the evening before. No night-time notifications.

const REMINDER_WINDOW_HOURS = 24;

export type ReminderMatch = {
  fixtureId: string;
  label: string; // "Polska – Argentyna"
  startsAt: Date;
};

export type ReminderRecipient = {
  userId: string;
  displayName: string;
  notifyPush: boolean;
  matches: ReminderMatch[];
  pushSubscriptions: StoredPushSubscription[];
};

function resolveTeamName(team: unknown, placeholder: string | null) {
  const value = Array.isArray(team) ? team[0] : team;
  return (value as { name?: string } | null)?.name ?? placeholder ?? "TBD";
}

export async function getUsersWithPendingBets(now = new Date()): Promise<ReminderRecipient[]> {
  const supabase = createAdminClient();

  const { data: leagueRow } = await supabase
    .from("leagues")
    .select("id")
    .eq("invite_code", league.inviteCode)
    .single();

  if (!leagueRow?.id) return [];

  // Deadline in (now, now+24h]  ⟺  starts_at in (now+lock, now+24h+lock].
  const lockMs = MATCH_LOCK_MINUTES * 60 * 1000;
  const windowStart = new Date(now.getTime() + lockMs);
  const windowEnd = new Date(now.getTime() + REMINDER_WINDOW_HOURS * 60 * 60 * 1000 + lockMs);

  const [{ data: members }, { data: fixtures }, { data: subscriptions }] = await Promise.all([
    supabase
      .from("league_members")
      .select("user_id, profiles(display_name, notify_push)")
      .eq("league_id", leagueRow.id),
    supabase
      .from("fixtures")
      .select("id, starts_at, placeholder_a, placeholder_b, team_a:team_a_id(name), team_b:team_b_id(name)")
      .eq("league_id", leagueRow.id)
      .gt("starts_at", windowStart.toISOString())
      .lte("starts_at", windowEnd.toISOString())
      .order("starts_at", { ascending: true }),
    supabase.from("push_subscriptions").select("id, user_id, endpoint, p256dh, auth")
  ]);

  if (!fixtures?.length || !members?.length) return [];

  const fixtureIds = fixtures.map((fixture) => fixture.id);
  const { data: predictions } = await supabase
    .from("match_predictions")
    .select("fixture_id, user_id")
    .in("fixture_id", fixtureIds);

  // user_id -> set of fixture_ids they have already predicted
  const predictedByUser = new Map<string, Set<string>>();
  for (const prediction of predictions ?? []) {
    const set = predictedByUser.get(prediction.user_id) ?? new Set<string>();
    set.add(prediction.fixture_id);
    predictedByUser.set(prediction.user_id, set);
  }

  const subscriptionsByUser = new Map<string, StoredPushSubscription[]>();
  for (const sub of subscriptions ?? []) {
    const list = subscriptionsByUser.get(sub.user_id) ?? [];
    list.push({ id: sub.id, endpoint: sub.endpoint, p256dh: sub.p256dh, auth: sub.auth });
    subscriptionsByUser.set(sub.user_id, list);
  }

  const reminderMatches: ReminderMatch[] = fixtures.map((fixture) => ({
    fixtureId: fixture.id,
    label: `${resolveTeamName(fixture.team_a, fixture.placeholder_a)} – ${resolveTeamName(fixture.team_b, fixture.placeholder_b)}`,
    startsAt: new Date(fixture.starts_at)
  }));

  const recipients: ReminderRecipient[] = [];
  for (const member of members) {
    const profile = (Array.isArray(member.profiles) ? member.profiles[0] : member.profiles) as
      | { display_name: string; notify_push: boolean }
      | null;
    if (!profile) continue;

    const predicted = predictedByUser.get(member.user_id) ?? new Set<string>();
    const pending = reminderMatches.filter((match) => !predicted.has(match.fixtureId));
    if (!pending.length) continue;

    recipients.push({
      userId: member.user_id,
      displayName: profile.display_name,
      notifyPush: profile.notify_push,
      matches: pending,
      pushSubscriptions: subscriptionsByUser.get(member.user_id) ?? []
    });
  }

  return recipients;
}

// Short push copy, e.g. "⚽ Masz 2 mecze do obstawienia" / "Najbliższy: Polska – Argentyna o 19.06.2026, 03:00."
export function buildReminderText(matches: ReminderMatch[]) {
  const count = matches.length;
  const nearest = matches[0];
  const when = nearest ? formatWarsawDateTime(nearest.startsAt) : "";

  const title = `⚽ Masz ${count} ${pluralizeMatches(count)} do obstawienia`;
  const body = nearest
    ? `Najbliższy: ${nearest.label} o ${when}. Obstaw zanim pójdziesz spać!`
    : "Wejdź i zapisz swoje typy.";

  return { title, body };
}

// Polish noun agreement for "mecz": 1 → mecz, 2-4 → mecze, else → meczów.
export function pluralizeMatches(count: number) {
  if (count === 1) return "mecz";
  const lastTwo = count % 100;
  const last = count % 10;
  if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) return "mecze";
  return "meczów";
}
