import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isConfigured } from "@/lib/supabase/env";
import { requireAdmin } from "@/lib/auth";
import siteChanges from "@/lib/site-changes.json";
import { addChange, addTodo, deleteChange, deleteTodo, toggleTodo } from "../actions";

export const metadata: Metadata = { title: "Admin Dashboard" };
export const dynamic = "force-dynamic";

type Day = { day: string; visitors: number; views: number };
type Todo = { id: number; text: string; done_at: string | null; created_at: string };
type Change = { id: number; title: string; details: string | null; created_at: string };

const fmt = (d: string) =>
  new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

export default async function DashboardPage({ searchParams }: PageProps<"/admin/dashboard">) {
  if (!isConfigured) redirect("/join");
  const { supabase } = await requireAdmin("/admin/dashboard");
  const error = (await searchParams).error;

  const count = (table: string, filter: (q: any) => any) => // eslint-disable-line @typescript-eslint/no-explicit-any
    filter(supabase.from(table).select("id", { count: "exact", head: true })).then((r: { count: number | null }) => r.count ?? 0);

  const [pendingConsiderations, pendingStories, inbox, stats, pages, todos, changes] = await Promise.all([
    count("considerations", (q) => q.eq("status", "pending")),
    count("stories", (q) => q.eq("status", "pending")),
    count("submissions", (q) => q.is("resolved_at", null)),
    supabase.rpc("visit_stats", { days: 30 }),
    supabase.rpc("top_pages", { days: 30 }),
    supabase.from("admin_todos").select("id, text, done_at, created_at").order("done_at", { nullsFirst: true }).order("created_at", { ascending: false }),
    supabase.from("change_log").select("id, title, details, created_at").order("created_at", { ascending: false }).limit(30),
  ]);

  const days = (stats.data ?? []) as Day[];
  const sum = (n: number, key: "visitors" | "views") =>
    days.slice(0, n).reduce((t, d) => t + Number(d[key]), 0);
  const peak = Math.max(1, ...days.slice(0, 14).map((d) => Number(d.visitors)));

  return (
    <section>
      <div className="wrap read">
        <p>
          <Link href="/admin">&larr; Keepers&rsquo; Desk</Link>
        </p>
        <h1>Admin Dashboard</h1>
        {error && <p className="error">{String(error)}</p>}
        {stats.error && <p className="error">Analytics are not set up in the database yet.</p>}

        {/* ---------- To do ---------- */}
        <h2>To do</h2>
        <ul className="dash-auto">
          <li>
            <Link href="/admin">Considerations waiting for review</Link>
            <span className={`status ${pendingConsiderations ? "pending" : ""}`}>{pendingConsiderations}</span>
          </li>
          <li>
            <Link href="/admin/stories">Stories waiting for review</Link>
            <span className={`status ${pendingStories ? "pending" : ""}`}>{pendingStories}</span>
          </li>
          <li>
            <Link href="/admin/inbox">Glossary suggestions and issue reports</Link>
            <span className={`status ${inbox ? "pending" : ""}`}>{inbox}</span>
          </li>
        </ul>
        <table className="list">
          <tbody>
            {((todos.data ?? []) as Todo[]).map((t) => (
              <tr key={t.id} className={t.done_at ? "done" : ""}>
                <td style={{ width: 36 }}>
                  <form action={toggleTodo}>
                    <input type="hidden" name="id" value={t.id} />
                    <input type="hidden" name="done" value={t.done_at ? "" : "1"} />
                    <button className="todo-check" aria-label={t.done_at ? "Mark not done" : "Mark done"}>
                      {t.done_at ? "✓" : ""}
                    </button>
                  </form>
                </td>
                <td>{t.text}</td>
                <td style={{ textAlign: "right" }}>
                  <form action={deleteTodo}>
                    <input type="hidden" name="id" value={t.id} />
                    <button className="link-button" aria-label="Delete">×</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <form action={addTodo} className="inline-form">
          <input name="text" type="text" maxLength={500} placeholder="Add a to-do" required />
          <button className="btn btn-moss btn-small">Add</button>
        </form>

        {/* ---------- Analytics ---------- */}
        <h2 style={{ marginTop: 48 }}>Analytics</h2>
        <div className="cards cards-3">
          <div className="card">
            <div className="num">{days[0] ? Number(days[0].visitors) : 0}</div>
            <p>people today</p>
          </div>
          <div className="card">
            <div className="num">{sum(7, "visitors")}</div>
            <p>person-days, last 7 days</p>
          </div>
          <div className="card">
            <div className="num">{sum(30, "views")}</div>
            <p>pages opened, last 30 days</p>
          </div>
        </div>
        <p className="hint">
          Each person is counted once per day. Someone who visits on three days counts three times,
          because visits can&rsquo;t be linked from one day to the next.
        </p>
        <table className="list">
          <thead>
            <tr>
              <th>Day</th>
              <th>People</th>
              <th>Pages</th>
              <th style={{ width: "40%" }} />
            </tr>
          </thead>
          <tbody>
            {days.slice(0, 14).map((d) => (
              <tr key={d.day}>
                <td>{fmt(d.day)}</td>
                <td>{Number(d.visitors)}</td>
                <td>{Number(d.views)}</td>
                <td>
                  <div className="bar" style={{ width: `${(Number(d.visitors) / peak) * 100}%` }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <h3 style={{ marginTop: 24 }}>Most opened pages, last 30 days</h3>
        <table className="list">
          <tbody>
            {((pages.data ?? []) as { path: string; views: number }[]).map((p) => (
              <tr key={p.path}>
                <td>{p.path}</td>
                <td style={{ textAlign: "right" }}>{Number(p.views)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ---------- Change log ---------- */}
        <h2 style={{ marginTop: 48 }}>Change log</h2>
        <form action={addChange} className="review">
          <div className="field">
            <label htmlFor="title">What changed</label>
            <input id="title" name="title" type="text" maxLength={200} required />
          </div>
          <div className="field">
            <label htmlFor="details">Details (optional)</label>
            <textarea id="details" name="details" maxLength={5000} style={{ minHeight: 90 }} />
          </div>
          <button className="btn btn-moss btn-small">Add to change log</button>
        </form>
        <table className="list">
          <tbody>
            {((changes.data ?? []) as Change[]).map((c) => (
              <tr key={c.id}>
                <td style={{ whiteSpace: "nowrap" }}>{fmt(c.created_at)}</td>
                <td>
                  <strong>{c.title}</strong>
                  {c.details && <div className="hint">{c.details}</div>}
                </td>
                <td style={{ textAlign: "right" }}>
                  <form action={deleteChange}>
                    <input type="hidden" name="id" value={c.id} />
                    <button className="link-button" aria-label="Delete">×</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <details className="pick" style={{ marginTop: 24 }}>
          <summary>Website updates ({siteChanges.length})</summary>
          <table className="list">
            <tbody>
              {siteChanges.map((c, i) => (
                <tr key={i}>
                  <td style={{ whiteSpace: "nowrap" }}>{c.date}</td>
                  <td>{c.title}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      </div>
    </section>
  );
}
