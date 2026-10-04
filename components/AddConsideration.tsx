import Link from "next/link";

/** Members only, so it carries the dark purple outline. */
export default function AddConsideration({ book }: { book?: string }) {
  return (
    <p className="book-links">
      <Link
        className="btn btn-small members"
        href={book ? `/books?book=${book}#offer` : "/books#offer"}
        title="Members only"
      >
        Submit a Consideration
      </Link>
    </p>
  );
}
