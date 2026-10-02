import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Sacred Aspirations", description: "The Foundational Understanding, the Three Sacred Aspirations, the Nine Tenets of Agreement, and the Condemnations." };

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
            <li><a href="#autonomy">First Tenet: Autonomy</a></li>
            <li><a href="#xenia">Second Tenet: Xenia</a></li>
            <li><a href="#repair">Third Tenet: Repair</a></li>
            <li><a href="#reciprocity">Fourth Tenet: Reciprocity</a></li>
            <li><a href="#rocking-chair">Fifth Tenet: The Rocking Chair</a></li>
            <li><a href="#trauma-informed">Sixth Tenet: Trauma Informed</a></li>
            <li><a href="#power">Seventh Tenet: Power</a></li>
            <li><a href="#education">Eighth Tenet: Education</a></li>
            <li><a href="#testimony">Ninth Tenet: Testimony</a></li>
          </ol>
        </nav>

        <p>When we look at history and the religions therein, we find belief structures full of aspirations and religions full of controlling methodologies for shaping human behavior, leveraging the aspirations of the many to guide the masses.</p>
        <p>We acknowledge and condemn the social and individual violences caused by religion. We do, however, recognize the sacred in aspirations. We do not found yet another patriarchal religion, rather we consolidate the voices of the people into a quilt of solidarity to reveal the belief structure within us all. This religion is spiritual, it is thoughtful, and it holds its condemnations in writing to remember why we have our Foundational Understanding, the Three Sacred Aspirations, and to temper our 9 Tenets of Agreement.</p>


        <div className="part" id="condemnations">
          <h2>The Condemnations of Cults and Religion</h2>
          <ul className="condemn">
            <li><strong>Crusades.</strong> Forced capitulations to proclaim belief and the slaying of &ldquo;them&rdquo;.</li>
            <li><strong>Oppression.</strong> Rule through punishments and unfair restrictions in a bid for dominance and control; demands for submission.</li>
            <li><strong>Slavery.</strong> Treating people as property or worse.</li>
            <li><strong>Exploitation.</strong> Forced or manipulated labors, demands for resources without trade, and sexual controls levied against persons.</li>
            <li><strong>Erasure.</strong> Voices and deeds filtered out or replaced based on genetic disposition.</li>
            <li><strong>Torture.</strong> Use of torture including rape, then the added harm from a lack of action to prevent suffering and accountability for causing grievous harms.</li>
            <li><strong>Knowledge Prevention.</strong> Withholding education, prevention of exposure to societies outside their own, lack of transparency, and purposeful misleading through top down indoctrination.</li>
            <li><strong>Central Charismatic Cult Leadership.</strong> A single dominant figure or group who demands obedience, devotion, and tribute on threat of heavy cost punishment.</li>
            <li><strong>Denial of Autonomy.</strong> Corporeal punishment, demands of self-harm, requirements of self-sacrifice, prevention of another person from receiving medical care, and thought control.</li>
            <li><strong>Religion as Ruling Divinity or Government System.</strong> Forcing religious belief on those who do not choose to participate on pain of significant life impacting enforcement, reduction of rights to force those outside the system to participate or to replace the religious beliefs of others, or claiming divine interpretation that does or affects the quality of life and wellbeing of the public.</li>
          </ul>
          <p>We hold true our Foundational Understanding. Our sacred aspirations are grounded in reduction and consideration. They should augment your life, not overtake it.</p>
        </div>


        <div className="part" id="foundation">
          <h2>The Foundational Understanding</h2>
          <p>All things are exposed to change. Change is what allows us to experience the wonder in our existence; it is what is needed to reduce suffering. At times, change brings friction that requires us to hold grace for ourselves and others. Our lives are cycles upon cycles that can balance when they move; rest and moments of stillness are part of the movement and cycle of life. Holding one position or aspiring in only one direction when we should be cycling is disruptive to health and happiness.</p>
          <div className="consider">Daodejing 76 and 40, Ecclesiastes 3:1&ndash;8</div>
          <p>Considerations can be held as both true and not true; they are able to fall into place, provide inspiration, be dismissed, or spark wonder. Each individual can make their own decisions or non-decisions about considerations.</p>
          <p><em>Aspirations require a purpose, a path, and the desire to walk it.</em></p>
        </div>


        <div className="part" id="suffering">
          <h2>The First Aspiration: Less Suffering</h2>
          <div className="aspire">To cause less suffering, to enable less suffering, to endure less suffering, to stand up and actively prevent suffering. Harm is not suffering but all suffering is harm.</div>
            <p className="book-link"><Link href="/books/less-suffering">Read The First Aspiration: Considerations of Less Suffering &rarr;</Link></p>
          <div className="consider">The natural world is violent, yet peaceful. It is kind, yet harsh. Violence is a continuum and a cycle. When violence is necessary to reduce suffering, it should be sharp, definitive, controlled; a precision instrument to prevent unnecessary suffering, such as setting a bone. We do not condemn the dragon for killing a sheep in order to sustain itself, as we would not condemn the sheep for assaulting greens, nor condemn the greens for draining the earth. We do condemn the horrors associated with these actions when done with cruel intentions or as byproducts of negligence.</div>
        </div>

        <div className="part" id="wonder">
          <h2>The Second Aspiration: Wonder</h2>
          <div className="aspire">To delight in the mysteries you encounter, and to encounter more than you have.</div>
            <p className="book-link"><Link href="/books/wonder">Read The Second Aspiration: Considerations of Wonder &rarr;</Link></p>
          <div className="consider">The number of molecules in a single breath is larger than the number of breaths in the atmosphere, which means you have shared a breath with every deity and every ancestor to have breathed upon this earth. A mammoth, an enemy, a friend, a person no one remembers, and a unicorn, if one ever walked the earth, have all shared a breath with you. We are the ancients, for every atom in us is older than the sun. Yet we see the world first with the eyes of a child, delight in the prism rainbows dancing on the wall, and find mystery in the mundane.</div>
        </div>

        <div className="part" id="grace">
          <h2>The Third Aspiration: Grace</h2>
          <div className="aspire">To be kind to yourself, be kind to others, and be kind to life wherever you encounter it.</div>
            <p className="book-link"><Link href="/books/grace">Read The Third Aspiration: Considerations of Grace &rarr;</Link></p>
          <div className="consider">Grace overflows; it is there for anyone who would have it, to hold or share from abundance. Grace contains neither forgiveness nor debt, yet for it we can hold gratitude. No one should demand grace or gratitude; both are elegant kindnesses extended and held freely, never to be earned or repaid. &ldquo;A debt of gratitude&rdquo; is self-imposed and should never be forced as leverage.</div>
        </div>


        <div className="part" id="tenets">
          <h2>The Nine Tenets of Agreement</h2>
          <p>The canon of each tenet is set apart; beneath it is our explanation.</p>
        </div>

          <div className="part tenet" id="autonomy">
            <h2>The First Tenet: Autonomy</h2>
            <div className="canon">Non-negotiable. You have the power and responsibility of you. We have the power and responsibility of we.</div>
            <p className="book-link"><Link href="/books/autonomy">Read The First Tenet: Considerations of Autonomy &rarr;</Link></p>
            <p>Each person holds what is theirs: their body, their boundaries, their deliberate thoughts, their deliberate actions, their beliefs, and their mistakes; all without needing to announce, justify, or publish any of it. Boundaries may be held unspoken; a request is a request and a share is a share, neither are mandates. The interior is your truest self. What you think is yours. What you believe is yours. We do not curate your thoughts; that is for you to do. We offer thoughts for consideration and encourage you to make your own decisions.</p>
            <p>Each group also has autonomy that it sets for itself. We know from the Foundational Understanding that boundaries and beliefs will naturally change and cycle. Because of this, members may choose to leave the group without reprisal or harassment.</p>
            <p>Autonomy and Less Suffering go hand in hand while being each other&rsquo;s opposition.</p>
            <div className="consider">A person who declares someone incapacitated because they hold an opinion. Someone who claims a boundary that forces someone else&rsquo;s behavior change instead of their own. Fabricating someone&rsquo;s thoughts and motivations instead of asking them. Prevention of medical care including an abortion. These all violate autonomy. Does autonomy stop at the skin? Herd immunity may be a good thing, but it is wrong to force someone to receive an injection. Forcing someone to wear a mask for the sake of wearing a mask is wrong, but preventing entry to a nursing home without being masked during a pandemic is correct if the mask is appropriate to reduce transmission. A person who chooses self-harm has the right to do so.</div>
          </div>

          <div className="part tenet" id="xenia">
            <h2>The Second Tenet: Xenia</h2>
            <div className="canon">Be appropriate in the role you have accepted.</div>
            <p className="book-link"><Link href="/books/xenia">Read The Second Tenet: Considerations of Xenia &rarr;</Link></p>
            <p>Xenia is about being appropriate in the role of guest and host. For us it extends to any role a person accepts. It allows rejection if the role is abused. Obligation has an end; a guest who abuses the host or will not leave is no longer a guest. A host that extorts the guest is no longer a host.</p>
            <h3>Left and Found</h3>
            <div className="canon">A person can find what was left for them.</div>
            <p>Donations or excess can be put in the left to be found area, where their new owners can find them. People can leave things, they are not gifts, there is no moral high ground over the person who finds. The person who finds is not a taker, nor must they prove a condition or identify in any way; the left to be found is equal on both sides and is open to all.</p>
            <p>A person who never leaves and always finds may overstay their welcome, and the person who always leaves and never finds is not participating in the cycle and exists in stagnation.</p>
            <div className="consider">The guest that exploits or threatens the host, the host that dehumanizes the guest. How does this apply to abortion?</div>
          </div>

          <div className="part tenet" id="repair">
            <h2>The Third Tenet: Repair and Our Path Forward</h2>
            <div className="canon">Positive change is repair, an apology is not.</div>
            <p className="book-link"><Link href="/books/repair">Read The Third Tenet: Considerations of Repair &rarr;</Link></p>
            <p>We do not accept words in place of a change of behavior. Change the behavior going forward, or double down; both show where a person stands. Acknowledge the harm, find the cause, then take action to prevent it from happening again. Problem solving is the path forward; apologies seek redemption without change. Some things cannot be forgiven; sometimes it is best to move forward without demanding acceptance or consolation from the person who requires repair.</p>
          </div>

          <div className="part tenet" id="reciprocity">
            <h2>The Fourth Tenet: Reciprocity</h2>
            <div className="canon">What is given is not repaid to the giver but passed to the next.</div>
            <p className="book-link"><Link href="/books/reciprocity">Read The Fourth Tenet: Considerations of Reciprocity &rarr;</Link></p>
            <p>Reciprocity requires no matching capacity, which is why it works alongside spoon theory. You pay when you can, to whoever is there. No one is in arrears and no ledger is kept. For activities that do carry a ledger, it is stated clearly and participants are volunteers or paid workers without exploitation.</p>
          </div>

          <div className="part tenet" id="rocking-chair">
            <h2>The Fifth Tenet: The Rocking Chair</h2>
            <div className="canon">The chair remains; it&rsquo;s okay to get up. You aren&rsquo;t leaving a void, you are leaving a chair, a chair someone else can sit in for a while.</div>
            <p className="book-link"><Link href="/books/rocking-chair">Read The Fifth Tenet: Considerations of the Rocking Chair &rarr;</Link></p>
            <p>A single person cannot do everything. Know what you can do and what you can&rsquo;t. Explore and learn. The chair moves and when it doesn&rsquo;t, it needs a new person to fill it. The guard changes and is meant to.</p>
            <p>The quintessential idyllic grandmother does not move in; she sits a while. She bakes cookies for no reason other than joy and to generate smiles, she makes sure cold toes have warm socks, she quilts blankets to keep you cozy when you sleep, afghans for quiet moments, tea for meaningful conversations, delicious food to keep you healthy, hugs alongside a sharp word so you know you still belong, and sanctuary behind her skirts when you need it. Grandmothers do everything a religion should do, and we honor this by naming the Kindly Crone First Matron of the Nyxalon, our Pantheon of Mysteries.</p>
          </div>

          <div className="part tenet" id="trauma-informed">
            <h2>The Sixth Tenet: Trauma Informed</h2>
            <div className="canon">We practice trauma informed care, and we ask you to learn it.</div>
            <p className="book-link"><Link href="/books/trauma-informed">Read The Sixth Tenet: Considerations of Trauma Informed Care &rarr;</Link></p>
            <p>It is not a credential and it is not therapy. It is a set of practices anyone can learn: recognizing what distress looks like, not treating it as disruption, giving people choice and room to pass, and never using fear, humiliation, exhaustion, or pain as instruments &mdash; not to teach, not to bond, not to correct. What is hard is named as hard rather than reframed as good for you. We learn it, we practice it, and we keep learning it to support the First Aspiration.</p>
          </div>

          <div className="part tenet" id="power">
            <h2>The Seventh Tenet: Power</h2>
            <div className="canon">Power is held only to delegate and retract authority.</div>
            <p className="book-link"><Link href="/books/power">Read The Seventh Tenet: Considerations of Power &rarr;</Link></p>
            <p>The power that exists in our coming together is held by a Council of Wisdoms, who then choose members outside the Council of Wisdoms to hold authority. No one on the Council may make decisions other than selection of those who do and do not hold authority, and what is entered into canon. The Council of Wisdoms rotate seats. A single person may not embody or sit the seat of a matron permanently. Each seat on the council is a rocking chair.</p>
            <p>Authority here exists to do a thing and then end. It is given by those who do not use it, to those who do not choose themselves, for a stated time. No one selects their own successor, extends their own seat, or decides the limits of their own authority. No power in this body may be used to gain more of it, and no one may hold both the power to act and the power to decide who acts. What cannot be done by these means is not done here.</p>
          </div>

          <div className="part tenet" id="education">
            <h2>The Eighth Tenet: Education</h2>
            <div className="canon">Myth is a language for thinking, not an explanation. Education is the best preventative.</div>
            <p className="book-link"><Link href="/books/education">Read The Eighth Tenet: Considerations of Education &rarr;</Link></p>
            <p>We embrace mythology and folklore as a way to practice and appreciate wonder. It is not a literal belief in monsters and deities (or is it?), but a consideration of the patterns in meaning found in the quilt of mysteries. We go looking for those concepts wherever they are held, in whatever tongue, and no one here is kept from what is known, what is doubted, or what other people believe. We believe in storytelling, skill sharing, and education for all. We do not ban books. We encourage seeking and honoring the mysteries of our existence.</p>
            <div className="consider">Monsters often remain static and deities reside motionless in their pantheons even across a robust and storied history; this is an expression of the concepts remaining true throughout phases and cycles.</div>
          </div>

          <div className="part tenet" id="testimony">
            <h2>The Ninth Tenet: Testimony</h2>
            <div className="canon">Your account is neither boasting nor invalid, it is a report.</div>
            <p className="book-link"><Link href="/books/testimony">Read The Ninth Tenet: Considerations of Testimony &rarr;</Link></p>
            <p>A person who says what they have done or what has been done to them is reporting. A report does not become less true or egregious because of gender, race, or other non-choice characteristics. We do not tell a person they have misremembered their own life. What you say happened is what you say happened; it is not bragging, accusation, or a request for praise. Say what you did, say who was with you, and let the report stand as testimony.</p>
          </div>

      </div>
    </section>
    </>
  );
}
