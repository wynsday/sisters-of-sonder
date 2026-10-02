"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";

export async function offerConsideration(formData: FormData) {
  const { supabase, user } = await requireUser("/contribute");
  const field = (k: string) => String(formData.get(k) ?? "").trim();

  const { error } = await supabase.from("considerations").insert({
    author: user.id,
    title: field("title"),
    concept: field("concept"),
    stories: field("stories"),
    suggested_book: field("suggested_book") || null,
  });
  if (error) redirect(`/contribute?error=${encodeURIComponent(error.message)}`);
  redirect("/account?offered=1");
}
