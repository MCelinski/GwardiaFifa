create extension if not exists pgcrypto;

create type public.member_role as enum ('admin', 'member');
create type public.prediction_status as enum ('draft', 'saved', 'locked', 'hidden', 'live', 'scored');
create type public.fixture_stage as enum ('group', 'knockout');
create type public.fixture_status as enum ('draft', 'scheduled', 'locked', 'live', 'finished');
create type public.group_status as enum ('editable', 'saved', 'locked', 'scored');
create type public.points_source_type as enum ('match', 'group', 'knockout', 'bonus', 'admin');
create type public.sync_status as enum ('success', 'warning', 'error');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text not null default 'Gwardzista',
  avatar_initials text not null default 'GP',
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.leagues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  invite_code text not null unique,
  is_private boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.league_members (
  id uuid primary key default gen_random_uuid(),
  league_id uuid not null references public.leagues(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.member_role not null default 'member',
  joined_at timestamptz not null default now(),
  unique (league_id, user_id)
);

create table public.world_cup_groups (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  standings_deadline timestamptz not null,
  status public.group_status not null default 'editable'
);

create table public.teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  flag_code text not null,
  fifa_rank integer,
  group_code text references public.world_cup_groups(code),
  created_at timestamptz not null default now()
);

create unique index teams_name_unique_idx on public.teams(name);

