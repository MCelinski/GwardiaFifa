# Gwardia Piwo World Cup 2026

Private FIFA World Cup 2026 prediction league hosted on Vercel with Next.js App Router, Tailwind, shadcn-style components, Framer Motion, and Supabase.

## Current Status

The app has a complete premium dashboard UI and a backend foundation ready for Supabase:

- private auth/join page with invite code `GWARDIA-PIWO-2026`;
- dashboard, match predictions, group standings predictions, knockout bracket, leaderboard, friends predictions, user breakdown, admin page, and rules page;
- Supabase SSR clients and middleware session refresh;
- SQL schema with RLS privacy rules;
- server actions for login/register/join league and saving predictions;
- admin API routes for official schedule import, results sync, and point recalculation;
- real football-data.org sync endpoint wired for Vercel Cron;
- static official schedule import with 104 World Cup 2026 fixtures from a football-data.org snapshot;
- podium picks with the same lock deadline as group standings;
- dashboard panel with today's matches that the current user can still predict;
- all pages read exclusively from Supabase (no mock data); empty states show until data is imported.

## Rules

- Group final standings can be edited until `11 czerwca 2026, 23:59 Europe/Warsaw`.
- Match predictions can be edited until 10 minutes before kickoff.
- Podium picks lock together with group standings.
- Friends' match predictions become visible only after that match starts.
- Friends' group standings predictions become visible only after the group deadline.
- Users can always see their own predictions.

## Supabase Setup

1. Create a Supabase project.
2. Run every file in `supabase/migrations/` in order (`0001` … `0005`) in the Supabase SQL editor. `0005` fixes match scoring so the "goal difference" bonus is actually awarded.
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
- Vercel Cron runs `GET /api/cron/football-data` once per day on Hobby, configured in `vercel.json`.
- football-data.org sync calls `/v4/competitions/{competition}/matches?season=2026&dateFrom=today&dateTo=today`.
- Full schedule import uses the committed static snapshot in `lib/official-schedule.ts`.
- football-data.org remains used for today's results sync.
