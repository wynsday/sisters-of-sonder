import type { Metadata } from "next";
import Link from "next/link";
import { ORG } from "@/lib/config";

export const metadata: Metadata = {
  title: "Council of Wisdoms",
  description: `Where to read about the Council of Wisdoms and the Nyxalon of the ${ORG.name}.`,
};

const COUNCIL = [
  { href: "/tenets#power", label: "The Seventh Tenet: Power and Authority" },
  { href: "/definitions#council-of-wisdoms", label: "Council of Wisdoms" },
  { href: "/definitions#wisdom", label: "Wisdom" },
  { href: "/definitions#conclave", label: "Conclave" },
];

const NYXALON = [
  { href: "/tenets#rocking-chair", label: "The Fifth Tenet: The Rocking Chair" },
  { href: "/definitions#nyxalon", label: "Nyxalon" },
  { href: "/definitions#kindly-crone", label: "Kindly Crone" },
  { href: "/definitions#matron-saint", label: "Matron Saint" },
];

function Links({ items }: { items: { href: string; label: string }[] }) {
  return (
    <div className="cards">
      {items.map((i) => (
        <Link key={i.href} className="card card-link" href={i.href}>
          {i.label} &rarr;
        </Link>
      ))}
    </div>
  );
}

export default function Council() {
  return (
    <>
      <div className="page-hero">
        <div className="wrap">
          <h1>The Council of Wisdoms</h1>
        </div>
      </div>

      <section>
        <div className="wrap read">
          <h2>The Council</h2>
          <p>Who holds power, how authority is given, and how a Wisdom is succeeded.</p>
          <Links items={COUNCIL} />
        </div>
      </section>

      <section className="alt">
        <div className="wrap read">
          <h2>The Nyxalon</h2>
          <p>The Pantheon of Mysteries, and the Kindly Crone.</p>
          <Links items={NYXALON} />
        </div>
      </section>
    </>
  );
}
