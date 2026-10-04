import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { type Book, sourceHref } from "@/lib/books";
import { fetchPart } from "@/lib/feed";
import { createPublicClient } from "@/lib/supabase/server";
import { isConfigured } from "@/lib/supabase/env";
import Feed from "@/components/Feed";
import NotConnected from "@/components/NotConnected";
import { FOUNDING } from "@/lib/founding";

export const revalidate = 300;

// Pages are built the first time someone visits, then cached and refreshed.
export async function generateStaticParams() {
  return [];
}

async function loadBook(slug: string) {
  const { data: book } = await createPublicClient()
    .from("books")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (!book) return null;
  // First page of each part; the rest loads as the reader scrolls.
  const [neutral, glimmer, trigger] = await Promise.all(
    (["neutral", "glimmer", "trigger"] as const).map((part) => fetchPart(slug, part, 0)),
  );
  return { book: book as Book, parts: { neutral, glimmer, trigger } };
}

export async function generateMetadata({ params }: PageProps<"/books/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  if (!isConfigured) return { title: FOUNDING[slug]?.title ?? "Book of Considerations" };
  const loaded = await loadBook(slug);
  return { title: loaded?.book.title ?? "Book of Considerations" };
}

export default async function BookPage({ params }: PageProps<"/books/[slug]">) {
  const { slug } = await params;
  const founding = FOUNDING[slug];
  const loaded = isConfigured ? await loadBook(slug) : null;
  if (!loaded && (isConfigured || !founding)) {
    if (isConfigured) notFound();
    return (
      <section>
        <div className="wrap read">
          <NotConnected />
        </div>
      </section>
    );
  }
  const title = loaded?.book.title ?? founding.title;
  const subject = loaded?.book.subject ?? founding.subject;
  const source = loaded ? sourceHref(loaded.book) : `/#${slug === "less-suffering" ? "suffering" : slug}`;
  const parts = loaded?.parts;
  const addLink = (
    <Link className="add-consideration" href={`/contribute?book=${slug}`}>
      + Add a Consideration <span className="hint">(members)</span>
    </Link>
  );

  return (
    <>
      <div className="page-hero">
        <div className="wrap">
          <h1>{title}</h1>
        </div>
      </div>
      <section>
        <div className="wrap read">
          <p className="book-links">
            <Link href="/books">&larr; All books</Link>
            {source && <Link href={source}>Read {subject}</Link>}
            {!founding && addLink}
          </p>

          {founding && (
            <>
              {founding.consider.map((text, i) => (
                <div key={i} className="consider">{text}</div>
              ))}
              <p className="book-links">{addLink}</p>
            </>
          )}

          {!loaded && <NotConnected />}

          {parts && (
            <>
            <div className="book-part">
              <Feed book={slug} part="neutral" initial={parts.neutral.entries} initialHasMore={parts.neutral.hasMore} />
            </div>

            <div className="book-part">
              <h2>
                <span className="part-label glimmer">Glimmers</span>
              </h2>
              <Feed book={slug} part="glimmer" initial={parts.glimmer.entries} initialHasMore={parts.glimmer.hasMore} />
            </div>

            <div className="book-part">
              <h2>
                <span className="part-label trigger">Triggers</span>
              </h2>
              {parts.trigger.entries.length > 0 && (
                <p className="hint">
                  Each of these is folded closed and marked with what it contains. You are free to
                  pass.
                </p>
              )}
              <Feed book={slug} part="trigger" initial={parts.trigger.entries} initialHasMore={parts.trigger.hasMore} />
            </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
