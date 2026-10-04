import type { Metadata } from "next";
import glossary from "@/lib/glossary.json";
import SubmitPage from "@/components/SubmitPage";

export const metadata: Metadata = { title: "Submit a new glossary item" };
export const dynamic = "force-dynamic";

export default async function SuggestPage({ searchParams }: PageProps<"/glossary/suggest">) {
  const sent = Boolean((await searchParams).sent);
  return (
    <SubmitPage
      title="Submit a New Item"
      intro="Name a harmful behavior the glossary is missing."
      kind="glossary_item"
      path="/glossary/suggest"
      sent={sent}
      sections={glossary.sections.map((s) => s.title)}
    />
  );
}
