export type IndexKind = "foundation" | "aspiration" | "tenet" | "condemnation" | "definition" | "glossary";

export type IndexItem = { slug: string; kind: IndexKind; ordinal: number; label: string };

export const INDEX_GROUPS: { kind: IndexKind; label: string }[] = [
  { kind: "foundation", label: "Foundational Understanding" },
  { kind: "aspiration", label: "Aspirations" },
  { kind: "tenet", label: "Tenets" },
  { kind: "condemnation", label: "Condemnations" },
  { kind: "definition", label: "Definitions" },
  { kind: "glossary", label: "Glossary of Potentially Harmful Behaviors" },
];

export type Story = {
  id: number;
  happened: string;
  could_help: string;
  reviewed_at: string | null;
  story_index: { index_items: IndexItem | null }[];
  story_indicators: { indicators: { slug: string; label: string } | null }[];
};

export const STORY_FIELDS =
  "id, happened, could_help, reviewed_at, story_index(index_items(slug, kind, ordinal, label)), story_indicators(indicators(slug, label))";

export function groupIndex(items: IndexItem[]) {
  return INDEX_GROUPS.map((g) => ({
    ...g,
    items: items.filter((i) => i.kind === g.kind).sort((a, b) => a.ordinal - b.ordinal),
  })).filter((g) => g.items.length);
}
