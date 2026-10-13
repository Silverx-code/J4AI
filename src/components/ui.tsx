import Link from "next/link";
import { cn, STATUS_LABEL } from "@/lib/utils";

export function Icon({ name, fill, className }: { name: string; fill?: boolean; className?: string }) {
  return <span aria-hidden className={cn("material-symbols-outlined", fill && "icon-fill", className)}>{name}</span>;
}

export function StatusChip({ status, className }: { status: string; className?: string }) {
  const tone =
    status === "UPCOMING" || status === "ONGOING" ? "bg-secondary-fixed text-secondary"
    : status === "COMPLETED_REPORT_PENDING" ? "bg-[#FFF0F5] text-primary"
    : "bg-surface-container-high text-on-surface-variant";
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 font-label-sm text-label-sm uppercase", tone, className)}>
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}

export function SectionHeading({ icon, title, aside, href }: { icon?: string; title: string; aside?: string; href?: string }) {
  return (
    <div className="flex items-center justify-between px-1">
      <div className="flex items-center gap-2">
        {icon && <Icon name={icon} fill className="text-primary text-[20px]" />}
        <h2 className="font-headline-sm text-headline-sm text-on-surface">{title}</h2>
      </div>
      {aside && (href
        ? <Link href={href} className="font-label-sm text-label-sm uppercase text-primary hover:underline">{aside}</Link>
        : <span className="font-label-sm text-label-sm uppercase text-on-surface-variant">{aside}</span>)}
    </div>
  );
}

export function HeroGradient({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("relative w-full overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-container to-secondary-container p-5 text-on-primary shadow-xl md:p-10", className)}>
      <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-44 w-44 rounded-full bg-secondary-fixed/20 blur-xl" />
      <div className="relative z-10">{children}</div>
    </section>
  );
}

export function Progress({ percent, className }: { percent: number; className?: string }) {
  return (
    <div className={cn("h-3 w-full overflow-hidden rounded-full bg-[#FFE4EE]", className)} role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full rounded-full bg-gradient-to-r from-primary-container to-secondary-container" style={{ width: `${Math.max(2, Math.min(100, percent))}%` }} />
    </div>
  );
}

export function EmptyState({ icon = "inbox", title, body }: { icon?: string; title: string; body?: string }) {
  return (
    <div className="card flex flex-col items-center gap-2 p-8 text-center">
      <Icon name={icon} className="text-[36px] text-outline" />
      <p className="font-headline-sm text-headline-sm">{title}</p>
      {body && <p className="font-body-sm text-body-sm text-on-surface-variant">{body}</p>}
    </div>
  );
}
