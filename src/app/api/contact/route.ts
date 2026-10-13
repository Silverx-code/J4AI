import { NextResponse } from "next/server";
import { z } from "zod";
import { db, schema } from "@/db";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { notifyAdmin } from "@/lib/email";

const body = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  subject: z.string().trim().min(2).max(160),
  message: z.string().trim().min(5).max(4000),
  website: z.string().max(0).optional(),
});

export async function POST(req: Request) {
  if (!rateLimit(`contact:${clientIp(req)}`, 4, 10 * 60_000))
    return NextResponse.json({ error: "Too many messages. Please try again shortly." }, { status: 429 });
  const p = body.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: p.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  const { website: _h, ...d } = p.data;
  await db.insert(schema.enquiries).values({ ...d, email: d.email.toLowerCase() });
  void notifyAdmin(`New enquiry: ${d.subject}`, { Name: d.name, Email: d.email, Message: d.message });
  return NextResponse.json({ ok: true });
}
