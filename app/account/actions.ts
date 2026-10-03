"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";

/** Autonomy: a member may withdraw their story at any time. */
export async function withdrawStory(formData: FormData) {
  const { supabase } = await requireUser("/account");
  await supabase.rpc("withdraw_story", { story_id: Number(formData.get("id")) });
  revalidatePath("/account");
  revalidatePath("/hear-my-voice");
}
