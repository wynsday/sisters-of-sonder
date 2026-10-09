-- Sisters of Sonder: complete database setup (for a NEW project).

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
  -- agreed at sign-up to the Sacred Aspirations, Foundational Understanding, and Tenets
  agreed_at timestamptz not null default now(),
  -- may be told when the wording changes significantly or a new item is added
  notify_changes boolean not null default false,
  created_at timestamptz not null default now()
);

create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, display_name, notify_changes)
  values (new.id,
          coalesce(new.raw_user_meta_data->>'display_name', 'Member'),
          coalesce((new.raw_user_meta_data->>'notify_changes')::boolean, false));
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
  kind text not null check (kind in ('foundation', 'aspiration', 'tenet', 'quilt')),
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
  -- premise (affirmation and/or condemnation), parable, or stories from two or more cultures
  form text not null default 'stories' check (form in ('premise', 'parable', 'stories')),
  concept text not null check (char_length(concept) between 1 and 20000),   -- the Consideration itself
  stories text not null default '' check (char_length(stories) <= 50000),   -- sources
  check (form <> 'stories' or char_length(stories) > 0),
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
  ('foundation', 'foundation', 1, 'The Foundational Understanding', 'Considerations of the Foundational Understanding', null),
  ('less-suffering', 'aspiration', 1, 'Less Suffering', 'The First Aspiration: Considerations of Less Suffering',
   'To cause less suffering, to enable less suffering, to endure less suffering, to stand up and actively prevent suffering.'),
  ('wonder', 'aspiration', 2, 'Wonder', 'The Second Aspiration: Considerations of Wonder',
   'To delight in the mysteries you encounter, and to encounter more than you have.'),
  ('grace', 'aspiration', 3, 'Grace', 'The Third Aspiration: Considerations of Grace',
   'To be kind to yourself, be kind to others, and be kind to life wherever you encounter it.'),
  ('autonomy', 'tenet', 1, 'Autonomy', 'I. Considerations of Autonomy',
   'Non-negotiable. You have the power and responsibility of you. We have the power and responsibility of we.'),
  ('xenia', 'tenet', 2, 'Xenia', 'II. Considerations of Xenia',
   'Be appropriate in the role you have accepted.'),
  ('repair', 'tenet', 3, 'Repair and Our Path Forward', 'III. Considerations of Repair and Our Path Forward',
   'Positive change is repair; an apology is not.'),
  ('reciprocity', 'tenet', 4, 'Reciprocity', 'IV. Considerations of Reciprocity',
   'A person can find what was left for them without reciprocity. Within a Considerate, what is received is received by all and is equal; clear boundaries, a community communications culture, and reciprocity rules govern the node beyond canon and bylaws.'),
  ('rocking-chair', 'tenet', 5, 'The Rocking Chair', 'V. Considerations of the Rocking Chair',
   'A single person cannot do everything. Know what you can do and what you can''t. Explore, share, and learn. The chair remains; it was empty before you sat, it will be empty as you get up. The chair moves and when it doesn''t, a new person can fill it and start it rocking again.'),
  ('trauma-informed', 'tenet', 6, 'Trauma Informed Behavior', 'VI. Considerations of Trauma Informed Behavior',
   'Awareness and education allow trauma informed behaviors.'),
  ('power', 'tenet', 7, 'Power and Authority', 'VII. Considerations of Power and Authority',
   'Power is held to delegate and retract authority. Power is shared and authority limited.'),
  ('education', 'tenet', 8, 'Education', 'VIII. Considerations of Education',
   'Myth is a language for thinking, not an explanation. Education is the best preventative of social harm.'),
  ('testimony', 'tenet', 9, 'Attestation and Testimony', 'IX. Considerations of Attestation and Testimony',
   'Conveying your experience is neither boasting nor invalid; it is your experience. Only a disinterested party can judge a claim of abuse.'),
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

-- =====================================================================
-- Hear My Voice: anonymous stories, indexed by what they speak to.
-- The author is stored only so a member can see and withdraw their own
-- stories. Readers and reviewers are never granted the author column.
-- =====================================================================
create table public.index_items (
  slug text primary key,
  kind text not null check (kind in ('foundation', 'aspiration', 'tenet', 'condemnation', 'definition', 'glossary')),
  ordinal int not null,
  label text not null
);

create table public.stories (
  id bigint generated always as identity primary key,
  author uuid references public.profiles(id) on delete set null,
  happened text not null check (char_length(happened) between 1 and 20000),
  could_help text not null check (char_length(could_help) between 1 and 20000),
  no_names boolean not null check (no_names),
  status public.consideration_status not null default 'pending',
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  review_note text,
  created_at timestamptz not null default now()
);
create index on public.stories (status, reviewed_at);

