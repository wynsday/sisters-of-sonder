import Feed from "./Feed";
import NotConnected from "./NotConnected";
import type { BookPartsData } from "@/lib/feed";

/** A book's three parts: unlabeled, Glimmers, and Triggers. */
export default function BookParts({ slug, parts }: { slug: string; parts: BookPartsData | null }) {
  if (!parts) return <NotConnected />;
  return (
    <>
      <div className="book-part">
        <Feed book={slug} part="neutral" initial={parts.neutral.entries} initialHasMore={parts.neutral.hasMore} />
      </div>
      <div className="book-part">
        <h3>
          <span className="part-label glimmer">Glimmers</span>
        </h3>
        <Feed book={slug} part="glimmer" initial={parts.glimmer.entries} initialHasMore={parts.glimmer.hasMore} />
      </div>
      <div className="book-part">
        <h3>
          <span className="part-label trigger">Triggers</span>
        </h3>
        {parts.trigger.entries.length > 0 && (
          <p className="hint">
            Each of these is folded closed and marked with what it contains. You are free to pass.
          </p>
        )}
        <Feed book={slug} part="trigger" initial={parts.trigger.entries} initialHasMore={parts.trigger.hasMore} />
      </div>
    </>
  );
}
