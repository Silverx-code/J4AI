import { desc } from "drizzle-orm";
import { db, schema } from "@/db";
import { formatDate } from "@/lib/utils";
import { setEnquiryStatus } from "../actions";

export default async function EnquiriesAdmin() {
  const rows = await db.select().from(schema.enquiries).orderBy(desc(schema.enquiries.createdAt));
  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-headline-md text-headline-md">Enquiries <span className="text-body-md text-on-surface-variant">({rows.length})</span></h1>
      {rows.map((r) => (
        <div key={r.id} className={`card flex flex-col gap-2 p-4 ${r.status === "UNREAD" ? "!border-primary" : ""}`}>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div><p className="font-label-lg text-label-lg">{r.subject}</p><p className="font-body-sm text-body-sm text-on-surface-variant">{r.name} · <a className="text-primary" href={`mailto:${r.email}?subject=Re: ${encodeURIComponent(r.subject)}`}>{r.email}</a> · {formatDate(r.createdAt)}</p></div>
            <span className="chip">{r.status}</span>
          </div>
          <p className="whitespace-pre-line rounded-xl bg-surface-container-low p-3 font-body-sm text-body-sm">{r.message}</p>
          <div className="flex gap-2">
            {(["READ", "REPLIED", "UNREAD"] as const).filter((s) => s !== r.status).map((s) => (
              <form key={s} action={setEnquiryStatus}><input type="hidden" name="id" value={r.id} /><input type="hidden" name="status" value={s} /><button className="btn-outline !min-h-[36px] !py-1">Mark {s.toLowerCase()}</button></form>
            ))}
          </div>
        </div>
      ))}
      {!rows.length && <p className="card p-6 text-center font-body-sm text-body-sm text-on-surface-variant">No enquiries yet.</p>}
    </div>
  );
}
