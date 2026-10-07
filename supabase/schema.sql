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
