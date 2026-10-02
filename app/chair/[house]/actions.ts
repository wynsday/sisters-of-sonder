"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getRoles } from "@/lib/auth";

/** Only the Wisdom seated in this House's chair may act here. */
async function wisdomOf(house: string) {
  const roles = await getRoles();
  if (!roles.user || !roles.chairs.some((c) => c.house === house)) redirect("/account");
  return { supabase: roles.supabase, user: roles.user };
}

function fail(house: string, message: string): never {
  redirect(`/chair/${house}?error=${encodeURIComponent(message)}`);
}

export async function appoint(formData: FormData) {
  const house = String(formData.get("house"));
  const { supabase, user } = await wisdomOf(house);
  const ends = String(formData.get("ends_at") ?? "");
  if (!ends) fail(house, "Every appointment needs an end date.");
  const { error } = await supabase.from("appointments").insert({
    house,
    member: String(formData.get("member")),
    granted_by: user.id,
    ends_at: new Date(`${ends}T23:59:59`).toISOString(),
    note: String(formData.get("note") ?? "").trim() || null,
  });
  if (error) fail(house, error.message);
  revalidatePath(`/chair/${house}`);
}

export async function endAppointment(formData: FormData) {
  const house = String(formData.get("house"));
  const { supabase } = await wisdomOf(house);
  const { error } = await supabase
    .from("appointments")
    .update({ revoked_at: new Date().toISOString() })
    .eq("id", Number(formData.get("id")))
    .eq("house", house);
  if (error) fail(house, error.message);
  revalidatePath(`/chair/${house}`);
}
