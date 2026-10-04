import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isConfigured } from "@/lib/supabase/env";
import { requireAdmin } from "@/lib/auth";
import { resolveSubmission } from "../actions";

export const metadata: Metadata = { title: "Inbox" };
export const dynamic = "force-dynamic";

type Row = {
  id: number;
  kind: string;
  issue_type: string | null;
  page: string | null;
  title: string;
  body: string;
  section: string | null;
  sources: string | null;
  created_at: string;
};

export default async function InboxPage() {
  if (!isConfigured) redirect("/join");
  const { supabase } = await requireAdmin("/admin/inbox");
  const { data } = await supabase
    .from("submissions")
    .select("id, kind, issue_type, page, title, body, section, sources, created_at")
    .is("resolved_at", null)
    .order("created_at");
  const rows = (data ?? []) as Row[];

  return (
    <section>
      <div className="wrap read">
        <p>
          <Link href="/admin">&larr; Keepers&rsquo; Desk</Link>
        </p>
        <h1>Inbox ({rows.length})</h1>
        <p className="hint">New glossary items and issue reports from members.</p>
        {rows.length === 0 && <p className="empty">Nothing waiting.</p>}
        {rows.map((r) => (
          <div key={r.id} className="review">
            <p>
              <span className="tag">{r.kind === "issue" ? r.issue_type : "new glossary item"}</span>
              {r.page && <span className="hint"> {r.page}</span>}
              {r.section && <span className="hint"> {r.section}</span>}
            </p>
            <h3>{r.title}</h3>
            <p className="body">{r.body}</p>
            {r.sources && (
              <>
                <h4>Sources</h4>
                <p className="body">{r.sources}</p>
              </>
            )}
            <div className="hint">Sent {new Date(r.created_at).toLocaleDateString()}</div>
            <form action={resolveSubmission} className="actions">
              <input type="hidden" name="id" value={r.id} />
              <button className="btn btn-moss btn-small">Mark handled</button>
            </form>
          </div>
        ))}
      </div>
    </section>
  );
}
