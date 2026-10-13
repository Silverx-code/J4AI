import { desc } from "drizzle-orm";
import { db, schema } from "@/db";
import { getSession } from "@/lib/auth";

const cell = (v: unknown) => {
  let s = v == null ? "" : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; // neutralise spreadsheet formula injection
  return `"${s.replace(/"/g, '""')}"`;
};

export async function GET() {
  const s = await getSession();
  if (s?.user?.role !== "ADMIN") return new Response("Forbidden", { status: 403 });
  const rows = await db.select().from(schema.signups).orderBy(desc(schema.signups.createdAt));
  const head = ["Date", "Type", "Status", "Name", "Email", "Phone", "Units", "Location", "Availability", "Organisation", "Girls", "Message"];
  const lines = rows.map((r) => [r.createdAt.toISOString(), r.type, r.status, r.name, r.email, r.phone, r.units.join("; "), r.location, r.availability, r.organisation, r.girlsCount, r.message].map(cell).join(","));
  return new Response([head.map(cell).join(","), ...lines].join("\n"), {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="j4ai-signups-${new Date().toISOString().slice(0, 10)}.csv"` },
  });
}
