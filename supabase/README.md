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
```

4. Start the app and import the mock World Cup data into Supabase:

```bash
curl -X POST http://localhost:3000/api/admin/import-mock -H "Authorization: Bearer $CRON_SECRET"
```

If `CRON_SECRET` is not set, admin API routes are allowed only in non-production.

## Backend endpoints

- `POST /api/admin/import-mock` imports league, groups, teams, fixtures, and bracket placeholders.
- `POST /api/admin/recalculate` recalculates finished fixture points.
- `POST /api/admin/sync-results` records the football-data.org sync placeholder.
- `GET /api/friends/match/:fixtureId` returns visible friends' match predictions through RLS.
- `GET /api/friends/group/:groupId` returns visible friends' group predictions through RLS.

## Privacy Model

RLS enforces:

- users can always see their own predictions;
- match predictions by friends become visible only when `fixtures.starts_at <= now()`;
- group standings predictions by friends become visible only when `world_cup_groups.standings_deadline <= now()`;
- users can create/update predictions only before the lock timestamp;
- admin operations require the server-side secret key.
