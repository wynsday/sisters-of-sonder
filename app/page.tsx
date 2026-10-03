import Link from "next/link";
import { ORG } from "@/lib/config";

function BookLink({ slug, title }: { slug: string; title: string }) {
  return (
    <p className="book-link">
      <Link href={`/books/${slug}`}>Read {title} &rarr;</Link>
    </p>
  );
}

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

      <section>
        <div className="wrap read">
          <div className="center">
            <h2>The Three Sacred Aspirations</h2>
            <p><em>Aspirations require a purpose, a path, and the desire to walk it.</em></p>
          </div>
          <div className="part" id="suffering">
            <h2>The First Aspiration: Less Suffering</h2>
            <div className="aspire">To cause less suffering, to enable less suffering, to endure less suffering, to stand up and actively prevent suffering. Harm is not suffering but all suffering is harm.</div>
            <div className="consider">The natural world is violent, yet peaceful. It is kind, yet harsh. Violence is a continuum and a cycle. When violence is necessary to reduce suffering, it should be sharp, definitive, controlled; a precision instrument to prevent unnecessary suffering, such as setting a bone. We do not condemn the dragon for killing a sheep in order to sustain itself, as we would not condemn the sheep for assaulting greens, nor condemn the greens for draining the earth. We do condemn the horrors associated with these actions when done with cruel intentions or as byproducts of negligence.</div>
            <BookLink slug="less-suffering" title="The First Aspiration: Considerations of Less Suffering" />
          </div>

          <div className="part" id="wonder">
            <h2>The Second Aspiration: Wonder</h2>
            <div className="aspire">To delight in the mysteries you encounter, and to encounter more than you have.</div>
            <div className="consider">The number of molecules in a single breath is larger than the number of breaths in the atmosphere, which means you have shared a breath with every deity and every ancestor to have breathed upon this earth. A mammoth, an enemy, a friend, a person no one remembers, and a unicorn, if one ever walked the earth, have all shared a breath with you. We are the ancients, for every atom in us is older than the sun. Yet we see the world first with the eyes of a child, delight in the prism rainbows dancing on the wall, and find mystery in the mundane.</div>
            <BookLink slug="wonder" title="The Second Aspiration: Considerations of Wonder" />
          </div>

          <div className="part" id="grace">
            <h2>The Third Aspiration: Grace</h2>
            <div className="aspire">To be kind to yourself, be kind to others, and be kind to life wherever you encounter it.</div>
            <div className="consider">Grace overflows; it is there for anyone who would have it, to hold or share from abundance, as water from a spring can be drawn by whoever comes. Grace contains neither forgiveness nor debt, yet for it we can hold gratitude. No one should demand grace or gratitude; both are elegant kindnesses extended and held freely, never to be earned or repaid. &ldquo;A debt of gratitude&rdquo; is not grace; it is self-imposed or becomes unkind leverage.</div>
            <BookLink slug="grace" title="The Third Aspiration: Considerations of Grace" />
          </div>
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
