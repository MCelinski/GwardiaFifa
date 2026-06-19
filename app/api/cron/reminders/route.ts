import { NextRequest, NextResponse } from "next/server";
import { isAuthorizedAdminRequest } from "@/lib/backend/admin-auth";
import { canUseSupabaseAdmin, createAdminClient } from "@/lib/supabase/server";
import { buildReminderText, getUsersWithPendingBets } from "@/lib/backend/reminders";
import { canUseWebPush } from "@/lib/notifications/config";
import { sendPush } from "@/lib/notifications/web-push";

// web-push uses Node crypto — keep this off the edge runtime.
export const runtime = "nodejs";

const REMINDER_PATH = "/predictions/group-matches";

export async function GET(request: NextRequest) {
  if (!(await isAuthorizedAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!canUseSupabaseAdmin()) {
    return NextResponse.json({ error: "Supabase admin env is not configured." }, { status: 500 });
  }

  if (!canUseWebPush()) {
    return NextResponse.json({ error: "Web Push (VAPID) env is not configured." }, { status: 500 });
  }

  const admin = createAdminClient();

  let usersNotified = 0;
  let pushSent = 0;
  let prunedSubscriptions = 0;

  try {
    const recipients = await getUsersWithPendingBets(new Date());

    for (const recipient of recipients) {
      if (!recipient.notifyPush || !recipient.pushSubscriptions.length) continue;

      const { title, body } = buildReminderText(recipient.matches);
      let delivered = false;

      for (const subscription of recipient.pushSubscriptions) {
        const result = await sendPush(subscription, { title, body, url: REMINDER_PATH });
        if (result.ok) {
          pushSent += 1;
          delivered = true;
        } else if (result.gone) {
          await admin.from("push_subscriptions").delete().eq("id", subscription.id);
          prunedSubscriptions += 1;
        }
      }

      if (delivered) usersNotified += 1;
    }

    return NextResponse.json({ ok: true, usersNotified, pushSent, prunedSubscriptions });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unknown reminder error" },
      { status: 500 }
    );
  }
}
