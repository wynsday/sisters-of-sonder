"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";

async function staff() {
  return (await requireAdmin("/admin")).supabase;
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
    if (error) fail("/admin", error.message);
    revalidatePath("/admin");
    return;
  }

  const book = String(formData.get("book") ?? "");
  const part = String(formData.get("part") ?? "");
  const indicators = formData.getAll("indicators").map(String);
  const crossList = formData.getAll("cross").map(String).filter((b) => b !== book);
  if (!book || !["neutral", "glimmer", "trigger"].includes(part)) {
    fail("/admin", "Choose a book and a part before publishing.");
  }
  if (part === "trigger" && indicators.length === 0) {
    fail("/admin", "A Trigger needs at least one indicator.");
  }

  // Tags first, so the entry never appears publicly without its indicators.
  await supabase.from("consideration_indicators").delete().eq("consideration", id);
  if (part === "trigger") {
    const { error } = await supabase
      .from("consideration_indicators")
      .insert(indicators.map((indicator) => ({ consideration: id, indicator })));
    if (error) fail("/admin", error.message);
  }
  await supabase.from("consideration_books").delete().eq("consideration", id);
  if (crossList.length) {
    const { error } = await supabase
      .from("consideration_books")
      .insert(crossList.map((b) => ({ consideration: id, book: b })));
    if (error) fail("/admin", error.message);
  }

  const { error } = await supabase
    .from("considerations")
    .update({ status: "published", book, part, review_note: note })
    .eq("id", id);
  if (error) fail("/admin", error.message);

  revalidatePath("/books");
  for (const b of [book, ...crossList]) revalidatePath(`/books/${b}`);
  revalidatePath(`/c/${id}`);
  revalidatePath("/admin");
}

export async function unpublish(formData: FormData) {
  const supabase = await staff();
  const id = Number(formData.get("id"));
  const { data } = await supabase.from("considerations").select("book").eq("id", id).single();
  const { error } = await supabase.from("considerations").update({ status: "pending" }).eq("id", id);
  if (error) fail("/admin", error.message);
  revalidatePath("/books");
  if (data?.book) revalidatePath(`/books/${data.book}`);
  revalidatePath(`/c/${id}`);
  revalidatePath("/admin");
}

// ---------- Indicators ----------
export async function addIndicator(formData: FormData) {
  const supabase = await staff();
  const label = String(formData.get("label") ?? "").trim();
  const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  if (!slug) fail("/admin/indicators", "Give the indicator a name.");
  const { error } = await supabase.from("indicators").insert({ slug, label });
  if (error) fail("/admin/indicators", error.message);
  revalidatePath("/admin/indicators");
  revalidatePath("/admin");
}
