-- =====================================================================
-- Admin dashboard: visit counts, to-do list, change log.
-- Visits store only a daily scrambled code (no IP address, no cookie),
-- so a visitor can be counted once per day but not followed across days.
-- =====================================================================
create table if not exists public.visits (
  day date not null,
  visitor text not null check (char_length(visitor) <= 64),
  primary key (day, visitor)
);
create table if not exists public.page_views (
  day date not null,
  path text not null check (char_length(path) <= 200),
  views int not null default 0,
  primary key (day, path)
);
alter table public.visits enable row level security;
alter table public.page_views enable row level security;
-- No policies: these are only reached through the functions below.

create or replace function public.record_visit(visitor text, path text) returns void
language sql security definer set search_path = '' as $$
  insert into public.visits (day, visitor) values (current_date, left(record_visit.visitor, 64))
    on conflict do nothing;
  insert into public.page_views (day, path, views) values (current_date, left(record_visit.path, 200), 1)
    on conflict (day, path) do update set views = public.page_views.views + 1;
$$;

create or replace function public.visit_stats(days int)
returns table (day date, visitors bigint, views bigint)
language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.is_admin() then raise exception 'Admins only.'; end if;
  return query
    select d::date,
      (select count(*) from public.visits v where v.day = d::date),
      (select coalesce(sum(p.views), 0) from public.page_views p where p.day = d::date)
    from generate_series(current_date - (greatest(days, 1) - 1), current_date, interval '1 day') d
    order by 1 desc;
end $$;

create or replace function public.top_pages(days int)
returns table (path text, views bigint)
language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.is_admin() then raise exception 'Admins only.'; end if;
  return query
    select p.path, sum(p.views)::bigint from public.page_views p
    where p.day > current_date - greatest(days, 1)
    group by p.path order by 2 desc limit 15;
end $$;

-- Keep visit records for 13 months, then let them go.
create or replace function public.prune_visits() returns void
language sql security definer set search_path = '' as $$
  delete from public.visits where day < current_date - interval '13 months';
  delete from public.page_views where day < current_date - interval '13 months';
$$;

create table if not exists public.admin_todos (
  id bigint generated always as identity primary key,
  text text not null check (char_length(text) between 1 and 500),
  done_at timestamptz,
  created_by uuid default auth.uid() references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);
alter table public.admin_todos enable row level security;
drop policy if exists "admins manage todos" on public.admin_todos;
create policy "admins manage todos" on public.admin_todos for all
  using (public.is_admin()) with check (public.is_admin());

create table if not exists public.change_log (
  id bigint generated always as identity primary key,
  title text not null check (char_length(title) between 1 and 200),
  details text check (char_length(details) <= 5000),
  created_by uuid default auth.uid() references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);
alter table public.change_log enable row level security;
drop policy if exists "admins manage change log" on public.change_log;
create policy "admins manage change log" on public.change_log for all
  using (public.is_admin()) with check (public.is_admin());
