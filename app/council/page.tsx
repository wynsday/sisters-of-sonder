import type { Metadata } from "next";
import Link from "next/link";
import { ORG } from "@/lib/config";

export const metadata: Metadata = {
  title: "Council of Wisdoms",
  description: "The Council of Wisdoms and the Nyxalon, our Pantheon of Mysteries.",
};

export default function Council() {
  return (
    <>
      <div className="page-hero">
        <div className="wrap">
          <h1>The Council of Wisdoms</h1>
          <p>Power is shared and authority limited.</p>
        </div>
      </div>

      <section>
        <div className="wrap read">
          <div className="kicker">The Seventh Tenet: Power and Authority</div>
          <div className="canon">Power is held to delegate and retract authority. Power is shared and authority limited.</div>
          <p>The power that exists in our coming together is held by a Council of Wisdoms, who then choose members outside the Council of Wisdoms to hold authority. Not only is it important to prevent a centralized power with great authority, but reducing the workload on a single person is also conscientious. Succession of a Wisdom is done by conclave without the voice of the Wisdom to be succeeded. Men cannot be Wisdoms. Men can accept authority and are held equal among members, not to be elevated simply based on their gender.</p>
          <div className="cards">
            <div className="card">
              <h3>Council of Wisdoms</h3>
              <p>The Wisdoms together, who hold the power of the {ORG.name} solely to delegate and retract authority and manage canon.</p>
            </div>
            <div className="card">
              <h3>Wisdom</h3>
              <p>A member of the Council of Wisdoms; never a man. May be a trans woman who has lived as and been known as a sister. These are the exemplars of the Kindly Crone.</p>
            </div>
            <div className="card">
              <h3>Conclave</h3>
              <p>The 3 to 27 people that choose a Wisdom&rsquo;s successor.</p>
            </div>
          </div>
          <p style={{ marginTop: 24 }}>
            Having a women only council does not erase or filter out men&rsquo;s voices or deeds since men can be granted authority as board members and clergy, which is an authority Wisdoms cannot have.
          </p>
          <p className="book-link">
            <Link href="/tenets#power">Read the Seventh Tenet in full &rarr;</Link>
          </p>
        </div>
      </section>

      <section className="alt">
        <div className="wrap read">
          <div className="kicker">The Pantheon of Mysteries</div>
          <h2>The Nyxalon</h2>
          <p>Grandmothers and kindly little old ladies do everything a religion should do, and we honor this by naming the Kindly Crone First Matron of the Nyxalon and the Matron Saint of the {ORG.name}.</p>
          <div className="cards">
            <div className="card">
              <h3>Kindly Crone</h3>
              <p>First Matron of the Nyxalon and Matron Saint of the {ORG.name}. She represents the concept of the little old lady and the grandmother who kindly care for those around her.</p>
            </div>
            <div className="card">
              <h3>Matron Saint</h3>
              <p>A figure of the Nyxalon as an honored concept acting as patroness of a domain.</p>
            </div>
          </div>
          <p style={{ marginTop: 24 }}>The quintessential idyllic grandmother does not move in; she sits a while. She bakes cookies for no reason other than joy and to generate smiles and makes sure cold toes have warm socks. She quilts blankets to keep you cozy when you sleep, crochets afghans for quiet moments, brews tea for meaningful conversations, provides delicious food to keep you healthy, gives hugs alongside a sharp word so you know you still belong, and defends sanctuary behind her skirts when you need it. She gives moments. She takes naps. She helps others to share the load, and she points out the things that need fixing.</p>
        </div>
      </section>
    </>
  );
}
