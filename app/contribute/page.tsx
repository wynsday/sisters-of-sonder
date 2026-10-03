import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isConfigured } from "@/lib/supabase/env";
import { requireUser } from "@/lib/auth";
import type { Book } from "@/lib/books";
import { offerConsideration } from "./actions";

export const metadata: Metadata = { title: "Offer a Consideration" };
// Personal to whoever is signed in; never cached.
export const dynamic = "force-dynamic";

export default async function ContributePage({ searchParams }: PageProps<"/contribute">) {
  if (!isConfigured) redirect("/join");
  const sp = await searchParams;
  const { supabase } = await requireUser("/contribute");
  const { data } = await supabase.from("books").select("*").order("ordinal");
  const shelfOrder = { aspiration: 0, tenet: 1, quilt: 2 };
  const books = ((data ?? []) as Book[]).sort((a, b) => shelfOrder[a.kind] - shelfOrder[b.kind]);
  const chosen = String(sp.book ?? "");
  const error = sp.error ? String(sp.error) : null;

  return (
    <>
      <div className="page-hero">
        <div className="wrap">
          <h1>Offer a Consideration</h1>
          <p>Each Consideration is reviewed before it is placed in its book.</p>
        </div>
      </div>

      <section className="alt">
        <div className="wrap read">
          <h2>What makes a Consideration</h2>
          <div className="cards cards-2">
            <div className="card"><div className="num">1</div><h3>A shared concept</h3><p>Name the idea in plain words. What do these stories understand?</p></div>
            <div className="card"><div className="num">2</div><h3>More than one culture</h3><p>Show the concept in at least two traditions that arrived at it separately.</p></div>
            <div className="card"><div className="num">3</div><h3>Sources</h3><p>Say where each story comes from so others can read it for themselves.</p></div>
            <div className="card"><div className="num">4</div><h3>Connection</h3><p>Which Aspiration or Tenet does it speak to? If none, it belongs in the Quilt.</p></div>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap read">
          {error && <p className="error">{error}</p>}
          <form action={offerConsideration}>
            <div className="field">
              <label htmlFor="title">Title</label>
              <input id="title" name="title" type="text" maxLength={200} required placeholder="e.g. The flood that renews" />
            </div>
            <div className="field">
              <label htmlFor="concept">The underlying concept</label>
              <textarea id="concept" name="concept" maxLength={10000} required placeholder="In plain words, what do these stories understand?" />
            </div>
            <div className="field">
              <label htmlFor="stories">The stories and where they come from</label>
              <textarea id="stories" name="stories" maxLength={50000} required style={{ minHeight: 240 }} placeholder="At least two cultures or traditions, with sources." />
              <div className="hint">Name each tradition and where to read the story: a book, a verse, a collection, a link.</div>
            </div>
            <div className="field">
              <label htmlFor="suggested_book">Which book do you think it belongs in?</label>
              <select id="suggested_book" name="suggested_book" defaultValue={chosen || "quilt"}>
                {books.map((b) => (
                  <option key={b.slug} value={b.slug}>
                    {b.title}
                  </option>
                ))}
              </select>
              <div className="hint">
                The final placement is made on review, including whether it belongs with the
                Glimmers or the Triggers.
              </div>
            </div>
            <button className="btn btn-moss" type="submit">
              Offer for review
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
