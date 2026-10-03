import type { Metadata } from "next";
import Link from "next/link";
import { ORG } from "@/lib/config";

export const metadata: Metadata = {
  title: "Sacred Aspirations",
  description:
    "The Foundational Understanding, the Three Sacred Aspirations, the Nine Tenets of Agreement, the Condemnations, and Definitions.",
};

const TENETS = [
  { id: "autonomy", ord: "First", name: "Autonomy", book: "autonomy" },
  { id: "xenia", ord: "Second", name: "Xenia", book: "xenia" },
  { id: "repair", ord: "Third", name: "Repair and Our Path Forward", book: "repair" },
  { id: "reciprocity", ord: "Fourth", name: "Reciprocity", book: "reciprocity" },
  { id: "rocking-chair", ord: "Fifth", name: "The Rocking Chair", book: "rocking-chair" },
  { id: "trauma-informed", ord: "Sixth", name: "Trauma Informed Behavior", book: "trauma-informed" },
  { id: "power", ord: "Seventh", name: "Power and Authority", book: "power" },
  { id: "education", ord: "Eighth", name: "Education", book: "education" },
  { id: "testimony", ord: "Ninth", name: "Attestation and Testimony", book: "testimony" },
];

function BookLink({ slug, title }: { slug: string; title: string }) {
  return (
    <p className="book-link">
      <Link href={`/books/${slug}`}>Read {title} &rarr;</Link>
    </p>
  );
}

function Tenet({ id, children }: { id: string; children: React.ReactNode }) {
  const t = TENETS.find((x) => x.id === id)!;
  return (
    <div className="part tenet" id={t.id}>
      <h2>
        The {t.ord} Tenet: {t.name}
      </h2>
      {children}
      <BookLink slug={t.book} title={`The ${t.ord} Tenet: Considerations of ${t.name}`} />
    </div>
  );
}

