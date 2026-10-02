-- =====================================================================
-- Oracle platform schema. Run once in Supabase: SQL Editor -> New query.
--
-- Governance (Tenet VII):
--   * Each House is headed by a Wisdom who sits in that House's chair.
--   * The Wisdom appoints House staff directly, for a stated time.
--   * The Wisdom cannot hold the authority she grants.
--   * The House of Nisaba keeps the sacred books. The Oracle of the
--     Hallowed Tree (House of the wood element) hosts this site.
--   * For now, admins appointed by either House have equal access:
--     reviewing, placing, and sorting Considerations, and indicators.
--   * Who sits in a chair is set by the Council (outside this site);
--     record it by editing `chairs` in the Supabase dashboard.
-- =====================================================================

-- ---------- Members ----------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Member',
  created_at timestamptz not null default now()
);

create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', 'Member'));
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Houses, chairs, appointments ----------
create table public.houses (
  slug text primary key,
  name text not null,
  charge text not null,
  grants_admin boolean not null default false
);

create table public.chairs (
  house text primary key references public.houses(slug),
  wisdom uuid references public.profiles(id),
  seated_at timestamptz,
  seat_ends timestamptz
);

create table public.appointments (
  id bigint generated always as identity primary key,
  house text not null references public.houses(slug),
  member uuid not null references public.profiles(id),
  granted_by uuid not null references public.profiles(id),
  starts_at timestamptz not null default now(),
  ends_at timestamptz not null,
  revoked_at timestamptz,
  note text,
  check (ends_at > starts_at),
  check (member <> granted_by)
);

-- Is this person the seated Wisdom of a house right now?
create function public.is_wisdom(h text, uid uuid default auth.uid()) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.chairs c
    where c.house = h and c.wisdom = uid
      and (c.seat_ends is null or c.seat_ends > now())
  );
$$;

-- Does this person currently hold authority in a house?
-- A seated Wisdom never does, even if an old appointment exists.
create function public.has_authority(h text, uid uuid default auth.uid()) returns boolean
language sql stable security definer set search_path = '' as $$
  select not public.is_wisdom(h, uid) and exists (
    select 1 from public.appointments a
    where a.house = h and a.member = uid
      and a.revoked_at is null
      and a.starts_at <= now() and a.ends_at > now()
  );
$$;

-- Is this person seated as Wisdom of any House that grants admin?
create function public.is_admin_wisdom(uid uuid default auth.uid()) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.chairs c join public.houses h on h.slug = c.house
    where h.grants_admin and c.wisdom = uid
      and (c.seat_ends is null or c.seat_ends > now())
  );
$$;

-- Admin access is equal across Houses that grant it. A Wisdom of any
-- such House never holds it, since admin is the authority she grants.
create function public.is_admin(uid uuid default auth.uid()) returns boolean
language sql stable security definer set search_path = '' as $$
  select not public.is_admin_wisdom(uid) and exists (
    select 1 from public.appointments a join public.houses h on h.slug = a.house
    where h.grants_admin and a.member = uid
      and a.revoked_at is null
      and a.starts_at <= now() and a.ends_at > now()
  );
$$;

-- A Wisdom cannot appoint herself, and an appointment may only be made
-- by the Wisdom seated in that house's chair.
create function public.check_appointment() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'INSERT' and (public.is_wisdom(new.house, new.member)
      or public.is_admin_wisdom(new.member)) then
    raise exception 'A Wisdom cannot hold the authority she grants.';
  end if;
  if tg_op = 'INSERT' and not public.is_wisdom(new.house, new.granted_by) then
    raise exception 'Only the Wisdom seated in this chair may appoint to its House.';
  end if;
  if tg_op = 'UPDATE' and (new.member <> old.member or new.house <> old.house
      or new.granted_by <> old.granted_by or new.starts_at <> old.starts_at
      or new.ends_at > old.ends_at) then
    raise exception 'An appointment may be ended early, never extended or reassigned.';
  end if;
  return new;
end $$;

create trigger appointments_check
  before insert or update on public.appointments
  for each row execute function public.check_appointment();

-- ---------- Books ----------
create table public.books (
  slug text primary key,
  kind text not null check (kind in ('aspiration', 'tenet', 'quilt')),
  ordinal int not null,
  subject text not null,
  title text not null,
  canon text
);

-- ---------- Trigger indicators ----------
create table public.indicators (
  slug text primary key,
  label text not null,
  created_at timestamptz not null default now()
);

-- ---------- Considerations ----------
create type public.consideration_status as enum ('pending', 'published', 'declined');
create type public.consideration_part as enum ('neutral', 'glimmer', 'trigger');

create table public.considerations (
  id bigint generated always as identity primary key,
  author uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 200),
  concept text not null check (char_length(concept) <= 10000),
  stories text not null check (char_length(stories) <= 50000),
  suggested_book text references public.books(slug),
  -- set by an admin on review:
  status public.consideration_status not null default 'pending',
  book text references public.books(slug),
  part public.consideration_part,
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  review_note text,
  created_at timestamptz not null default now(),
  check (status <> 'published' or (book is not null and part is not null))
);
create index on public.considerations (book, status, part);
create index on public.considerations (status, created_at);

-- Cross-listing in additional books (set by an admin)
create table public.consideration_books (
  consideration bigint references public.considerations(id) on delete cascade,
  book text references public.books(slug),
  primary key (consideration, book)
);

create table public.consideration_indicators (
  consideration bigint references public.considerations(id) on delete cascade,
  indicator text references public.indicators(slug) on delete cascade,
  primary key (consideration, indicator)
);

