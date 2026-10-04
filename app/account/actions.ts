"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";

/** A member may change whether the Sisters let them know about wording changes. */
export async function setNotify(formData: FormData) {
  const { supabase, user } = await requireUser("/account");
  await supabase
    .from("profiles")
    .update({ notify_changes: formData.get("notify") === "on" })
    .eq("id", user.id);
  revalidatePath("/account");
}

/** Autonomy: a member may withdraw their story at any time. */
export async function withdrawStory(formData: FormData) {
  const { supabase } = await requireUser("/account");
  await supabase.rpc("withdraw_story", { story_id: Number(formData.get("id")) });
  revalidatePath("/account");
  revalidatePath("/hear-my-voice");
}
