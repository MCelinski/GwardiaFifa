# Gwardia Piwo World Cup 2026

Private FIFA World Cup 2026 prediction league hosted on Vercel with Next.js App Router, Tailwind, shadcn-style components, Framer Motion, and Supabase.

## Current Status

The app is **live and in production** for the World Cup 2026 group stage. Full premium UI on a Supabase backend:

- private auth/join page with invite code `GWARDIA-PIWO-2026`;
- dashboard, match predictions, **live Flashscore-style group tables**, knockout bracket, leaderboard, friends predictions, user breakdown, admin page, and rules page;
- Supabase SSR clients and middleware session refresh; SQL schema with RLS privacy rules;
- server actions for login/register/join league and saving predictions;
- admin API routes for official schedule import, results sync, and point recalculation;
- **football-data.org sync over the whole tournament window** on every cron run, so results are ingested reliably regardless of timezone/finalization timing;
- match scoring uses the **margin-bonus** model (exact 5; correct outcome +3; exact goal difference +1; one team's goals +1; capped at 5) — migration `0005`;
- **group-standings points are added to the leaderboard only after the entire group stage finishes** (migration `0007`); until then the leaderboard reflects matches only;
- the Grupy tab shows **real live tables computed from results** plus a per-group "Twój typ" panel that **simulates** how many points your prediction would earn if the stage ended now;
- **interactive leaderboard filters** (overall / group matches / group tables / knockout / today) that re-sort the table;
- **validated score inputs** (digits only, 0–99) on both the match card and the dashboard betting panel;
- **navigation feedback**: a top progress bar plus a per-tab spinner while a dynamic page loads;
- all pages read exclusively from Supabase (no mock data); empty states show until data is imported.

## Rules

- Group final standings can be edited until `11 czerwca 2026, 23:59 Europe/Warsaw`.
- Match predictions can be edited until 10 minutes before kickoff; scores are integers 0–99.
- Podium picks lock together with group standings.
- Friends' match predictions become visible only after that match starts.
- Friends' group standings predictions become visible only after the group deadline.
- Users can always see their own predictions.
- Real results are pulled automatically from football-data.org; match points and the leaderboard recalculate on each sync.
- Group-table points only count toward the leaderboard once **all** group-stage matches have been played; before that the Grupy tab shows live tables and a points simulation.

The full, player-facing rules live in `lib/rules.ts` (`rulesSummary`) and render on the **Regulamin** tab.

## Supabase Setup

1. Create a Supabase project.
2. Run every file in `supabase/migrations/` in order (`0001` … `0007`) in the Supabase SQL editor. Notable ones:
   - `0005` — match scoring switched to the margin-bonus model (the "goal difference" bonus is actually awarded);
   - `0006` — fix tournament final detection for podium scoring;
   - `0007` — group-standings points only count after the whole group stage finishes (`recalculate_league_points` keeps them at 0 until then).

   > Migrations are applied manually in the SQL editor — there is no Supabase CLI/DB connection string in this repo, so DDL cannot go through the REST API.
3. Copy `.env.example` to `.env.local` and fill:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
CRON_SECRET=
FOOTBALL_DATA_API_KEY=
FOOTBALL_DATA_COMPETITION=WC
FOOTBALL_DATA_SEASON=2026
```

4. Start the app:

```bash
npm run dev
```

5. Import the official schedule (populates teams, groups, and all 104 fixtures):

```bash
curl -X POST http://localhost:3000/api/admin/import-official-schedule -H "Authorization: Bearer YOUR_CRON_SECRET"
```

> Important: `SUPABASE_SECRET_KEY` must be a real Supabase **service_role / secret** key, not the
> publishable key. Schedule import, results sync, and point recalculation use the admin client to
> bypass RLS — with a publishable key in that slot those writes are silently rejected by RLS.

## Security Model

The database enforces lock rules with RLS:

- match insert/update is allowed only when `fixtures.starts_at - interval '10 minutes' > now()`;
- group standings insert/update is allowed only before `world_cup_groups.standings_deadline`;
- podium insert/update is allowed only before `world_cup_groups.standings_deadline`;
- friends' predictions are hidden by RLS until the visibility deadline;
- admin endpoints use `CRON_SECRET` and server-side Supabase secret key.

## Production Checklist

- Configure Supabase env vars in Vercel.
- Run all SQL migrations in Supabase.
- Import fixtures using `/api/admin/import-official-schedule`.
- Create the first admin user and set their `profiles.is_admin = true` plus `league_members.role = 'admin'`.
- Enable email/password auth in Supabase.
- Set Vercel environment variable `CRON_SECRET`.
- Vercel Cron runs `GET /api/cron/football-data` once per day on Hobby, configured in `vercel.json`. An external scheduler (e.g. cron-job.org every 5 min) can hit the same endpoint for near-real-time results.
- The cron syncs the **whole tournament window** (`WORLD_CUP_2026_DATE_FROM`…`DATE_TO`) on every run, not just "today", so a result that finalizes after the day's cron slot is still back-filled. The manual `/api/admin/sync-results` accepts an explicit `dateFrom`/`dateTo`.
- Full schedule import uses the committed static snapshot in `lib/official-schedule.ts`.
