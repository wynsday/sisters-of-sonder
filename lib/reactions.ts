export type ReactionKind = "heart" | "wounded" | "star" | "up" | "down" | "trigger";

/** In display order. Private ones are counted for admins only. */
export const REACTIONS: { kind: ReactionKind; icon: string; label: string; private?: boolean }[] = [
  { kind: "heart", icon: "❤️", label: "Heart" },
  { kind: "wounded", icon: "❤️‍🩹", label: "Wounded heart: it hurts my heart, or I care" },
  { kind: "star", icon: "⭐", label: "Gold star" },
  { kind: "up", icon: "👍", label: "Thumbs up" },
  { kind: "down", icon: "👎", label: "Thumbs down", private: true },
  { kind: "trigger", icon: "!", label: "This may be triggering", private: true },
];
