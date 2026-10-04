import type { Metadata } from "next";
import Link from "next/link";
import { FOUNDING } from "@/lib/founding";
import { loadParts } from "@/lib/feed";
import AddConsideration from "@/components/AddConsideration";
import BookParts from "@/components/BookParts";

export const metadata: Metadata = {
  title: "Considerations of the Aspirations",
  description: "The three Books of Considerations of the Sacred Aspirations, side by side.",
};
export const revalidate = 300;

const ASPIRATIONS = [
  { slug: "less-suffering", ord: "First", anchor: "suffering" },
  { slug: "wonder", ord: "Second", anchor: "wonder" },
  { slug: "grace", ord: "Third", anchor: "grace" },
];

export default async function AspirationsPage() {
  const parts = await Promise.all(ASPIRATIONS.map((a) => loadParts(a.slug)));
  return (
    <>
      <div className="page-hero">
        <div className="wrap">
          <h1>Considerations of the Aspirations</h1>
        </div>
      </div>
      <section>
        <div className="wrap">
          <div className="aspiration-books">
            {ASPIRATIONS.map((a, i) => {
              const f = FOUNDING[a.slug];
              return (
                <div key={a.slug} id={a.slug} className="aspiration-book">
                  <div className="ordinal">The {a.ord} Aspiration</div>
                  <h2>
                    <Link href={`/#${a.anchor}`}>{f.subject}</Link>
                  </h2>
                  {f.consider.map((text, n) => (
                    <div key={n} className="consider">
                      {text}
                    </div>
                  ))}
                  <AddConsideration book={a.slug} />
                  <BookParts slug={a.slug} parts={parts[i]} />
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
