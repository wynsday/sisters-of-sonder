"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// The books, in the thin red bar under the top bar. The Foundational
// Understanding's book lives on its own page and the Aspirations share one
// page (the "A" button), so neither appears here. The nine Tenets share one
// book for now.
const BOOKS = [
  { href: "/books/tenets", label: "Tenets", title: "Considerations of the Tenets" },
  { href: "/glossary", label: "Glossary", title: "Glossary of Potentially Harmful Behaviors" },
  { href: "/hear-my-voice", label: "Hear My Voice", title: "Hear My Voice" },
]

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
