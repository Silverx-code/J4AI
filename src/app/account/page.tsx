import type { Metadata } from "next";
import Link from "next/link";
import { desc, eq, or } from "drizzle-orm";
import { db, schema } from "@/db";
import { requireUser } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import SignOutButton from "@/components/SignOutButton";
import { EmptyState } from "@/components/ui";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "My account" };

export default async function AccountPage() {
  const s = await requireUser();
  const mine = await db.select().from(schema.signups)
    .where(or(eq(schema.signups.userId, s.user.id), eq(schema.signups.email, (s.user.email ?? "").toLowerCase())))
    .orderBy(desc(schema.signups.createdAt));
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-6">
      <div className="flex items-start justify-between gap-3">
        <div><p className="font-label-sm text-label-sm uppercase text-primary">My account</p><h1 className="font-headline-md text-headline-md">{s.user.name}</h1><p className="font-body-sm text-body-sm text-on-surface-variant">{s.user.email}</p></div>
        <div className="flex gap-2">{s.user.role === "ADMIN" && <Link href="/admin" className="btn-primary">Admin</Link>}<SignOutButton /></div>
      </div>
      <h2 className="mb-2 mt-8 font-headline-sm text-headline-sm">My applications</h2>
      {mine.length ? (
        <div className="flex flex-col gap-3">{mine.map((m) => (
          <div key={m.id} className="card flex items-center justify-between gap-3 p-4">
            <div><p className="font-label-lg text-label-lg">{m.type === "VOLUNTEER" ? "Volunteer application" : "Outreach request"}</p><p className="font-body-sm text-body-sm text-on-surface-variant">{m.units.join(", ") || m.organisation} · {formatDate(m.createdAt)}</p></div>
            <span className="chip">{m.status}</span>
          </div>))}</div>
      ) : <EmptyState icon="volunteer_activism" title="No applications yet" body="Volunteer or request an outreach and it will show up here." />}
      <Link href="/get-involved" className="btn-primary mt-4">Get involved</Link>
    </main>
  );
}
