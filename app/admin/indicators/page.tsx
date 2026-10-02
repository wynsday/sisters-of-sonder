import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isConfigured } from "@/lib/supabase/env";
import { requireAdmin } from "@/lib/auth";
import { addIndicator } from "../actions";

export const metadata: Metadata = { title: "Trigger indicators" };
// Personal to whoever is signed in; never cached.
export const dynamic = "force-dynamic";

export default async function IndicatorsPage({ searchParams }: PageProps<"/admin/indicators">) {
  if (!isConfigured) redirect("/join");
  const { supabase } = await requireAdmin("/admin/indicators");
  const error = (await searchParams).error;
  const { data: indicators } = await supabase.from("indicators").select("slug, label").order("label");

  return (
    <section>
      <div className="wrap read">
        <p>
          <Link href="/admin">&larr; Keepers&rsquo; Desk</Link>
        </p>
        <h1>Trigger indicators</h1>
        <p>These mark what a Trigger contains, so readers can choose whether to open it.</p>
        {error && <p className="error">{String(error)}</p>}
        <p>
          {(indicators ?? []).map((i) => (
            <span key={i.slug} className="indicator">
              {i.label}
            </span>
          ))}
        </p>
        <form action={addIndicator} className="review">
          <div className="field">
            <label htmlFor="label">Add an indicator</label>
            <input id="label" name="label" type="text" maxLength={60} required />
          </div>
          <button className="btn btn-moss btn-small">Add</button>
        </form>
      </div>
    </section>
  );
}
