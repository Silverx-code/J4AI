import type { Metadata } from "next";
import Link from "next/link";
import { getEditions, getFinance, getStats } from "@/lib/queries";
import { formatDateRange, isDone, STATUS_LABEL } from "@/lib/utils";
import { getSettings } from "@/lib/settings";
import BankCard from "@/components/BankCard";
import { Icon, SectionHeading } from "@/components/ui";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Impact & Transparency" };

export default async function ImpactPage() {
  const [editions, stats, s] = await Promise.all([getEditions(), getStats(), getSettings()]);
  const withFinance = (await Promise.all(editions.map(async (e) => ({ e, f: await getFinance(e.id) }))))
    .filter((x) => x.f?.published && x.f.breakdown.length > 0)
    .sort((a, b) => (b.e.startDate ?? "").localeCompare(a.e.startDate ?? ""));
  const latestFinance = withFinance[0];
  const pendingFinance = editions.filter((e) => e.status === "COMPLETED_REPORT_PENDING");
  const reports = editions.filter((e) => e.reportUrl);
  const doneCount = editions.filter((e) => isDone(e.status)).length;
  const participantRows = [
    { campaign: "PAG 1.0", girlsStudents: 200, boys: 0, mothers: 30, staff: 10, volunteers: 10, idpCamps: 0 },
    { campaign: "PAG 2.0", girlsStudents: 410, boys: 0, mothers: 0, staff: 16, volunteers: 14, idpCamps: 0 },
    { campaign: "PAG 3.0", girlsStudents: 260, boys: 0, mothers: 50, staff: 5, volunteers: 10, idpCamps: 1 },
    { campaign: "PAG 4.0", girlsStudents: 150, boys: 100, mothers: 0, staff: 5, volunteers: 9, idpCamps: 0 },
  ].map((row) => ({ ...row, total: row.girlsStudents + row.boys + row.mothers + row.staff + row.volunteers }));
  const participantTotals = participantRows.reduce((totals, row) => ({
    girlsStudents: totals.girlsStudents + row.girlsStudents,
    boys: totals.boys + row.boys,
    mothers: totals.mothers + row.mothers,
    staff: totals.staff + row.staff,
    volunteers: totals.volunteers + row.volunteers,
    idpCamps: totals.idpCamps + row.idpCamps,
    total: totals.total + row.total,
  }), { girlsStudents: 0, boys: 0, mothers: 0, staff: 0, volunteers: 0, idpCamps: 0, total: 0 });
  const verifiedReach = participantTotals.girlsStudents + participantTotals.boys;

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-4">
      <div>
        <span className="inline-flex items-center gap-1 rounded-full bg-surface-container px-3 py-1 font-label-sm text-label-sm uppercase text-primary"><Icon name="verified_user" className="text-[14px]" />Transparent non-profit record</span>
        <h1 className="mt-2 font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg">Impact &amp; Transparency</h1>
        <p className="mt-1 max-w-2xl font-body-md text-body-md text-on-surface-variant">Every donation is tracked with community-led accountability. Cumulative reach is reported by J4AI; edition details below are drawn from the field reports.</p>
      </div>

      <section className="rounded-3xl bg-gradient-to-br from-primary to-primary-container p-5 text-on-primary shadow-xl md:p-8">
        <p className="font-label-sm text-label-sm uppercase opacity-90">Mission milestone</p>
        <p className="mt-1 font-display-hero-mobile text-[44px] font-extrabold leading-none md:text-[64px]">{verifiedReach.toLocaleString()}</p>
        <p className="mt-1 font-label-lg text-label-lg">Verified beneficiaries reached: girls, students and boys</p>
        <p className="mt-2 max-w-xl font-body-sm text-body-sm text-primary-fixed">Verified reach includes 1,020 girls/students and 100 boys. Mothers, teachers/staff and volunteers are included in total attendance, shown separately below.</p>
      </section>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-4">
        {[
          ["favorite", "Girls / students", participantTotals.girlsStudents.toLocaleString()],
          ["groups", "Boys", participantTotals.boys.toLocaleString()],
          ["verified_user", "Verified reach", verifiedReach.toLocaleString()],
          ["family_restroom", "Mothers reached", participantTotals.mothers.toLocaleString()],
          ["groups", "Total participants", participantTotals.total.toLocaleString()],
          ["flag", "Editions held", String(doneCount)],
          ["school", "Schools reached", String(stats.schools)],
          ["camping", "IDP camps reached", "1"],
        ].map(([icon, label, v]) => (
          <div key={label} className="card p-4"><Icon name={icon} className="text-primary" /><p className="mt-2 font-headline-md text-headline-md font-extrabold text-primary">{v}</p><p className="font-label-sm text-label-sm uppercase text-on-surface-variant">{label}</p></div>
        ))}
      </section>

      <section className="flex flex-col gap-3">
        <SectionHeading title="Total PAG Beneficiaries and Participants" aside="Figures across four campaigns" />
        <div className="card overflow-x-auto p-4">
          <table className="w-full min-w-[820px] text-left font-body-sm text-body-sm">
            <thead><tr className="border-b border-outline-variant text-on-surface-variant">
              {["Campaign", "Girls/Students", "Boys", "Mothers", "Teachers/Staff", "Volunteers", "IDP Camps", "Total People"].map((heading) => <th key={heading} className="px-2 py-3 font-label-md text-label-md">{heading}</th>)}
            </tr></thead>
            <tbody>
              {participantRows.map((row) => <tr key={row.campaign} className="border-b border-outline-variant/60">
                <th className="px-2 py-3 font-semibold">{row.campaign}</th><td className="px-2 py-3">{row.girlsStudents}</td><td className="px-2 py-3">{row.boys}</td><td className="px-2 py-3">{row.mothers}</td><td className="px-2 py-3">{row.staff}</td><td className="px-2 py-3">{row.volunteers}</td><td className="px-2 py-3">{row.idpCamps || "—"}</td><td className="px-2 py-3 font-semibold">{row.total}</td>
              </tr>)}
              <tr className="font-extrabold text-primary"><th className="px-2 py-3">GRAND TOTAL</th><td className="px-2 py-3">{participantTotals.girlsStudents.toLocaleString()}</td><td className="px-2 py-3">{participantTotals.boys.toLocaleString()}</td><td className="px-2 py-3">{participantTotals.mothers.toLocaleString()}</td><td className="px-2 py-3">{participantTotals.staff.toLocaleString()}</td><td className="px-2 py-3">{participantTotals.volunteers.toLocaleString()}</td><td className="px-2 py-3">{participantTotals.idpCamps}</td><td className="px-2 py-3">{participantTotals.total.toLocaleString()}</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <SectionHeading title="Editions Ledger" aside="Field logs" />
        <div className="grid gap-3 md:grid-cols-3">
          {editions.map((e) => (
            <div key={e.id} className="card flex flex-col gap-3 p-4">
              <div className="flex items-start justify-between gap-2">
                <Link href={`/editions/${e.slug}`} className="font-headline-sm text-headline-sm hover:text-primary">{e.title}</Link>
                <span className="chip !normal-case">{STATUS_LABEL[e.status]}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 rounded-2xl bg-surface-container-low p-3 font-body-sm text-body-sm">
                <div><p className="font-label-sm text-label-sm uppercase text-on-surface-variant">Dates &amp; hub</p><p className="font-semibold">{formatDateRange(e.startDate, e.endDate)}</p><p className="text-on-surface-variant">{e.hostState ?? e.locations[0] ?? "TBA"}</p></div>
                <div><p className="font-label-sm text-label-sm uppercase text-on-surface-variant">{e.reach != null ? "Verified beneficiary reach" : e.attendance != null ? "Recorded attendance" : "Campaign goal"}</p><p className="font-semibold text-primary">{e.reach != null ? `${e.reach.toLocaleString()} beneficiaries` : e.attendance != null ? `~${e.attendance.toLocaleString()} attendees` : e.targetReach ? `${e.targetReach.toLocaleString()} girls` : "—"}</p>{e.reach != null && e.attendance != null && <p className="text-on-surface-variant">Total attendance: {e.attendance.toLocaleString()}</p>}</div>
              </div>
              {e.status === "COMPLETED_REPORT_PENDING" && e.slug !== "3-0" && <p className="flex items-center gap-1 font-body-sm text-body-sm text-secondary"><Icon name="hourglass_top" className="text-[16px]" />Reconciliation in progress</p>}
              {e.reportUrl && <a href={e.reportUrl} target="_blank" rel="noopener noreferrer" className="btn-primary !py-2"><Icon name="picture_as_pdf" className="text-[18px]" />{e.reportLabel ?? "View report"}</a>}
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <SectionHeading title="Edition reach and attendance" aside="Field figures supplied by J4AI" />
        <div className="grid gap-3 md:grid-cols-2">
          <article className="card p-5">
            <h2 className="font-headline-sm text-headline-sm">PAG 1.0 - Government Technical College, Njimtilo</h2>
            <p className="mt-2 font-body-sm text-body-sm text-on-surface-variant">The 28 October 2025 outreach recorded 250 people: 200 girls, 30 mothers, 10 staff, and 10 volunteers. Menstrual pads and hygiene education were provided.</p>
          </article>
          <article className="card p-5">
            <h2 className="font-headline-sm text-headline-sm">Pad A Girl 2.0 - Three institutions</h2>
            <p className="mt-2 font-body-sm text-body-sm text-on-surface-variant">Held January 22 to 26, 2026 across Government Girls Secondary School, Yerwa; Continuing Education Institute / Agency for Mass Literacy; and Federal Government Girls College, Monguno. The 440 people included 410 students, 14 volunteers, and 16 staff across the three schools.</p>
          </article>
          <article className="card p-5">
            <h2 className="font-headline-sm text-headline-sm">Pad A Girl 3.0 - Maiduguri</h2>
            <p className="mt-2 font-body-sm text-body-sm text-on-surface-variant">The 25–31 May 2026 drive recorded 325 people: 260 young girls, 50 mothers, 10 volunteers, and 5 staff members. The official report is being finalised.</p>
          </article>
          <article className="card p-5">
            <h2 className="font-headline-sm text-headline-sm">PAG 4.0 - Government Secondary School, Maiduguri</h2>
            <p className="mt-2 font-body-sm text-body-sm text-on-surface-variant">On October 23, 2026, PAG 4.0 reached 250 beneficiaries: 150 girls and 100 boys. Five male teachers and 9 volunteers also participated, bringing total attendance to 264. The official report is pending.</p>
          </article>
        </div>
        <a href="/brand/PAG%201.0%20AND%202.0%20REPORT.pdf" target="_blank" rel="noopener noreferrer" className="btn-primary self-start"><Icon name="picture_as_pdf" className="text-[18px]" />Download the PAG 1.0 and 2.0 field report</a>
      </section>

      <section className="flex flex-col gap-3">
        <SectionHeading title={latestFinance ? `Edition ${latestFinance.e.label} Expenditure` : "Financial Breakdown"} aside="Published summary" />
        {latestFinance ? (
          <div className="card flex flex-col gap-4 p-4 md:p-6">
            {latestFinance.f!.breakdown.map((l) => (
              <div key={l.category}>
                <div className="flex justify-between font-label-md text-label-md"><span>{l.category}</span><span className="text-primary">{l.percent}%</span></div>
                <div className="mt-1 h-3 overflow-hidden rounded-full bg-[#FFE4EE]"><div className="h-full rounded-full bg-gradient-to-r from-primary-container to-secondary-container" style={{ width: `${l.percent}%` }} /></div>
                {l.note && <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">{l.note}</p>}
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-4 font-body-sm text-body-sm text-on-surface-variant">Financial summaries are published once each edition&apos;s report is reconciled.</div>
        )}
        {pendingFinance.map((e) => (
          <div key={e.id} className="rounded-2xl bg-secondary-fixed p-4 font-body-sm text-body-sm text-on-secondary-fixed-variant">
            <b>{e.title}:</b> the financial summary will be published alongside the official field reconciliation report.
          </div>
        ))}
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-3">
          <SectionHeading icon="account_balance" title="Official Donation Account" />
          <p className="px-1 font-body-sm text-body-sm text-on-surface-variant">Direct public contributions are received into this designated operational account. Beneficiary: {s.beneficiary_label}.</p>
          <div className="card p-3"><BankCard tone="plain" /></div>
        </div>
        <div className="flex flex-col gap-3">
          <SectionHeading icon="description" title="Downloadable Reports" />
          {reports.length ? reports.map((e) => (
            <a key={e.id} href={e.reportUrl!} target="_blank" rel="noopener noreferrer" className="card flex items-center gap-3 p-4 transition hover:shadow-glow">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-fixed text-primary"><Icon name="picture_as_pdf" /></div>
              <div className="flex-1"><p className="font-label-lg text-label-lg">{e.title} · {e.reportLabel ?? "Report"}</p></div>
              <Icon name="download" className="text-primary" />
            </a>
          )) : <div className="card p-4 font-body-sm text-body-sm text-on-surface-variant">Reports will appear here as soon as they are uploaded.</div>}
        </div>
      </section>

      <section className="rounded-3xl bg-surface-container p-5 text-center">
        <Icon name="support_agent" className="text-[32px] text-primary" />
        <h3 className="font-headline-sm text-headline-sm">Independent inquiries</h3>
        <p className="mx-auto max-w-lg font-body-sm text-body-sm text-on-surface-variant">Questions about our governance or field methodologies? Reach our secretariat at <a className="font-semibold text-primary" href={`mailto:${s.contact_email}`}>{s.contact_email}</a> or <a className="font-semibold text-primary" href={`mailto:${s.additional_contact_email}`}>{s.additional_contact_email}</a>, or on Instagram @{s.instagram_handle}.</p>
      </section>
    </main>
  );
}
