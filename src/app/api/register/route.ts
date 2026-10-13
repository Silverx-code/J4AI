import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const body = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(30).optional(),
  password: z.string().min(8, "Password must be at least 8 characters").max(100),
});

export async function POST(req: Request) {
  if (!rateLimit(`register:${clientIp(req)}`, 5, 15 * 60_000))
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  const p = body.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: p.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  const email = p.data.email.toLowerCase();
  const [exists] = await db.select({ id: schema.users.id }).from(schema.users).where(eq(schema.users.email, email)).limit(1);
  if (exists) return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  await db.insert(schema.users).values({
    name: p.data.name, email, phone: p.data.phone || null,
    passwordHash: await bcrypt.hash(p.data.password, 12), role: "MEMBER", // admins are only created via seed / DB
  });
  return NextResponse.json({ ok: true });
}
