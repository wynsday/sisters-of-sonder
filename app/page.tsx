import Link from "next/link";
import { ORG } from "@/lib/config";

export default function Home() {
  return (
    <>
    <div className="hero">
      <div className="wrap">
        <img className="logo" src="/logo.svg" alt="The Sisters of Sonder emblem" />
        <h1>{ORG.name}</h1>
        <p className="lede"><em>{ORG.motto}</em></p>
        <Link className="btn btn-gold" href="/aspirations">Read the Sacred Aspirations</Link>
        <Link className="btn btn-ghost" href="/join">Join and contribute</Link>
      </div>
    </div>

    <section>
      <div className="wrap read">
        <div className="kicker">Why we exist</div>
        <h2>A safe fourth space</h2>
        <p>When we look at history, we find mythologies full of stories, belief structures full of aspirations, and religions full of controlling methodologies for shaping human behavior. The United States Constitution protects a religion&rsquo;s right to govern itself: to choose ministers, set discipline, and order itself. Within that protection, is where people&mdash; especially women&mdash; can find the most harm. The {ORG.name} hold our religious freedom as a trust and shield for the benefit of our members, not our leaders. Everyone deserves a safe space to learn about themselves and the world at large so they can live their own full, complex life.</p>
        <p>We acknowledge and condemn the social and individual violences caused by religion. We do, however, recognize the sacred in aspirations. We do not found yet another patriarchal religion, rather we consolidate the voices of the people into a quilt of solidarity to reveal the belief structure within us all.</p>
        <p>Our Sacred Aspirations are grounded in reduction and consideration; Tenets provide rights and dictate the expected behavior of members. They should augment your life, not overtake it.</p>
      </div>
    </section>

    <section className="alt">
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
        <p className="center" style={{marginTop: "28px"}}><Link href="/aspirations">Read the Foundational Understanding and the Nine Tenets &rarr;</Link></p>
      </div>
    </section>

    <section>
      <div className="wrap">
        <div className="two-col">
          <div>
            <div className="kicker">A crowd-sourced faith</div>
            <h2>The Books of Considerations</h2>
            <p>We may be the first religion written by its people from stories that already exist. Each Aspiration and each Tenet has its own Book of Considerations, and the Quilt of the Considerate holds all the rest. Together they gather myths and folklore from around the world, looking for the ideas that more than one culture arrived at on its own.</p>
            <p>When the same truth shows up in different tongues, on different continents, in different ages, we take notice. Members offer these stories, and each is reviewed before it is placed in its book.</p>
            <Link className="btn btn-moss" href="/books">Explore the Considerations</Link>
          </div>
          <div className="consider">
            The number of molecules in a single breath is larger than the number of breaths in the atmosphere, which means you have shared a breath with every deity and every ancestor to have breathed upon this earth. We are the ancients, for every atom in us is older than the sun.
          </div>
        </div>
      </div>
    </section>

    <section className="alt">
      <div className="wrap read center">
        <div className="kicker">Myth is a language for thinking</div>
        <h2>Not an explanation</h2>
        <p>We embrace mythology and folklore as a way to practice and appreciate wonder. It is not a literal belief in monsters and deities (or is it?), but a consideration of the patterns in meaning found in the quilt of mysteries.</p>
        <Link className="btn btn-gold" href="/join">Create an account</Link>
      </div>
    </section>
    </>
  );
}
