/** The nine Tenets. Each Consideration is filed under one, so the single
 *  Tenets book can be separated into nine later. */
export const TENETS = [
  { slug: "autonomy", num: "I", ord: "First", name: "Autonomy" },
  { slug: "xenia", num: "II", ord: "Second", name: "Xenia" },
  { slug: "repair", num: "III", ord: "Third", name: "Repair and Our Path Forward" },
  { slug: "reciprocity", num: "IV", ord: "Fourth", name: "Reciprocity" },
  { slug: "rocking-chair", num: "V", ord: "Fifth", name: "The Rocking Chair" },
  { slug: "trauma-informed", num: "VI", ord: "Sixth", name: "Trauma Informed Behavior" },
  { slug: "power", num: "VII", ord: "Seventh", name: "Power and Authority" },
  { slug: "education", num: "VIII", ord: "Eighth", name: "Education" },
  { slug: "testimony", num: "IX", ord: "Ninth", name: "Attestation and Testimony" },
];

export const TENET_SLUGS = TENETS.map((t) => t.slug);
export const tenetOf = (slug: string | null) => TENETS.find((t) => t.slug === slug);
