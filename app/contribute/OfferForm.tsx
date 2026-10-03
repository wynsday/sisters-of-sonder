"use client";

import { useActionState } from "react";
import { type Book, FORMS } from "@/lib/books";
import { offerConsideration, type OfferState } from "./actions";

export default function OfferForm({ books, chosen }: { books: Book[]; chosen: string }) {
  const [state, action, pending] = useActionState<OfferState, FormData>(offerConsideration, {});
  const v = state.values ?? {};
  // Re-mount fields with what was typed whenever the server sends it back.
  const key = JSON.stringify(state);

  return (
    <form action={action} key={key}>
      {state.error && <p className="error">{state.error}</p>}

      <div className="field">
        <span className="prompt">What are you offering?</span>
        <div className="checks" style={{ flexDirection: "column", gap: 8, marginTop: 8 }}>
          {FORMS.map((f) => (
            <label key={f.value}>
              <input type="radio" name="form" value={f.value} required defaultChecked={v.form === f.value} />{" "}
              <strong>{f.label}</strong>: {f.describe}
            </label>
          ))}
        </div>
      </div>

      <div className="field">
        <label htmlFor="title">Title</label>
        <input id="title" name="title" type="text" maxLength={200} required defaultValue={v.title} />
      </div>

      <div className="field">
        <label htmlFor="concept">Your Consideration</label>
        <textarea
          id="concept"
          name="concept"
          maxLength={20000}
          required
          style={{ minHeight: 240 }}
          defaultValue={v.concept}
        />
        <div className="hint">
          The premise with its affirmation or condemnation, the parable, or the stories and the
          opinion they share.
        </div>
      </div>

      <div className="field">
        <label htmlFor="stories">Sources</label>
        <textarea id="stories" name="stories" maxLength={50000} defaultValue={v.stories} />
        <div className="hint">
          Needed for stories from different cultures: name each culture and where its story can
          be read (a book, a verse, a collection, a link). Optional otherwise.
        </div>
      </div>

      <div className="field">
        <label htmlFor="suggested_book">Which book do you think it belongs in?</label>
        <select id="suggested_book" name="suggested_book" defaultValue={v.suggested_book || chosen || "quilt"}>
          {books.map((b) => (
            <option key={b.slug} value={b.slug}>
              {b.title}
            </option>
          ))}
        </select>
      </div>

      <button className="btn btn-moss" type="submit" disabled={pending}>
        {pending ? "Offering…" : "Offer for review"}
      </button>
    </form>
  );
}
