"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function safeNext(value: FormDataEntryValue | null) {
  const next = String(value ?? "/account");
  return next.startsWith("/") && !next.startsWith("//") ? next : "/account";
}

function back(mode: string, next: string, error: string): never {
  redirect(`/join?mode=${mode}&next=${encodeURIComponent(next)}&error=${encodeURIComponent(error)}`);
}

export async function signUp(formData: FormData) {
  const next = safeNext(formData.get("next"));
  const displayName = String(formData.get("display_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!formData.get("read")) {
    back("signup", next, "Please confirm you have read and agree to the Sacred Aspirations, the Foundational Understanding, and the 9 Tenets of Agreement.");
  }
  if (!displayName) back("signup", next, "Please choose a name to use.");
  if (password.length < 8) back("signup", next, "Passwords need at least 8 characters.");

  const origin = (await headers()).get("origin") ?? "";
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName, notify_changes: Boolean(formData.get("notify")) },
      emailRedirectTo: `${origin}/auth/confirm?next=${encodeURIComponent(next)}`,
    },
  });
  if (error) back("signup", next, error.message);
  redirect("/join?mode=check-email");
}

export async function signIn(formData: FormData) {
  const next = safeNext(formData.get("next"));
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
  });
  if (error) back("signin", next, error.message);
  redirect(next);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
