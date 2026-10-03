import Link from "next/link";
import { type Consideration, FORMS, indicatorLabels } from "@/lib/books";

function Body({ c }: { c: Consideration }) {
  return (
    <>
      <p className="body">{c.concept}</p>
      {c.stories && (
        <>
          <h4>Sources</h4>
          <p className="body">{c.stories}</p>
        </>
      )}
      <div className="meta">
        {FORMS.find((f) => f.value === c.form)?.label} &middot; Offered by {c.profiles?.display_name ?? "a member"} &middot;{" "}
        <Link href={`/c/${c.id}`}>Permanent link</Link>
      </div>
    </>
  );
}

/** Triggers stay folded until the reader chooses to open them (Tenet VI). */
export default function ConsiderationEntry({ c }: { c: Consideration }) {
  if (c.part === "trigger") {
    const labels = indicatorLabels(c);
    return (
      <details className="trigger-entry">
        <summary>
          <h3>{c.title}</h3>
          <div>
            {(labels.length ? labels : ["Trigger"]).map((l) => (
              <span key={l} className="indicator">
                {l}
              </span>
            ))}
          </div>
          <div className="open-hint">Folded closed. Open it when and if you choose.</div>
        </summary>
        <div className="trigger-body">
          <Body c={c} />
        </div>
      </details>
    );
  }
  return (
    <article className={`entry ${c.part ?? ""}`}>
      <h3>
        <Link href={`/c/${c.id}`}>{c.title}</Link>
      </h3>
      <Body c={c} />
    </article>
  );
}
