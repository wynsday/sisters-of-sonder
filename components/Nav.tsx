"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/aspirations", label: "Sacred Aspirations" },
  { href: "/books", label: "Considerations" },
  { href: "/council", label: "Council of Wisdoms" },
  { href: "/account", label: "Account" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const current = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <button
        className="nav-toggle"
        aria-expanded={open}
        aria-controls="nav"
        onClick={() => setOpen(!open)}
      >
        Menu
      </button>
      <nav className={`nav${open ? " open" : ""}`} id="nav">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            aria-current={current(l.href) ? "page" : undefined}
            onClick={() => setOpen(false)}
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
