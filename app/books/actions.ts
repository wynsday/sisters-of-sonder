"use server";

import { getSession } from "@/lib/auth";
import { fetchPart, type Part } from "@/lib/feed";
import { REACTIONS, type ReactionKind } from "@/lib/reactions";

const PARTS: Part[] = ["neutral", "glimmer", "trigger"];

export async function loadMore(book: string, part: Part, offset: number) {
  if (!PARTS.includes(part) || !/^[a-z-]+$/.test(book)) return { entries: [], hasMore: false };
  return fetchPart(book, part, Math.max(0, Math.floor(offset)));
}

export type ReactionState = {
  signedIn: boolean;
  counts: Record<number, Partial<Record<ReactionKind, number>>>;
  mine: Record<number, ReactionKind[]>;
};

/** Counts for a batch of entries, plus which ones the signed-in member gave. */
export async function getReactions(ids: number[]): Promise<ReactionState> {
  const clean = ids.filter((n) => Number.isInteger(n)).slice(0, 200);
  const { supabase, user } = await getSession();
  const state: ReactionState = { signedIn: Boolean(user), counts: {}, mine: {} };
  if (!clean.length) return state;

  const [{ data: counts }, { data: mine }] = await Promise.all([
    supabase.rpc("reaction_counts", { ids: clean }),
    user
      ? supabase.from("reactions").select("consideration, kind").in("consideration", clean)
      : Promise.resolve({ data: [] as { consideration: number; kind: ReactionKind }[] }),
  ]);
  for (const row of (counts ?? []) as { consideration: number; kind: ReactionKind; total: number }[]) {
    (state.counts[row.consideration] ??= {})[row.kind] = Number(row.total);
  }
  for (const row of (mine ?? []) as { consideration: number; kind: ReactionKind }[]) {
    (state.mine[row.consideration] ??= []).push(row.kind);
  }
  return state;
}

/** Give or take back one reaction. Members only. */
export async function toggleReaction(id: number, kind: ReactionKind, on: boolean) {
  if (!REACTIONS.some((r) => r.kind === kind)) return { ok: false };
  const { supabase, user } = await getSession();
  if (!user) return { ok: false, signIn: true };
  const { error } = on
    ? await supabase.from("reactions").insert({ consideration: id, kind })
    : await supabase.from("reactions").delete().match({ consideration: id, kind, member: user.id });
  return { ok: !error };
}
