import type { Metadata } from "next";

export const metadata: Metadata = { title: "Council of Wisdoms", description: "The Council of Wisdoms and the Nyxalon, our Pantheon of Mysteries." };

export default function Council() {
  return (
    <>
    <div className="page-hero">
      <div className="wrap">
        <h1>The Council of Wisdoms</h1>
        <p>Each seat on the council is a rocking chair.</p>
      </div>
    </div>

    <section>
      <div className="wrap read">
        <div className="kicker">Tenet VII: Power</div>
        <h2>Power held only to delegate and retract authority</h2>
        <p>The power that exists in our coming together is held by a Council of Wisdoms, who then choose members outside the Council of Wisdoms to hold authority. No one on the Council may make decisions other than selection of those who do and do not hold authority, and what is entered into canon.</p>
        <div className="cards">
          <div className="card"><h3>Seats rotate</h3><p>A single person may not embody or sit the seat of a matron permanently.</p></div>
          <div className="card"><h3>Authority ends</h3><p>Authority exists to do a thing and then end, for a stated time.</p></div>
          <div className="card"><h3>No self-selection</h3><p>No one selects their own successor, extends their own seat, or decides the limits of their own authority.</p></div>
          <div className="card"><h3>Separated powers</h3><p>No one may hold both the power to act and the power to decide who acts.</p></div>
        </div>
        <p style={{marginTop: "28px"}}><em>What cannot be done by these means is not done here.</em></p>
        <h2 style={{marginTop: "48px"}}>The Houses</h2>
        <p>Each House is headed by a Wisdom, who appoints the members that compose the House to assist its tasks. Because the House supports the seat, the Wisdom grants this authority directly, without a vote of the Council, and for a stated time. The Wisdom cannot hold the authority she grants.</p>
        <div className="card">
          <h3>The House of Nisaba</h3>
          <p>Keepers of the sacred books. Headed by the Wisdom sitting in the chair of Nisaba, the House cares for this site, reviews each Consideration offered by members, and places it in its book.</p>
        </div>
      </div>
    </section>

    <section className="alt">
      <div className="wrap read">
        <div className="kicker">Our Pantheon of Mysteries</div>
        <h2>The Nyxalon</h2>
        <p>Grandmothers do everything a religion should do, and we honor this by naming the Kindly Crone First Matron of the Nyxalon, our Pantheon of Mysteries.</p>
        <p>The quintessential idyllic grandmother does not move in; she sits a while. She bakes cookies for no reason other than joy, makes sure cold toes have warm socks, quilts blankets to keep you cozy when you sleep, and offers hugs alongside a sharp word so you know you still belong, and sanctuary behind her skirts when you need it.</p>
        <div className="figure-placeholder">
          A representation of the Kindly Crone, the Bog Witch, and the Seshat
          <div className="hint">Artwork to come</div>
        </div>
      </div>
    </section>
    </>
  );
}
