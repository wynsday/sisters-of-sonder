import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isConfigured } from "@/lib/supabase/env";
import { requireUser } from "@/lib/auth";
import type { IndexItem } from "@/lib/stories";
import ShareForm from "./ShareForm";

export const metadata: Metadata = { title: "Share your story" };
// Personal to whoever is signed in; never cached.
export const dynamic = "force-dynamic";

export default async function SharePage({ searchParams }: PageProps<"/hear-my-voice/share">) {
  if (!isConfigured) redirect("/join");
  const about = (await searchParams).about;
  const preselect = (Array.isArray(about) ? about : about ? [about] : []).map(String);
  const { supabase } = await requireUser(
    `/hear-my-voice/share${preselect.length ? `?about=${preselect.join("&about=")}` : ""}`,
  );
  const { data } = await supabase.from("index_items").select("*").order("ordinal");

  return (
    <>
      <div className="page-hero">
        <div className="wrap">
          <h1>Share Your Story</h1>
          <p>Say what happened. Say what could have made it different.</p>
        </div>
      </div>

      <section>
        <div className="wrap read">
          <h2>Before you begin</h2>
          <ul>
            <li>
              <strong>Your story will be public.</strong> Once it is published, anyone in the
              world can read it. That is the point: your voice is out there, and it is heard.
            </li>
            <li>
              <strong>Your name is never shown</strong>, not to readers and not to those who
              review stories.
            </li>
            <li>
              <strong>Name no people.</strong> Use roles instead. This protects you and keeps the
              focus on what happened and what could prevent it.
            </li>
            <li>
              <strong>Share only what you choose.</strong> You can stop at any time, and you can
              withdraw your story later from your account.
            </li>
            <li>
              This is a place to be heard, not a complaint or a request for remedy. Those are
              handled under the bylaws.
            </li>
          </ul>
          <p className="notice">
            If you are in danger now, contact local emergency services. In the United States, you
            can call or text 988 for crisis support.
          </p>
          <ShareForm items={(data ?? []) as IndexItem[]} preselect={preselect} />
          <p style={{ marginTop: 24 }}>
            <Link href="/hear-my-voice">&larr; Back to Hear My Voice</Link>
          </p>
        </div>
      </section>
    </>
  );
}
