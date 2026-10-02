import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isConfigured } from "@/lib/supabase/env";
import { getRoles } from "@/lib/auth";
import { signOut } from "../join/actions";

export const metadata: Metadata = { title: "Your account" };
// Personal to whoever is signed in; never cached.
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  if (!isConfigured) redirect("/join");
  const { supabase, user, isAdmin, chairs } = await getRoles();
  if (!user) redirect("/join?mode=signin&next=/account");

  const [{ data: profile }, { data: mine }] = await Promise.all([
    supabase.from("profiles").select("display_name").eq("id", user.id).single(),
    supabase
      .from("considerations")
      .select("id, title, status, book, created_at, review_note")
      .eq("author", user.id)
      .order("created_at", { ascending: false }),
  ]);

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
            <Link className="btn btn-moss btn-small" href="/contribute">
              Offer a Consideration
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
                        <div className="hint">Note from the House: {c.review_note}</div>
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
        </div>
      </section>
    </>
  );
}