create table public.fixtures (
  id uuid primary key default gen_random_uuid(),
  external_id text unique,
  league_id uuid not null references public.leagues(id) on delete cascade,
  stage public.fixture_stage not null,
  round text,
  group_code text references public.world_cup_groups(code),
  team_a_id uuid references public.teams(id),
  team_b_id uuid references public.teams(id),
  placeholder_a text,
  placeholder_b text,
  starts_at timestamptz not null,
  status public.fixture_status not null default 'scheduled',
  score_a integer,
  score_b integer,
  winner_team_id uuid references public.teams(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (score_a is null or score_a >= 0),
  check (score_b is null or score_b >= 0)
);

create table public.match_predictions (
  id uuid primary key default gen_random_uuid(),
  fixture_id uuid not null references public.fixtures(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  score_a integer not null,
  score_b integer not null,
  winner_team_id uuid references public.teams(id),
  status public.prediction_status not null default 'saved',
  points integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (fixture_id, user_id),
  check (score_a >= 0),
  check (score_b >= 0)
);

create table public.group_standing_predictions (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.world_cup_groups(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  status public.prediction_status not null default 'saved',
  points integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (group_id, user_id)
);

create table public.group_standing_prediction_items (
  id uuid primary key default gen_random_uuid(),
  prediction_id uuid not null references public.group_standing_predictions(id) on delete cascade,
  team_id uuid not null references public.teams(id) on delete cascade,
  predicted_position integer not null,
  points integer not null default 0,
  unique (prediction_id, team_id),
  unique (prediction_id, predicted_position),
  check (predicted_position between 1 and 4)
);

create table public.points_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  league_id uuid not null references public.leagues(id) on delete cascade,
  source_type public.points_source_type not null,
  source_id uuid,
  label text not null,
  points integer not null,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.sync_logs (
  id uuid primary key default gen_random_uuid(),
  job text not null,
  status public.sync_status not null,
  detail text not null,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index league_members_user_idx on public.league_members(user_id);
create index fixtures_league_stage_idx on public.fixtures(league_id, stage, starts_at);
create index match_predictions_user_idx on public.match_predictions(user_id);
create index group_standing_predictions_user_idx on public.group_standing_predictions(user_id);
create index points_events_user_idx on public.points_events(user_id, created_at desc);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_touch_updated_at before update on public.profiles
for each row execute function public.touch_updated_at();

create trigger fixtures_touch_updated_at before update on public.fixtures
for each row execute function public.touch_updated_at();

create trigger match_predictions_touch_updated_at before update on public.match_predictions
for each row execute function public.touch_updated_at();

create trigger group_predictions_touch_updated_at before update on public.group_standing_predictions
for each row execute function public.touch_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  display text;
  initials text;
begin
  display := coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1), 'Gwardzista');
  initials := upper(left(regexp_replace(display, '[^[:alnum:]]', '', 'g'), 2));

  insert into public.profiles (id, email, display_name, avatar_initials)
  values (new.id, new.email, display, coalesce(nullif(initials, ''), 'GP'))
  on conflict (id) do update
    set email = excluded.email,
        display_name = excluded.display_name,
        avatar_initials = excluded.avatar_initials;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.is_league_member(target_league_id uuid, target_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.league_members lm
    where lm.league_id = target_league_id
      and lm.user_id = target_user_id
  );
$$;

create or replace function public.is_league_admin(target_league_id uuid, target_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.league_members lm
    where lm.league_id = target_league_id
      and lm.user_id = target_user_id
      and lm.role = 'admin'
  );
$$;

create or replace function public.join_league_by_code(code text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  target_league_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  select id into target_league_id
  from public.leagues
  where invite_code = upper(trim(code));

  if target_league_id is null then
    raise exception 'Invalid invite code';
  end if;

  insert into public.league_members (league_id, user_id)
  values (target_league_id, auth.uid())
  on conflict (league_id, user_id) do nothing;

  return target_league_id;
end;
$$;

create or replace function public.score_match_prediction(pred public.match_predictions, fix public.fixtures)
returns integer
language plpgsql
immutable
as $$
declare
  points integer := 0;
  predicted_diff integer;
  actual_diff integer;
begin
  if fix.score_a is null or fix.score_b is null then
    return 0;
  end if;

  predicted_diff := pred.score_a - pred.score_b;
  actual_diff := fix.score_a - fix.score_b;

  if pred.score_a = fix.score_a and pred.score_b = fix.score_b then
    points := greatest(points, 5);
  elsif sign(predicted_diff) = sign(actual_diff) then
    points := greatest(points, 3);
  elsif predicted_diff = actual_diff then
    points := greatest(points, 2);
  end if;

  if pred.score_a = fix.score_a then
    points := points + 1;
  end if;

  if pred.score_b = fix.score_b then
    points := points + 1;
  end if;

  return points;
end;
$$;

create or replace function public.recalculate_league_points(target_league_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  affected integer := 0;
begin
  update public.match_predictions mp
  set points = public.score_match_prediction(mp, f),
      status = 'scored'
  from public.fixtures f
  where f.id = mp.fixture_id
    and f.league_id = target_league_id
    and f.status = 'finished';

  get diagnostics affected = row_count;

  insert into public.sync_logs (job, status, detail, meta)
  values ('points.recalculate', 'success', affected || ' match predictions recalculated', jsonb_build_object('league_id', target_league_id));

  return affected;
end;
$$;

create or replace view public.leaderboard as
select
  lm.league_id,
  p.id as user_id,
  p.display_name,
  p.avatar_initials,
  coalesce(mp_totals.group_match_points, 0)
    + coalesce(gp_totals.group_standings_points, 0)
    + coalesce(mp_totals.knockout_points, 0)
    + coalesce(pe_totals.bonus_points, 0) as total_points,
  coalesce(mp_totals.group_match_points, 0) as group_match_points,
  coalesce(gp_totals.group_standings_points, 0) as group_standings_points,
  coalesce(mp_totals.knockout_points, 0) as knockout_points,
  coalesce(pe_totals.bonus_points, 0) as bonus_points,
  coalesce((
    select pe2.points
    from public.points_events pe2
    where pe2.user_id = p.id and pe2.league_id = lm.league_id
    order by pe2.created_at desc
    limit 1
  ), 0)::integer as last_points_gained
from public.league_members lm
join public.profiles p on p.id = lm.user_id
left join lateral (
  select
    coalesce(sum(mp.points) filter (where f.stage = 'group'), 0)::integer as group_match_points,
    coalesce(sum(mp.points) filter (where f.stage = 'knockout'), 0)::integer as knockout_points
  from public.match_predictions mp
  join public.fixtures f on f.id = mp.fixture_id
  where mp.user_id = p.id and f.league_id = lm.league_id
) mp_totals on true
left join lateral (
  select coalesce(sum(gsp.points), 0)::integer as group_standings_points
  from public.group_standing_predictions gsp
  where gsp.user_id = p.id
) gp_totals on true
left join lateral (
  select coalesce(sum(pe.points) filter (where pe.source_type = 'bonus'), 0)::integer as bonus_points
  from public.points_events pe
  where pe.user_id = p.id and pe.league_id = lm.league_id
) pe_totals on true;

alter table public.profiles enable row level security;
alter table public.leagues enable row level security;
alter table public.league_members enable row level security;
alter table public.world_cup_groups enable row level security;
alter table public.teams enable row level security;
alter table public.fixtures enable row level security;
alter table public.match_predictions enable row level security;
alter table public.group_standing_predictions enable row level security;
alter table public.group_standing_prediction_items enable row level security;
alter table public.points_events enable row level security;
alter table public.sync_logs enable row level security;

create policy "profiles visible to same league members"
on public.profiles for select
to authenticated
using (
  id = auth.uid()
  or exists (
    select 1
    from public.league_members self
    join public.league_members other_member on other_member.league_id = self.league_id
    where self.user_id = auth.uid()
      and other_member.user_id = profiles.id
  )
);

create policy "users update own profile"
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy "leagues visible to members or by invite"
on public.leagues for select
to authenticated
using (public.is_league_member(id));

create policy "league members visible within league"
on public.league_members for select
to authenticated
using (public.is_league_member(league_id));

create policy "groups visible to authenticated users"
on public.world_cup_groups for select
to authenticated
using (true);

create policy "teams visible to authenticated users"
on public.teams for select
to authenticated
using (true);

create policy "fixtures visible to league members"
on public.fixtures for select
to authenticated
using (public.is_league_member(league_id));

create policy "own match predictions visible before lock, friends after start"
on public.match_predictions for select
to authenticated
using (
  user_id = auth.uid()
  or exists (
    select 1
    from public.fixtures f
    where f.id = match_predictions.fixture_id
      and f.starts_at <= now()
      and public.is_league_member(f.league_id)
  )
);

create policy "users insert own unlocked match predictions"
on public.match_predictions for insert
to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.fixtures f
    where f.id = fixture_id
      and f.starts_at > now()
      and public.is_league_member(f.league_id)
  )
);

create policy "users update own unlocked match predictions"
on public.match_predictions for update
to authenticated
using (
  user_id = auth.uid()
  and exists (select 1 from public.fixtures f where f.id = fixture_id and f.starts_at > now())
)
with check (
  user_id = auth.uid()
  and exists (select 1 from public.fixtures f where f.id = fixture_id and f.starts_at > now())
);

create policy "own group predictions visible before deadline, friends after deadline"
on public.group_standing_predictions for select
to authenticated
using (
  user_id = auth.uid()
  or exists (
    select 1
    from public.world_cup_groups g
    where g.id = group_standing_predictions.group_id
      and g.standings_deadline <= now()
  )
);

create policy "users insert own unlocked group predictions"
on public.group_standing_predictions for insert
to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1 from public.world_cup_groups g
    where g.id = group_id and g.standings_deadline > now()
  )
);

