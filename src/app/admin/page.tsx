import Link from "next/link";
import { desc, eq, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { formatDate } from "@/lib/utils";
import { Icon } from "@/components/ui";

export default async function AdminOverview() {
  const count = async (t: any, cond: any) => (await db.select({ c: sql<number>`count(*)::int` }).from(t).where(cond))[0].c;
  const [pendingSignups, unread, pendingDon, drafts, recent] = await Promise.all([
    count(schema.signups, eq(schema.signups.status, "PENDING")),
    count(schema.enquiries, eq(schema.enquiries.status, "UNREAD")),
    count(schema.donations, eq(schema.donations.status, "PENDING")),
    count(schema.posts, eq(schema.posts.status, "DRAFT")),
    db.select().from(schema.signups).orderBy(desc(schema.signups.createdAt)).limit(6),
  ]);
  const cards = [
    ["/admin/signups", "groups", "Pending signups", pendingSignups],
    ["/admin/enquiries", "mail", "Unread enquiries", unread],
    ["/admin/donations", "volunteer_activism", "Donations to verify", pendingDon],
    ["/admin/posts", "edit_note", "Draft posts", drafts],
  ] as const;
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-headline-md text-headline-md">Overview</h1>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map(([href, icon, label, n]) => (
          <Link key={label} href={href} className="card p-4 transition hover:shadow-glow"><Icon name={icon} className="text-primary" /><p className="mt-2 font-headline-md text-headline-md font-extrabold">{n}</p><p className="font-label-sm text-label-sm uppercase text-on-surface-variant">{label}</p></Link>
        ))}
      </div>
      <section>
        <h2 className="mb-2 font-headline-sm text-headline-sm">Latest signups</h2>
        <div className="card divide-y divide-[#F3D9E2]">
          {recent.length ? recent.map((r) => (
            <div key={r.id} className="flex items-center justify-between gap-3 p-3"><div><p className="font-label-lg text-label-lg">{r.name}</p><p className="font-body-sm text-body-sm text-on-surface-variant">{r.type === "VOLUNTEER" ? r.units.join(", ") : r.organisation} · {formatDate(r.createdAt)}</p></div><span className="chip">{r.status}</span></div>
          )) : <p className="p-4 font-body-sm text-body-sm text-on-surface-variant">No signups yet.</p>}
        </div>
      </section>
    </div>
  );
}
