import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { getFinance, getMedia } from "@/lib/queries";
import UploadField from "@/components/UploadField";
import { addMedia, deleteEdition, deleteMedia, saveEdition, saveFinance } from "../../actions";

const T = ({ name, label, d, hint, type = "text" }: { name: string; label: string; d?: string | number | null; hint?: string; type?: string }) => (
  <div><label className="label" htmlFor={name}>{label}</label><input id={name} name={name} type={type} defaultValue={d ?? ""} className="field" />{hint && <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">{hint}</p>}</div>
);

export default async function EditionEditor({ params, searchParams }: { params: { id: string }; searchParams: { saved?: string } }) {
  const isNew = params.id === "new";
  const [e] = isNew ? [null] : await db.select().from(schema.editions).where(eq(schema.editions.id, params.id)).limit(1);
  if (!isNew && !e) notFound();
  const [media, fin] = e ? await Promise.all([getMedia(e.id), getFinance(e.id)]) : [[], null];
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-headline-md text-headline-md">{isNew ? "New edition" : `Edit ${e!.title}`}</h1>
      {searchParams.saved && <p className="rounded-xl bg-primary-fixed px-4 py-2 font-body-sm text-body-sm text-on-primary-fixed">Saved.</p>}

      <form action={saveEdition} className="card flex flex-col gap-4 p-5">
        <input type="hidden" name="id" value={e?.id ?? ""} />
        <div className="grid gap-4 md:grid-cols-3">
          <T name="label" label="Label * (e.g. 4.0)" d={e?.label} />
          <T name="slug" label="Slug" d={e?.slug} hint="Auto from label if empty (4.0 → 4-0)" />
          <div><label className="label">Status</label>
            <select name="status" defaultValue={e?.status ?? "UPCOMING"} className="field">
              <option value="UPCOMING">Upcoming</option><option value="ONGOING">Ongoing</option>
              <option value="COMPLETED_REPORT_PENDING">Completed · report pending</option><option value="COMPLETED">Completed</option>
            </select></div>
        </div>
        <div className="grid gap-4 md:grid-cols-2"><T name="title" label="Title" d={e?.title} /><T name="tagline" label="Tagline (hero headline)" d={e?.tagline} /></div>
        <div><label className="label">Summary</label><textarea name="summary" rows={3} defaultValue={e?.summary ?? ""} className="field" /></div>
        <div className="grid gap-4 md:grid-cols-4"><T name="startDate" label="Start date" type="date" d={e?.startDate} /><T name="endDate" label="End date" type="date" d={e?.endDate} /><T name="hostState" label="Host state" d={e?.hostState} /><T name="locations" label="Locations (comma-separated)" d={e?.locations.join(", ")} /></div>

        <fieldset className="rounded-2xl bg-secondary-fixed/50 p-4">
          <legend className="px-2 font-label-md text-label-md text-secondary">Numbers: be strict</legend>
          <p className="mb-3 font-body-sm text-body-sm text-on-secondary-fixed-variant"><b>Verified reach</b> feeds the public impact totals. Leave it empty until it is confirmed. Planned numbers go in <b>Target reach</b>, which never counts towards totals.</p>
          <div className="grid gap-4 md:grid-cols-5"><T name="reach" label="Verified reach" d={e?.reach} /><T name="targetReach" label="Target reach" d={e?.targetReach} /><T name="attendance" label="Attendance" d={e?.attendance} /><T name="schools" label="Schools reached" d={e?.schools} /><T name="enrolled" label="Enrolled (optional)" d={e?.enrolled} /></div>
        </fieldset>

        <div className="grid gap-4 md:grid-cols-2"><T name="partners" label="Partners (comma-separated)" d={e?.partners.join(", ")} hint="Only list partners you have permission to name." /><T name="pillars" label="Pillars (comma-separated)" d={e?.pillars.join(", ")} /></div>
        <T name="targetDescription" label="Target description" d={e?.targetDescription} />
        <T name="partnerNote" label="Partner note" d={e?.partnerNote} />
        <div><label className="label">Objectives & activities (one per line: Title | Description)</label><textarea name="objectives" rows={5} defaultValue={e?.objectives.map((o) => `${o.title} | ${o.body}`).join("\n")} className="field" /></div>
        <UploadField name="coverImage" label="Cover image" defaultValue={e?.coverImage} accept="image/png,image/jpeg,image/webp" />
        <div className="grid gap-4 md:grid-cols-2"><UploadField name="reportUrl" label="Report (PDF)" defaultValue={e?.reportUrl} accept="application/pdf" /><T name="reportLabel" label="Report button label" d={e?.reportLabel} /></div>
        <button className="btn-primary self-start">Save edition</button>
      </form>

      {e && (
        <>
          <section className="card flex flex-col gap-4 p-5">
            <h2 className="font-headline-sm text-headline-sm">Media & press</h2>
            {media.map((m) => (
              <div key={m.id} className="flex items-center justify-between gap-3 rounded-xl bg-surface-container-low p-3">
                <div className="min-w-0"><p className="font-label-md text-label-md">{m.type} · {m.title ?? m.url}</p><p className="truncate font-body-sm text-body-sm text-on-surface-variant">{m.url}</p></div>
                <form action={deleteMedia}><input type="hidden" name="id" value={m.id} /><input type="hidden" name="editionId" value={e.id} /><button className="btn !text-error">Remove</button></form>
              </div>
            ))}
            <form action={addMedia} className="grid gap-3 md:grid-cols-2">
              <input type="hidden" name="editionId" value={e.id} />
              <div><label className="label">Type</label><select name="type" className="field"><option value="PHOTO">Photo</option><option value="VIDEO">Video (mp4 URL)</option><option value="PRESS">Press link / clipping</option></select></div>
              <T name="title" label="Title" />
              <div className="md:col-span-2"><UploadField name="url" label="File or URL" /></div>
              <div className="md:col-span-2"><T name="caption" label="Caption" /></div>
              <button className="btn-outline md:col-span-2">Add media</button>
            </form>
          </section>

          <form action={saveFinance} className="card flex flex-col gap-4 p-5">
            <input type="hidden" name="editionId" value={e.id} />
            <h2 className="font-headline-sm text-headline-sm">Public financial summary</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Publish category percentages only. Never upload or paste a personal bank statement.</p>
            <div className="grid gap-4 md:grid-cols-2"><T name="totalIncome" label="Total income (₦)" d={fin?.totalIncome} /><T name="totalExpenses" label="Total expenses (₦)" d={fin?.totalExpenses} /></div>
            <div><label className="label">Expense breakdown (one per line: Category | percent | note)</label><textarea name="breakdown" rows={5} defaultValue={fin?.breakdown.map((b) => `${b.category} | ${b.percent}${b.note ? ` | ${b.note}` : ""}`).join("\n")} className="field" /></div>
            <label className="flex items-center gap-2 font-label-md text-label-md"><input type="checkbox" name="published" defaultChecked={fin?.published} className="h-4 w-4 accent-[#b70051]" />Publish on the Impact page</label>
            <button className="btn-outline self-start">Save financial summary</button>
          </form>

          <form action={deleteEdition}><input type="hidden" name="id" value={e.id} /><button className="btn !text-error">Delete this edition</button></form>
        </>
      )}
    </div>
  );
}
