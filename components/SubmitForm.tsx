"use client";

import { useActionState } from "react";
import { submit, type SubmitState } from "@/app/submit-actions";

type Props = {
  kind: "glossary_item" | "issue";
  sections?: string[];
  page?: string;
};

export default function SubmitForm({ kind, sections = [], page = "" }: Props) {
  const [state, action, pending] = useActionState<SubmitState, FormData>(submit, {});
  const v = state.values ?? {};
  const key = JSON.stringify(state);

  return (
    <form action={action} key={key}>
      <input type="hidden" name="kind" value={kind} />
      {state.error && <p className="error">{state.error}</p>}

      {kind === "issue" ? (
        <>
          <div className="field">
            <span className="prompt">What kind of issue?</span>
            <div className="checks" style={{ marginTop: 8 }}>
              {[
                ["feedback", "Feedback"],
                ["bug", "Bug"],
                ["typo", "Typo"],
                ["discrepancy", "Discrepancy"],
              ].map(([value, label]) => (
                <label key={value}>
                  <input type="radio" name="issue_type" value={value} required defaultChecked={v.issue_type === value} />{" "}
                  {label}
                </label>
              ))}
            </div>
          </div>
          <div className="field">
            <label htmlFor="page">Where on the site? (optional)</label>
            <input id="page" name="page" type="text" maxLength={500} defaultValue={v.page ?? page} placeholder="A page, a tenet, an entry number…" />
          </div>
          <div className="field">
            <label htmlFor="title">Short summary</label>
            <input id="title" name="title" type="text" maxLength={200} required defaultValue={v.title} />
          </div>
          <div className="field">
            <label htmlFor="body">Details</label>
            <textarea id="body" name="body" maxLength={20000} required defaultValue={v.body} />
            <div className="hint">For a typo or discrepancy, quote the words as they appear now.</div>
          </div>
        </>
      ) : (
        <>
          <div className="field">
            <label htmlFor="title">Name of the behavior</label>
            <input id="title" name="title" type="text" maxLength={200} required defaultValue={v.title} />
          </div>
          <div className="field">
            <label htmlFor="body">What it is</label>
            <textarea id="body" name="body" maxLength={20000} required defaultValue={v.body} />
            <div className="hint">Describe what people do, in plain words, the way the other entries do.</div>
          </div>
          <div className="field">
            <label htmlFor="section">Which section does it belong in? (optional)</label>
            <select id="section" name="section" defaultValue={v.section ?? ""}>
              <option value="">Not sure</option>
              {sections.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="sources">Sources (optional)</label>
            <textarea id="sources" name="sources" maxLength={10000} style={{ minHeight: 90 }} defaultValue={v.sources} />
          </div>
        </>
      )}

      <button className="btn btn-moss" type="submit" disabled={pending}>
        {pending ? "Sending…" : "Send"}
      </button>
    </form>
  );
}