create policy "users update own unlocked group predictions"
on public.group_standing_predictions for update
to authenticated
using (
  user_id = auth.uid()
  and exists (select 1 from public.world_cup_groups g where g.id = group_id and g.standings_deadline > now())
)
with check (
  user_id = auth.uid()
  and exists (select 1 from public.world_cup_groups g where g.id = group_id and g.standings_deadline > now())
);

create policy "group prediction items follow parent visibility"
on public.group_standing_prediction_items for select
to authenticated
using (
  exists (
    select 1 from public.group_standing_predictions gp
    where gp.id = prediction_id
      and (
        gp.user_id = auth.uid()
        or exists (
          select 1 from public.world_cup_groups g
          where g.id = gp.group_id and g.standings_deadline <= now()
        )
      )
  )
);

create policy "users manage own unlocked group prediction items"
on public.group_standing_prediction_items for all
to authenticated
using (
  exists (
    select 1
    from public.group_standing_predictions gp
    join public.world_cup_groups g on g.id = gp.group_id
    where gp.id = prediction_id
      and gp.user_id = auth.uid()
      and g.standings_deadline > now()
  )
)
with check (
  exists (
    select 1
    from public.group_standing_predictions gp
    join public.world_cup_groups g on g.id = gp.group_id
    where gp.id = prediction_id
      and gp.user_id = auth.uid()
      and g.standings_deadline > now()
  )
);

create policy "points visible within league"
on public.points_events for select
to authenticated
using (public.is_league_member(league_id));

create policy "sync logs visible to admins"
on public.sync_logs for select
to authenticated
using (
  exists (
    select 1 from public.league_members lm
    where lm.user_id = auth.uid() and lm.role = 'admin'
  )
);

insert into public.leagues (name, invite_code)
values ('Gwardia Piwo', 'GWARDIA-PIWO-2026')
on conflict (invite_code) do nothing;

insert into public.world_cup_groups (code, standings_deadline, status)
select chr(65 + i), make_timestamptz(2026, 6, 12 + i, 17, 0, 0, 'Europe/Warsaw'), 'editable'
from generate_series(0, 11) as s(i)
on conflict (code) do nothing;
