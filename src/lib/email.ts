/** Sends via Resend when RESEND_API_KEY is set; otherwise logs (so dev works with no setup). */
export async function sendEmail(opts: { to: string; subject: string; html: string; replyTo?: string }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log(`[email:dev] to=${opts.to} subject="${opts.subject}"`);
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM ?? "J4AI <onboarding@resend.dev>",
        to: opts.to, subject: opts.subject, html: opts.html, reply_to: opts.replyTo,
      }),
    });
    return res.ok;
  } catch (e) {
    console.error("email failed", e);
    return false;
  }
}

export const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

export function notifyAdmin(subject: string, lines: Record<string, string | number | null | undefined>) {
  const to = process.env.ADMIN_NOTIFY_EMAIL;
  if (!to) return Promise.resolve(false);
  const rows = Object.entries(lines)
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0"><b>${esc(k)}</b></td><td>${esc(String(v ?? "—"))}</td></tr>`)
    .join("");
  return sendEmail({ to, subject, html: `<table>${rows}</table>` });
}
