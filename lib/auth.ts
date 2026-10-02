import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";

export async function getSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

/** Redirects to sign-in when nobody is signed in. */
export async function requireUser(next: string) {
  const { supabase, user } = await getSession();
  if (!user) redirect(`/join?next=${encodeURIComponent(next)}`);
  return { supabase, user };
}

/** Roles the signed-in member holds in a House right now. */
export async function houseRoles(house: string) {
  const { supabase, user } = await getSession();
  if (!user) return { supabase, user, isWisdom: false, hasAuthority: false };
  const [w, a] = await Promise.all([
    supabase.rpc("is_wisdom", { h: house }),
    supabase.rpc("has_authority", { h: house }),
  ]);
  return { supabase, user, isWisdom: w.data === true, hasAuthority: a.data === true };
}
