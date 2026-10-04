-- =====================================================================
-- Founding period. While the Sisters are getting started, the founder
-- holds admin access and may sit in the chairs at the same time. The
-- exception ends on its own at `until`; after that the usual rules apply
-- (a Wisdom cannot hold the authority she grants). Delete the row to end
-- it early.
-- =====================================================================
create table if not exists public.founders (
  member uuid primary key references public.profiles(id) on delete cascade,
  until timestamptz not null
);
alter table public.founders enable row level security;
drop policy if exists "founders readable" on public.founders;
create policy "founders readable" on public.founders for select using (true);

create or replace function public.is_founder(uid uuid default auth.uid()) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.founders f where f.member = uid and f.until > now());
$$;

create or replace function public.is_admin(uid uuid default auth.uid()) returns boolean
language sql stable security definer set search_path = '' as $$
  select public.is_founder(uid) or (not public.is_admin_wisdom(uid) and exists (
    select 1 from public.appointments a join public.houses h on h.slug = a.house
    where h.grants_admin and a.member = uid
      and a.revoked_at is null
      and a.starts_at <= now() and a.ends_at > now()
  ));
$$;

-- Make wynsday the founder until 2027-04-04 and seat her in both chairs.
insert into public.founders (member, until)
select id, '2027-04-04' from public.profiles where display_name = 'wynsday'
on conflict (member) do update set until = excluded.until;

update public.chairs
set wisdom = (select id from public.profiles where display_name = 'wynsday'),
    seated_at = now()
where house in ('nisaba', 'oht');
