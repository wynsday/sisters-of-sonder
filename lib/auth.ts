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
  if (!user) redirect(`/join?mode=signin&next=${encodeURIComponent(next)}`);
  return { supabase, user };
}

export type Chair = { house: string; name: string };

/**
 * What the signed-in member may do right now.
 * isAdmin: appointed admin of any House that grants admin (equal access).
 * chairs: Houses whose chair she sits in as Wisdom.
 */
export async function getRoles() {
  const { supabase, user } = await getSession();
  if (!user) return { supabase, user, isAdmin: false, chairs: [] as Chair[] };
  const [admin, seats] = await Promise.all([
    supabase.rpc("is_admin"),
    supabase
      .from("chairs")
      .select("house, seat_ends, houses(name)")
      .eq("wisdom", user.id),
  ]);
  const now = new Date();
  const chairs = (seats.data ?? [])
    .filter((c) => !c.seat_ends || new Date(c.seat_ends) > now)
    .map((c) => ({
      house: c.house as string,
      name: (c.houses as unknown as { name: string } | null)?.name ?? c.house,
    }));
  return { supabase, user, isAdmin: admin.data === true, chairs };
}

/** For admin pages: redirects anyone who is not an admin. */
export async function requireAdmin(next: string) {
  const roles = await getRoles();
  if (!roles.user) redirect(`/join?mode=signin&next=${encodeURIComponent(next)}`);
  if (!roles.isAdmin) redirect("/account");
  return roles;
}
