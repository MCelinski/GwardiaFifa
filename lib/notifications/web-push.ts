import webpush from "web-push";
import { requireVapidConfig } from "@/lib/notifications/config";

// Web Push sender. Runs only on the Node runtime (web-push uses Node crypto) — every
// route importing this must set `export const runtime = "nodejs"`.

export type StoredPushSubscription = {
  id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
};

export type PushPayload = {
  title: string;
  body: string;
  url?: string;
};

export type PushSendResult =
  | { ok: true }
  // The endpoint no longer exists (browser unsubscribed / cleared) — caller should
  // delete the stored row so the table stays clean.
  | { ok: false; gone: boolean; error: string };

let configured = false;

function ensureConfigured() {
  if (configured) return;
  const { publicKey, privateKey, subject } = requireVapidConfig();
  webpush.setVapidDetails(subject, publicKey, privateKey);
  configured = true;
}

export async function sendPush(
  subscription: StoredPushSubscription,
  payload: PushPayload
): Promise<PushSendResult> {
  ensureConfigured();

  try {
    await webpush.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: { p256dh: subscription.p256dh, auth: subscription.auth }
      },
      JSON.stringify(payload)
    );
    return { ok: true };
  } catch (error) {
    const statusCode = (error as { statusCode?: number }).statusCode;
    const gone = statusCode === 404 || statusCode === 410;
    return {
      ok: false,
      gone,
      error: error instanceof Error ? error.message : "Unknown web-push error"
    };
  }
}
