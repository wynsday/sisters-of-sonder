import type { Metadata } from "next";
import Link from "next/link";
import { createPublicClient } from "@/lib/supabase/server";
import { isConfigured } from "@/lib/supabase/env";
import StoryEntry from "@/components/StoryEntry";
import { type IndexItem, type Story, STORY_FIELDS, groupIndex } from "@/lib/stories";

export const metadata: Metadata = {
  title: "Hear My Voice",
  description:
    "Anonymous stories of harm that could have been prevented, and of the suffering that could have been eased.",
};

const PAGE_SIZE = 30;

async function load(about: string | null, page: number) {
  const supabase = createPublicClient();
  const { data: items } = await supabase.from("index_items").select("*").order("ordinal");

  let ids: number[] | null = null;
  if (about) {
    const { data } = await supabase.from("story_index").select("story").eq("item", about);
    ids = (data ?? []).map((r) => r.story);
  }

  let query = supabase
    .from("stories")
    .select(STORY_FIELDS, { count: "exact" })
    .eq("status", "published")
    .order("reviewed_at", { ascending: false })
    .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);
  if (ids) query = query.in("id", ids.length ? ids : [-1]);
  const { data, count } = await query;

  return {
    items: (items ?? []) as IndexItem[],
    stories: (data ?? []) as unknown as Story[],
    total: count ?? 0,
  };
}

export default async function HearMyVoicePage({ searchParams }: PageProps<"/hear-my-voice">) {
  const sp = await searchParams;
  const about = sp.about ? String(sp.about) : null;
  const page = Math.max(0, Number(sp.page ?? 0) || 0);
  const data = isConfigured ? await load(about, page) : null;
  const current = data?.items.find((i) => i.slug === about);

  return (
    <>
      <div className="page-hero">
        <div className="wrap">
          <h1>Hear My Voice</h1>
          <p>Stories shared so they are heard.</p>
        </div>
      </div>

      <section>
        <div className="wrap read">
          <p>
            Some harm never needed to happen. Some suffering could have been prevented, or
            eased, if the people nearby had held to a Tenet, lived an Aspiration, or refused what
            a Condemnation names.
          </p>
          <p>
            We ask for those stories. Tell what happened, and what would have been different if
            someone near you had known and followed what you choose to speak to. These stories
            show plainly why the Aspirations and Tenets matter, and how they protect. They are
            heard here, not judged.
          </p>
          <div className="notice">
            <strong>These stories are public, for the world to read.</strong> The names of those
            who share them are never shown, and stories name no people. Each is read before
            it appears, and stories that may be hard to read stay folded closed, marked with
            what they contain.
          </div>
          <p style={{ marginTop: 24 }}>
            <Link className="btn btn-moss" href="/hear-my-voice/share">
              Share your story
            </Link>
          </p>
        </div>
      </section>

      <section className="alt">
        <div className="wrap read">
          {!data ? (
            <p className="notice">Stories will appear here once the database is connected.</p>
          ) : (
            <>
              <details className="index-picker" open={!!about}>
                <summary>
                  {current ? (
                    <>Stories that speak to <strong>{current.label}</strong></>
                  ) : (
                    "Find stories by what they speak to"
                  )}
                </summary>
                {groupIndex(data.items).map((g) => (
                  <div key={g.kind} className="index-group">
                    <h4>{g.label}</h4>
                    {g.items.map((i) => (
                      <Link
                        key={i.slug}
                        className={`tag${i.slug === about ? " on" : ""}`}
                        href={`/hear-my-voice?about=${i.slug}`}
                      >
                        {i.label}
                      </Link>
                    ))}
                  </div>
                ))}
                {about && (
                  <p>
                    <Link href="/hear-my-voice">Show all stories</Link>
                  </p>
                )}
              </details>

              {data.stories.length === 0 ? (
                <p className="empty">No stories here yet.</p>
              ) : (
                data.stories.map((s) => <StoryEntry key={s.id} s={s} />)
              )}

              {(page > 0 || (page + 1) * PAGE_SIZE < data.total) && (
                <p className="actions">
                  {page > 0 && (
                    <Link href={`/hear-my-voice?${new URLSearchParams({ ...(about ? { about } : {}), page: String(page - 1) })}`}>
                      &larr; Newer
                    </Link>
                  )}
                  {(page + 1) * PAGE_SIZE < data.total && (
                    <Link href={`/hear-my-voice?${new URLSearchParams({ ...(about ? { about } : {}), page: String(page + 1) })}`}>
                      Older &rarr;
                    </Link>
                  )}
                </p>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
