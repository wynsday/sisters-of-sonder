import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// The link in the confirmation email lands here and signs the member in.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const nextParam = searchParams.get("next") ?? "/account";
  const next = nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : "/account";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }
  return NextResponse.redirect(
    `${origin}/join?mode=signin&error=${encodeURIComponent("That link has expired. Please sign in.")}`,
  );
}
