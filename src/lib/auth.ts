import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db, schema } from "@/db";
import { rateLimit } from "./rate-limit";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 14 },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      name: "Email",
      credentials: { email: { type: "email" }, password: { type: "password" } },
      async authorize(creds) {
        const email = creds?.email?.toLowerCase().trim();
        const password = creds?.password ?? "";
        if (!email || !password) return null;
        if (!rateLimit(`login:${email}`, 8, 5 * 60_000)) return null;
        const [u] = await db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1);
        if (!u || !(await bcrypt.compare(password, u.passwordHash))) return null;
        return { id: u.id, name: u.name, email: u.email, role: u.role };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) { token.id = user.id; token.role = user.role; }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = (token.role ?? "MEMBER") as "MEMBER" | "ADMIN";
      return session;
    },
  },
};

export const getSession = () => getServerSession(authOptions);

export async function requireAdmin() {
  const s = await getSession();
  if (!s?.user) redirect("/login?callbackUrl=/admin");
  if (s.user.role !== "ADMIN") redirect("/");
  return s;
}

export async function requireUser() {
  const s = await getSession();
  if (!s?.user) redirect("/login?callbackUrl=/account");
  return s;
}
