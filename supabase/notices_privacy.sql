-- =====================================================================
-- 1. Roman numerals for the Tenet books' titles.
-- =====================================================================
update public.books set title = v.title
from (values
  ('autonomy', 'I. Considerations of Autonomy'),
  ('xenia', 'II. Considerations of Xenia'),
  ('repair', 'III. Considerations of Repair and Our Path Forward'),
  ('reciprocity', 'IV. Considerations of Reciprocity'),
  ('rocking-chair', 'V. Considerations of the Rocking Chair'),
  ('trauma-informed', 'VI. Considerations of Trauma Informed Behavior'),
  ('power', 'VII. Considerations of Power and Authority'),
  ('education', 'VIII. Considerations of Education'),
  ('testimony', 'IX. Considerations of Attestation and Testimony')
) as v(slug, title)
where books.slug = v.slug;

-- =====================================================================
-- 2a. Fix: unlinking a deleted account's stories is allowed.
-- =====================================================================
create or replace function public.guard_story() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'INSERT' then
    new.author := auth.uid();
    new.status := 'pending';
    new.reviewed_by := null;
    new.reviewed_at := null;
    new.review_note := null;
    return new;
  end if;
  -- When an account is deleted, its stories are unlinked from it.
  if new.author is null and old.author is not null
     and new.happened = old.happened and new.could_help = old.could_help
     and new.status = old.status then
    return new;
  end if;
  if not public.is_admin() then
    raise exception 'Only an admin may review a story.';
  end if;
  new.author := old.author;
  new.happened := old.happened;
  new.could_help := old.could_help;
  new.reviewed_by := auth.uid();
  new.reviewed_at := now();
  return new;
end $$;

-- =====================================================================
-- 2. A member may delete their own account. Their profile, Considerations,
--    and reactions are deleted with it. Stories stay published but lose
--    any link to the account (withdraw them first to remove them).
--    Anyone who holds or has held a seat, an appointment, or a review is
--    removed by the Council instead, so the record of authority stays.
-- =====================================================================
create or replace function public.delete_my_account() returns void
language plpgsql security definer set search_path = '' as $$
declare me uuid := auth.uid();
begin
  if me is null then raise exception 'Please sign in first.'; end if;
  if exists (select 1 from public.chairs where wisdom = me)
     or exists (select 1 from public.appointments where member = me or granted_by = me)
     or exists (select 1 from public.considerations where reviewed_by = me)
     or exists (select 1 from public.stories where reviewed_by = me)
     or exists (select 1 from public.submissions where resolved_by = me) then
    raise exception 'Accounts that hold or have held authority are removed by the Council. Please use Report an Issue.';
  end if;
  delete from auth.users where id = me;
end $$;

-- =====================================================================
-- 3. Change notices. An admin writes a statement; it is emailed only to
--    members who gave permission. At most one notice every 30 days,
--    enforced here.
-- =====================================================================
create table if not exists public.notices (
  id bigint generated always as identity primary key,
  subject text not null check (char_length(subject) between 1 and 200),
  body text not null check (char_length(body) between 1 and 20000),
  sent_by uuid references public.profiles(id) on delete set null,
  status text not null default 'sending' check (status in ('sending', 'sent', 'failed')),
  recipients int,
  created_at timestamptz not null default now()
);
alter table public.notices enable row level security;
drop policy if exists "admins read notices" on public.notices;
create policy "admins read notices" on public.notices for select using (public.is_admin());

-- When the next notice may be sent (null means now).
create or replace function public.next_notice_at() returns timestamptz
language sql stable security definer set search_path = '' as $$
  select max(created_at) + interval '30 days' from public.notices
  where status = 'sent' or (status = 'sending' and created_at > now() - interval '15 minutes')
  having max(created_at) + interval '30 days' > now();
$$;

-- Reserve the month's notice and return who it goes to.
create or replace function public.begin_notice(subject text, body text)
returns table (notice_id bigint, email text, display_name text)
language plpgsql security definer set search_path = '' as $$
declare nid bigint;
begin
  if not public.is_admin() then raise exception 'Only an admin may send a notice.'; end if;
  if public.next_notice_at() is not null then
    raise exception 'One notice has already been sent in the last 30 days. The next may be sent after %.',
      to_char(public.next_notice_at(), 'Mon DD, YYYY');
  end if;
  insert into public.notices (subject, body, sent_by)
    values (begin_notice.subject, begin_notice.body, auth.uid()) returning id into nid;
  return query
    select nid, u.email::text, p.display_name
    from public.profiles p join auth.users u on u.id = p.id
    where p.notify_changes and u.email is not null and u.email_confirmed_at is not null;
end $$;

create or replace function public.finish_notice(notice_id bigint, ok boolean, sent int) returns void
language sql security definer set search_path = '' as $$
  update public.notices set status = case when ok then 'sent' else 'failed' end, recipients = sent
  where id = notice_id and public.is_admin();
$$;
