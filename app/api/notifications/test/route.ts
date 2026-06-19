import { NextResponse } from "next/server";
import { canUseSupabase, createClient } from "@/lib/supabase/server";
import { canUseWebPush } from "@/lib/notifications/config";
import { sendPush } from "@/lib/notifications/web-push";

// Sends a test push to the logged-in user's own devices — lets a player verify the
// whole push path immediately, without depending on un-bet matches being in the window.
// Uses the authenticated client (RLS lets a user read/delete only their own
// subscriptions), so no admin client is needed here.

export const runtime = "nodejs";

export async function POST() {
  if (!canUseWebPush()) {
    return NextResponse.json({ error: "Web Push (VAPID) nie jest skonfigurowany." }, { status: 500 });
  }

  if (!canUseSupabase()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims.sub;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: subscriptions } = await supabase
    .from("push_subscriptions")
    .select("id, endpoint, p256dh, auth")
    .eq("user_id", userId);

  if (!subscriptions?.length) {
    return NextResponse.json(
      { error: "Brak zapisanej subskrypcji na tym koncie. Kliknij najpierw przycisk Włącz powiadomienia." },
      { status: 400 }
    );
  }

  let sent = 0;
  let pruned = 0;

  for (const subscription of subscriptions) {
    const result = await sendPush(subscription, {
      title: "✅ Test powiadomień — Gwardia Piwo",
      body: "Działa! Tu będą wpadać przypomnienia o meczach do obstawienia.",
      url: "/dashboard"
    });
    if (result.ok) {
      sent += 1;
    } else if (result.gone) {
      await supabase.from("push_subscriptions").delete().eq("id", subscription.id);
      pruned += 1;
    }
  }

  return NextResponse.json({ ok: true, sent, pruned });
}
