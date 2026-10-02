"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { houseRoles } from "@/lib/auth";

const HOUSE = "nisaba";

async function staff() {
  const roles = await houseRoles(HOUSE);
  if (!roles.hasAuthority) redirect("/account");
  return roles.supabase;
}

async function wisdom() {
  const roles = await houseRoles(HOUSE);
  if (!roles.isWisdom || !roles.user) redirect("/account");
  return { supabase: roles.supabase, user: roles.user };
}

function fail(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

// ---------- Review ----------
export async function review(formData: FormData) {
  const supabase = await staff();
  const id = Number(formData.get("id"));
  const decision = String(formData.get("decision"));
  const note = String(formData.get("note") ?? "").trim() || null;

  if (decision === "decline") {
    const { error } = await supabase
      .from("considerations")
      .update({ status: "declined", review_note: note })
      .eq("id", id);
    if (error) fail("/house/nisaba", error.message);
    revalidatePath("/house/nisaba");
    return;
  }

  const book = String(formData.get("book") ?? "");
  const part = String(formData.get("part") ?? "");
  const indicators = formData.getAll("indicators").map(String);
  const crossList = formData.getAll("cross").map(String).filter((b) => b !== book);
  if (!book || !["neutral", "glimmer", "trigger"].includes(part)) {
    fail("/house/nisaba", "Choose a book and a part before publishing.");
  }
  if (part === "trigger" && indicators.length === 0) {
    fail("/house/nisaba", "A Trigger needs at least one indicator.");
  }

  // Tags first, so the entry never appears publicly without its indicators.
  await supabase.from("consideration_indicators").delete().eq("consideration", id);
  if (part === "trigger") {
    const { error } = await supabase
      .from("consideration_indicators")
      .insert(indicators.map((indicator) => ({ consideration: id, indicator })));
    if (error) fail("/house/nisaba", error.message);
  }
  await supabase.from("consideration_books").delete().eq("consideration", id);
  if (crossList.length) {
    const { error } = await supabase
      .from("consideration_books")
      .insert(crossList.map((b) => ({ consideration: id, book: b })));
    if (error) fail("/house/nisaba", error.message);
  }

  const { error } = await supabase
    .from("considerations")
    .update({ status: "published", book, part, review_note: note })
    .eq("id", id);
  if (error) fail("/house/nisaba", error.message);

  revalidatePath("/books");
  for (const b of [book, ...crossList]) revalidatePath(`/books/${b}`);
  revalidatePath(`/c/${id}`);
  revalidatePath("/house/nisaba");
}

export async function unpublish(formData: FormData) {
  const supabase = await staff();
  const id = Number(formData.get("id"));
  const { data } = await supabase.from("considerations").select("book").eq("id", id).single();
  const { error } = await supabase.from("considerations").update({ status: "pending" }).eq("id", id);
  if (error) fail("/house/nisaba", error.message);
  revalidatePath("/books");
  if (data?.book) revalidatePath(`/books/${data.book}`);
  revalidatePath(`/c/${id}`);
  revalidatePath("/house/nisaba");
}

// ---------- Indicators ----------
export async function addIndicator(formData: FormData) {
  const supabase = await staff();
  const label = String(formData.get("label") ?? "").trim();
  const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  if (!slug) fail("/house/nisaba/indicators", "Give the indicator a name.");
  const { error } = await supabase.from("indicators").insert({ slug, label });
  if (error) fail("/house/nisaba/indicators", error.message);
  revalidatePath("/house/nisaba/indicators");
  revalidatePath("/house/nisaba");
}

// ---------- Appointments (the Wisdom in the chair of Nisaba only) ----------
export async function appoint(formData: FormData) {
  const { supabase, user } = await wisdom();
  const member = String(formData.get("member"));
  const ends = String(formData.get("ends_at") ?? "");
  if (!ends) fail("/house/nisaba/staff", "Every appointment needs an end date.");
  const { error } = await supabase.from("appointments").insert({
    house: HOUSE,
    member,
    granted_by: user.id,
    ends_at: new Date(`${ends}T23:59:59`).toISOString(),
    note: String(formData.get("note") ?? "").trim() || null,
  });
  if (error) fail("/house/nisaba/staff", error.message);
  revalidatePath("/house/nisaba/staff");
}

export async function endAppointment(formData: FormData) {
  const { supabase } = await wisdom();
  const { error } = await supabase
    .from("appointments")
    .update({ revoked_at: new Date().toISOString() })
    .eq("id", Number(formData.get("id")));
  if (error) fail("/house/nisaba/staff", error.message);
  revalidatePath("/house/nisaba/staff");
}
