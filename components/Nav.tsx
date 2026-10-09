"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Letter buttons, right-aligned. The full name shows on hover and is read
// aloud by screen readers.
const LINKS = [
  { href: "/foundation", letter: "F", label: "Foundation" },
  { href: "/aspirations", letter: "A", label: "Aspirations" },
  { href: "/books", letter: "C", label: "Quilt of the Considerate" },
  { href: "/hear-my-voice", letter: "E", label: "Experiences: Hear My Voice" },
  { href: "/tenets", letter: "T", label: "Tenets" },
  { href: "/account", letter: "👤", label: "Account" },
];

export default function Nav() {
  const pathname = usePathname();
  const current = (href: string) => (href === "/books" ? pathname === "/books" : pathname.startsWith(href));

  return (
    <nav className="nav letters" aria-label="Main">
      {LINKS.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          title={l.label}
          aria-label={l.label}
          aria-current={current(l.href) ? "page" : undefined}
          className={l.label === "Account" ? "profile" : undefined}
        >
          {l.letter}
        </Link>
      ))}
    </nav>
  );
}
