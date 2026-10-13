import { NextResponse } from "next/server";
import { z } from "zod";
import { db, schema } from "@/db";
import { getSession } from "@/lib/auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { notifyAdmin, sendEmail, esc } from "@/lib/email";

const base = {
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(7).max(30),
  message: z.string().trim().max(2000).optional(),
  website: z.string().max(0).optional(), // honeypot
};
const schemaIn = z.discriminatedUnion("type", [
  z.object({
    ...base, type: z.literal("VOLUNTEER"),
    units: z.array(z.string().max(60)).min(1, "Pick at least one unit").max(8),
    location: z.string().max(80).optional(), availability: z.string().max(80).optional(),
  }),
  z.object({
    ...base, type: z.literal("OUTREACH_REQUEST"),
    organisation: z.string().trim().min(2).max(160),
    location: z.string().trim().min(2).max(120),
    girlsCount: z.coerce.number().int().min(1).max(100000).optional(),
  }),
]);

export async function POST(req: Request) {
  if (!rateLimit(`signup:${clientIp(req)}`, 5, 10 * 60_000))
    return NextResponse.json({ error: "Too many submissions. Please try again shortly." }, { status: 429 });
  const parsed = schemaIn.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  const d = parsed.data;
  const session = await getSession();

  await db.insert(schema.signups).values({
    userId: session?.user?.id ?? null, type: d.type, name: d.name, email: d.email.toLowerCase(), phone: d.phone,
    units: d.type === "VOLUNTEER" ? d.units : [],
    location: d.location ?? null,
    availability: d.type === "VOLUNTEER" ? d.availability ?? null : null,
    organisation: d.type === "OUTREACH_REQUEST" ? d.organisation : null,
    girlsCount: d.type === "OUTREACH_REQUEST" ? d.girlsCount ?? null : null,
    message: d.message || null,
  });

  void notifyAdmin(`New ${d.type === "VOLUNTEER" ? "volunteer application" : "outreach request"}: ${d.name}`, {
    Name: d.name, Email: d.email, Phone: d.phone, Location: d.location,
    Units: d.type === "VOLUNTEER" ? d.units.join(", ") : undefined,
    Organisation: d.type === "OUTREACH_REQUEST" ? d.organisation : undefined, Message: d.message,
  });
  void sendEmail({
    to: d.email, subject: "We received your submission · Jesus For All Initiative",
    html: `<p>Hi ${esc(d.name)},</p><p>Thank you for ${d.type === "VOLUNTEER" ? "applying to volunteer with" : "requesting an outreach from"} the Jesus For All Initiative. Our team will review it and get back to you.</p><p>Every girl deserves dignity, education and comfort.</p>`,
  });
  return NextResponse.json({ ok: true });
}
