import { NextResponse } from "next/server";
import { z } from "zod";
import { db, schema } from "@/db";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { saveFile, validateFile } from "@/lib/storage";
import { notifyAdmin, sendEmail, esc } from "@/lib/email";
import { str } from "@/lib/utils";

const body = z.object({
  donorName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  amount: z.coerce.number().int().min(100, "Enter the amount you sent (₦)").max(100_000_000),
  message: z.string().trim().max(1000).optional(),
  editionId: z.string().uuid().optional().or(z.literal("")),
});

/** Donors notify us after a bank transfer. Nothing is counted until an admin CONFIRMS it. */
export async function POST(req: Request) {
  if (!rateLimit(`donation:${clientIp(req)}`, 4, 10 * 60_000))
    return NextResponse.json({ error: "Too many submissions. Please try again shortly." }, { status: 429 });
  const fd = await req.formData().catch(() => null);
  if (!fd) return NextResponse.json({ error: "Invalid form" }, { status: 400 });
  if (str(fd.get("website"))) return NextResponse.json({ ok: true }); // honeypot

  const p = body.safeParse({
    donorName: str(fd.get("donorName")), email: str(fd.get("email")), amount: str(fd.get("amount")),
    message: str(fd.get("message")) || undefined, editionId: str(fd.get("editionId")),
  });
  if (!p.success) return NextResponse.json({ error: p.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });

  let proofUrl: string | null = null;
  const proof = fd.get("proof");
  if (proof instanceof File && proof.size > 0) {
    const err = validateFile(proof);
    if (err) return NextResponse.json({ error: err }, { status: 400 });
    try { proofUrl = await saveFile(proof, "j4ai/proofs"); } catch { return NextResponse.json({ error: "Could not upload the receipt. Try again." }, { status: 502 }); }
  }

  await db.insert(schema.donations).values({
    donorName: p.data.donorName, email: p.data.email.toLowerCase(), amount: p.data.amount,
    message: p.data.message || null, proofUrl, editionId: p.data.editionId || null, status: "PENDING",
  });
  void notifyAdmin(`Donation notification: ₦${p.data.amount.toLocaleString()} from ${p.data.donorName}`, {
    Donor: p.data.donorName, Email: p.data.email, Amount: `₦${p.data.amount.toLocaleString()}`, Receipt: proofUrl ?? "none attached", Message: p.data.message,
  });
  void sendEmail({
    to: p.data.email, subject: "Thank you for supporting Pad A Girl",
    html: `<p>Dear ${esc(p.data.donorName)},</p><p>We have received your donation notification of ₦${p.data.amount.toLocaleString()}. Our team will verify the transfer and confirm shortly. Thank you for helping a girl stay in school with dignity.</p>`,
  });
  return NextResponse.json({ ok: true });
}
