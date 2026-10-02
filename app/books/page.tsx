import type { Metadata } from "next";
import Link from "next/link";
import type { Book } from "@/lib/books";
import { createPublicClient } from "@/lib/supabase/server";
import { isConfigured } from "@/lib/supabase/env";
import NotConnected from "@/components/NotConnected";

export const metadata: Metadata = {
  title: "Books of Considerations",
  description:
    "A crowd-sourced library of myths and folklore that share an underlying concept across cultures.",
};
export const revalidate = 300;

async function loadShelf() {
  if (!isConfigured) return null;
  const supabase = createPublicClient();
  const [{ data: books }, { data: rows }] = await Promise.all([
    supabase.from("books").select("*").order("ordinal"),
    supabase.from("considerations").select("book").eq("status", "published"),
  ]);
  const counts = new Map<string, number>();
  for (const r of rows ?? []) if (r.book) counts.set(r.book, (counts.get(r.book) ?? 0) + 1);
  return { books: (books ?? []) as Book[], counts };
}

function Shelf({ books, counts }: { books: Book[]; counts: Map<string, number> }) {
  return (
    <div className="shelf">
      {books.map((b) => {
        const n = counts.get(b.slug) ?? 0;
        return (
          <Link key={b.slug} href={`/books/${b.slug}`} className={`book-spine ${b.kind}`}>
            <h3>{b.title}</h3>
            <div className="count">
              {n} Consideration{n === 1 ? "" : "s"}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default async function BooksPage() {
  const shelf = await loadShelf();
  return (
    <>
      <div className="page-hero">
        <div className="wrap">
          <h1>The Books of Considerations</h1>
          <p>Written by its people, from the stories humanity already tells.</p>
        </div>
      </div>

      <section>
        <div className="wrap read">
          <p>
            Each Aspiration and each Tenet has its own Book of Considerations. The Quilt of the
            Considerate holds all the rest. Members bring myths, folklore, and sacred texts from
            every tradition they can find, and look for the concept underneath: an idea that more
            than one culture arrived at and adopted.
          </p>
          <p>
            Considerations can be held as both true and not true; they are able to fall into
            place, provide inspiration, be dismissed, or spark wonder. Each individual can make
            their own decisions or non-decisions about considerations.
          </p>
          <p>
            Every book has three parts. The first is unlabeled. <strong>Glimmers</strong> are
            marked as such. <strong>Triggers</strong> are marked with indicators of what they
            contain and stay folded closed until you choose to open them.
          </p>
          <Link className="btn btn-moss" href="/contribute">
            Offer a Consideration
          </Link>
        </div>
      </section>

      <section className="alt">
        <div className="wrap">
          {shelf ? (
            <>
              <h2>The Aspirations</h2>
              <Shelf books={shelf.books.filter((b) => b.kind === "aspiration")} counts={shelf.counts} />
              <h2 style={{ marginTop: 48 }}>The Tenets</h2>
              <Shelf books={shelf.books.filter((b) => b.kind === "tenet")} counts={shelf.counts} />
              <h2 style={{ marginTop: 48 }}>The Quilt</h2>
              <Shelf books={shelf.books.filter((b) => b.kind === "quilt")} counts={shelf.counts} />
            </>
          ) : (
            <NotConnected />
          )}
        </div>
      </section>
    </>
  );
}
