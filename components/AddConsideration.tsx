import Link from "next/link";

export default function AddConsideration({ book }: { book: string }) {
  return (
    <p className="book-links">
      <Link className="add-consideration" href={`/books?book=${book}#offer`}>
        + Add a Consideration <span className="hint">(members)</span>
      </Link>
    </p>
  );
}
