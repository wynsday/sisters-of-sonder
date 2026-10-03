import Link from "next/link";

/** Under each Aspiration, Tenet, and the Foundational Understanding:
 *  read its Book of Considerations, or add to it (members only). */
export default function BookLinks({ slug, title }: { slug: string; title: string }) {
  return (
    <p className="book-links">
      <Link href={`/books/${slug}`}>Read {title} &rarr;</Link>
      <Link className="add-consideration" href={`/contribute?book=${slug}`}>
        + Add a Consideration <span className="hint">(members)</span>
      </Link>
    </p>
  );
}