const DEFINITIONS: [string, React.ReactNode][] = [
  ["Accusation", "Statement naming who caused a harm."],
  ["Attestation", "Written account of a person’s experience."],
  ["Autonomy", "A person’s or group’s power, authority, and responsibility over what is inherently theirs."],
  ["Bylaws", "The changeable legal and administrative collection of processes managed by appointed authorities, subordinate to canon. Accommodates all state and federal requirements for a religious entity."],
  [
    "Canon",
    <>
      Doctrine that carries authority and power within itself. Canon can be
      <ul>
        <li><strong>Sealed:</strong> The highest authority requiring adherence; texts closed by ceremony are never to be changed. Only the most important beliefs that transcend time are sealed. A sealed canon text cannot become unsealed or altered. Copies can be made, distributed, abridged, and decorated by the membership as long as it is treated respectfully and retains its spirit.</li>
        <li><strong>Unsealed:</strong> Core doctrine that can be created, altered, or deleted.</li>
        <li><strong>Considerations:</strong> Approved considerations can conflict; the point is to provide wonder, connect to adjunct belief, or allow critical thinking and meaningful rubber banding.</li>
      </ul>
    </>,
  ],
  ["Complaint", "Report of a harm, incident, issue, or demand for remedy."],
  ["Conclave", "The 3 to 27 people that choose a Wisdom’s successor."],
  ["Consideration", "An offered thought that may be held as true, not true, or both, which each person decides for themselves."],
  ["Considerate", "A node of members, led by a member of the clergy."],
  ["Council of Wisdoms", `The Wisdoms together, who hold the power of the ${ORG.name} solely to delegate and retract authority and manage canon.`],
  ["Disinterested party", "A person with no personal, familial, romantic, or financial ties to anyone in the claim, and no stake in its outcome."],
  ["Fourth space", "The spiritual space, between the third space (public) and the fifth (sanctuary)."],
  ["Guest", "One who is in the role of enjoying the auspices of a host; obligation ends when the role is abused or overstayed."],
  ["Harm", "Physical, mental, or spiritual damage or injury; all suffering is harm."],
  ["Host", "One who provides auspices within a role; one who extorts the guest is no longer a host."],
  ["Kindly Crone", `First Matron of the Nyxalon and Matron Saint of the ${ORG.name}. She represents the concept of the little old lady and the grandmother who kindly care for those around her.`],
  ["Ledger", "A record."],
  ["Left and Found", "A designated area where items left may be found by anyone, without reciprocity or gatekeeping."],
  ["Matron Saint", "A figure of the Nyxalon as an honored concept acting as patroness of a domain."],
  ["Member", "Any human who agrees to the Tenets, Bylaws, Foundational Understanding, and Aspirations. Beliefs are their own, and behavior is in line with the canon."],
  ["Mutual aid", "The giving and taking of items, time, mental load, labor, or money, under clear rules of reciprocity."],
  ["Node", "A Considerate with a board, clergy, central concept (usually matron or patron)"],
  ["Nyxalon", "The Pantheon of Mysteries, whose figures include the Matrons."],
  ["Remedy", "An action or payment to address a complaint."],
  ["Repair", "Creating change to prevent a future mishap."],
  ["Role", "A position with responsibility."],
  [`${ORG.name} (${ORG.short})`, "A religion founded to promote the beliefs and wellbeing of its people, to protect its members, especially women and traumatized peoples."],
  ["Sonder", "Realizing and appreciating that everyone’s life is as complex, rich, full, and dynamic as one’s own; to fathom deeply in order to consider the complexities that arise from this understanding."],
  ["Spoon theory", "A metaphor for limited daily energy, especially among people with chronic illness or disability (Christine Miserandino, 2003)."],
  ["Suffering", "Pain caused by injury, illness, or loss, whether physical, mental, or emotional; always a harm."],
  ["Testimony", "An account of an experience that verbal, signed, filmed, or otherwise conveyed beyond writing."],
  ["Trauma informed behavior", "Learned behavior that is more effective and causes less suffering when interacting with affected community."],
  [
    "Wisdom",
    "A member of the Council of Wisdoms; never a man. May be a trans woman who has lived as and been known as a sister. These are the exemplars of the Kindly Crone. Note: Having a women only council does not erase or filter out men’s voices or deeds since men can be granted authority as board members and clergy, which is an authority Wisdoms cannot have.",
  ],
];

