import Link from "next/link";
import { isConfigured } from "@/lib/supabase/env";
import { getSession } from "@/lib/auth";
import SubmitForm from "./SubmitForm";

type Props = {
  title: string;
  intro: string;
  kind: "glossary_item" | "issue";
  path: string;
  sent: boolean;
  sections?: string[];
  page?: string;
};

/** Shared layout for the glossary suggestion and issue report pages. */
export default async function SubmitPage({ title, intro, kind, path, sent, sections, page }: Props) {
  const { user } = isConfigured ? await getSession() : { user: null };
  return (
    <>
      <div className="page-hero">
        <div className="wrap">
          <h1>{title}</h1>
          <p>{intro}</p>
        </div>
      </div>
      <section>
        <div className="wrap read">
          {sent ? (
            <div className="notice">
              <p>Thank you. It has been received and will be read.</p>
              <Link href={path}>Send another</Link>
            </div>
          ) : user ? (
            <SubmitForm kind={kind} sections={sections} page={page} />
          ) : (
            <div className="card center">
              <p>Members can send these. Join or sign in, and you will come straight back here.</p>
              <Link className="btn btn-gold" href={`/join?next=${encodeURIComponent(path)}`}>Join</Link>
              <Link className="btn btn-moss" href={`/join?mode=signin&next=${encodeURIComponent(path)}`}>Sign in</Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
