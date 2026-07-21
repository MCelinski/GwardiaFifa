// One-off broadcast: tell every push subscriber that the tournament is over and
// link them to the results page. Mirrors the send/prune loop from the reminder
// cron (app/api/cron/reminders/route.ts) but as a manual, one-time blast.
//
//   node scripts/notify-tournament-over.mjs          # dry run (lists recipients + payload)
//   node scripts/notify-tournament-over.mjs --apply   # actually send the push
import { readFileSync } from 'node:fs';
import webpush from 'web-push';

const env = Object.fromEntries(
  readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
    .split('\n')
    .filter((l) => l.includes('='))
    .map((l) => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);

const URL_BASE = env.NEXT_PUBLIC_SUPABASE_URL + '/rest/v1';
const KEY = env.SUPABASE_SECRET_KEY;
const H = { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' };
const APPLY = process.argv.includes('--apply');

const PAYLOAD = {
  title: 'Koniec turnieju',
  body: 'Mundial dobiegł końca',
  url: '/wyniki'
};

async function q(path, init) {
  const res = await fetch(`${URL_BASE}/${path}`, { headers: H, ...init });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} on ${path}: ${await res.text()}`);
  return res.status === 204 ? null : res.json();
}

webpush.setVapidDetails(env.VAPID_SUBJECT, env.VAPID_PUBLIC_KEY, env.VAPID_PRIVATE_KEY);

const subs = await q('push_subscriptions?select=id,endpoint,p256dh,auth');

console.log(`Payload: ${JSON.stringify(PAYLOAD)}`);
console.log(`Subscriptions: ${subs.length}`);

if (!APPLY) {
  for (const s of subs) console.log(`  would send -> ${s.endpoint.slice(0, 60)}...`);
  console.log('\nDRY RUN — re-run with --apply to actually send.');
  process.exit(0);
}

let sent = 0;
let pruned = 0;
let failed = 0;
for (const s of subs) {
  try {
    await webpush.sendNotification(
      { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
      JSON.stringify(PAYLOAD)
    );
    sent += 1;
  } catch (error) {
    const statusCode = error?.statusCode;
    if (statusCode === 404 || statusCode === 410) {
      // Endpoint gone (unsubscribed / cleared) — drop the stale row.
      await q(`push_subscriptions?id=eq.${s.id}`, { method: 'DELETE', headers: { ...H, Prefer: 'return=minimal' } });
      pruned += 1;
    } else {
      failed += 1;
      console.error(`  send failed (${statusCode ?? '??'}) for ${s.endpoint.slice(0, 60)}...: ${error?.message ?? error}`);
    }
  }
}

console.log(`\nAPPLIED — sent: ${sent}, pruned: ${pruned}, failed: ${failed}`);
