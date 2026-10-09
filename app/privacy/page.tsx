import type { Metadata } from "next";
import Link from "next/link";
import { ORG } from "@/lib/config";

export const metadata: Metadata = {
  title: "Privacy",
  description: `What the ${ORG.name} site stores, who can see it, and what it cannot promise.`,
};

// Keep this page true to how the site actually works. Update it whenever
// what is stored, who can see it, or which services are used changes.
const UPDATED = "October 7, 2026";

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
          <p className="hint">Last updated {UPDATED}.</p>

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
              link to your account.
            </li>
            <li>
              <strong>Reactions:</strong> the reactions attached to Considerations. No one can see
              who gave a particular reaction.
            </li>
            <li>
              <strong>Stories in Hear My Voice:</strong> the text, what it speaks to, and a link to
              your account so you can see its status.
            </li>
            <li>
              <strong>Glossary suggestions and issue reports:</strong> the text and a link to your
              account.
            </li>
            <li>
              <strong>Technical logs:</strong> our providers record sign-ins and requests to the
              site, including IP address and browser type.
            </li>
          </ul>

          <h2>What is not done</h2>
          <ul>
            <li>No advertising. Nothing is sold or shared for marketing.</li>
            <li>The only cookie is the sign-in cookie, so you stay signed in.</li>
          </ul>

          <h2>Who can see what</h2>
          <ul>
            <li>
              <strong>Anyone:</strong> published Considerations with the name you chose, and
              published stories with no name.
            </li>
            <li>
              <strong>Admins:</strong> Considerations and stories waiting for review, and who sent
              each glossary suggestion and issue report. The site never shows admins who wrote a
              story.
            </li>
            <li>
              <strong>Whoever manages the database:</strong> everything stored, including email
              addresses and which account wrote each story.
            </li>
            <li>
              <strong>Service providers:</strong> Supabase (database and sign-in), Vercel (hosting),
              and Resend (email).
            </li>
            <li>
              <strong>Legal demands:</strong> anything stored here could be disclosed if the law
              requires it. Your records here help show your religious dedication to the{" "}
              {ORG.name}, and we are happy to provide them on your behalf if requested by you or your lawyer.
            </li>
          </ul>

          <h2>How it is protected</h2>
          <p>
            The site is only reached over an encrypted connection, stored data is encrypted, and
            access rules keep members from seeing each other&rsquo;s unpublished work or email
            addresses.
          </p>

          <h2>Email</h2>
          <p>
            You are emailed to confirm your account and to reset your password. If you gave
            permission, you may also get a notice when the canon changes, no more than once every
            30 days. You can turn these off on your <Link href="/account">account page</Link>.
          </p>

          <h2>How long it is kept</h2>
          <p>Until you delete it, or an admin removes it.</p>

          <h2>Your choices</h2>
          <ul>
            <li>
              <strong>Withdraw a story</strong> at any time from your account page. It is deleted
              completely.
            </li>
            <li>
              <strong>Delete your account</strong> from your account page. This deletes your email
              address, profile, Considerations, and reactions. Stories you have not withdrawn stay
              published, with no link to you.
            </li>
          </ul>

          <h2>Questions</h2>
          <p>
            Members can ask through <Link href="/report">Report an Issue</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
