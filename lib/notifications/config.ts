// Central env access + guards for the notification channels. Mirrors the pattern in
// lib/supabase/config.ts: read env in one place and expose `canUse*` checks so the
// cron and API routes degrade gracefully (skip a channel) instead of throwing when a
// key is missing in a given environment.

export function getVapidPublicKey() {
  return process.env.VAPID_PUBLIC_KEY ?? process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
}

export function getVapidPrivateKey() {
  return process.env.VAPID_PRIVATE_KEY;
}

export function getVapidSubject() {
  return process.env.VAPID_SUBJECT ?? "mailto:michc2000@gmail.com";
}

export function canUseWebPush() {
  return Boolean(getVapidPublicKey() && getVapidPrivateKey());
}

export function requireVapidConfig() {
  const publicKey = getVapidPublicKey();
  const privateKey = getVapidPrivateKey();

  if (!publicKey || !privateKey) {
    throw new Error("Missing VAPID_PUBLIC_KEY or VAPID_PRIVATE_KEY.");
  }

  return { publicKey, privateKey, subject: getVapidSubject() };
}
