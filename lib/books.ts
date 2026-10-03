export type Book = {
  slug: string;
  kind: "foundation" | "aspiration" | "tenet" | "quilt";
  ordinal: number;
  subject: string;
  title: string;
  canon: string | null;
};

export type ConsiderationForm = "premise" | "parable" | "stories";

export const FORMS: { value: ConsiderationForm; label: string; describe: string }[] = [
  { value: "premise", label: "A premise", describe: "A premise with an affirmation, a condemnation, or both." },
  { value: "parable", label: "A parable", describe: "A parable." },
  {
    value: "stories",
    label: "Stories from different cultures",
    describe: "Two or more stories from different cultures that share a pertinent opinion.",
  },
];

export type Consideration = {
  id: number;
  title: string;
  form: ConsiderationForm;
  concept: string;
  stories: string;
  part: "neutral" | "glimmer" | "trigger" | null;
  book: string | null;
  status: "pending" | "published" | "declined";
  created_at: string;
  profiles?: { display_name: string } | null;
  consideration_indicators?: { indicators: { slug: string; label: string } | null }[];
};

export const CONSIDERATION_FIELDS =
  "id, title, form, concept, stories, part, book, status, created_at, profiles!considerations_author_fkey(display_name), consideration_indicators(indicators(slug, label))";

export function indicatorLabels(c: Consideration) {
  return (c.consideration_indicators ?? [])
    .map((ci) => ci.indicators?.label)
    .filter((l): l is string => Boolean(l));
}

/** Where a book's Aspiration, Tenet, or Understanding is written on the site. */
export function sourceHref(book: Book) {
  if (book.kind === "aspiration") {
    return `/#${book.slug === "less-suffering" ? "suffering" : book.slug}`;
  }
  if (book.kind === "tenet") return `/tenets#${book.slug}`;
  if (book.kind === "foundation") return "/foundation#foundation";
  return null;
}