-- Members may only submit; they can never set review fields.
create function public.guard_submission() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if public.is_admin() then
    if tg_op = 'UPDATE' then
      new.reviewed_by := auth.uid();
      new.reviewed_at := now();
    end if;
    return new;
  end if;
  if tg_op = 'INSERT' then
    new.author := auth.uid();
    new.status := 'pending';
    new.book := null;
    new.part := null;
    new.reviewed_by := null;
    new.reviewed_at := null;
    new.review_note := null;
    return new;
  end if;
  raise exception 'Only an admin may change a Consideration after it is offered.';
end $$;

create trigger considerations_guard
  before insert or update on public.considerations
  for each row execute function public.guard_submission();

-- ---------- Row level security ----------
alter table public.profiles enable row level security;
alter table public.houses enable row level security;
alter table public.chairs enable row level security;
alter table public.appointments enable row level security;
alter table public.books enable row level security;
alter table public.indicators enable row level security;
alter table public.considerations enable row level security;
alter table public.consideration_books enable row level security;
alter table public.consideration_indicators enable row level security;

create policy "profiles readable" on public.profiles for select using (true);
create policy "edit own profile" on public.profiles for update using (id = auth.uid());

create policy "houses readable" on public.houses for select using (true);
create policy "chairs readable" on public.chairs for select using (true);
create policy "books readable" on public.books for select using (true);
create policy "indicators readable" on public.indicators for select using (true);

create policy "admins add indicators" on public.indicators for insert
  with check (public.is_admin());

create policy "appointments visible to house and wisdom" on public.appointments for select
  using (member = auth.uid() or public.is_wisdom(house) or public.has_authority(house));
create policy "wisdom appoints" on public.appointments for insert
  with check (granted_by = auth.uid() and public.is_wisdom(house));
create policy "wisdom ends appointments" on public.appointments for update
  using (public.is_wisdom(house));

create policy "published readable" on public.considerations for select
  using (status = 'published' or author = auth.uid() or public.is_admin());
create policy "members offer" on public.considerations for insert
  to authenticated with check (author = auth.uid());
create policy "admins review" on public.considerations for update
  using (public.is_admin());
create policy "admins remove" on public.considerations for delete
  using (public.is_admin());

create policy "cross-listings readable" on public.consideration_books for select using (true);
create policy "admins cross-list" on public.consideration_books for all
  using (public.is_admin()) with check (public.is_admin());

create policy "indicator tags readable" on public.consideration_indicators for select using (true);
create policy "admins tag" on public.consideration_indicators for all
  using (public.is_admin()) with check (public.is_admin());

-- ---------- Seed ----------
insert into public.houses (slug, name, charge, grants_admin) values
  ('nisaba', 'House of Nisaba', 'Keepers of the sacred books', true),
  ('oht', 'Oracle of the Hallowed Tree', 'House of the wood element; hosts this site', true);
insert into public.chairs (house) values ('nisaba'), ('oht');

insert into public.books (slug, kind, ordinal, subject, title, canon) values
  ('less-suffering', 'aspiration', 1, 'Less Suffering', 'The First Aspiration: Considerations of Less Suffering',
   'To cause less suffering, to enable less suffering, to endure less suffering, to stand up and actively prevent suffering.'),
  ('wonder', 'aspiration', 2, 'Wonder', 'The Second Aspiration: Considerations of Wonder',
   'To delight in the mysteries you encounter, and to encounter more than you have.'),
  ('grace', 'aspiration', 3, 'Grace', 'The Third Aspiration: Considerations of Grace',
   'To be kind to yourself, be kind to others, and be kind to life wherever you encounter it.'),
  ('autonomy', 'tenet', 1, 'Autonomy', 'The First Tenet: Considerations of Autonomy',
   'Non-negotiable. You have the power and responsibility of you. We have the power and responsibility of we.'),
  ('xenia', 'tenet', 2, 'Xenia', 'The Second Tenet: Considerations of Xenia',
   'Be appropriate in the role you have accepted.'),
  ('repair', 'tenet', 3, 'Repair', 'The Third Tenet: Considerations of Repair',
   'Positive change is repair, an apology is not.'),
  ('reciprocity', 'tenet', 4, 'Reciprocity', 'The Fourth Tenet: Considerations of Reciprocity',
   'What is given is not repaid to the giver but passed to the next.'),
  ('rocking-chair', 'tenet', 5, 'The Rocking Chair', 'The Fifth Tenet: Considerations of the Rocking Chair',
   'The chair remains; it''s okay to get up. You aren''t leaving a void, you are leaving a chair, a chair someone else can sit in for a while.'),
  ('trauma-informed', 'tenet', 6, 'Trauma Informed', 'The Sixth Tenet: Considerations of Trauma Informed Care',
   'We practice trauma informed care, and we ask you to learn it.'),
  ('power', 'tenet', 7, 'Power', 'The Seventh Tenet: Considerations of Power',
   'Power is held only to delegate and retract authority.'),
  ('education', 'tenet', 8, 'Education', 'The Eighth Tenet: Considerations of Education',
   'Myth is a language for thinking, not an explanation. Education is the best preventative.'),
  ('testimony', 'tenet', 9, 'Testimony', 'The Ninth Tenet: Considerations of Testimony',
   'Your account is neither boasting nor invalid, it is a report.'),
  ('quilt', 'quilt', 1, 'All Else', 'Quilt of the Considerate', null);

insert into public.indicators (slug, label) values
  ('violence', 'Violence'),
  ('sexual-violence', 'Sexual violence'),
  ('self-harm', 'Self-harm or suicide'),
  ('abuse', 'Abuse'),
  ('death', 'Death or grief'),
  ('religious-trauma', 'Religious trauma'),
  ('medical', 'Medical or body'),
  ('war', 'War');
