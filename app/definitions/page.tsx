import type { Metadata } from "next";
import { ORG } from "@/lib/config";

export const metadata: Metadata = {
  title: "Definitions",
  description: "Definitions of terms used by the Sisters of Sonder.",
};

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
  ["Considerate", "A congregation."],
  ["Council of Wisdoms", `The Wisdoms together, who hold the power of the ${ORG.name} solely to delegate and retract authority and manage canon.`],
  ["Disinterested party", "A person with no personal, familial, romantic, or financial ties to anyone in the claim, and no stake in its outcome."],
  ["Fourth space", "The spiritual space, between the third space (public) and the fifth (sanctuary)."],
  ["Glimmer", "The opposite of a trigger; a thing that brings instant and strong positive or comforting emotions such a tears to the eyes with love, appreciation, or joy."],
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
  ["Trigger", "A thing that brings an instant and strong negative emotional response that causes someone to relive a past trauma; it can be coupled with a threat response on the HPA axis."],
  [
    "Wisdom",
    "A member of the Council of Wisdoms; never a man. May be a trans woman who has lived as and been known as a sister. These are the exemplars of the Kindly Crone. Note: Having a women only council does not erase or filter out men’s voices or deeds since men can be granted authority as board members and clergy, which is an authority Wisdoms cannot have.",
  ],
];

function anchor(term: string) {
  return term.toLowerCase().replace(/\(.*?\)/g, "").trim().replace(/[^a-z]+/g, "-");
}

export default function Definitions() {
  return (
    <>
      <div className="page-hero">
        <div className="wrap">
          <h1>Definitions</h1>
        </div>
      </div>

      <section>
        <div className="wrap read">
          {/* ===== Definitions ===== */}
          <div className="part" id="definitions">
                        <dl className="definitions">
              {DEFINITIONS.map(([term, def]) => (
                <div key={term} id={anchor(term)}>
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
