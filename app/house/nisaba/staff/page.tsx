import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isConfigured } from "@/lib/supabase/env";
import { houseRoles } from "@/lib/auth";
import { appoint, endAppointment } from "../actions";

export const metadata: Metadata = { title: "Chair of Nisaba" };
// Personal to whoever is signed in; never cached.
export const dynamic = "force-dynamic";

type Appointment = {
  id: number;
  starts_at: string;
  ends_at: string;
  revoked_at: string | null;
  note: string | null;
  member: { display_name: string } | null;
};

function splitAppointments(all: Appointment[]) {
  const now = Date.now();
  const active = all.filter((a) => !a.revoked_at && new Date(a.ends_at).getTime() > now);
  return { active, past: all.filter((a) => !active.includes(a)) };
}

export default async function StaffPage({ searchParams }: PageProps<"/house/nisaba/staff">) {
  if (!isConfigured) redirect("/join");
  const { supabase, user, isWisdom } = await houseRoles("nisaba");
  if (!user) redirect("/join?mode=signin&next=/house/nisaba/staff");
  if (!isWisdom) redirect("/account");
  const sp = await searchParams;
  const q = String(sp.q ?? "").trim();
  const error = sp.error ? String(sp.error) : null;

  const { data } = await supabase
    .from("appointments")
    .select("id, starts_at, ends_at, revoked_at, note, member:profiles!appointments_member_fkey(display_name)")
    .eq("house", "nisaba")
    .order("starts_at", { ascending: false });
  const appointments = (data ?? []) as unknown as Appointment[];
  const { active, past } = splitAppointments(appointments);

  const { data: found } = q
    ? await supabase
        .from("profiles")
        .select("id, display_name, created_at")
        .ilike("display_name", `%${q.replace(/[%_]/g, "")}%`)
        .neq("id", user.id)
        .limit(20)
    : { data: [] };

  const fmt = (d: string) => new Date(d).toLocaleDateString();

  return (
    <>
      <div className="page-hero">
        <div className="wrap">
          <h1>The Chair of Nisaba</h1>
          <p>
            You appoint the members of the House of Nisaba, for a stated time. You cannot hold the
            authority you grant.
          </p>
        </div>
      </div>
      <section>
        <div className="wrap read">
          {error && <p className="error">{error}</p>}

          <h2>The House now</h2>
          {!active.length ? (
            <p className="empty">No one holds authority in the House right now.</p>
          ) : (
            <table className="list">
              <tbody>
                {active.map((a) => (
                  <tr key={a.id}>
                    <td>
                      {a.member?.display_name}
                      <div className="hint">
                        {fmt(a.starts_at)} to {fmt(a.ends_at)}
                        {a.note && <> &middot; {a.note}</>}
                      </div>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <form action={endAppointment}>
                        <input type="hidden" name="id" value={a.id} />
                        <button className="btn btn-rose btn-small">End now</button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <h2 style={{ marginTop: 48 }}>Appoint a member</h2>
          <form className="review" method="get">
            <div className="field">
              <label htmlFor="q">Find a member by name</label>
              <input id="q" name="q" type="text" defaultValue={q} />
            </div>
            <button className="btn btn-moss btn-small">Search</button>
          </form>

          {q && !found?.length && <p className="empty">No members match &ldquo;{q}&rdquo;.</p>}
          {(found ?? []).map((p) => (
            <form key={p.id} action={appoint} className="review">
              <input type="hidden" name="member" value={p.id} />
              <h3>{p.display_name}</h3>
              <div className="hint">Member since {fmt(p.created_at)}</div>
              <div className="row" style={{ marginTop: 12 }}>
                <div className="field">
                  <label htmlFor={`ends-${p.id}`}>Authority ends on</label>
                  <input id={`ends-${p.id}`} name="ends_at" type="date" required />
                </div>
                <div className="field">
                  <label htmlFor={`note-${p.id}`}>Task (optional)</label>
                  <input id={`note-${p.id}`} name="note" type="text" placeholder="e.g. Review the Tenet books" />
                </div>
              </div>
              <button className="btn btn-gold btn-small">Appoint to the House of Nisaba</button>
            </form>
          ))}

          {past.length > 0 && (
            <>
              <h2 style={{ marginTop: 48 }}>Past appointments</h2>
              <table className="list">
                <tbody>
                  {past.map((a) => (
                    <tr key={a.id}>
                      <td>{a.member?.display_name}</td>
                      <td>
                        {fmt(a.starts_at)} to {fmt(a.revoked_at ?? a.ends_at)}
                        {a.revoked_at && " (ended early)"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </section>
    </>
  );
}
