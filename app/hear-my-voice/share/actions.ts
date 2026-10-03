"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ShareState = {
  error?: string;
  happened?: string;
  could_help?: string;
  items?: string[];
};

export async function shareStory(_prev: ShareState, formData: FormData): Promise<ShareState> {
  const happened = String(formData.get("happened") ?? "").trim();
  const could_help = String(formData.get("could_help") ?? "").trim();
  const items = formData.getAll("items").map(String);
  const keep = { happened, could_help, items };

  if (!happened || !could_help) return { ...keep, error: "Please fill in both parts of your story." };
  if (!items.length) return { ...keep, error: "Choose at least one item your story speaks to." };
  if (!formData.get("public_ok"))
    return { ...keep, error: "Please confirm you understand your story will be public." };
  if (!formData.get("no_names")) return { ...keep, error: "Please confirm your story names no one." };

  const supabase = await createClient();
  const { error } = await supabase.rpc("share_story", {
    happened,
    could_help,
    no_names: true,
    items,
  });
  if (error) return { ...keep, error: error.message };
  redirect("/account?shared=1");
}
