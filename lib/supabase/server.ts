import { createServerClient } from "@supabase/ssr";
import { createClient as createBareClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { SUPABASE_KEY, SUPABASE_URL } from "./env";

/** Client acting as the signed-in visitor. Use in actions and private pages. */
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component; the proxy refreshes the session.
        }
      },
    },
  });
}

/** Anonymous client with no cookies, so public pages can be cached. */
export function createPublicClient() {
  return createBareClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false },
  });
}
