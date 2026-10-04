import type { Metadata } from "next";
import SubmitPage from "@/components/SubmitPage";

export const metadata: Metadata = { title: "Report an issue" };
export const dynamic = "force-dynamic";

export default async function ReportPage({ searchParams }: PageProps<"/report">) {
  const sp = await searchParams;
  return (
    <SubmitPage
      title="Report an Issue"
      intro="Feedback, a bug, a typo, or a discrepancy."
      kind="issue"
      path="/report"
      sent={Boolean(sp.sent)}
      page={sp.page ? String(sp.page) : ""}
    />
  );
}
