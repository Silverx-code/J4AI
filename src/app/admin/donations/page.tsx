import { desc } from "drizzle-orm";
import { db, schema } from "@/db";
import { formatDate, formatNaira } from "@/lib/utils";
import { addManualDonation, setDonationStatus } from "../actions";

export default async function DonationsAdmin() {
  const [rows, editions] = await Promise.all([
    db.select().from(schema.donations).orderBy(desc(schema.donations.createdAt)),
    db.select({ id: schema.editions.id, title: schema.editions.title }).from(schema.editions),
  ]);
  const confirmed = rows.filter((r) => r.status === "CONFIRMED").reduce((n, r) => n + r.amount, 0);
  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-headline-md text-headline-md">Donations</h1>
      <p className="font-body-sm text-body-sm text-on-surface-variant">Donor notifications are <b>not counted</b> until you confirm them against the bank account. Confirmed total: <b className="text-primary">{formatNaira(confirmed)}</b></p>
      {rows.map((r) => (
        <div key={r.id} className="card flex flex-col gap-2 p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div><p className="font-label-lg text-label-lg">{formatNaira(r.amount)} · {r.donorName ?? "Anonymous"}</p><p className="font-body-sm text-body-sm text-on-surface-variant">{r.email} · {formatDate(r.createdAt)} · {r.method}</p></div>
            <span className="chip">{r.status}</span>
          </div>
          {r.message && <p className="rounded-xl bg-surface-container-low p-3 font-body-sm text-body-sm">{r.message}</p>}
          <div className="flex flex-wrap items-center gap-2">
            {r.proofUrl && <a href={r.proofUrl} target="_blank" rel="noopener noreferrer" className="btn-outline !min-h-[36px] !py-1">View receipt</a>}
            {(["CONFIRMED", "REJECTED", "PENDING"] as const).filter((s) => s !== r.status).map((s) => (
              <form key={s} action={setDonationStatus}><input type="hidden" name="id" value={r.id} /><input type="hidden" name="status" value={s} /><button className={s === "CONFIRMED" ? "btn-primary !min-h-[36px] !py-1" : "btn-outline !min-h-[36px] !py-1"}>{s === "CONFIRMED" ? "Confirm" : s === "REJECTED" ? "Reject" : "Back to pending"}</button></form>
            ))}
          </div>
        </div>
      ))}
      {!rows.length && <p className="card p-6 text-center font-body-sm text-body-sm text-on-surface-variant">No donations recorded yet.</p>}

      <form action={addManualDonation} className="card grid gap-3 p-4 md:grid-cols-2">
        <h2 className="font-headline-sm text-headline-sm md:col-span-2">Log a verified donation manually</h2>
        <div><label className="label">Donor name</label><input name="donorName" className="field" /></div>
        <div><label className="label">Email</label><input name="email" type="email" className="field" /></div>
        <div><label className="label">Amount (₦) *</label><input name="amount" required inputMode="numeric" className="field" /></div>
        <div><label className="label">Bank reference</label><input name="reference" className="field" /></div>
        <div className="md:col-span-2"><label className="label">Campaign</label><select name="editionId" className="field"><option value="">None</option>{editions.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}</select></div>
        <button className="btn-primary md:col-span-2">Add confirmed donation</button>
      </form>
    </div>
  );
}
