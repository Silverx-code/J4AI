import Link from "next/link";
import { getEditions } from "@/lib/queries";
import { formatDateRange } from "@/lib/utils";
import { StatusChip } from "@/components/ui";

export default async function EditionsAdmin() {
  const rows = await getEditions();
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between"><h1 className="font-headline-md text-headline-md">Pad A Girl editions</h1><Link href="/admin/editions/new" className="btn-primary">New edition</Link></div>
      <div className="card divide-y divide-[#F3D9E2]">
        {rows.map((e) => (
          <Link key={e.id} href={`/admin/editions/${e.id}`} className="flex items-center justify-between gap-3 p-4 hover:bg-surface-container-low">
            <div><p className="font-label-lg text-label-lg">{e.title}</p><p className="font-body-sm text-body-sm text-on-surface-variant">{formatDateRange(e.startDate, e.endDate)} · reach {e.reach ?? "—"} · target {e.targetReach ?? "—"}</p></div>
            <StatusChip status={e.status} />
          </Link>
        ))}
      </div>
    </div>
  );
}
