import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isConfigured } from "@/lib/supabase/env";
import { getRoles } from "@/lib/auth";
import { signOut } from "../join/actions";
import { setNotify, withdrawStory } from "./actions";

export const metadata: Metadata = { title: "Your account" };
// Personal to whoever is signed in; never cached.
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  if (!isConfigured) redirect("/join");
  const { supabase, user, isAdmin, chairs } = await getRoles();
  if (!user) redirect("/join?mode=signin&next=/account");

  const [{ data: profile }, { data: mine }, { data: stories }] = await Promise.all([
    supabase.from("profiles").select("display_name, notify_changes").eq("id", user.id).single(),
    supabase
      .from("considerations")
      .select("id, title, status, book, created_at, review_note")
      .eq("author", user.id)
      .order("created_at", { ascending: false }),
    supabase.rpc("my_stories"),
  ]);
  const myStories = (stories ?? []) as {
    id: number;
    happened: string;
    status: string;
    review_note: string | null;
    created_at: string;
  }[];

  return (
    <>
      <div className="page-hero">
        <div className="wrap">
          <h1>Welcome, {profile?.display_name ?? "member"}</h1>
        </div>
      </div>
      <section>
        <div className="wrap read">
          <div className="subnav">
            <Link className="btn btn-small members" href="/books#offer">
              Submit a Consideration
            </Link>
            <Link className="btn btn-small members" href="/hear-my-voice/share">
              Share your story
            </Link>
            {isAdmin && (
              <Link className="btn btn-gold btn-small" href="/admin">
                Keepers&rsquo; Desk
              </Link>
            )}
            {chairs.map((c) => (
              <Link key={c.house} className="btn btn-gold btn-small" href={`/chair/${c.house}`}>
                Chair of {c.name}: appointments
              </Link>
            ))}
            <form action={signOut}>
              <button className="btn btn-ghost btn-small" style={{ color: "var(--ink-soft)", borderColor: "var(--line)" }}>
                Sign out
              </button>
            </form>
          </div>

          <form action={setNotify} className="notice" style={{ marginBottom: 32 }}>
            <label className="check">
              <input type="checkbox" name="notify" defaultChecked={profile?.notify_changes ?? false} /> If the
              wording changes significantly or a new item is added, the Sisters have my permission
              to let me know.
            </label>
            <button className="btn btn-moss btn-small" style={{ marginTop: 8 }}>Save</button>
          </form>

          <h2>What you have offered</h2>
          {!mine?.length ? (
            <p className="empty">Nothing yet.</p>
          ) : (
            <table className="list">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Offered</th>
                </tr>
              </thead>
              <tbody>
                {mine.map((c) => (
                  <tr key={c.id}>
                    <td>
                      {c.status === "published" ? <Link href={`/c/${c.id}`}>{c.title}</Link> : c.title}
                      {c.status === "declined" && c.review_note && (
                        <div className="hint">Note from review: {c.review_note}</div>
                      )}
                    </td>
                    <td>
                      <span className={`status ${c.status}`}>
                        {c.status === "pending" ? "awaiting review" : c.status}
                      </span>
                    </td>
                    <td>{new Date(c.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <h2 style={{ marginTop: 48 }}>Your stories</h2>
          <p className="hint">Only you can see this list. Your name is never shown with a story.</p>
          {!myStories.length ? (
            <p className="empty">Nothing yet.</p>
          ) : (
            <table className="list">
              <tbody>
                {myStories.map((s) => (
                  <tr key={s.id}>
                    <td>
                      {s.happened.length > 140 ? `${s.happened.slice(0, 140)}…` : s.happened}
                      {s.review_note && <div className="hint">Note from review: {s.review_note}</div>}
                    </td>
                    <td>
                      <span className={`status ${s.status}`}>
                        {s.status === "pending" ? "awaiting review" : s.status}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <form action={withdrawStory}>
                        <input type="hidden" name="id" value={s.id} />
                        <button className="btn btn-small" style={{ border: "1px solid var(--line)" }}>
                          Withdraw
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
