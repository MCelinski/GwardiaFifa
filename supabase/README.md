# Supabase Setup

1. Create a Supabase project.
2. Run `supabase/migrations/0001_initial_schema.sql` in the SQL editor, or through the Supabase CLI.
3. Add env vars to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_SECRET_KEY=...
CRON_SECRET=choose-a-long-random-secret
FOOTBALL_DATA_API_KEY=optional-for-later
FOOTBALL_DATA_COMPETITION=WC
FOOTBALL_DATA_SEASON=2026
```

4. Start the app and import the mock World Cup data into Supabase:

```bash
curl -X POST http://localhost:3000/api/admin/import-mock -H "Authorization: Bearer $CRON_SECRET"
```

For production, import the real schedule instead:

```bash
curl -X POST http://localhost:3000/api/admin/import-official-schedule -H "Authorization: Bearer $CRON_SECRET"
```

If `CRON_SECRET` is not set, admin API routes are allowed only in non-production.

## Backend endpoints

- `POST /api/admin/import-mock` imports fake local dev/test data only.
- `POST /api/admin/import-official-schedule` imports the committed official World Cup 2026 schedule snapshot.
- `POST /api/admin/recalculate` recalculates finished fixture points.
- `POST /api/admin/sync-results` runs a football-data.org sync for the selected date range.
- `GET /api/cron/football-data` runs the daily football-data.org sync from Vercel Cron.
- `GET /api/friends/match/:fixtureId` returns visible friends' match predictions through RLS.
- `GET /api/friends/group/:groupId` returns visible friends' group predictions through RLS.

## Privacy Model

RLS enforces:

- users can always see their own predictions;
- match predictions by friends become visible only when `fixtures.starts_at <= now()`;
- group standings predictions by friends become visible only when `world_cup_groups.standings_deadline <= now()`;
- podium predictions by friends become visible only after the group standings deadline;
- users can create/update match predictions only until 10 minutes before kickoff;
- users can create/update group standings until `2026-06-11 23:59:59 Europe/Warsaw`;
- users can create/update podium picks until `2026-06-11 23:59:59 Europe/Warsaw`;
- admin operations require the server-side secret key.
