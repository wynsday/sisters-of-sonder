import type { Metadata } from "next";
import { ORG } from "@/lib/config";
import { loadParts } from "@/lib/feed";
import AddConsideration from "@/components/AddConsideration";
import BookParts from "@/components/BookParts";
import ShareButton from "@/components/ShareButton";

export const metadata: Metadata = {
  title: "The Foundational Understanding",
  description: "The Condemnations of Cults and Religion and the Foundational Understanding.",
};

export const revalidate = 300;

export default async function Foundation() {
  const parts = await loadParts("foundation");
  return (
    <>
      <div className="page-hero">
        <div className="wrap">
          <h1>The Foundational Understanding</h1>
          <p>The Condemnations of Cults and Religion, and the Foundational Understanding</p>
        </div>
      </div>

      <section>
        <div className="wrap read">
          <nav className="toc" aria-label="Contents">
            <ol>
              <li><a href="#condemnations">The Condemnations of Cults and Religion</a></li>
              <li><a href="#foundation">The Foundational Understanding</a></li>
              <li><a href="#book">Considerations of the Foundational Understanding</a></li>
            </ol>
          </nav>

          <p>When we look at history, we find mythologies full of stories, belief structures full of aspirations, and religions full of controlling methodologies for shaping human behavior. The United States Constitution protects a religion&rsquo;s right to govern itself: to choose ministers, set discipline, and order itself. Within that protection, is where people&mdash; especially women&mdash; can find the most harm. The {ORG.name} hold our religious freedom as a trust and shield for the benefit of our members, not our leaders. Everyone deserves a safe space to learn about themselves and the world at large so they can live their own full, complex life.</p>
          <p>We acknowledge and condemn the social and individual violences caused by religion. We do, however, recognize the sacred in aspirations. We do not found yet another patriarchal religion, rather we consolidate the voices of the people into a quilt of solidarity to reveal the belief structure within us all. This religion is spiritual, it is thoughtful, and it holds its condemnations in writing to remember why we have our Foundational Understanding, the Three Sacred Aspirations, and our 9 Tenets of Agreement.</p>

          {/* ===== Condemnations ===== */}
          <div className="part" id="condemnations">
            <h2>The Condemnations of Cults and Religion</h2>
            <details className="trigger-entry">
              <summary>
                <span className="indicator">Trigger warning</span>
                <div className="open-hint">Folded closed. Open it when and if you choose.</div>
              </summary>
              <div className="trigger-body">
                <ul className="condemn">
                  <li><strong>Crusades.</strong> Forced capitulations to proclaim belief, forced conversion, and the slaying of &ldquo;them&rdquo; over religious belief.
                    <ShareButton about="c-crusades" />
                  </li>
                  <li><strong>Oppression.</strong> Harsh punishments and unfair restrictions in a bid for dominance and control; demands for submission, self-policing, and personal sacrifice.
                    <ShareButton about="c-oppression" />
                  </li>
                  <li><strong>Slavery.</strong> Treating people as property or worse.
                    <ShareButton about="c-slavery" />
                  </li>
                  <li><strong>Exploitation.</strong> Forced or manipulated labors, demands for resources without trade, and sexual controls levied against persons.
                    <ShareButton about="c-exploitation" />
                  </li>
                  <li><strong>Erasure.</strong> Voices and deeds filtered out or replaced based on genetic disposition or non-choice characteristics.
                    <ShareButton about="c-erasure" />
                  </li>
                  <li><strong>Torture.</strong> Deliberate infliction of grievous harm, including rape, and the failures to prevent it or ensure accountability especially if it delivers lasting trauma.
                    <ShareButton about="c-torture" />
                  </li>
                  <li><strong>Knowledge Prevention.</strong> Withholding education, prevention of exposure to societies outside their own, lack of transparency, and knowingly pushing harmful misinformation through top-down indoctrination.
                    <ShareButton about="c-knowledge-prevention" />
                  </li>
                  <li><strong>Central Charismatic Cult Leadership.</strong> A single dominant figure or group who demands obedience, devotion, and tribute on threat of heavy or invasive punishment.
                    <ShareButton about="c-central-charismatic-cult-leadership" />
                  </li>
                  <li><strong>Denial of Autonomy.</strong> Corporal punishment, demands of self-harm, requirements of self-sacrifice, prevention of another person from receiving medical care, and thought control.
                    <ShareButton about="c-denial-of-autonomy" />
                  </li>
                  <li><strong>Religion as Ruling Divinity or Government System.</strong> Forcing religious belief on those who do not choose to participate on pain of significant life impacting enforcement, reduction of rights to force those outside the system to participate or to replace the religious beliefs of others, or claiming divine interpretation that affects the quality of life and wellbeing of the public.
                    <ShareButton about="c-religion-as-ruling-divinity-or-government-system" />
                  </li>
                </ul>
              </div>
            </details>
            <p>We hold true our Foundational Understanding. Our Sacred Aspirations are grounded in reduction and consideration; Tenets provide rights and dictate the expected behavior of members. They should augment your life, not overtake it.</p>
          </div>

          {/* ===== Foundation ===== */}
          <div className="part" id="foundation">
            <h2><em>The Foundational Understanding</em></h2>
            <p>All things are exposed to change. Change is what allows us to experience the wonder in our existence; it is what is needed to reduce suffering. At times, change brings friction that requires us to hold grace for ourselves and others. Our lives are cycles upon cycles that can balance when they move through their phases. Rest and moments of stillness are important phases in the cycle of life. Holding on to a single phase when we should be cycling is disruptive to health and happiness.</p>
            <div className="consider">Daodejing 76 and 40, Ecclesiastes 3:1&ndash;8</div>
            <p>Considerations can be held as both true and not true; they are able to fall into place, provide inspiration, be dismissed, or spark wonder. Each individual can make their own decisions or non-decisions about considerations.</p>
          </div>

          <div className="part" id="book">
            <h2>Considerations of the Foundational Understanding</h2>
            <AddConsideration book="foundation" />
            <BookParts slug="foundation" parts={parts} />
          </div>
        </div>
      </section>
    </>
  );
}
