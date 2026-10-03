import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isConfigured } from "@/lib/supabase/env";
import { requireAdmin } from "@/lib/auth";
import type { Book } from "@/lib/books";
import { review, unpublish } from "./actions";

export const metadata: Metadata = { title: "Admin" };
// Personal to whoever is signed in; never cached.
export const dynamic = "force-dynamic";

type Pending = {
  id: number;
  title: string;
  concept: string;
  stories: string;
  suggested_book: string | null;
  created_at: string;
  profiles: { display_name: string } | null;
};

export default async function AdminPage({ searchParams }: PageProps<"/admin">) {
  if (!isConfigured) redirect("/join");
  const { supabase } = await requireAdmin("/admin");
  const error = (await searchParams).error;

  const [{ data: pending }, { data: books }, { data: indicators }, { data: recent }] =
    await Promise.all([
      supabase
        .from("considerations")
        .select("id, title, concept, stories, suggested_book, created_at, profiles!considerations_author_fkey(display_name)")
        .eq("status", "pending")
        .order("created_at"),
      supabase.from("books").select("*").order("kind").order("ordinal"),
      supabase.from("indicators").select("slug, label").order("label"),
      supabase
        .from("considerations")
        .select("id, title, book, part, reviewed_at")
        .eq("status", "published")
        .order("reviewed_at", { ascending: false })
        .limit(20),
    ]);
  const shelf = (books ?? []) as Book[];
  const queue = (pending ?? []) as unknown as Pending[];

  return (
    <>
      <div className="page-hero">
        <div className="wrap">
          <h1>Keepers&rsquo; Desk</h1>
          <p>For admins of the House of Nisaba and the Oracle of the Hallowed Tree</p>
        </div>
      </div>
      <section>
        <div className="wrap read">
          <div className="subnav">
            <Link className="btn btn-moss btn-small" href="/admin/stories">
              Hear My Voice stories
            </Link>
            <Link className="btn btn-moss btn-small" href="/admin/indicators">
              Trigger indicators
            </Link>
          </div>
          {error && <p className="error">{String(error)}</p>}

          <h2>Awaiting review ({queue.length})</h2>
          {queue.length === 0 && <p className="empty">Nothing is waiting.</p>}
          {queue.map((c) => (
            <form key={c.id} action={review} className="review">
              <input type="hidden" name="id" value={c.id} />
              <h3>{c.title}</h3>
              <div className="meta hint">
                Offered by {c.profiles?.display_name ?? "a member"} on{" "}
                {new Date(c.created_at).toLocaleDateString()}
              </div>
              <h4>Concept</h4>
              <p className="body">{c.concept}</p>
              <h4>Stories</h4>
              <p className="body">{c.stories}</p>

              <div className="row">
                <div className="field">
                  <label htmlFor={`book-${c.id}`}>Book</label>
                  <select id={`book-${c.id}`} name="book" defaultValue={c.suggested_book ?? "quilt"}>
                    {shelf.map((b) => (
                      <option key={b.slug} value={b.slug}>
                        {b.title}
                      </option>
                    ))}
                  </select>
                  <div className="hint">The member suggested this one.</div>
                </div>
                <div className="field">
                  <label>Part</label>
                  <div className="checks">
                    <label><input type="radio" name="part" value="neutral" defaultChecked /> Unlabeled</label>
                    <label><input type="radio" name="part" value="glimmer" /> Glimmer</label>
                    <label><input type="radio" name="part" value="trigger" /> Trigger</label>
                  </div>
                </div>
              </div>

              <div className="field">
                <label>Trigger indicators (for Triggers only)</label>
                <div className="checks">
                  {(indicators ?? []).map((i) => (
                    <label key={i.slug}>
                      <input type="checkbox" name="indicators" value={i.slug} /> {i.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="field">
                <label>Also list it in</label>
                <div className="checks">
                  {shelf.map((b) => (
                    <label key={b.slug}>
                      <input type="checkbox" name="cross" value={b.slug} /> {b.subject}
                    </label>
                  ))}
                </div>
              </div>

              <div className="field">
                <label htmlFor={`note-${c.id}`}>Note to the member (optional)</label>
                <input id={`note-${c.id}`} name="note" type="text" />
              </div>

              <div className="actions">
                <button className="btn btn-moss btn-small" name="decision" value="publish">
                  Place in the book
                </button>
                <button className="btn btn-rose btn-small" name="decision" value="decline" formNoValidate>
                  Decline
                </button>
              </div>
            </form>
          ))}

          <h2 style={{ marginTop: 56 }}>Recently placed</h2>
          {!recent?.length ? (
            <p className="empty">Nothing yet.</p>
          ) : (
            <table className="list">
              <tbody>
                {recent.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <Link href={`/c/${c.id}`}>{c.title}</Link>
                      <div className="hint">
                        {shelf.find((b) => b.slug === c.book)?.subject} &middot; {c.part}
                      </div>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <form action={unpublish}>
                        <input type="hidden" name="id" value={c.id} />
                        <button className="btn btn-small" style={{ border: "1px solid var(--line)" }}>
                          Return to review
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </>
  );
}
