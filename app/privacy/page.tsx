import type { Metadata } from "next";
import Link from "next/link";
import { ORG } from "@/lib/config";

export const metadata: Metadata = {
  title: "Privacy",
  description: `What the ${ORG.name} site stores, who can see it, and what it cannot promise.`,
};

// Keep this page true to how the site actually works. Update it whenever
// what is stored, who can see it, or which services are used changes.
const UPDATED = "October 6, 2026";

export default function Privacy() {
  return (
    <>
      <div className="page-hero">
        <div className="wrap">
          <h1>Privacy</h1>
          <p>We care, be aware</p>
        </div>
      </div>

      <section>
        <div className="wrap read privacy">
          <p className="hint">Last updated {UPDATED}. This describes how the site works today.</p>

          <h2>What is stored</h2>
          <ul>
            <li>
              <strong>Your account:</strong> your email address, the name you choose, when you
              agreed to the Sacred Aspirations, Foundational Understanding, and Tenets, and whether
              you gave permission for change notices. Your password is kept only as a one-way hash;
              no one can read it, including those who run the site.
            </li>
            <li>
              <strong>Considerations you submit:</strong> the text, the book it belongs in, and a
              link to your account. Once published, it shows the name you chose.
            </li>
            <li>
              <strong>Reactions:</strong> the reactions attached to Considerations.
            </li>
            <li>
              <strong>Stories in Hear My Voice:</strong> the text, what it speaks to, and a link to
              your account so you can see its status and withdraw it.
            </li>
            <li>
              <strong>Glossary suggestions and issue reports:</strong> the text and a link to your
              account.
            </li>
            <li>
              <strong>Sign-in records:</strong> our database provider keeps a log of sign-ins and
              account changes, including IP address and browser type.
            </li>
            <li>
              <strong>Hosting logs:</strong> our hosting provider records requests to the site,
              including IP address, the page, and the time.
            </li>
          </ul>

          <h2>What is not done</h2>
          <ul>
            <li>No advertising, analytics, or tracking scripts. No outside fonts or scripts load.</li>
            <li>Nothing is sold or shared for marketing.</li>
            <li>
              The only cookie is the sign-in cookie, set when you sign in so you stay signed in.
            </li>
          </ul>

          <h2>Who can see what</h2>
          <ul>
            <li>
              <strong>Anyone:</strong> published Considerations with the name you chose; published
              stories, with no name; totals for hearts, mending hearts, gold stars, and thumbs up.
            </li>
            <li>
              <strong>Admins, through the site:</strong> Considerations and stories waiting for
              review; totals for thumbs down and the trigger flag; who sent each glossary suggestion
              and issue report. The site never shows admins who wrote a story, and no one can see
              who gave a particular reaction.
            </li>
            <li>
              <strong>Whoever manages the database and hosting accounts:</strong> everything
              stored, including email addresses and which account wrote each story. They can read
              it directly in the database. It is not hidden or encrypted from them. During the
              founding period this is one person, the founder.
            </li>
            <li>
              <strong>Service providers:</strong> Supabase (database and sign-in), Vercel (hosting),
              and Resend (sending email, which means it handles your email address and the content
              of each email). They run these services under their own policies and may store data
              outside your country.
            </li>
            <li>
              <strong>Legal demands:</strong> anything stored here, or by these providers, could be
              disclosed if the law requires it. Nothing here is end-to-end encrypted.
            </li>
          </ul>

          <h2>How it is protected</h2>
          <p>
            The site is only reached over an encrypted connection (HTTPS). The database provider
            encrypts stored data. Access rules in the database decide what each person can see or
            change through the site, so a member cannot read another member&rsquo;s unpublished
            work or another member&rsquo;s email address.
          </p>

          <h2>Email</h2>
          <p>
            You are emailed to confirm your account and to reset your password. If you gave
            permission, you may also get a notice when the wording of the canon changes
            significantly or a new item is added. These notices are written by an admin, go out
            no more than once every 30 days, and can be turned off on your{" "}
            <Link href="/account">account page</Link>.
          </p>

          <h2>How long it is kept</h2>
          <p>
            Until you delete it, or an admin removes it. There is no automatic deletion schedule.
            Our providers keep their own logs for as long as their policies say.
          </p>

          <h2>Your choices</h2>
          <ul>
            <li>
              <strong>Withdraw a story</strong> at any time from your account page. It is deleted
              completely.
            </li>
            <li>
              <strong>Delete your account</strong> from your account page. This deletes your email
              address, profile, Considerations, and reactions. Stories you have not withdrawn stay
              published, with no link to you; withdraw them first if you want them gone. Accounts
              that hold or have held authority are removed by the Council instead; ask through
              Report an Issue.
            </li>
            <li>
              <strong>Change notices</strong> can be turned on or off on your account page.
            </li>
          </ul>

          <h2>Questions</h2>
          <p>
            Members can ask through <Link href="/report">Report an Issue</Link>. There is not yet a
            public contact address for people without an account.
          </p>
        </div>
      </section>
    </>
  );
}
