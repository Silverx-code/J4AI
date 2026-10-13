export function cn(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

export function formatNaira(n: number | null | undefined) {
  return "₦" + new Intl.NumberFormat("en-NG").format(n ?? 0);
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const MONTHS_LONG = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function parse(d: string | Date | null | undefined) {
  if (!d) return null;
  const x = typeof d === "string" ? new Date(d + (d.length === 10 ? "T00:00:00" : "")) : d;
  return isNaN(x.getTime()) ? null : x;
}

/** "25 – 31 May 2026", "22 Jan – 26 Jan 2026", "28 Oct 2025" or "Date to be announced". */
export function formatDateRange(start?: string | null, end?: string | null, long = false) {
  const s = parse(start), e = parse(end);
  const M = long ? MONTHS_LONG : MONTHS;
  if (!s) return "Date to be announced";
  if (!e || (s.getTime() === e.getTime())) return `${s.getDate()} ${M[s.getMonth()]} ${s.getFullYear()}`;
  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear())
    return `${s.getDate()} – ${e.getDate()} ${M[e.getMonth()]} ${e.getFullYear()}`;
  return `${s.getDate()} ${M[s.getMonth()]} – ${e.getDate()} ${M[e.getMonth()]} ${e.getFullYear()}`;
}

export function formatDate(d?: Date | string | null) {
  const x = parse(d as string | Date | null);
  return x ? `${x.getDate()} ${MONTHS[x.getMonth()]} ${x.getFullYear()}` : "";
}

export function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}

export const STATUS_LABEL: Record<string, string> = {
  UPCOMING: "Upcoming",
  ONGOING: "Ongoing",
  COMPLETED_REPORT_PENDING: "Completed · Report pending",
  COMPLETED: "Completed",
};

export function isDone(status: string) {
  return status === "COMPLETED" || status === "COMPLETED_REPORT_PENDING";
}

export function str(v: FormDataEntryValue | null | undefined) {
  return typeof v === "string" ? v.trim() : "";
}
