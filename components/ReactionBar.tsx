"use client";

import Link from "next/link";
import { REACTIONS, type ReactionKind } from "@/lib/reactions";

type Props = {
  counts: Partial<Record<ReactionKind, number>>;
  mine: ReactionKind[];
  signedIn: boolean;
  onToggle: (kind: ReactionKind, on: boolean) => void;
};

export default function ReactionBar({ counts, mine, signedIn, onToggle }: Props) {
  return (
    <div className="reactions" role="group" aria-label="Reactions">
      {REACTIONS.map((r) => {
        const on = mine.includes(r.kind);
        const count = counts[r.kind];
        const label = `${r.label}${r.private ? " (seen only by reviewers)" : ""}`;
        const content = (
          <>
            <span className={r.kind === "trigger" ? "bang" : "icon"} aria-hidden="true">
              {r.icon}
            </span>
            {count ? <span className="count">{count}</span> : null}
          </>
        );
        return signedIn ? (
          <button
            key={r.kind}
            type="button"
            className={`reaction members ${r.kind}${on ? " on" : ""}`}
            aria-pressed={on}
            aria-label={label}
            title={label}
            onClick={() => onToggle(r.kind, !on)}
          >
            {content}
          </button>
        ) : (
          <Link key={r.kind} className={`reaction members ${r.kind}`} href="/join?mode=signin" title={`${label}: members only`}>
            {content}
          </Link>
        );
      })}
    </div>
  );
}
