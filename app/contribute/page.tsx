import { permanentRedirect } from "next/navigation";

// Offering a Consideration now lives on the Quilt of the Considerate page.
export default async function ContributePage({ searchParams }: PageProps<"/contribute">) {
  const book = (await searchParams).book;
  permanentRedirect(`/books${book ? `?book=${encodeURIComponent(String(book))}` : ""}#offer`);
}
