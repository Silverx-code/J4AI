import Link from "next/link";
import Image from "next/image";
import type { Edition } from "@/db/schema";
import { formatDateRange } from "@/lib/utils";
import { Icon, Progress, StatusChip } from "./ui";

export default function EditionCard({ e, compact = false }: { e: Edition; compact?: boolean }) {
  const showProgress = e.enrolled != null && e.targetReach;
  const pct = showProgress ? Math.round((e.enrolled! / e.targetReach!) * 100) : 0;
  const coverImage = e.slug === "3-0" ? "/images/pag-3-0-shirt.jpg" : e.coverImage;
  return (
    <Link href={`/editions/${e.slug}`} className="card group flex h-full flex-col overflow-hidden transition hover:shadow-glow">
      {coverImage ? (
        <div className="relative h-44 w-full shrink-0 overflow-hidden bg-surface-container">
          <Image src={coverImage} alt={e.slug === "3-0" ? "Pad A Girl 3.0 campaign shirt" : `${e.title} cover`} fill sizes="(max-width: 768px) 100vw, 400px" className="object-cover transition duration-500 group-hover:scale-105" />
        </div>
      ) : (
        <div className={`relative flex h-44 w-full shrink-0 items-end overflow-hidden px-5 pb-4 ${e.status === "UPCOMING" || e.status === "ONGOING" ? "bg-primary text-white" : "bg-primary-fixed text-primary"}`}>
          <span className="absolute -right-2 -top-8 select-none font-black leading-none opacity-[0.08]" style={{ fontSize: "10rem" }}>{e.label}</span>
          <span className="relative z-10 font-label-sm text-label-sm uppercase tracking-[0.16em]">Pad A Girl · Edition {e.label}</span>
        </div>
      )}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <StatusChip status={e.status} />
          <span className="inline-flex items-center gap-1 font-label-sm text-label-sm uppercase text-on-surface-variant">
            <Icon name="event" className="text-[14px]" />{formatDateRange(e.startDate, e.endDate)}
          </span>
        </div>
        <h3 className="font-headline-sm text-headline-sm">{e.title}</h3>
        {!compact && e.summary && <p className="line-clamp-2 font-body-sm text-body-sm text-on-surface-variant">{e.summary}</p>}
        <div className="mt-auto grid grid-cols-2 gap-2 font-body-sm text-body-sm">
          <div>
            <p className="font-label-sm text-label-sm uppercase text-on-surface-variant">{e.reach != null ? "Verified reach" : "Target reach"}</p>
            <p className="font-headline-sm text-headline-sm text-primary">{(e.reach ?? e.targetReach)?.toLocaleString() ?? "—"}</p>
          </div>
          <div>
            <p className="font-label-sm text-label-sm uppercase text-on-surface-variant">Venue</p>
            <p className="font-semibold">{e.hostState ?? e.locations[0] ?? "To be announced"}</p>
          </div>
        </div>
        {showProgress && (
          <div>
            <Progress percent={pct} />
            <p className="mt-1 font-label-sm text-label-sm uppercase text-on-surface-variant">{e.enrolled!.toLocaleString()} enrolled of {e.targetReach!.toLocaleString()} planned</p>
          </div>
        )}
      </div>
    </Link>
  );
}
