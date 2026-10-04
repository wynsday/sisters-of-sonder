import type { Metadata } from "next";
import glossary from "@/lib/glossary.json";
import ShareButton from "@/components/ShareButton";

export const metadata: Metadata = {
  title: glossary.title,
  description: "Named and numbered behaviors that harm groups of people, so they can be recognized and avoided.",
};

export default function Glossary() {
  return (
    <>
      <div className="page-hero">
        <div className="wrap">
          <h1>{glossary.title}</h1>
        </div>
      </div>

      <section>
        <div className="wrap read">
          {glossary.preface.map((block) => (
            <div key={block.heading} className="part">
              <h2>{block.heading}</h2>
              {block.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
              {block.list.length > 0 && (
                <ul>
                  {block.list.map((li) => (
                    <li key={li}>{li}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          <nav className="toc glossary-toc" aria-label="Sections">
            <ol>
              {glossary.sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}>{s.title}</a>
                  <span className="hint"> Entries {s.range}.</span>
                  <div className="hint">{s.summary}</div>
                </li>
              ))}
            </ol>
          </nav>

          {glossary.sections.map((s) => (
            <div key={s.id} id={s.id} className="part">
              <h2>{s.title}</h2>
              {s.intro.map((p) => (
                <p key={p}>{p}</p>
              ))}
              <dl className="glossary">
                {s.entries.map((e) => (
                  <div key={e.n} id={`g-${e.n}`}>
                    <dt>
                      <span className="g-num">{e.n}.</span> {e.term}
                    </dt>
                    <dd>
                      {e.text}
                      <ShareButton about={`g-${e.n}`} />
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}

          {glossary.closing.map((block) => (
            <div key={block.heading} className="part">
              <h2>{block.heading}</h2>
              {block.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
