import Link from "next/link";
import type { Story } from "@/lib/stories";

function Body({ s }: { s: Story }) {
  return (
    <>
      <h4>What happened</h4>
      <p className="body">{s.happened}</p>
      <h4>What could have prevented it, or eased it</h4>
      <p className="body">{s.could_help}</p>
    </>
  );
}

function Tags({ s }: { s: Story }) {
  return (
    <div className="meta">
      {s.story_index
        .map((x) => x.index_items)
        .filter((i) => i !== null)
        .map((i) => (
          <Link key={i.slug} className="tag" href={`/hear-my-voice?about=${i.slug}`}>
            {i.label}
          </Link>
        ))}
    </div>
  );
}

/** Stories with indicators stay folded until the reader chooses to open them. */
export default function StoryEntry({ s }: { s: Story }) {
  const labels = s.story_indicators.map((x) => x.indicators?.label).filter(Boolean) as string[];
  if (labels.length) {
    return (
      <details className="trigger-entry">
        <summary>
          <Tags s={s} />
          <div>
            {labels.map((l) => (
              <span key={l} className="indicator">
                {l}
              </span>
            ))}
          </div>
          <div className="open-hint">Folded closed. Open it when and if you choose.</div>
        </summary>
        <div className="trigger-body">
          <Body s={s} />
        </div>
      </details>
    );
  }
  return (
    <article className="entry">
      <Tags s={s} />
      <Body s={s} />
    </article>
  );
}