create table public.story_index (
  story bigint references public.stories(id) on delete cascade,
  item text references public.index_items(slug),
  primary key (story, item)
);

create table public.story_indicators (
  story bigint references public.stories(id) on delete cascade,
  indicator text references public.indicators(slug) on delete cascade,
  primary key (story, indicator)
);

create function public.guard_story() returns trigger
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

create trigger stories_guard
  before insert or update on public.stories
  for each row execute function public.guard_story();

-- Share a story and its index tags in one step. At least one tag is required.
create function public.share_story(happened text, could_help text, no_names boolean, items text[])
returns bigint
language plpgsql security definer set search_path = '' as $$
declare new_id bigint;
begin
  if auth.uid() is null then raise exception 'Please sign in to share.'; end if;
  if coalesce(array_length(items, 1), 0) = 0 then
    raise exception 'Choose at least one item your story speaks to.';
  end if;
  insert into public.stories (happened, could_help, no_names)
    values (share_story.happened, share_story.could_help, share_story.no_names)
    returning id into new_id;
  insert into public.story_index (story, item)
    select new_id, unnest(items);
  return new_id;
end $$;

-- A member's own stories (the only way author is ever read).
create function public.my_stories()
returns table (id bigint, happened text, status public.consideration_status, review_note text, created_at timestamptz)
language sql stable security definer set search_path = '' as $$
  select s.id, s.happened, s.status, s.review_note, s.created_at
  from public.stories s where s.author = auth.uid() and auth.uid() is not null
  order by s.created_at desc;
$$;

-- Autonomy: a member may withdraw their story at any time.
create function public.withdraw_story(story_id bigint) returns void
language sql security definer set search_path = '' as $$
  delete from public.stories where id = story_id and author = auth.uid() and auth.uid() is not null;
$$;

alter table public.index_items enable row level security;
alter table public.stories enable row level security;
alter table public.story_index enable row level security;
alter table public.story_indicators enable row level security;

create policy "index readable" on public.index_items for select using (true);

create policy "published stories readable" on public.stories for select
  using (status = 'published' or public.is_admin());
create policy "admins review stories" on public.stories for update
  using (public.is_admin());
create policy "admins remove stories" on public.stories for delete
  using (public.is_admin());

-- Hide the author column from everyone reading through the API.
revoke select on public.stories from anon, authenticated;
grant select (id, happened, could_help, status, reviewed_at, review_note, created_at)
  on public.stories to anon, authenticated;
revoke insert on public.stories from anon, authenticated;

create policy "story tags readable" on public.story_index for select using (true);
create policy "admins retag" on public.story_index for all
  using (public.is_admin()) with check (public.is_admin());
create policy "story indicators readable" on public.story_indicators for select using (true);
create policy "admins tag stories" on public.story_indicators for all
  using (public.is_admin()) with check (public.is_admin());

