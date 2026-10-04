-- =====================================================================
-- Founding period. While the Sisters are getting started, the founder
-- holds admin access and may sit in the chairs at the same time. The
-- exception ends on its own at founder_until; after that the usual rules
-- apply (a Wisdom cannot hold the authority she grants). Set it to null
-- to end it early.
-- =====================================================================
alter table public.profiles add column if not exists founder_until timestamptz;

create or replace function public.is_founder(uid uuid default auth.uid()) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles p where p.id = uid and p.founder_until > now());
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

-- Members may edit their own profile, but never their own founder date.
create or replace function public.guard_profile() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.founder_until is distinct from old.founder_until and auth.uid() is not null then
    raise exception 'The founding period is set by the Council, not from the site.';
  end if;
  return new;
end $$;
drop trigger if exists profiles_guard on public.profiles;
create trigger profiles_guard before update on public.profiles
  for each row execute function public.guard_profile();

-- Make wynsday the founder until 2027-04-04 and seat her in both chairs.
update public.profiles set founder_until = '2027-04-04' where display_name = 'wynsday';

update public.chairs
set wisdom = (select id from public.profiles where display_name = 'wynsday'),
    seated_at = now()
where house in ('nisaba', 'oht');
