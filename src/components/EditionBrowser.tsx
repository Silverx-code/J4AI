"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Edition } from "@/db/schema";
import { formatDateRange } from "@/lib/utils";
import { Icon, StatusChip } from "./ui";
import EditionCard from "./EditionCard";

const FILTERS = [
  { id: "ALL", label: "All editions" },
  { id: "UPCOMING", label: "Upcoming" },
  { id: "COMPLETED", label: "Completed" },
] as const;

type Filter = (typeof FILTERS)[number]["id"];

function isUpcoming(edition: Edition) {
  return edition.status === "UPCOMING" || edition.status === "ONGOING";
}

export default function EditionBrowser({ editions, featured }: { editions: Edition[]; featured: Edition | null }) {
  const [filter, setFilter] = useState<Filter>("ALL");
  const visibleEditions = useMemo(() => editions.filter((edition) => {
    if (featured?.id === edition.id) return false;
    return filter === "ALL"
      || (filter === "UPCOMING" && isUpcoming(edition))
      || (filter === "COMPLETED" && !isUpcoming(edition));
  }), [editions, featured, filter]);

  return (
    <div className="mt-7 space-y-8">
      {featured && filter !== "COMPLETED" && <FeaturedEdition edition={featured} />}

      <section aria-labelledby="edition-archive-title">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-label-sm text-label-sm uppercase text-primary">Campaign archive</p>
            <h2 id="edition-archive-title" className="mt-1 font-headline-sm text-headline-sm">Explore every edition</h2>
          </div>
          <div role="group" aria-label="Filter editions" className="flex flex-wrap gap-2">
            {FILTERS.map((option) => (
              <button
                key={option.id}
                type="button"
                aria-pressed={filter === option.id}
                onClick={() => setFilter(option.id)}
                className={`min-h-10 rounded-full border px-4 py-2 font-label-md text-label-md transition ${filter === option.id
                  ? "border-primary bg-primary text-white shadow-warm"
                  : "border-[#F3D9E2] bg-white text-on-surface-variant hover:border-primary hover:text-primary"}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {visibleEditions.length ? (
          <div className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleEditions.map((edition) => <EditionCard key={edition.id} e={edition} />)}
          </div>
        ) : featured && filter !== "COMPLETED" ? (
          <div className="rounded-3xl border border-dashed border-[#E9ABC0] bg-white/70 p-6 text-center">
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {filter === "UPCOMING" ? "The current upcoming campaign is featured above." : "The upcoming campaign is featured above; more editions will appear here as they are added."}
            </p>
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-[#E9ABC0] bg-white/70 p-8 text-center">
            <Icon name="campaign" className="text-[36px] text-primary" />
            <p className="mt-2 font-headline-sm text-headline-sm">No editions in this filter yet</p>
            <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">Choose another filter to explore the campaign archive.</p>
          </div>
        )}
      </section>
    </div>
  );
}

function FeaturedEdition({ edition }: { edition: Edition }) {
  return (
    <section aria-labelledby="featured-edition-title" className="grid overflow-hidden rounded-3xl bg-primary text-white shadow-xl md:grid-cols-[1.35fr_0.65fr]">
      <div className="flex flex-col items-start justify-center p-6 sm:p-8 lg:p-10">
        <div className="flex flex-wrap items-center gap-2">
          <StatusChip status={edition.status} className="!bg-white !text-primary" />
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 font-label-sm text-label-sm uppercase text-white">
            <Icon name="event" className="text-[15px]" />{formatDateRange(edition.startDate, edition.endDate, true)}
          </span>
        </div>
        <p className="mt-5 font-label-sm text-label-sm uppercase text-primary-fixed">Featured campaign · Pad A Girl {edition.label}</p>
        <h2 id="featured-edition-title" className="mt-2 max-w-2xl font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg">
          {edition.tagline ?? edition.title}
        </h2>
        {edition.summary && <p className="mt-3 max-w-2xl font-body-md text-body-md text-white/85">{edition.summary}</p>}

        <div className="mt-5 grid w-full max-w-md grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/20 bg-white/10 p-3">
            <p className="font-label-sm text-label-sm uppercase text-primary-fixed">Target reach</p>
            <p className="mt-1 font-headline-sm text-headline-sm">{edition.targetReach?.toLocaleString() ?? "To be announced"}</p>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 p-3">
            <p className="font-label-sm text-label-sm uppercase text-primary-fixed">Venue</p>
            <p className="mt-1 font-label-lg text-label-lg">{edition.hostState ?? edition.locations[0] ?? "To be announced"}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={`/editions/${edition.slug}`} className="btn-white">Campaign details</Link>
          <Link href="/get-involved" className="btn-glass">Volunteer for {edition.label}</Link>
        </div>
      </div>

      <div aria-hidden="true" className="relative hidden min-h-[20rem] overflow-hidden bg-primary-container md:flex md:items-center md:justify-center">
        <span className="absolute -right-5 -top-16 select-none font-black leading-none text-white/[0.08]" style={{ fontSize: "clamp(15rem, 26vw, 24rem)" }}>{edition.label}</span>
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/40 bg-white/10 backdrop-blur-sm">
            <Icon name="volunteer_activism" className="text-[42px] text-white" />
          </div>
          <span className="mt-4 font-label-sm text-label-sm uppercase tracking-[0.18em] text-white/90">Dignity · Health · Education</span>
        </div>
        <span className="absolute bottom-6 left-6 h-2 w-2 rounded-full bg-secondary-fixed" />
        <span className="absolute left-12 top-8 h-3 w-3 rounded-full bg-white/70" />
        <span className="absolute bottom-16 right-12 h-4 w-4 rounded-full bg-primary-fixed/60" />
      </div>
    </section>
  );
}
