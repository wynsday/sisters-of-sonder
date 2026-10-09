"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { noticeText, sendEmails } from "@/lib/email";

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

// ---------- Hear My Voice ----------
export async function reviewStory(formData: FormData) {
  const supabase = await staff();
  const id = Number(formData.get("id"));
  const note = String(formData.get("note") ?? "").trim() || null;
  const back = "/admin/stories";

  if (formData.get("decision") === "decline") {
    const { error } = await supabase
      .from("stories")
      .update({ status: "declined", review_note: note })
      .eq("id", id);
    if (error) fail(back, error.message);
    revalidatePath(back);
    return;
  }

  const items = formData.getAll("items").map(String);
  const indicators = formData.getAll("indicators").map(String);
  if (!items.length) fail(back, "A story needs at least one item it speaks to.");
  if (!formData.get("checked_names")) fail(back, "Confirm no one is named or identifiable before publishing.");

  // Tags and indicators first, so a story never appears without its indicators.
  await supabase.from("story_index").delete().eq("story", id);
  const tagged = await supabase.from("story_index").insert(items.map((item) => ({ story: id, item })));
  if (tagged.error) fail(back, tagged.error.message);
  await supabase.from("story_indicators").delete().eq("story", id);
  if (indicators.length) {
    const marked = await supabase
      .from("story_indicators")
      .insert(indicators.map((indicator) => ({ story: id, indicator })));
    if (marked.error) fail(back, marked.error.message);
  }

  const { error } = await supabase
    .from("stories")
    .update({ status: "published", review_note: note })
    .eq("id", id);
  if (error) fail(back, error.message);
  revalidatePath("/hear-my-voice");
  revalidatePath(back);
}

// ---------- Inbox ----------
export async function resolveSubmission(formData: FormData) {
  const supabase = await staff();
  const { error } = await supabase
    .from("submissions")
    .update({ resolved_at: new Date().toISOString() })
    .eq("id", Number(formData.get("id")));
  if (error) fail("/admin/inbox", error.message);
  revalidatePath("/admin/inbox");
}

// ---------- Change notices (at most one every 30 days; enforced in the database) ----------
export async function sendNotice(formData: FormData) {
  const roles = await requireAdmin("/admin/notices");
  const supabase = roles.supabase;
  const back = "/admin/notices";
  const subject = String(formData.get("subject") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  if (!subject || !body) fail(back, "Write a subject and a statement.");
  if (!process.env.RESEND_API_KEY || !process.env.NOTICE_FROM) {
    fail(back, "Email is not set up yet (RESEND_API_KEY and NOTICE_FROM).");
  }

  if (formData.get("mode") === "test") {
    const to = roles.user?.email;
    if (!to) fail(back, "Your account has no email address.");
    let problem = "";
    try {
      await sendEmails([{ to, subject: `[Test] ${subject}`, text: noticeText("", body) }]);
    } catch (e) {
      problem = (e as Error).message;
    }
    if (problem) fail(back, problem);
    redirect(`${back}?tested=1`);
  }

  const { data, error } = await supabase.rpc("begin_notice", { subject, body });
  if (error) fail(back, error.message);
  const rows = (data ?? []) as { notice_id: number; email: string; display_name: string }[];
  if (!rows.length) fail(back, "No members have given permission for notices yet, so nothing was sent.");
  const noticeId = rows[0].notice_id;
  let sent = 0;
  let problem = "";
  try {
    sent = await sendEmails(
      rows.map((r) => ({ to: r.email, subject, text: noticeText(r.display_name, body) })),
    );
  } catch (e) {
    problem = (e as Error).message;
  }
  await supabase.rpc("finish_notice", { notice_id: noticeId, ok: sent > 0, sent });
  revalidatePath(back);
  if (!sent) fail(back, `Nothing was sent, and the month was not used up. ${problem}`);
  redirect(`${back}?sent=${sent}`);
}

// ---------- Dashboard: to-dos and change log ----------
export async function addTodo(formData: FormData) {
  const supabase = await staff();
  const text = String(formData.get("text") ?? "").trim();
  if (text) await supabase.from("admin_todos").insert({ text });
  revalidatePath("/admin/dashboard");
}

export async function toggleTodo(formData: FormData) {
  const supabase = await staff();
  const done = formData.get("done") === "1";
  await supabase
    .from("admin_todos")
    .update({ done_at: done ? new Date().toISOString() : null })
    .eq("id", Number(formData.get("id")));
  revalidatePath("/admin/dashboard");
}

export async function deleteTodo(formData: FormData) {
  const supabase = await staff();
  await supabase.from("admin_todos").delete().eq("id", Number(formData.get("id")));
  revalidatePath("/admin/dashboard");
}

export async function addChange(formData: FormData) {
  const supabase = await staff();
  const title = String(formData.get("title") ?? "").trim();
  const details = String(formData.get("details") ?? "").trim() || null;
  if (title) await supabase.from("change_log").insert({ title, details });
  revalidatePath("/admin/dashboard");
}

export async function deleteChange(formData: FormData) {
  const supabase = await staff();
  await supabase.from("change_log").delete().eq("id", Number(formData.get("id")));
  revalidatePath("/admin/dashboard");
}
