"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// The thin red bar under the top bar: the books, plus every page the top
// buttons do not reach. The Foundational Understanding's book lives on its
// own page and the Aspirations share one page (the "A" button), so neither
// appears here. The Tenets' book is at the bottom of the Tenets page.
const PAGES = [
  { href: "/hear-my-voice", label: "Hear My Voice", title: "Hear My Voice" },
  { href: "/glossary", label: "Glossary", title: "Glossary of Potentially Harmful Behaviors" },
  { href: "/definitions", label: "Definitions", title: "Definitions" },
  { href: "/report", label: "Report an Issue", title: "Report an issue (members only)", members: true },
];

export default function BookBar() {
  const pathname = usePathname();
  return (
    <nav className="book-bar" aria-label="Books and pages">
      <div className="wrap">
        {PAGES.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            title={p.title}
            className={p.members ? "members" : undefined}
            aria-current={pathname.startsWith(p.href) ? "page" : undefined}
          >
            {p.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
