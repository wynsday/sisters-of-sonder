"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";

export type SubmitState = { error?: string; values?: Record<string, string> };

const ISSUE_TYPES = ["feedback", "bug", "typo", "discrepancy"];

/** New glossary item or issue report, from a signed-in member. */
export async function submit(_prev: SubmitState, formData: FormData): Promise<SubmitState> {
  const kind = String(formData.get("kind"));
  const back = kind === "issue" ? "/report" : "/glossary/suggest";
  const { supabase } = await requireUser(back);
  const f = (k: string) => String(formData.get(k) ?? "").trim();
  const values = {
    title: f("title"),
    body: f("body"),
    section: f("section"),
    sources: f("sources"),
    issue_type: f("issue_type"),
    page: f("page"),
  };

  if (!["glossary_item", "issue"].includes(kind)) return { values, error: "Something went wrong." };
  if (kind === "issue" && !ISSUE_TYPES.includes(values.issue_type)) {
    return { values, error: "Choose what kind of issue this is." };
  }
  if (!values.title || !values.body) return { values, error: "Please fill in both fields." };

  const { error } = await supabase.from("submissions").insert({
    kind,
    issue_type: kind === "issue" ? values.issue_type : null,
    page: values.page || null,
    title: values.title,
    body: values.body,
    section: values.section || null,
    sources: values.sources || null,
  });
  if (error) return { values, error: error.message };
  redirect(`${back}?sent=1`);
}
