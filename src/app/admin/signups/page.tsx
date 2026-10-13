import { desc, eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { formatDate } from "@/lib/utils";
import { deleteSignup, setSignupStatus } from "../actions";

export default async function SignupsAdmin({ searchParams }: { searchParams: { type?: string } }) {
  const type = searchParams.type === "VOLUNTEER" || searchParams.type === "OUTREACH_REQUEST" ? searchParams.type : null;
  const q = db.select().from(schema.signups);
  const rows = await (type ? q.where(eq(schema.signups.type, type)) : q).orderBy(desc(schema.signups.createdAt));
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="font-headline-md text-headline-md">Signups <span className="text-body-md text-on-surface-variant">({rows.length})</span></h1>
        <div className="flex flex-wrap gap-2">
          {[[null, "All"], ["VOLUNTEER", "Volunteers"], ["OUTREACH_REQUEST", "Outreach requests"]].map(([k, l]) => (
            <a key={l} href={k ? `?type=${k}` : "?"} className={`chip ${type === k ? "!bg-primary !text-white" : ""}`}>{l}</a>
          ))}
          <a href="/api/admin/export/signups" className="btn-outline !min-h-[36px] !py-1">Export CSV</a>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {rows.map((r) => (
          <div key={r.id} className="card flex flex-col gap-2 p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-label-lg text-label-lg">{r.name} <span className="chip ml-1">{r.type === "VOLUNTEER" ? "Volunteer" : "Outreach"}</span></p>
                <p className="font-body-sm text-body-sm text-on-surface-variant"><a className="text-primary" href={`mailto:${r.email}`}>{r.email}</a> · {r.phone} · {formatDate(r.createdAt)}</p>
              </div>
              <span className="chip">{r.status}</span>
            </div>
            <p className="font-body-sm text-body-sm">
              {r.type === "VOLUNTEER" ? <>Units: <b>{r.units.join(", ")}</b> · {r.location} · {r.availability}</> : <><b>{r.organisation}</b> · {r.location}{r.girlsCount ? ` · ~${r.girlsCount} girls` : ""}</>}
            </p>
            {r.message && <p className="rounded-xl bg-surface-container-low p-3 font-body-sm text-body-sm text-on-surface-variant">{r.message}</p>}
            <div className="flex flex-wrap gap-2">
              {(["APPROVED", "REJECTED", "PENDING"] as const).filter((s) => s !== r.status).map((s) => (
                <form key={s} action={setSignupStatus}><input type="hidden" name="id" value={r.id} /><input type="hidden" name="status" value={s} /><button className={s === "APPROVED" ? "btn-primary !min-h-[36px] !py-1" : "btn-outline !min-h-[36px] !py-1"}>{s === "APPROVED" ? "Approve" : s === "REJECTED" ? "Reject" : "Mark pending"}</button></form>
              ))}
              <form action={deleteSignup}><input type="hidden" name="id" value={r.id} /><button className="btn !min-h-[36px] !py-1 text-error">Delete</button></form>
            </div>
          </div>
        ))}
        {!rows.length && <p className="card p-6 text-center font-body-sm text-body-sm text-on-surface-variant">No signups yet.</p>}
      </div>
    </div>
  );
}
