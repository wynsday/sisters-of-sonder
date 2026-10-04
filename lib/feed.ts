import { type Consideration, CONSIDERATION_FIELDS } from "./books";
import { createPublicClient } from "./supabase/server";

export const PAGE_SIZE = 20;
export type Part = "neutral" | "glimmer" | "trigger";

/** One page of published Considerations in one part of a book (including
 *  cross-listings): the 10 newest first, then by most positive response
 *  (heart, wounded heart, gold star, thumbs up).
 *  The order itself is decided in the database (feed_ids). */
export async function fetchPart(book: string, part: Part, offset: number, limit = PAGE_SIZE) {
  const supabase = createPublicClient();
  // Ask for one extra id to learn whether more remain.
  const { data: ids } = await supabase.rpc("feed_ids", {
    book_slug: book,
    part_name: part,
    skip: offset,
    take: limit + 1,
  });
  const order = ((ids ?? []) as { id: number }[]).map((r) => r.id);
  const page = order.slice(0, limit);
  if (!page.length) return { entries: [] as Consideration[], hasMore: false };

  const { data } = await supabase.from("considerations").select(CONSIDERATION_FIELDS).in("id", page);
  const byId = new Map(((data ?? []) as unknown as Consideration[]).map((c) => [c.id, c]));
  const entries = page.map((id) => byId.get(id)).filter((c): c is Consideration => Boolean(c));
  return { entries, hasMore: order.length > limit };
}

/** First page of each part of a book, or null before the database is connected. */
export async function loadParts(book: string) {
  const { isConfigured } = await import("./supabase/env");
  if (!isConfigured) return null;
  const [neutral, glimmer, trigger] = await Promise.all(
    (["neutral", "glimmer", "trigger"] as const).map((part) => fetchPart(book, part, 0)),
  );
  return { neutral, glimmer, trigger };
}

export type BookPartsData = NonNullable<Awaited<ReturnType<typeof loadParts>>>;
