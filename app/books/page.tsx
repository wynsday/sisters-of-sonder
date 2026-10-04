import type { Metadata } from "next";
import Link from "next/link";
import { isConfigured } from "@/lib/supabase/env";
import { getSession } from "@/lib/auth";
import { type Book, FORMS } from "@/lib/books";
import { loadParts } from "@/lib/feed";
import BookParts from "@/components/BookParts";
import OfferForm from "./OfferForm";

export const metadata: Metadata = {
  title: "Quilt of the Considerate",
  description: "Offer a Consideration: a premise, a parable, or stories from different cultures that share an opinion.",
};
// Shows the offer form to signed-in members, so it is rendered per visitor.
export const dynamic = "force-dynamic";

const SHELF_ORDER = { foundation: 0, aspiration: 1, tenet: 2, quilt: 3 };

export default async function QuiltPage({ searchParams }: PageProps<"/books">) {
  const sp = await searchParams;
  const chosen = String(sp.book ?? "");
  const here = `/books${chosen ? `?book=${chosen}` : ""}`;
  const { supabase, user } = isConfigured ? await getSession() : { supabase: null, user: null };
  const [{ data }, parts] = await Promise.all([
    supabase && user ? supabase.from("books").select("*").order("ordinal") : Promise.resolve({ data: [] }),
    loadParts("quilt"),
  ]);
  const books = ((data ?? []) as Book[]).sort((a, b) => SHELF_ORDER[a.kind] - SHELF_ORDER[b.kind]);

  return (
    <>
      <div className="page-hero">
        <div className="wrap">
          <h1>Quilt of the Considerate</h1>
          <p>Offer a premise, a parable, or stories that share an opinion.</p>
        </div>
      </div>

      <section className="alt">
        <div className="wrap read">
          <h2>If you have a Consideration to offer</h2>
          <p>It should contain one of these:</p>
          <div className="cards cards-3">
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
            <Link href="/aspirations">Aspirations</Link> or <Link href="/tenets">Tenets</Link>.
          </p>
        </div>
      </section>

      <section id="offer" className="part">
        <div className="wrap read">
          {user ? (
            <OfferForm books={books} chosen={chosen} />
          ) : (
            <div className="card center">
              <h2>Members offer Considerations</h2>
              <p>Join or sign in, and you will come straight back here to write yours.</p>
              <Link className="btn btn-gold" href={`/join?next=${encodeURIComponent(here)}`}>
                Join
              </Link>
              <Link className="btn btn-moss" href={`/join?mode=signin&next=${encodeURIComponent(here)}`}>
                Sign in
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="alt">
        <div className="wrap read">
          <h2>The Quilt</h2>
          <p className="hint">Considerations that belong to no single Aspiration or Tenet.</p>
          <BookParts slug="quilt" parts={parts} />
        </div>
      </section>
    </>
  );
}
