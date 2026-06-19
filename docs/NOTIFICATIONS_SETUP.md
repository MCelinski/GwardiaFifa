# Notifications setup — daily betting reminders (Web Push)

One reminder per evening (20:00 Europe/Warsaw) tells each player they still have
un-bet matches whose deadline is within the next 24h, delivered as a **Web Push**
notification through the installed PWA. No email, no SMS — free and self-hosted.

The send is done by `GET /api/cron/reminders`, triggered by an external scheduler
(cron-job.org), because Vercel Hobby only allows one cron slot (already used by
`football-data`).

---

## 1. Run the database migration

In the **Supabase SQL editor**, run the contents of:

```
supabase/migrations/0009_push_subscriptions_and_notif_prefs.sql
```

This creates the `push_subscriptions` table (with RLS) and adds `notify_push`
(default `true`) to `profiles`. Without this, the "Włącz powiadomienia" button can't
save a subscription.

---

## 2. Environment variables

Add these in **two places**: your local `.env.local` (done) **and** the Vercel
project (Settings → Environment Variables → Production + Preview). The values are in
your `.env.local`.

| Variable | Notes |
|---|---|
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | Public VAPID key (browser reads it). |
| `VAPID_PUBLIC_KEY` | Same value as above (server side). |
| `VAPID_PRIVATE_KEY` | **Secret.** Server only. |
| `VAPID_SUBJECT` | `mailto:michc2000@gmail.com` |

> To regenerate keys if ever needed: `npx web-push generate-vapid-keys`.
> Put the public key into **both** `NEXT_PUBLIC_VAPID_PUBLIC_KEY` and `VAPID_PUBLIC_KEY`.

---

## 3. Push it to Vercel

After adding the env vars in Vercel, **redeploy** (env changes only take effect on a
new deployment). `NEXT_PUBLIC_*` values are baked at build time, so a redeploy is
mandatory for the opt-in button to pick up the VAPID public key.

---

## 4. Schedule the cron (cron-job.org)

Create one job:

- **URL:** `https://gwardia-fifa.vercel.app/api/cron/reminders`
- **Method:** `GET`
- **Schedule:** every day at **20:00**, **timezone Europe/Warsaw** (cron-job.org lets
  you pick the timezone and handles DST — no UTC math needed).
- **Request header:** `Authorization: Bearer <CRON_SECRET>` — the value is `CRON_SECRET`
  from `.env.local` (and must match the value set in Vercel).

A successful run returns JSON like:
`{ "ok": true, "usersNotified": 3, "pushSent": 4, "prunedSubscriptions": 0 }`.

---

## 5. Players opt in

Each player, on their phone:

1. Open the app and **add it to the home screen** (PWA). On iPhone this is required —
   web push only works from the installed app (iOS 16.4+).
2. Open the installed app → Dashboard → **"Włącz powiadomienia"** → allow when prompted.

This stores their device in `push_subscriptions`. A player can mute reminders without
unsubscribing by setting `notify_push = false` on their `profiles` row.

---

## 6. Test it

- **Locally:** `npm run dev`, then
  `curl http://localhost:3000/api/cron/reminders -H "Authorization: Bearer <CRON_SECRET>"`.
  (In dev, the route also runs without the header.)
- **Production:** hit the same URL with the Bearer header, or use cron-job.org's
  "Run now". Check the JSON counters.

---

## How the timing avoids night-time pings

The cron runs once each evening and covers every deadline in the next 24h, so each
deadline is reminded exactly once — by the 20:00 immediately before it. An overnight
03:00 kickoff is nudged the evening before ("bet before bed"); nobody is woken at night.
