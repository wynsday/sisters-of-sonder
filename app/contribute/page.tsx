import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isConfigured } from "@/lib/supabase/env";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import { type Book, FORMS } from "@/lib/books";
import OfferForm from "./OfferForm";

export const metadata: Metadata = { title: "Offer a Consideration" };
// Personal to whoever is signed in; never cached.
export const dynamic = "force-dynamic";

export default async function ContributePage({ searchParams }: PageProps<"/contribute">) {
  if (!isConfigured) redirect("/join");
  const sp = await searchParams;
  const { supabase, user } = await getSession();
  const { data } = user ? await supabase.from("books").select("*").order("ordinal") : { data: [] };
  const shelfOrder = { foundation: 0, aspiration: 1, tenet: 2, quilt: 3 };
  const books = ((data ?? []) as Book[]).sort((a, b) => shelfOrder[a.kind] - shelfOrder[b.kind]);
  const chosen = String(sp.book ?? "");

  return (
    <>
      <div className="page-hero">
        <div className="wrap">
          <h1>Offer a Consideration</h1>
          <p>Offer a premise, a parable, or stories that share an opinion.</p>
        </div>
      </div>

      <section className="alt">
        <div className="wrap read">
          <h2>If you have a Consideration to offer</h2>
          <p>It should contain one of these:</p>
          <div className="cards">
            {FORMS.map((f, n) => (
              <div key={f.value} className="card">
                <div className="num">{n + 1}</div>
                <h3>{f.label}</h3>
                <p>{f.describe}</p>
              </div>
            ))}
          </div>
          <p className="notice" style={{ marginTop: 24 }}>
            A Wisdom will review submissions and post any that do not violate the spirit of the{" "}
            <Link href="/#suffering">Aspirations</Link> or <Link href="/tenets">Tenets</Link>.
          </p>
        </div>
      </section>

      <section>
        <div className="wrap read">
          {user ? (
            <OfferForm books={books} chosen={chosen} />
          ) : (
            <div className="card center">
              <h2>Members offer Considerations</h2>
              <p>Join or sign in, and you will come straight back here to write yours.</p>
              <Link className="btn btn-gold" href={`/join?next=${encodeURIComponent(`/contribute${chosen ? `?book=${chosen}` : ""}`)}`}>
                Join
              </Link>
              <Link className="btn btn-moss" href={`/join?mode=signin&next=${encodeURIComponent(`/contribute${chosen ? `?book=${chosen}` : ""}`)}`}>
                Sign in
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
