"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// The books, in the thin red bar under the top bar. The Foundational
// Understanding's book lives on its own page and the Aspirations share one
// page (the "A" button), so neither appears here.
const BOOKS = [
  { href: "/books/autonomy", label: "Autonomy", title: "I. Autonomy" },
  { href: "/books/xenia", label: "Xenia", title: "II. Xenia" },
  { href: "/books/repair", label: "Repair", title: "III. Repair and Our Path Forward" },
  { href: "/books/reciprocity", label: "Reciprocity", title: "IV. Reciprocity" },
  { href: "/books/rocking-chair", label: "Rocking Chair", title: "V. The Rocking Chair" },
  { href: "/books/trauma-informed", label: "Trauma Informed", title: "VI. Trauma Informed Behavior" },
  { href: "/books/power", label: "Power", title: "VII. Power and Authority" },
  { href: "/books/education", label: "Education", title: "VIII. Education" },
  { href: "/books/testimony", label: "Testimony", title: "IX. Attestation and Testimony" },
  { href: "/glossary", label: "Glossary", title: "Glossary of Potentially Harmful Behaviors" },
  { href: "/hear-my-voice", label: "Hear My Voice", title: "Hear My Voice" },
];

export default function BookBar() {
  const pathname = usePathname();
  return (
    <nav className="book-bar" aria-label="Books">
      <div className="wrap">
        {BOOKS.map((b) => (
          <Link
            key={b.href}
            href={b.href}
            title={b.title}
            aria-current={pathname.startsWith(b.href) ? "page" : undefined}
          >
            {b.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
