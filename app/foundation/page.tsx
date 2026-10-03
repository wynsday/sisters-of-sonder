import type { Metadata } from "next";
import { ORG } from "@/lib/config";
import BookLinks from "@/components/BookLinks";

export const metadata: Metadata = {
  title: "The Foundational Understanding",
  description: "The Condemnations of Cults and Religion and the Foundational Understanding.",
};

export default function Foundation() {
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
                  <li><strong>Crusades.</strong> Forced capitulations to proclaim belief, forced conversion, and the slaying of &ldquo;them&rdquo; over religious belief.</li>
                  <li><strong>Oppression.</strong> Harsh punishments and unfair restrictions in a bid for dominance and control; demands for submission, self-policing, and personal sacrifice.</li>
                  <li><strong>Slavery.</strong> Treating people as property or worse.</li>
                  <li><strong>Exploitation.</strong> Forced or manipulated labors, demands for resources without trade, and sexual controls levied against persons.</li>
                  <li><strong>Erasure.</strong> Voices and deeds filtered out or replaced based on genetic disposition or non-choice characteristics.</li>
                  <li><strong>Torture.</strong> Deliberate infliction of grievous harm, including rape, and the failures to prevent it or ensure accountability especially if it delivers lasting trauma.</li>
                  <li><strong>Knowledge Prevention.</strong> Withholding education, prevention of exposure to societies outside their own, lack of transparency, and knowingly pushing harmful misinformation through top-down indoctrination.</li>
                  <li><strong>Central Charismatic Cult Leadership.</strong> A single dominant figure or group who demands obedience, devotion, and tribute on threat of heavy or invasive punishment.</li>
                  <li><strong>Denial of Autonomy.</strong> Corporal punishment, demands of self-harm, requirements of self-sacrifice, prevention of another person from receiving medical care, and thought control.</li>
                  <li><strong>Religion as Ruling Divinity or Government System.</strong> Forcing religious belief on those who do not choose to participate on pain of significant life impacting enforcement, reduction of rights to force those outside the system to participate or to replace the religious beliefs of others, or claiming divine interpretation that affects the quality of life and wellbeing of the public.</li>
                </ul>
              </div>
            </details>
            <p>We hold true our Foundational Understanding. Our Sacred Aspirations are grounded in reduction and consideration; Tenets provide rights and dictate the expected behavior of members. They should augment your life, not overtake it.</p>
          </div>

          {/* ===== Foundation ===== */}
          <div className="part" id="foundation">
            <h2><em>The Foundational Understanding</em></h2>
            <p>All things are exposed to change. Change is what allows us to experience the wonder in our existence; it is what is needed to reduce suffering. At times, change brings friction that requires us to hold grace for ourselves and others. Our lives are cycles upon cycles that can balance when they move; rest and moments of stillness are part of the movement and cycle of life. Holding one position or aspiring in only one direction when we should be cycling is disruptive to health and happiness.</p>
            <div className="consider">Daodejing 76 and 40, Ecclesiastes 3:1&ndash;8</div>
            <p>Considerations can be held as both true and not true; they are able to fall into place, provide inspiration, be dismissed, or spark wonder. Each individual can make their own decisions or non-decisions about considerations.</p>
            <BookLinks slug="foundation" title="Considerations of the Foundational Understanding" />
          </div>

        </div>
      </section>
    </>
  );
}
