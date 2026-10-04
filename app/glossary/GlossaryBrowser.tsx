"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type glossaryData from "@/lib/glossary.json";
import ShareButton from "@/components/ShareButton";

type Glossary = typeof glossaryData;

const fold = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

/** The glossary with a search box beside the members' buttons. While
 *  searching, only matching entries show, by number, name, or description. */
export default function GlossaryBrowser({ glossary }: { glossary: Glossary }) {
  const [query, setQuery] = useState("");
  const q = fold(query.trim());

  const sections = useMemo(() => {
    if (!q) return glossary.sections;
    return glossary.sections
      .map((s) => ({
        ...s,
        entries: s.entries.filter(
          (e) => String(e.n) === q || fold(e.term).includes(q) || fold(e.text).includes(q),
        ),
      }))
      .filter((s) => s.entries.length);
  }, [glossary, q]);
  const matches = sections.reduce((n, s) => n + s.entries.length, 0);

  return (
    <>
      <div className="top-actions">
        <Link className="btn btn-small members" href="/glossary/suggest" title="Members only">
          Submit a new item
        </Link>
        <Link className="btn btn-small members" href="/report?page=Glossary" title="Members only">
          Report an issue
        </Link>
        <input
          className="glossary-search"
          type="search"
          placeholder="Search the glossary"
          aria-label="Search the glossary"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {q ? (
        <p className="hint" aria-live="polite">
          {matches} {matches === 1 ? "entry matches" : "entries match"} &ldquo;{query.trim()}&rdquo;.
        </p>
      ) : (
        <>
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
        </>
      )}

      {sections.map((s) => (
        <div key={s.id} id={s.id} className="part">
          <h2>{s.title}</h2>
          {!q && s.intro.map((p) => <p key={p}>{p}</p>)}
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

      {!q &&
        glossary.closing.map((block) => (
          <div key={block.heading} className="part">
            <h2>{block.heading}</h2>
            {block.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        ))}
    </>
  );
}
