export type Book = {
  slug: string;
  kind: "aspiration" | "tenet" | "quilt";
  ordinal: number;
  subject: string;
  title: string;
  canon: string | null;
};

export type Consideration = {
  id: number;
  title: string;
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
  "id, title, concept, stories, part, book, status, created_at, profiles!considerations_author_fkey(display_name), consideration_indicators(indicators(slug, label))";

export function indicatorLabels(c: Consideration) {
  return (c.consideration_indicators ?? [])
    .map((ci) => ci.indicators?.label)
    .filter((l): l is string => Boolean(l));
}
