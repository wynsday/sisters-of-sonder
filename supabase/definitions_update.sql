-- Sync with the Sacred Aspirations document of October 6, 2026.
-- Adds Glimmer and Trigger as story tags and keeps the Definitions in the
-- document's order; updates the Eighth Tenet's book line. Safe to re-run.
insert into public.index_items (slug, kind, ordinal, label) values
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
  ('d-wisdom', 'definition', 35, 'Wisdom')
on conflict (slug) do update set ordinal = excluded.ordinal, label = excluded.label;

update public.books
set canon = 'Myth is a language for thinking, not an explanation. Education is the best preventative of social harm.'
where slug = 'education';
