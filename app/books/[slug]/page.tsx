import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { type Book, type Consideration, CONSIDERATION_FIELDS } from "@/lib/books";
import { createPublicClient } from "@/lib/supabase/server";
import { isConfigured } from "@/lib/supabase/env";
import ConsiderationEntry from "@/components/ConsiderationEntry";
import NotConnected from "@/components/NotConnected";

export const revalidate = 300;

// Pages are built the first time someone visits, then cached and refreshed.
export async function generateStaticParams() {
  return [];
}

async function loadBook(slug: string) {
  const supabase = createPublicClient();
  const { data: book } = await supabase.from("books").select("*").eq("slug", slug).maybeSingle();
  if (!book) return null;

  // Considerations that live in this book, plus those cross-listed into it.
  const { data: cross } = await supabase
    .from("consideration_books")
    .select("consideration")
    .eq("book", slug);
  const crossIds = (cross ?? []).map((r) => r.consideration);

  let query = supabase
    .from("considerations")
    .select(CONSIDERATION_FIELDS)
    .eq("status", "published")
    .order("reviewed_at", { ascending: true });
  query = crossIds.length
    ? query.or(`book.eq.${slug},id.in.(${crossIds.join(",")})`)
    : query.eq("book", slug);
  const { data } = await query;
  return { book: book as Book, entries: (data ?? []) as unknown as Consideration[] };
}

export async function generateMetadata({ params }: PageProps<"/books/[slug]">): Promise<Metadata> {
  if (!isConfigured) return { title: "Book of Considerations" };
  const loaded = await loadBook((await params).slug);
  return { title: loaded?.book.title ?? "Book of Considerations" };
}

function Part({ entries }: { entries: Consideration[] }) {
  if (!entries.length) return <p className="empty">Nothing here yet.</p>;
  return entries.map((c) => <ConsiderationEntry key={c.id} c={c} />);
}

export default async function BookPage({ params }: PageProps<"/books/[slug]">) {
  if (!isConfigured) {
    return (
      <section>
        <div className="wrap read">
          <NotConnected />
        </div>
      </section>
    );
  }
  const loaded = await loadBook((await params).slug);
  if (!loaded) notFound();
  const { book, entries } = loaded;
  const neutral = entries.filter((c) => c.part === "neutral");
  const glimmers = entries.filter((c) => c.part === "glimmer");
  const triggers = entries.filter((c) => c.part === "trigger");

  return (
    <>
      <div className="page-hero">
        <div className="wrap">
          <h1>{book.title}</h1>
        </div>
      </div>
      <section>
        <div className="wrap read">
          {book.canon && <div className="canon">{book.canon}</div>}
          <p>
            <Link href="/books">&larr; All books</Link> &middot;{" "}
            <Link href={`/contribute?book=${book.slug}`}>Offer a Consideration for this book</Link>
          </p>

          <div className="book-part">
            <Part entries={neutral} />
          </div>

          <div className="book-part">
            <h2>
              <span className="part-label glimmer">Glimmers</span>
            </h2>
            <Part entries={glimmers} />
          </div>

          <div className="book-part">
            <h2>
              <span className="part-label trigger">Triggers</span>
            </h2>
            {triggers.length > 0 && (
              <p className="hint">
                Each of these is folded closed and marked with what it contains. You are free to
                pass.
              </p>
            )}
            <Part entries={triggers} />
          </div>
        </div>
      </section>
    </>
  );
}
