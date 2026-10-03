import type { Metadata } from "next";
import { ORG } from "@/lib/config";
import BookLinks from "@/components/BookLinks";

export const metadata: Metadata = {
  title: "The Nine Tenets of Agreement",
  description: "The Nine Tenets of Agreement of the Sisters of Sonder.",
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

function Tenet({ id, children }: { id: string; children: React.ReactNode }) {
  const t = TENETS.find((x) => x.id === id)!;
  return (
    <div className="part tenet" id={t.id}>
      <h2>
        The {t.ord} Tenet: {t.name}
      </h2>
      {children}
      <BookLinks slug={t.book} title={`The ${t.ord} Tenet: Considerations of ${t.name}`} />
    </div>
  );
}

export default function Tenets() {
  return (
    <>
      <div className="page-hero">
        <div className="wrap">
          <h1>The Nine Tenets of Agreement</h1>
        </div>
      </div>

      <section>
        <div className="wrap read">
          <nav className="toc" aria-label="Contents">
            <ol>
              {TENETS.map((t) => (
                <li key={t.id}>
                  <a href={`#${t.id}`}>The {t.ord} Tenet: {t.name}</a>
                </li>
              ))}
            </ol>
          </nav>
          {/* ===== Tenets ===== */}

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

        </div>
      </section>
    </>
  );
}
