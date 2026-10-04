import Link from "next/link";

/** Opens Hear My Voice's share form with this item already chosen. */
export default function ShareButton({ about }: { about: string }) {
  return (
    <Link className="share-button" href={`/hear-my-voice/share?about=${about}`}>
      <span aria-hidden="true">💬</span> Share your story
    </Link>
  );
}
