"use client";

import { useActionState } from "react";
import { groupIndex, type IndexItem } from "@/lib/stories";
import { shareStory, type ShareState } from "./actions";

const OPEN_BY_DEFAULT = new Set(["foundation", "aspiration", "tenet"]);

export default function ShareForm({ items }: { items: IndexItem[] }) {
  const [state, action, pending] = useActionState<ShareState, FormData>(shareStory, {});
  const chosen = new Set(state.items ?? []);
  // Re-mount fields with what was typed whenever the server sends it back.
  const key = JSON.stringify(state);

  return (
    <form action={action} key={key}>
      {state.error && <p className="error">{state.error}</p>}

      <div className="field">
        <label htmlFor="happened" className="prompt">
          What happened?
        </label>
        <div className="hint" style={{ marginBottom: 8 }}>
          Use roles, not names: &ldquo;my father,&rdquo; &ldquo;a minister,&rdquo; &ldquo;a
          teacher,&rdquo; &ldquo;a neighbor.&rdquo; Leave out places and details that could
          identify anyone, including you.
        </div>
        <textarea
          id="happened"
          name="happened"
          required
          maxLength={20000}
          style={{ minHeight: 220 }}
          defaultValue={state.happened}
        />
      </div>

      <div className="field">
        <label htmlFor="could_help" className="prompt">
          What could have prevented it, or eased it?
        </label>
        <div className="hint" style={{ marginBottom: 8 }}>
          If someone near you had known and followed what you choose below, what would have been
          different? What harm might not have happened? What suffering might have been less?
        </div>
        <textarea
          id="could_help"
          name="could_help"
          required
          maxLength={20000}
          style={{ minHeight: 180 }}
          defaultValue={state.could_help}
        />
      </div>

      <div className="field">
        <span className="prompt">What does your story speak to?</span>
        <div className="hint" style={{ marginBottom: 10 }}>
          Choose at least one. This is also how others will find your story.
        </div>
        {groupIndex(items).map((g) => (
          <details
            key={g.kind}
            className="pick"
            open={OPEN_BY_DEFAULT.has(g.kind) || g.items.some((i) => chosen.has(i.slug))}
          >
            <summary>{g.label}</summary>
            <div className="checks">
              {g.items.map((i) => (
                <label key={i.slug}>
                  <input
                    type="checkbox"
                    name="items"
                    value={i.slug}
                    defaultChecked={chosen.has(i.slug)}
                  />{" "}
                  {i.label}
                </label>
              ))}
            </div>
          </details>
        ))}
      </div>

      <div className="field">
        <label className="check">
          <input type="checkbox" name="public_ok" required /> I understand my story will be public
          for anyone in the world to read.
        </label>
      </div>

      <div className="field">
        <label className="check">
          <input type="checkbox" name="no_names" required /> My story names no one, and nothing in
          it would identify a person.
        </label>
      </div>

      <button className="btn btn-moss" type="submit" disabled={pending}>
        {pending ? "Sharing…" : "Share my story"}
      </button>
    </form>
  );
}