insert into public.index_items (slug, kind, ordinal, label) values
  ('foundation', 'foundation', 1, 'The Foundational Understanding'),
  ('less-suffering', 'aspiration', 1, 'Less Suffering'),
  ('wonder', 'aspiration', 2, 'Wonder'),
  ('grace', 'aspiration', 3, 'Grace'),
  ('autonomy', 'tenet', 1, 'Autonomy'),
  ('xenia', 'tenet', 2, 'Xenia'),
  ('repair', 'tenet', 3, 'Repair and Our Path Forward'),
  ('reciprocity', 'tenet', 4, 'Reciprocity'),
  ('rocking-chair', 'tenet', 5, 'The Rocking Chair'),
  ('trauma-informed', 'tenet', 6, 'Trauma Informed Behavior'),
  ('power', 'tenet', 7, 'Power and Authority'),
  ('education', 'tenet', 8, 'Education'),
  ('testimony', 'tenet', 9, 'Attestation and Testimony'),
  ('c-crusades', 'condemnation', 1, 'Crusades'),
  ('c-oppression', 'condemnation', 2, 'Oppression'),
  ('c-slavery', 'condemnation', 3, 'Slavery'),
  ('c-exploitation', 'condemnation', 4, 'Exploitation'),
  ('c-erasure', 'condemnation', 5, 'Erasure'),
  ('c-torture', 'condemnation', 6, 'Torture'),
  ('c-knowledge-prevention', 'condemnation', 7, 'Knowledge Prevention'),
  ('c-central-charismatic-cult-leadership', 'condemnation', 8, 'Central Charismatic Cult Leadership'),
  ('c-denial-of-autonomy', 'condemnation', 9, 'Denial of Autonomy'),
  ('c-religion-as-ruling-divinity-or-government-system', 'condemnation', 10, 'Religion as Ruling Divinity or Government System'),
  ('d-accusation', 'definition', 1, 'Accusation'),
  ('d-attestation', 'definition', 2, 'Attestation'),
  ('d-autonomy', 'definition', 3, 'Autonomy'),
  ('d-bylaws', 'definition', 4, 'Bylaws'),
  ('d-canon', 'definition', 5, 'Canon'),
  ('d-complaint', 'definition', 6, 'Complaint'),
  ('d-conclave', 'definition', 7, 'Conclave'),
  ('d-consideration', 'definition', 8, 'Consideration'),
  ('d-considerate', 'definition', 9, 'Considerate'),
  ('d-council-of-wisdoms', 'definition', 10, 'Council of Wisdoms'),
  ('d-disinterested-party', 'definition', 11, 'Disinterested party'),
  ('d-fourth-space', 'definition', 12, 'Fourth space'),
  ('d-glimmer', 'definition', 13, 'Glimmer'),
  ('d-guest', 'definition', 14, 'Guest'),
  ('d-harm', 'definition', 15, 'Harm'),
  ('d-host', 'definition', 16, 'Host'),
  ('d-kindly-crone', 'definition', 17, 'Kindly Crone'),
  ('d-ledger', 'definition', 18, 'Ledger'),
  ('d-left-and-found', 'definition', 19, 'Left and Found'),
  ('d-matron-saint', 'definition', 20, 'Matron Saint'),
  ('d-member', 'definition', 21, 'Member'),
  ('d-mutual-aid', 'definition', 22, 'Mutual aid'),
  ('d-node', 'definition', 23, 'Node'),
  ('d-nyxalon', 'definition', 24, 'Nyxalon'),
  ('d-remedy', 'definition', 25, 'Remedy'),
  ('d-repair', 'definition', 26, 'Repair'),
  ('d-role', 'definition', 27, 'Role'),
  ('d-sisters-of-sonder', 'definition', 28, 'Sisters of Sonder'),
  ('d-sonder', 'definition', 29, 'Sonder'),
  ('d-spoon-theory', 'definition', 30, 'Spoon theory'),
  ('d-suffering', 'definition', 31, 'Suffering'),
  ('d-testimony', 'definition', 32, 'Testimony'),
  ('d-trauma-informed-behavior', 'definition', 33, 'Trauma informed behavior'),
  ('d-trigger', 'definition', 34, 'Trigger'),
  ('d-wisdom', 'definition', 35, 'Wisdom');

-- =====================================================================
-- Reactions on Considerations. One of each kind per member per entry.
-- Who reacted is private. Heart, wounded heart, gold star and thumbs up
-- are counted publicly; thumbs down and the trigger flag are counted
-- for admins only, so they guide review without inviting pile-ons.
-- =====================================================================
create table public.reactions (
  consideration bigint not null references public.considerations(id) on delete cascade,
  member uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  kind text not null check (kind in ('heart', 'wounded', 'star', 'up', 'down', 'trigger')),
  created_at timestamptz not null default now(),
  primary key (consideration, member, kind)
);
create index on public.reactions (consideration, kind);

alter table public.reactions enable row level security;
create policy "see own reactions" on public.reactions for select
  using (member = auth.uid());
create policy "react to published" on public.reactions for insert to authenticated
  with check (
    member = auth.uid()
    and exists (select 1 from public.considerations c where c.id = consideration and c.status = 'published')
  );
create policy "take back own reaction" on public.reactions for delete
  using (member = auth.uid());

-- Counts for a batch of entries. Admins also get thumbs down and trigger.
create function public.reaction_counts(ids bigint[])
returns table (consideration bigint, kind text, total bigint)
language sql stable security definer set search_path = '' as $$
  select r.consideration, r.kind, count(*)
  from public.reactions r
  where r.consideration = any(ids)
    and (r.kind in ('heart', 'wounded', 'star', 'up') or public.is_admin())
  group by r.consideration, r.kind;
$$;

