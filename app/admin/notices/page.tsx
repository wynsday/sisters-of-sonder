import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isConfigured } from "@/lib/supabase/env";
import { requireAdmin } from "@/lib/auth";
import { sendNotice } from "../actions";

export const metadata: Metadata = { title: "Change notices" };
export const dynamic = "force-dynamic";

type Notice = { id: number; subject: string; status: string; recipients: number | null; created_at: string };

export default async function NoticesPage({ searchParams }: PageProps<"/admin/notices">) {
  if (!isConfigured) redirect("/join");
  const { supabase } = await requireAdmin("/admin/notices");
  const sp = await searchParams;
  const [{ data: next }, { data: history }] = await Promise.all([
    supabase.rpc("next_notice_at"),
    supabase
      .from("notices")
      .select("id, subject, status, recipients, created_at")
      .order("created_at", { ascending: false })
      .limit(12),
  ]);
  const nextAt = next ? new Date(next as string) : null;
  const ready = Boolean(process.env.RESEND_API_KEY && process.env.NOTICE_FROM);

  return (
    <section>
      <div className="wrap read">
        <p>
          <Link href="/admin">&larr; Keepers&rsquo; Desk</Link>
        </p>
        <h1>Change notices</h1>
        <p>
          A statement emailed to members who gave permission, when the wording of the canon
          changes significantly or a new item is added. It is never sent automatically: an admin
          writes it. At most one is sent every 30 days.
        </p>
        {!ready && (
          <p className="error">
            Email is not set up yet: RESEND_API_KEY and NOTICE_FROM need to be added in Vercel.
          </p>
        )}
        {sp.error && <p className="error">{String(sp.error)}</p>}
        {sp.tested && <p className="notice">A test was sent to your own email address only.</p>}
        {sp.sent && <p className="notice">Sent to {String(sp.sent)} members.</p>}

        {nextAt ? (
          <p className="notice">
            A notice was sent in the last 30 days. The next may be sent after{" "}
            {nextAt.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}.
          </p>
        ) : (
          <form action={sendNotice} className="review">
            <div className="field">
              <label htmlFor="subject">Subject</label>
              <input id="subject" name="subject" type="text" maxLength={200} required />
            </div>
            <div className="field">
              <label htmlFor="body">Statement</label>
              <textarea id="body" name="body" maxLength={20000} required style={{ minHeight: 220 }} />
              <div className="hint">
                Plain text. Each member is greeted by the name they chose, and a closing line
                explains how to stop these notices.
              </div>
            </div>
            <div className="actions">
              <button className="btn btn-small btn-outline" name="mode" value="test">
                Send a test to me
              </button>
              <button className="btn btn-gold btn-small" name="mode" value="send">
                Send to members
              </button>
            </div>
          </form>
        )}

        <h2 style={{ marginTop: 40 }}>Sent</h2>
        {!history?.length ? (
          <p className="empty">None yet.</p>
        ) : (
          <table className="list">
            <tbody>
              {(history as Notice[]).map((n) => (
                <tr key={n.id}>
                  <td>{n.subject}</td>
                  <td>{new Date(n.created_at).toLocaleDateString()}</td>
                  <td>{n.status === "sent" ? `${n.recipients ?? 0} members` : n.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
