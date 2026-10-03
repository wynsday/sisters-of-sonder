"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";

export type OfferState = {
  error?: string;
  values?: Record<string, string>;
};

export async function offerConsideration(_prev: OfferState, formData: FormData): Promise<OfferState> {
  const { supabase, user } = await requireUser("/contribute");
  const field = (k: string) => String(formData.get(k) ?? "").trim();
  const values = {
    form: field("form"),
    title: field("title"),
    concept: field("concept"),
    stories: field("stories"),
    suggested_book: field("suggested_book"),
  };

  if (!["premise", "parable", "stories"].includes(values.form)) {
    return { values, error: "Choose what kind of Consideration you are offering." };
  }
  if (!values.title || !values.concept) {
    return { values, error: "Please give your Consideration a title and write it out." };
  }
  if (values.form === "stories" && !values.stories) {
    return { values, error: "For stories from different cultures, say where each story comes from." };
  }

  const { error } = await supabase.from("considerations").insert({
    author: user.id,
    form: values.form,
    title: values.title,
    concept: values.concept,
    stories: values.stories,
    suggested_book: values.suggested_book || null,
  });
  if (error) return { values, error: error.message };
  redirect("/account?offered=1");
}
