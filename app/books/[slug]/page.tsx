import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { type Book, sourceHref } from "@/lib/books";
import { loadParts } from "@/lib/feed";
import { createPublicClient } from "@/lib/supabase/server";
import { isConfigured } from "@/lib/supabase/env";
import AddConsideration from "@/components/AddConsideration";
import BookParts from "@/components/BookParts";
import NotConnected from "@/components/NotConnected";

export const revalidate = 300;

// Pages are built the first time someone visits, then cached and refreshed.
export async function generateStaticParams() {
  return [];
}

// These books live on other pages.
const ELSEWHERE: Record<string, string> = {
  foundation: "/foundation#book",
  quilt: "/books",
  "less-suffering": "/aspirations#less-suffering",
  wonder: "/aspirations#wonder",
  grace: "/aspirations#grace",
};

async function loadBook(slug: string) {
  const { data } = await createPublicClient().from("books").select("*").eq("slug", slug).maybeSingle();
  return data as Book | null;
}

export async function generateMetadata({ params }: PageProps<"/books/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  if (!isConfigured || ELSEWHERE[slug]) return { title: "Book of Considerations" };
  return { title: (await loadBook(slug))?.title ?? "Book of Considerations" };
}

export default async function BookPage({ params }: PageProps<"/books/[slug]">) {
  const { slug } = await params;
  if (ELSEWHERE[slug]) permanentRedirect(ELSEWHERE[slug]);
  if (!isConfigured) {
    return (
      <section>
        <div className="wrap read">
          <NotConnected />
        </div>
      </section>
    );
  }
  const [book, parts] = await Promise.all([loadBook(slug), loadParts(slug)]);
  if (!book) notFound();
  const source = sourceHref(book);

  return (
    <>
      <div className="page-hero">
        <div className="wrap">
          <h1>{book.title}</h1>
        </div>
      </div>
      <section>
        <div className="wrap read">
          <p className="book-links">
            {source && <Link href={source}>Read {book.subject}</Link>}
          </p>
          <AddConsideration book={slug} />
          <BookParts slug={slug} parts={parts} />
        </div>
      </section>
    </>
  );
}
