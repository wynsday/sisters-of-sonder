import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isConfigured } from "@/lib/supabase/env";
import { requireAdmin } from "@/lib/auth";
import { type IndexItem, groupIndex } from "@/lib/stories";
import { reviewStory } from "../actions";

export const metadata: Metadata = { title: "Stories to review" };
// Personal to whoever is signed in; never cached.
export const dynamic = "force-dynamic";

type PendingStory = {
  id: number;
  happened: string;
  could_help: string;
  created_at: string;
  story_index: { item: string }[];
};

export default async function StoriesReviewPage({ searchParams }: PageProps<"/admin/stories">) {
  if (!isConfigured) redirect("/join");
  const { supabase } = await requireAdmin("/admin/stories");
  const error = (await searchParams).error;

  const [{ data: pending }, { data: items }, { data: indicators }] = await Promise.all([
    supabase
      .from("stories")
      .select("id, happened, could_help, created_at, story_index(item)")
      .eq("status", "pending")
      .order("created_at"),
    supabase.from("index_items").select("*").order("ordinal"),
    supabase.from("indicators").select("slug, label").order("label"),
  ]);
  const queue = (pending ?? []) as unknown as PendingStory[];
  const groups = groupIndex((items ?? []) as IndexItem[]);

  return (
    <section>
      <div className="wrap read">
        <p>
          <Link href="/admin">&larr; Keepers&rsquo; Desk</Link>
        </p>
        <h1>Hear My Voice: stories to review ({queue.length})</h1>
        <p className="hint">
          Authors are never shown here. Before publishing, check that no person is named or
          identifiable. Mark indicators so hard stories stay folded closed for readers.
        </p>
        {error && <p className="error">{String(error)}</p>}
        {queue.length === 0 && <p className="empty">Nothing is waiting.</p>}

        {queue.map((s) => {
          const tagged = new Set(s.story_index.map((x) => x.item));
          return (
            <form key={s.id} action={reviewStory} className="review">
              <input type="hidden" name="id" value={s.id} />
              <div className="hint">Shared {new Date(s.created_at).toLocaleDateString()}</div>
              <h4>What happened</h4>
              <p className="body">{s.happened}</p>
              <h4>What could have prevented it, or eased it</h4>
              <p className="body">{s.could_help}</p>

              <div className="field">
                <label>Speaks to (the member chose these; adjust if needed)</label>
                {groups.map((g) => (
                  <details key={g.kind} className="pick" open={g.items.some((i) => tagged.has(i.slug))}>
                    <summary>{g.label}</summary>
                    <div className="checks">
                      {g.items.map((i) => (
                        <label key={i.slug}>
                          <input type="checkbox" name="items" value={i.slug} defaultChecked={tagged.has(i.slug)} />{" "}
                          {i.label}
                        </label>
                      ))}
                    </div>
                  </details>
                ))}
              </div>

              <div className="field">
                <label>Indicators (leave empty if the story can be shown open)</label>
                <div className="checks">
                  {(indicators ?? []).map((i) => (
                    <label key={i.slug}>
                      <input type="checkbox" name="indicators" value={i.slug} /> {i.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="field">
                <label className="check">
                  <input type="checkbox" name="checked_names" /> I checked: no one is named or
                  identifiable.
                </label>
              </div>

              <div className="field">
                <label htmlFor={`note-${s.id}`}>Note to the member (optional; she sees it in her account)</label>
                <input id={`note-${s.id}`} name="note" type="text" />
              </div>

              <div className="actions">
                <button className="btn btn-moss btn-small" name="decision" value="publish">
                  Publish
                </button>
                <button className="btn btn-rose btn-small" name="decision" value="decline">
                  Decline
                </button>
              </div>
            </form>
          );
        })}
      </div>
    </section>
  );
}
