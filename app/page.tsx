import Link from "next/link";
import { ORG } from "@/lib/config";

export default function Home() {
  return (
    <>
      <div className="hero">
        <div className="wrap">
          <img className="logo" src="/logo.svg" alt="The Sisters of Sonder emblem" />
          <h1>{ORG.name}</h1>
          <p className="motto">
            <em>{ORG.motto}</em>
          </p>
          <p className="lede">
            We are not yet another patriarchal religion. We consolidate the voices of the people
            into a quilt of solidarity to reveal the belief structures within us all.
          </p>
          <div className="choices">
            <Link className="choice" href="/aspirations#foundation">
              Foundational Understanding
            </Link>
            <Link className="choice choice-main" href="/join">
              <span>Join</span>
              <span>and contribute</span>
            </Link>
            <Link className="choice" href="/aspirations#tenets">
              Nine Tenets of Agreement
            </Link>
          </div>
        </div>
      </div>

      <section>
        <div className="wrap">
          <div className="center">
            <div className="kicker">The Three Sacred Aspirations</div>
            <h2>A purpose, a path, and the desire to walk it</h2>
          </div>
          <div className="cards">
            <div className="card">
              <div className="num">I</div>
              <h3>Less Suffering</h3>
              <p>To cause less suffering, to enable less suffering, to endure less suffering, to stand up and actively prevent suffering.</p>
            </div>
            <div className="card">
              <div className="num">II</div>
              <h3>Wonder</h3>
              <p>To delight in the mysteries you encounter, and to encounter more than you have.</p>
            </div>
            <div className="card">
              <div className="num">III</div>
              <h3>Grace</h3>
              <p>To be kind to yourself, be kind to others, and be kind to life wherever you encounter it.</p>
            </div>
          </div>
          <p className="center" style={{ marginTop: 28 }}>
            <Link href="/aspirations">Read the Sacred Aspirations &rarr;</Link>
          </p>
        </div>
      </section>

      <section className="alt">
        <div className="wrap read">
          <div className="kicker">Why we exist</div>
          <h2>The sacred in aspiration</h2>
          <p>When we look at history and the religions therein, we find belief structures full of aspirations and religions full of controlling methodologies for shaping human behavior, leveraging the aspirations of the many to guide the masses.</p>
          <p>We acknowledge and condemn the social and individual violences caused by religion. We do, however, recognize the sacred in aspirations. This religion is spiritual, it is thoughtful, and it holds its condemnations in writing to remember why we have our Foundational Understanding, the Three Sacred Aspirations, and to temper our Nine Tenets of Agreement.</p>
          <p>Our sacred aspirations are grounded in reduction and consideration. They should augment your life, not overtake it.</p>
        </div>
      </section>

      <section>
        <div className="wrap read center">
          <div className="kicker">Myth is a language for thinking</div>
          <h2>Not an explanation</h2>
          <p>We embrace mythology and folklore as a way to practice and appreciate wonder. It is not a literal belief in monsters and deities (or is it?), but a consideration of the patterns in meaning found in the quilt of mysteries.</p>
          <Link className="btn btn-gold" href="/join">Create an account</Link>
        </div>
      </section>

      <section className="alt">
        <div className="wrap symbol">
          <img src="/logo.svg" alt="" className="symbol-mark" />
          <div>
            <div className="kicker">Our symbol</div>
            <h2>The ring, the banner, and the dew drop</h2>
            <p>The symbol of the {ORG.name} is a banner and ring with a dew drop held inside three wreaths of double pentagons. The pentagons represent the five elements, and each wreath is one of our aspirations, braided with the nine tenets and the foundational Understanding. If you see rays, we didn&rsquo;t draw them; you did.</p>
            <p>The dew drop is water that doesn&rsquo;t belong to anyone. Water cycles, it rises, falls, gathers, and rises again.</p>
            <div className="consider">The far side of a dew drop holds the world upside down. The light within holds the same world in a different perspective, just like each of us, and with a tiny movement, a rainbow is thrown across a wall, beautiful and undeniable. Imagine, how many potential rainbows exist inside of you?</div>
          </div>
        </div>
      </section>
    </>
  );
}
