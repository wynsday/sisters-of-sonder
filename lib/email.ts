import { ORG } from "./config";

export const SITE_URL = process.env.SITE_URL ?? "https://sisters-of-sonder.vercel.app";

type Email = { to: string; subject: string; text: string };

/** Sends through Resend, at most 100 per request. Returns how many were accepted. */
export async function sendEmails(emails: Email[]) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.NOTICE_FROM;
  if (!key || !from) throw new Error("Email is not set up yet (RESEND_API_KEY and NOTICE_FROM).");
  let sent = 0;
  for (let i = 0; i < emails.length; i += 100) {
    const batch = emails
      .slice(i, i + 100)
      .map((e) => ({ from, to: [e.to], subject: e.subject, text: e.text }));
    const res = await fetch("https://api.resend.com/emails/batch", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify(batch),
    });
    if (!res.ok) throw new Error(`Resend refused the emails: ${res.status} ${await res.text()}`);
    sent += batch.length;
  }
  return sent;
}

/** The text of a change notice, with how to stop receiving them. */
export function noticeText(name: string, body: string) {
  return `${name ? `Dear ${name},\n\n` : ""}${body}

---
You are receiving this because you gave the ${ORG.name} permission to tell you when the wording of the canon changes significantly or a new item is added. Notices are sent no more than once every 30 days.
To stop them, uncheck that permission on your account page: ${SITE_URL}/account`;
}
