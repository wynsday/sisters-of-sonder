import { createHmac } from "node:crypto";
import { type NextRequest, NextResponse } from "next/server";
import { createPublicClient } from "@/lib/supabase/server";
import { isConfigured } from "@/lib/supabase/env";

// Counts a page view for the admin dashboard. Visitors are counted once a day
// by a code made from their IP address, browser, a secret, and the date.
export async function POST(request: NextRequest) {
  const secret = process.env.VISIT_SECRET;
  if (!isConfigured || !secret) {
    return new NextResponse(null, { status: 204 });
  }
  let path = "/";
  try {
    const body = JSON.parse(await request.text());
    if (typeof body.path === "string" && body.path.startsWith("/")) path = body.path;
  } catch {}
  path = path.split("?")[0].split("#")[0].slice(0, 200);

  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim();
  const agent = request.headers.get("user-agent") ?? "";
  const today = new Date().toISOString().slice(0, 10);
  const visitor = createHmac("sha256", secret).update(`${today}|${ip}|${agent}`).digest("hex").slice(0, 32);

  await createPublicClient().rpc("record_visit", { visitor, path });
  return new NextResponse(null, { status: 204 });
}
