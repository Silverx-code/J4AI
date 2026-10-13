import Link from "next/link";
import Image from "next/image";
import type { Edition } from "@/db/schema";
import { formatDateRange } from "@/lib/utils";
import { Icon, Progress, StatusChip } from "./ui";

export default function EditionCard({ e, compact = false }: { e: Edition; compact?: boolean }) {
  const showProgress = e.enrolled != null && e.targetReach;
  const pct = showProgress ? Math.round((e.enrolled! / e.targetReach!) * 100) : 0;
  return (
    <Link href={`/editions/${e.slug}`} className="card group flex flex-col overflow-hidden transition hover:shadow-glow">
      {e.coverImage && (
        <div className="relative h-44 w-full overflow-hidden bg-surface-container">
          <Image src={e.coverImage} alt={`${e.title} cover`} fill sizes="(max-width: 768px) 100vw, 400px" className="object-cover transition duration-500 group-hover:scale-105" />
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
        {!compact && e.summary && <p className="line-clamp-3 font-body-sm text-body-sm text-on-surface-variant">{e.summary}</p>}
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
