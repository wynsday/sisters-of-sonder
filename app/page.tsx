import Link from "next/link";
import { ORG } from "@/lib/config";

const ASPIRATIONS = [
  {
    id: "suffering", slug: "less-suffering", ord: "First", name: "Less Suffering",
    aspire: "To cause less suffering, to enable less suffering, to endure less suffering, to stand up and actively prevent suffering.",
  },
  {
    id: "wonder", slug: "wonder", ord: "Second", name: "Wonder",
    aspire: "To delight in the mysteries you encounter, and to encounter more than you have.",
  },
  {
    id: "grace", slug: "grace", ord: "Third", name: "Grace",
    aspire: "To be kind to yourself, be kind to others, and be kind to life wherever you encounter it.",
  },
];

export default function Home() {
  return (
    <>
      <div className="hero home-hero">
        <div className="wrap">
          <img className="logo" src="/logo.svg" alt="The Sisters of Sonder emblem" />
          <h1>{ORG.name}</h1>
          <p className="motto">
            <em>{ORG.motto}</em>
          </p>
          <p className="lede">
            We are not another patriarchal religion. We consolidate the voices of the people
            into a quilt of solidarity to reveal the belief structures within us all.
          </p>
          <div className="choices">
            <Link className="choice" href="/foundation">
              Foundational Understanding
            </Link>
            <Link className="choice choice-main" href="/join">
              <span>Join</span>
              <span>and contribute</span>
            </Link>
            <Link className="choice" href="/tenets">
              Nine Tenets of Agreement
            </Link>
          </div>
        </div>
      </div>

      <section className="aspirations-section" id="aspirations">
        <div className="wrap">
          <div className="center">
            <h2>The Three Sacred Aspirations</h2>
            <p><em>Aspirations require a purpose, a path, and the desire to walk it.</em></p>
          </div>
          <div className="aspirations">
            {ASPIRATIONS.map((a) => (
              <Link key={a.slug} id={a.id} className="aspiration" href={`/aspirations#${a.slug}`}>
                <span className="ordinal">The {a.ord} Aspiration</span>
                <h3>{a.name}</h3>
                <span className="aspire">{a.aspire}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="alt">
        <div className="wrap read">
          <div className="kicker">Why we exist</div>
          <h2>A Trust and a Shield</h2>
          <p>
            The United States Constitution protects a religion&rsquo;s right to govern itself, and
            within that &ldquo;protection&rdquo; is where people&mdash; especially women and
            children&mdash; find harm that often has no remedy. The {ORG.name} hold our
            constitutional religious freedoms as a trust and a shield for our members, not our
            leaders.
          </p>
          <Link className="btn btn-moss" href="/foundation">
            Read the Foundational Understanding
          </Link>
        </div>
      </section>

      <section>
        <div className="wrap read center">
          <div className="kicker">Myth and wonder</div>
          <h2>Why we gather the world&rsquo;s stories</h2>
          <p>
            Why mythology and folklore matter to us is set out in{" "}
            <Link href="/tenets#education">the Eighth Tenet</Link>. Members gather those stories
            into the Books of Considerations.
          </p>
          <Link className="btn btn-gold" href="/join">Create an account</Link>
        </div>
      </section>

      <section className="alt">
        <div className="wrap symbol">
          <img src="/logo-light.svg" alt="" className="symbol-mark" />
          <div>
            <div className="kicker">Our Symbol</div>
            <h2>The Ring, the Banner, and the Dew Drop</h2>
            <p>The symbol of the {ORG.name} is a banner and ring with a dew drop held inside three wreaths of double pentagons. The pentagons represent the five elements, and each wreath is one of our Aspirations, braided with the Nine Tenets and the Foundational Understanding. The banner is symbolically left blank for you, as you decide what Considerations you hold dear. Take a second to look at the dew drop, and let your eyes relax. If you see rays, we didn&rsquo;t draw them; you did.</p>
            <div className="consider">The dew drop is water that doesn&rsquo;t belong to anyone. Water cycles, it rises, falls, gathers, and rises again.<br />The far side of a dew drop holds the world upside down. The light within holds the same world in a different perspective, just like each of us, and with a tiny movement, a rainbow is thrown across a wall, beautiful and undeniable. Imagine, how many potential rainbows exist inside of you?</div>
          </div>
        </div>
      </section>
    </>
  );
}
