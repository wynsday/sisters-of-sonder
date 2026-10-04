import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { type Consideration, CONSIDERATION_FIELDS } from "@/lib/books";
import { createPublicClient } from "@/lib/supabase/server";
import { isConfigured } from "@/lib/supabase/env";
import Feed from "@/components/Feed";

export const revalidate = 300;

// Pages are built the first time someone visits, then cached and refreshed.
export async function generateStaticParams() {
  return [];
}

type WithBook = Consideration & { books: { slug: string; title: string } | null };

async function load(id: string) {
  if (!isConfigured || !/^\d+$/.test(id)) return null;
  const { data } = await createPublicClient()
    .from("considerations")
    .select(`${CONSIDERATION_FIELDS}, books!considerations_book_fkey(slug, title)`)
    .eq("id", id)
    .eq("status", "published")
    .maybeSingle();
  return data as unknown as WithBook | null;
}

export async function generateMetadata({ params }: PageProps<"/c/[id]">): Promise<Metadata> {
  const c = await load((await params).id);
  return { title: c?.title ?? "Consideration" };
}

export default async function ConsiderationPage({ params }: PageProps<"/c/[id]">) {
  const c = await load((await params).id);
  if (!c) notFound();
  return (
    <section>
      <div className="wrap read">
        {c.books && (
          <p>
            From {c.books.title}
            {c.part === "glimmer" && (
              <>
                {" "}
                &middot; <span className="part-label glimmer">Glimmer</span>
              </>
            )}
          </p>
        )}
        <Feed initial={[c]} />
      </div>
    </section>
  );
}
