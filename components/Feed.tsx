"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Consideration } from "@/lib/books";
import type { Part } from "@/lib/feed";
import type { ReactionKind } from "@/lib/reactions";
import { getReactions, loadMore, toggleReaction, type ReactionState } from "@/app/books/actions";
import ConsiderationEntry from "./ConsiderationEntry";
import ReactionBar from "./ReactionBar";

type Props = {
  book?: string;
  part?: Part;
  initial: Consideration[];
  initialHasMore?: boolean;
};

/** A list of Considerations with reactions; loads more as the reader scrolls. */
export default function Feed({ book, part, initial, initialHasMore = false }: Props) {
  const [entries, setEntries] = useState(initial);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [reactions, setReactions] = useState<ReactionState>({ signedIn: false, counts: {}, mine: {} });
  const fetched = useRef(new Set<number>());
  const sentinel = useRef<HTMLDivElement>(null);

  // Fetch reaction counts for any entries we haven't asked about yet.
  useEffect(() => {
    const ids = entries.map((e) => e.id).filter((id) => !fetched.current.has(id));
    if (!ids.length) return;
    ids.forEach((id) => fetched.current.add(id));
    getReactions(ids).then((r) =>
      setReactions((prev) => ({
        signedIn: r.signedIn,
        counts: { ...prev.counts, ...r.counts },
        mine: { ...prev.mine, ...r.mine },
      })),
    );
  }, [entries]);

  const more = useCallback(async () => {
    if (!book || !part || loading || !hasMore) return;
    setLoading(true);
    const next = await loadMore(book, part, entries.length);
    setEntries((prev) => [...prev, ...next.entries.filter((e) => !prev.some((p) => p.id === e.id))]);
    setHasMore(next.hasMore);
    setLoading(false);
  }, [book, part, loading, hasMore, entries.length]);

  // Load the next page when the bottom of the list comes into view.
  useEffect(() => {
    const el = sentinel.current;
    if (!el || !hasMore) return;
    const observer = new IntersectionObserver((seen) => seen[0].isIntersecting && more(), {
      rootMargin: "400px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [more, hasMore]);

  async function toggle(id: number, kind: ReactionKind, on: boolean) {
    // Show the change at once; undo it if the server refuses.
    const apply = (state: ReactionState, give: boolean): ReactionState => {
      const mine = state.mine[id] ?? [];
      const counts = { ...(state.counts[id] ?? {}) };
      if (counts[kind] !== undefined || give) counts[kind] = Math.max(0, (counts[kind] ?? 0) + (give ? 1 : -1));
      return {
        ...state,
        mine: { ...state.mine, [id]: give ? [...mine, kind] : mine.filter((k) => k !== kind) },
        counts: { ...state.counts, [id]: counts },
      };
    };
    setReactions((s) => apply(s, on));
    const result = await toggleReaction(id, kind, on);
    if (!result.ok) setReactions((s) => apply(s, !on));
  }

  if (!entries.length) return <p className="empty">Nothing here yet.</p>;

  return (
    <>
      {entries.map((c) => (
        <ConsiderationEntry key={c.id} c={c}>
          <ReactionBar
            counts={reactions.counts[c.id] ?? {}}
            mine={reactions.mine[c.id] ?? []}
            signedIn={reactions.signedIn}
            onToggle={(kind, on) => toggle(c.id, kind, on)}
          />
        </ConsiderationEntry>
      ))}
      {hasMore && (
        <div ref={sentinel} className="feed-more">
          {loading ? "Loading more…" : <button type="button" className="btn btn-small" onClick={more}>Load more</button>}
        </div>
      )}
    </>
  );
}
