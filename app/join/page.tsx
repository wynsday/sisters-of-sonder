import type { Metadata } from "next";
import Link from "next/link";
import { isConfigured } from "@/lib/supabase/env";
import { signIn, signUp } from "./actions";

export const metadata: Metadata = {
  title: "Join",
  description: "Create an account to contribute to the Books of Considerations.",
};

export default async function JoinPage({ searchParams }: PageProps<"/join">) {
  const sp = await searchParams;
  const mode = String(sp.mode ?? "signup");
  const next = String(sp.next ?? "/account");
  const error = sp.error ? String(sp.error) : null;

  return (
    <>
      <div className="page-hero">
        <div className="wrap">
          <h1>Join Us</h1>
          <p>Pull up a chair. Stay as long as you like, and leave whenever you choose.</p>
        </div>
      </div>

      <section>
        <div className="wrap">
          <div className="two-col">
            <div>
              <h2>What an account is for</h2>
              <p>
                With an account you can offer Considerations (a premise, a parable, or stories
                from different cultures), react to them, and share your story in Hear My Voice.
              </p>
              <p className="hint">
                Buttons with a dark purple outline are for members only.
              </p>
              <h3>Your autonomy</h3>
              <p>
                An account asks nothing of your beliefs, and you may leave whenever you choose.
              </p>
            </div>

            <div className="card">
              {!isConfigured && (
                <p className="notice">Sign-up is not open yet. The database is not connected.</p>
              )}
              {error && <p className="error">{error}</p>}

              {mode === "check-email" ? (
                <>
                  <h2>Check your email</h2>
                  <p>
                    We sent you a link to confirm your account. Open it in this browser and you
                    will be signed in.
                  </p>
                </>
              ) : mode === "signin" ? (
                <>
                  <h2>Sign in</h2>
                  <form action={signIn}>
                    <input type="hidden" name="next" value={next} />
                    <div className="field">
                      <label htmlFor="email">Email</label>
                      <input id="email" name="email" type="email" autoComplete="email" required />
                    </div>
                    <div className="field">
                      <label htmlFor="password">Password</label>
                      <input id="password" name="password" type="password" autoComplete="current-password" required />
                    </div>
                    <button className="btn btn-gold" type="submit" disabled={!isConfigured}>
                      Sign in
                    </button>
                  </form>
                  <p style={{ marginTop: 16 }}>
                    New here?{" "}
                    <Link href={`/join?mode=signup&next=${encodeURIComponent(next)}`}>Create an account</Link>
                  </p>
                </>
              ) : (
                <>
                  <h2>Create an account</h2>
                  <form action={signUp}>
                    <input type="hidden" name="next" value={next} />
                    <div className="field">
                      <label htmlFor="display_name">Name you&rsquo;d like to use</label>
                      <input id="display_name" name="display_name" type="text" autoComplete="nickname" required />
                      <div className="hint">
                        It does not need to be your legal name. It is shown on what you offer.
                      </div>
                    </div>
                    <div className="field">
                      <label htmlFor="email">Email</label>
                      <input id="email" name="email" type="email" autoComplete="email" required />
                      <div className="hint">Never shown to anyone.</div>
                    </div>
                    <div className="field">
                      <label htmlFor="password">Password</label>
                      <input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required />
                    </div>
                    <div className="field">
                      <label className="check">
                        <input type="checkbox" name="read" required /> I have read and agree to the
                        Sacred Aspirations, the Foundational Understanding, and the 9 Tenets of
                        Agreement.
                      </label>
                    </div>
                    <div className="field">
                      <label className="check">
                        <input type="checkbox" name="notify" /> If the wording changes
                        significantly within the canon or a new item is added, the Sisters have
                        my permission to let me know. I understand this is a new religion and
                        there may be adjustments to the current canon.
                      </label>
                    </div>
                    <button className="btn btn-gold" type="submit" disabled={!isConfigured}>
                      Create account
                    </button>
                  </form>
                  <p style={{ marginTop: 16 }}>
                    Already a member?{" "}
                    <Link href={`/join?mode=signin&next=${encodeURIComponent(next)}`}>Sign in</Link>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