-- Order of entries in one part of a book: the 10 newest first, then the
-- rest by most positive response (heart + wounded heart + gold star +
-- thumbs up), newest first among equals. Returns one page of ids. Takes a
-- list of books so several (the nine Tenets, for now) can be read as one.
create function public.feed_ids(book_slugs text[], part_name text, skip int, take int)
returns table (id bigint)
language sql stable security definer set search_path = '' as $$
  with entries as (
    select c.id, c.reviewed_at
    from public.considerations c
    where c.status = 'published'
      and c.part::text = part_name
      and (c.book = any(book_slugs)
           or c.id in (select cb.consideration from public.consideration_books cb where cb.book = any(book_slugs)))
  ),
  ranked as (
    select e.id, e.reviewed_at,
      row_number() over (order by e.reviewed_at desc, e.id desc) as recency,
      (select count(*) from public.reactions r
        where r.consideration = e.id and r.kind in ('heart', 'wounded', 'star', 'up')) as positive
    from entries e
  )
  select ranked.id from ranked
  order by (recency > 10), case when recency <= 10 then recency end,
           positive desc, reviewed_at desc, ranked.id desc
  offset greatest(skip, 0) limit least(greatest(take, 1), 100);
$$;

-- =====================================================================
-- Suggestions and reports from members: new glossary items, and issues
-- (feedback, bug, typo, discrepancy). Admins read and resolve them.
-- =====================================================================
create table public.submissions (
  id bigint generated always as identity primary key,
  author uuid default auth.uid() references public.profiles(id) on delete set null,
  kind text not null check (kind in ('glossary_item', 'issue')),
  issue_type text check (issue_type in ('feedback', 'bug', 'typo', 'discrepancy')),
  page text check (char_length(page) <= 500),
  title text not null check (char_length(title) between 1 and 200),
  body text not null check (char_length(body) between 1 and 20000),
  section text check (char_length(section) <= 200),
  sources text check (char_length(sources) <= 10000),
  resolved_at timestamptz,
  resolved_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  check (kind <> 'issue' or issue_type is not null)
);
alter table public.submissions enable row level security;
create policy "members submit" on public.submissions for insert to authenticated
  with check (author = auth.uid() and resolved_at is null);
create policy "see own or admin" on public.submissions for select
  using (author = auth.uid() or public.is_admin());
create policy "admins resolve" on public.submissions for update
  using (public.is_admin());

