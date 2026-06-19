-- Daily betting reminders: store Web Push subscriptions and a per-user push toggle.
--
-- A single evening cron (see app/api/cron/reminders) nudges players who still have
-- un-bet matches with a deadline in the next 24h, via Web Push. The cron reads these
-- tables via the service-role admin client, which bypasses RLS — the policies below
-- only need to let each user manage their own rows from the browser.

create table public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  user_agent text,
  created_at timestamptz not null default now()
);

create index push_subscriptions_user_idx on public.push_subscriptions(user_id);

alter table public.profiles
  add column notify_push boolean not null default true;

alter table public.push_subscriptions enable row level security;

create policy "users select own push subscriptions"
on public.push_subscriptions for select
to authenticated
using (user_id = auth.uid());

create policy "users insert own push subscriptions"
on public.push_subscriptions for insert
to authenticated
with check (user_id = auth.uid());

create policy "users update own push subscriptions"
on public.push_subscriptions for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "users delete own push subscriptions"
on public.push_subscriptions for delete
to authenticated
using (user_id = auth.uid());