export default function Aspirations() {
  return (
    <>
      <div className="page-hero">
        <div className="wrap">
          <h1>The Sacred Aspirations</h1>
          <p>The Three Sacred Aspirations in Nine Fundamental Tenets</p>
        </div>
      </div>

      <section>
        <div className="wrap read">
          <nav className="toc" aria-label="Contents">
            <ol>
              <li><a href="#condemnations">The Condemnations</a></li>
              <li><a href="#foundation">The Foundational Understanding</a></li>
              <li><a href="#suffering">First Aspiration: Less Suffering</a></li>
              <li><a href="#wonder">Second Aspiration: Wonder</a></li>
              <li><a href="#grace">Third Aspiration: Grace</a></li>
              <li><a href="#tenets">The Nine Tenets</a></li>
              {TENETS.map((t) => (
                <li key={t.id}>
                  <a href={`#${t.id}`}>{t.ord} Tenet: {t.name}</a>
                </li>
              ))}
              <li><a href="#definitions">Definitions</a></li>
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
            <p><em>Aspirations require a purpose, a path, and the desire to walk it.</em></p>
          </div>

          {/* ===== Aspirations ===== */}
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

          {/* ===== Tenets ===== */}
          <div className="part" id="tenets">
            <h2>The Nine Tenets of Agreement</h2>
          </div>

          <Tenet id="autonomy">
            <div className="canon">Non-negotiable. You have the power and responsibility of you. We have the power and responsibility of we.</div>
            <p>Each person holds what is theirs: their body, their boundaries, their deliberate thoughts, their deliberate actions, their beliefs, and their mistakes; all without needing to publicly announce, justify, or publish any of it. Boundaries may be held unspoken; a request is a request and a share is a share, neither is a mandate. The interior is your truest self. What you think is yours. What you believe is yours. We do not curate your thoughts; that is for you to do. We offer thoughts for consideration and encourage you to make your own decisions.</p>
            <p>Each group also has autonomy that it sets for itself. We know from the Foundational Understanding that boundaries and beliefs will naturally change and cycle. Because of this, members may choose to leave the group without reprisal or harassment.</p>
            <p>Autonomy and Less Suffering go hand in hand while being each other&rsquo;s opposition.</p>
          </Tenet>

          <Tenet id="xenia">
            <div className="canon">Be appropriate in the role you have accepted.</div>
            <p>Xenia is about being appropriate in the role of guest and host. For us it extends to any role a person accepts. It allows rejection if the role is abused. Obligation always has an end; a guest that abuses the host or will not leave is no longer a guest. A host that extorts the guest is no longer a host.</p>
          </Tenet>

          <Tenet id="repair">
            <div className="canon">Positive change is repair; an apology is not.</div>
            <p>We do not accept words in place of a change of behavior. Change the behavior going forward, or double down; both show where a person stands. Acknowledge the harm, find the cause, then take action to prevent it from happening again. Problem solving is the path forward; apologies seek redemption without change. Some things cannot be forgiven; sometimes it is best to move forward without demanding acceptance or consolation from the person who requires repair.</p>
            <p>Grace helps us through repair to a path forward.</p>
          </Tenet>

          <Tenet id="reciprocity">
            <div className="canon">A person can find what was left for them without reciprocity. Within a Considerate, what is received is received by all and is equal; clear boundaries, a community communications culture, and reciprocity rules govern the node beyond canon and bylaws.</div>
            <p>Items can be left to be found in a designated Left and Found area, where their new owners can find them. When things are left, they are not gifts. The person who finds is not a taker, not a receiver, nor must they prove a condition or identify in any way; no moral high ground exists over a person who finds. Left to be found is equal on both sides and is open to all persons, which is not restricted to membership. Reciprocity is not a consideration for Left and Found.</p>
            <p>A person who never leaves and always finds may overstay their welcome, and the person who always leaves and never finds is not participating in the cycle and exists in stagnation. Both are disruptions of the system; an individual whose actions would significantly disrupt the Left and Found system can be restricted or excluded from access to the designated area.</p>
            <p>Outside of Left and Found, mutual aid is based on clear, trauma informed rules of reciprocity. Gifts such as time, mental load, labor and money require no matching capacity, which is why it works alongside spoon theory. Individuals may choose to gift what they have. No one is in arrears and no ledger is kept for activities outside of accepted roles and responsibilities. Everyone is special; we are all the main characters of our own stories with complex and dynamic lives and no one member should be set apart as above the tenets.</p>
            <p>One type of contribution cannot be gauged against another. What is valuable to one person is useless to another and should not be given a forced value.</p>
            <p>Requested contribution conditions and terms are stated clearly and can carry a ledger, and participants are volunteers or paid workers without exploitation, especially of time, mental load, labor, and money. A culture of choosing not to be compensated when compensation is part of the role or responsibility is harmful to the system; it leads to socially pressuring others into states of exploitation and must not be tolerated.</p>
          </Tenet>

          <Tenet id="rocking-chair">
            <div className="canon">A single person cannot do everything. Know what you can do and what you can&rsquo;t. Explore, share, and learn. The chair remains; it was empty before you sat, it will be empty as you get up. The chair moves and when it doesn&rsquo;t, a new person can fill it and start it rocking again.</div>
            <p>The quintessential idyllic grandmother does not move in; she sits a while. She bakes cookies for no reason other than joy and to generate smiles and makes sure cold toes have warm socks. She quilts blankets to keep you cozy when you sleep, crochets afghans for quiet moments, brews tea for meaningful conversations, provides delicious food to keep you healthy, gives hugs alongside a sharp word so you know you still belong, and defends sanctuary behind her skirts when you need it. She gives moments. She takes naps. She helps others to share the load, and she points out the things that need fixing.</p>
            <p>Grandmothers and kindly little old ladies do everything a religion should do, and we honor this by naming the Kindly Crone First Matron of the Nyxalon and the Matron Saint of the {ORG.name}.</p>
          </Tenet>

          <Tenet id="trauma-informed">
            <div className="canon">Awareness and education allow trauma informed behaviors.</div>
            <p>Having trauma informed behaviors augments the aspiration of Less Suffering. It takes Grace for yourself and others, and being able to recognize what distress looks like. Everyone carries history that cannot be seen. When distress appears, we meet it as a signal, not a disruption; we ask instead of assuming, and offer instead of insisting. We learn these behaviors, share them, and keep learning them.</p>
            <p>This is where Autonomy and Less Suffering meet: easing suffering without invading a person&rsquo;s autonomy.</p>
          </Tenet>

          <Tenet id="power">
            <div className="canon">Power is held to delegate and retract authority. Power is shared and authority limited.</div>
            <p>The power that exists in our coming together is held by a Council of Wisdoms, who then choose members outside the Council of Wisdoms to hold authority. Not only is it important to prevent a centralized power with great authority, but reducing the workload on a single person is also conscientious. Succession of a Wisdom is done by conclave without the voice of the Wisdom to be succeeded. Men cannot be Wisdoms. Men can accept authority and are held equal among members, not to be elevated simply based on their gender.</p>
            <p>Bylaws exist as a changeable, legal collection of process that appointed authorities manage. Sealed canon is always the highest authority, then unsealed canon and bylaws.</p>
          </Tenet>

          <Tenet id="education">
            <div className="canon">Myth is a language for thinking, not an explanation. Education is the best preventative.</div>
            <p>We embrace mythology and folklore as a way to practice and appreciate wonder. It is not a literal belief in monsters and deities (or is it?), but a consideration of the patterns in meaning found in the quilt of mysteries. Go looking for those concepts wherever they are held, in whatever tongue, and appreciate the wonder found in learning on your own terms. Storytelling, skill sharing, and education are important for community health and wellness. We do not ban books. We encourage seeking and honoring the mysteries of our existence.</p>
          </Tenet>

          <Tenet id="testimony">
            <div className="canon">Conveying your experience is neither boasting nor invalid; it is your experience. Only a disinterested party can judge a claim of abuse.</div>
            <p>In the case of a complaint or attestation of harm: No one should demonize an individual for the act of providing an attestation or testimony. A person who states what they have done or what has been done to them is conveying their experience; it does not become less true or egregious because of gender, race, or other non-choice characteristics. We do not tell a person they have misremembered their own life. What you say happened is what you say happened; what you felt was felt, what was thought was thought. Say what you did, say what happened to you; then provide an accusation or demand for remedy; state who was with you, state what the harms are, state what your demands are. In this way your attestations and testimony remain a clear part of your autonomy.</p>
            <p>The bylaws contain how complaints, harms, attestations, and testimonies are handled beyond what is stated here. Provision of attestations and testimony is not blindly accepted as reason to act against another or provide remedy. A member who submits attestation or testimony that knowingly contains false accounting of behavior for personal gain (including protection from accountability), malicious intent, or jest will be responsible for the same remedy unjustly sought. The ripple effect of misrepresentation is a series of harms that must be accounted for.</p>
            <p>Attestation and testimony are not restricted. Freedom of speech, freedom of the press, and freedom of assembly are held dear. Attestations and testimony are encouraged.</p>
          </Tenet>

          {/* ===== Definitions ===== */}
          <div className="part" id="definitions">
            <h2>Definitions</h2>
            <dl className="definitions">
              {DEFINITIONS.map(([term, def]) => (
                <div key={term}>
                  <dt>{term}</dt>
                  <dd>{def}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </>
  );
}