-- Glossary entries as Hear My Voice index items. Generated by scripts/import_glossary.py.
-- Run after schema.sql. Safe to re-run: existing entries are updated.
insert into public.index_items (slug, kind, ordinal, label) values
  ('g-1', 'glossary', 1, '1. Learned helplessness'),
  ('g-2', 'glossary', 2, '2. Self-silencing'),
  ('g-3', 'glossary', 3, '3. Effort justification'),
  ('g-4', 'glossary', 4, '4. Sunk cost'),
  ('g-5', 'glossary', 5, '5. Moral licensing'),
  ('g-6', 'glossary', 6, '6. Just-world thinking'),
  ('g-7', 'glossary', 7, '7. Calling oneself finished'),
  ('g-8', 'glossary', 8, '8. DARVO'),
  ('g-9', 'glossary', 9, '9. Betrayal blindness'),
  ('g-10', 'glossary', 10, '10. Intermittent reinforcement'),
  ('g-11', 'glossary', 11, '11. Gaslighting'),
  ('g-12', 'glossary', 12, '12. Foot in the door'),
  ('g-13', 'glossary', 13, '13. The extracted apology'),
  ('g-14', 'glossary', 14, '14. Scapegoating'),
  ('g-15', 'glossary', 15, '15. Required confession'),
  ('g-16', 'glossary', 16, '16. Pluralistic ignorance'),
  ('g-17', 'glossary', 17, '17. Diffusion of responsibility'),
  ('g-18', 'glossary', 18, '18. Co-rumination'),
  ('g-19', 'glossary', 19, '19. Identity fusion'),
  ('g-20', 'glossary', 20, '20. Trashing'),
  ('g-21', 'glossary', 21, '21. The no structure tyranny'),
  ('g-22', 'glossary', 22, '22. Purity spiral'),
  ('g-23', 'glossary', 23, '23. Snitch-jacketing'),
  ('g-24', 'glossary', 24, '24. Manufactured consensus'),
  ('g-25', 'glossary', 25, '25. The litmus test'),
  ('g-26', 'glossary', 26, '26. Milieu control'),
  ('g-27', 'glossary', 27, '27. Loading the language'),
  ('g-28', 'glossary', 28, '28. Sacred science'),
  ('g-29', 'glossary', 29, '29. Mystical manipulation'),
  ('g-30', 'glossary', 30, '30. Doctrine over person'),
  ('g-31', 'glossary', 31, '31. Purity pledge'),
  ('g-32', 'glossary', 32, '32. Deciding who counts'),
  ('g-33', 'glossary', 33, '33. The inner teaching'),
  ('g-34', 'glossary', 34, '34. The bottleneck co-opt'),
  ('g-35', 'glossary', 35, '35. Commentary swallowing text'),
  ('g-36', 'glossary', 36, '36. Thought policing'),
  ('g-37', 'glossary', 37, '37. The permanent advisor'),
  ('g-38', 'glossary', 38, '38. Spokesperson capture'),
  ('g-39', 'glossary', 39, '39. Shunning'),
  ('g-40', 'glossary', 40, '40. The total institution'),
  ('g-41', 'glossary', 41, '41. Normalization of deviance'),
  ('g-42', 'glossary', 42, '42. Institutional betrayal'),
  ('g-43', 'glossary', 43, '43. Institutional DARVO'),
  ('g-44', 'glossary', 44, '44. Shared betrayal blindness'),
  ('g-45', 'glossary', 45, '45. Exit cost'),
  ('g-46', 'glossary', 46, '46. Conditionality'),
  ('g-47', 'glossary', 47, '47. Simony'),
  ('g-48', 'glossary', 48, '48. Fusion of powers'),
  ('g-49', 'glossary', 49, '49. Co-optation'),
  ('g-50', 'glossary', 50, '50. State of exception'),
  ('g-51', 'glossary', 51, '51. Stratification'),
  ('g-52', 'glossary', 52, '52. The ledger'),
  ('g-53', 'glossary', 53, '53. No door to knock on'),
  ('g-54', 'glossary', 54, '54. Organizational silence'),
  ('g-55', 'glossary', 55, '55. Urgency'),
  ('g-56', 'glossary', 56, '56. Attrition'),
  ('g-57', 'glossary', 57, '57. Funder capture'),
  ('g-58', 'glossary', 58, '58. Securitization'),
  ('g-59', 'glossary', 59, '59. Entryism'),
  ('g-60', 'glossary', 60, '60. The permanent campaign'),
  ('g-61', 'glossary', 61, '61. The Kafka trap'),
  ('g-62', 'glossary', 62, '62. Motte and bailey'),
  ('g-63', 'glossary', 63, '63. Bulverism'),
  ('g-64', 'glossary', 64, '64. Thought-terminating cliché'),
  ('g-65', 'glossary', 65, '65. Straw man'),
  ('g-66', 'glossary', 66, '66. No true Scotsman'),
  ('g-67', 'glossary', 67, '67. Isolated demand for rigor'),
  ('g-68', 'glossary', 68, '68. Sealioning'),
  ('g-69', 'glossary', 69, '69. Just asking questions'),
  ('g-70', 'glossary', 70, '70. Gish gallop'),
  ('g-71', 'glossary', 71, '71. Concern trolling'),
  ('g-72', 'glossary', 72, '72. Loaded question'),
  ('g-73', 'glossary', 73, '73. Nirvana fallacy'),
  ('g-74', 'glossary', 74, '74. Moving the goalposts'),
  ('g-75', 'glossary', 75, '75. False dilemma'),
  ('g-76', 'glossary', 76, '76. Special pleading'),
  ('g-77', 'glossary', 77, '77. Poisoning the well'),
  ('g-78', 'glossary', 78, '78. Ad hominem'),
  ('g-79', 'glossary', 79, '79. Genetic fallacy'),
  ('g-80', 'glossary', 80, '80. Whataboutism'),
  ('g-81', 'glossary', 81, '81. Appeal to nature'),
  ('g-82', 'glossary', 82, '82. Name calling'),
  ('g-83', 'glossary', 83, '83. Glittering generality'),
  ('g-84', 'glossary', 84, '84. Transfer'),
  ('g-85', 'glossary', 85, '85. Trick Testimonial'),
  ('g-86', 'glossary', 86, '86. Plain folks'),
  ('g-87', 'glossary', 87, '87. Card stacking'),
  ('g-88', 'glossary', 88, '88. Euphemism'),
  ('g-89', 'glossary', 89, '89. Bandwagon'),
  ('g-90', 'glossary', 90, '90. Firehose of falsehood'),
  ('g-91', 'glossary', 91, '91. Flooding the zone'),
  ('g-92', 'glossary', 92, '92. Astroturfing'),
  ('g-93', 'glossary', 93, '93. Dog whistle'),
  ('g-94', 'glossary', 94, '94. The big lie'),
  ('g-95', 'glossary', 95, '95. Overton window'),
  ('g-96', 'glossary', 96, '96. Illusory truth effect')
on conflict (slug) do update set label = excluded.label, ordinal = excluded.ordinal;

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
