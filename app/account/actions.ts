"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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

/** A member deletes their own account (the database decides what goes with it). */
export async function deleteAccount(formData: FormData) {
  const { supabase } = await requireUser("/account");
  if (String(formData.get("confirm") ?? "").trim().toUpperCase() !== "DELETE") {
    redirect("/account?error=" + encodeURIComponent("Type DELETE to confirm."));
  }
  const { error } = await supabase.rpc("delete_my_account");
  if (error) redirect("/account?error=" + encodeURIComponent(error.message));
  await supabase.auth.signOut();
  redirect("/?deleted=1");
}

/** Autonomy: a member may withdraw their story at any time. */
export async function withdrawStory(formData: FormData) {
  const { supabase } = await requireUser("/account");
  await supabase.rpc("withdraw_story", { story_id: Number(formData.get("id")) });
  revalidatePath("/account");
  revalidatePath("/hear-my-voice");
}
