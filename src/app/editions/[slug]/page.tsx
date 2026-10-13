import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEditionBySlug, getMedia, getNextEdition, getSponsorProgress } from "@/lib/queries";
import { formatDateRange, isDone } from "@/lib/utils";
import BankCard from "@/components/BankCard";
import { HeroGradient, Icon, Progress, SectionHeading, StatusChip } from "@/components/ui";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const e = await getEditionBySlug(params.slug);
  return { title: e?.title ?? "Edition", description: e?.summary ?? undefined };
}

export default async function EditionPage({ params }: { params: { slug: string } }) {
  const e = await getEditionBySlug(params.slug);
  if (!e) notFound();
  const [media, next] = await Promise.all([getMedia(e.id), getNextEdition()]);
  const sponsor = next ? await getSponsorProgress(next) : null;
  const done = isDone(e.status);
  const pending = e.status === "COMPLETED_REPORT_PENDING";
  const press = media.filter((m) => m.type === "PRESS" || m.type === "VIDEO");
  const photos = media.filter((m) => m.type === "PHOTO");

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-3">
      <Link href="/editions" className="inline-flex items-center gap-1 font-label-md text-label-md text-primary"><Icon name="arrow_back" className="text-[18px]" />All editions</Link>

      <HeroGradient>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-white/20 px-3 py-1 font-label-sm text-label-sm uppercase">Edition {e.label}{e.hostState ? ` · ${e.hostState}` : ""}</span>
          <StatusChip status={e.status} className="!bg-white !text-primary" />
        </div>
        <h1 className="mt-3 font-display-hero-mobile text-display-hero-mobile md:font-display-hero md:text-display-hero">{e.tagline ?? e.title}</h1>
        {e.summary && <p className="mt-2 max-w-2xl font-body-sm text-body-sm text-primary-fixed md:text-body-lg">{e.summary}</p>}
        <div className="mt-5 grid gap-2 sm:grid-cols-2 sm:max-w-2xl">
          <div className="flex items-center gap-3 rounded-2xl bg-white/15 p-3 backdrop-blur-md">
            <Icon name="calendar_month" /><div><p className="font-label-sm text-label-sm uppercase opacity-80">Execution dates</p><p className="font-label-lg text-label-lg">{formatDateRange(e.startDate, e.endDate, true)}</p></div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-white/15 p-3 backdrop-blur-md">
            <Icon name="location_on" /><div><p className="font-label-sm text-label-sm uppercase opacity-80">Host</p><p className="font-label-lg text-label-lg">{e.locations.length ? e.locations.join(" · ") : e.hostState ?? "To be announced"}</p></div>
          </div>
        </div>
      </HeroGradient>

      <section className="flex flex-col gap-3">
        <SectionHeading title="Mission Quick Facts" aside={done ? "Verified registry" : "Planned"} />
        <div className="grid gap-3 md:grid-cols-3">
          {e.reach != null && (
            <div className="card p-4"><p className="font-label-sm text-label-sm uppercase text-primary">Verified reach</p><p className="font-headline-md text-headline-md font-extrabold">{e.reach.toLocaleString()} girls</p>{e.attendance != null && <p className="font-body-sm text-body-sm text-on-surface-variant">{e.attendance.toLocaleString()} total attendees recorded.</p>}</div>
          )}
          {e.targetReach != null && (
            <div className="card p-4"><div className="flex items-center justify-between"><p className="font-label-sm text-label-sm uppercase text-primary">Target reach</p><span className="chip">{done ? "Campaign goal" : "Planned target"}</span></div><p className="font-headline-md text-headline-md font-extrabold">{e.targetReach.toLocaleString()} girls</p>{e.targetDescription && <p className="font-body-sm text-body-sm text-on-surface-variant">{e.targetDescription}</p>}</div>
          )}
          {(e.partners.length > 0 || e.partnerNote) && (
            <div className="card p-4"><p className="font-label-sm text-label-sm uppercase text-primary">Partner collaboration</p><p className="font-headline-sm text-headline-sm">{e.partners.join(" & ")}</p>{e.partnerNote && <p className="font-body-sm text-body-sm text-on-surface-variant">{e.partnerNote}</p>}</div>
          )}
        </div>
        {e.enrolled != null && e.targetReach ? (
          <div className="card p-4">
            <div className="mb-2 flex justify-between font-label-sm text-label-sm uppercase text-on-surface-variant"><span>Outreach enrolment</span><span>{Math.round((e.enrolled / e.targetReach) * 100)}% of target</span></div>
            <Progress percent={(e.enrolled / e.targetReach) * 100} />
            <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">{e.enrolled.toLocaleString()} enrolled · {e.targetReach.toLocaleString()} planned</p>
          </div>
        ) : null}
        {e.pillars.length > 0 && (
          <div className="rounded-3xl bg-surface-container-low p-4">
            <p className="font-label-sm text-label-sm uppercase text-on-surface-variant">Pillars of intervention</p>
            <div className="mt-2 flex flex-wrap gap-2">{e.pillars.map((p) => <span key={p} className="chip">{p}</span>)}</div>
          </div>
        )}
      </section>

      {pending && (
        <section className="rounded-3xl bg-secondary-fixed p-4 md:p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary-container text-white"><Icon name="fact_check" /></div>
            <div>
              <p className="font-headline-sm text-headline-sm text-on-secondary-container">Official financial &amp; impact report in progress</p>
              <p className="font-body-sm text-body-sm text-on-secondary-fixed-variant">Verification and receipt matching are underway. Certified figures will be published here automatically once complete.</p>
              <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/60 px-3 py-1 font-label-sm text-label-sm uppercase text-secondary"><Icon name="hourglass_top" className="text-[14px]" />Report pending</span>
            </div>
          </div>
        </section>
      )}
      {e.reportUrl && (
        <a href={e.reportUrl} target="_blank" rel="noopener noreferrer" className="btn-primary self-start"><Icon name="download" className="text-[18px]" />{e.reportLabel ?? "Download report"}</a>
      )}

      {e.objectives.length > 0 && (
        <section className="flex flex-col gap-3">
          <SectionHeading title="Objectives & Activities" aside="Field deployment" />
          <div className="card divide-y divide-[#F3D9E2]">
            {e.objectives.map((o) => (
              <div key={o.title} className="flex items-start gap-3 p-4">
                <Icon name="check_circle" fill className="text-primary" />
                <div><p className="font-label-lg text-label-lg">{o.title}</p><p className="font-body-sm text-body-sm text-on-surface-variant">{o.body}</p></div>
              </div>
            ))}
          </div>
        </section>
      )}

      {(press.length > 0 || photos.length > 0) && (
        <section className="flex flex-col gap-3">
          <SectionHeading title="Media & Press Highlights" aside={`${media.length} item${media.length === 1 ? "" : "s"}`} />
          <div className="grid gap-4 md:grid-cols-2">
            {media.map((m) => (
              <figure key={m.id} className="card overflow-hidden">
                {m.type === "VIDEO" ? (
                  <video controls preload="metadata" className="aspect-video w-full bg-black"><source src={m.url} type="video/mp4" /></video>
                ) : m.type === "PRESS" && !/\.(jpe?g|png|webp)$/i.test(m.url) ? (
                  <a href={m.url} target="_blank" rel="noopener noreferrer" className="flex aspect-video items-center justify-center bg-surface-container text-primary"><Icon name="open_in_new" className="text-[40px]" /></a>
                ) : (
                  <div className="relative aspect-[4/3] w-full bg-surface-container"><Image src={m.url} alt={m.title ?? "Edition media"} fill sizes="(max-width: 768px) 100vw, 560px" className="object-cover" /></div>
                )}
                {(m.title || m.caption) && (
                  <figcaption className="p-4">
                    <p className="font-label-sm text-label-sm uppercase text-primary">{m.type === "PHOTO" ? "Field photo archive" : "Press & media"}</p>
                    {m.title && <p className="font-label-lg text-label-lg">{m.title}</p>}
                    {m.caption && <p className="font-body-sm text-body-sm text-on-surface-variant">{m.caption}</p>}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </section>
      )}

      {next && next.id !== e.id && (
        <section className="rounded-3xl bg-surface-container p-4 md:p-6">
          <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-secondary-container" /><span className="font-label-sm text-label-sm font-extrabold uppercase text-secondary-container">Upcoming campaign</span></div>
          <h3 className="mt-1 font-headline-md text-headline-md">Sponsor {next.title}</h3>
          <p className="mb-3 font-body-sm text-body-sm text-on-surface-variant">
            {formatDateRange(next.startDate, next.endDate, true)}. Every ₦{sponsor?.cost.toLocaleString()} provides one adolescent girl with a full 3-month hygiene kit.
          </p>
          <div className="max-w-md"><BankCard /></div>
          <div className="mt-4 grid gap-2 sm:max-w-md sm:grid-cols-2">
            <Link href="/donate" className="btn-primary"><Icon name="favorite" className="text-[18px]" />Sponsor kits</Link>
            <Link href="/get-involved?tab=outreach" className="btn-outline">Request an outreach</Link>
          </div>
        </section>
      )}
    </main>
  );
}
