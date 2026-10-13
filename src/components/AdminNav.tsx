"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Icon } from "./ui";

const ITEMS = [
  ["/admin", "Overview", "dashboard"], ["/admin/signups", "Signups", "groups"], ["/admin/enquiries", "Enquiries", "mail"],
  ["/admin/editions", "Editions", "auto_stories"], ["/admin/posts", "News posts", "newspaper"],
  ["/admin/donations", "Donations", "volunteer_activism"], ["/admin/settings", "Settings", "settings"],
] as const;

export default function AdminNav() {
  const path = usePathname();
  return (
    <nav aria-label="Admin" className="scrollbar-none flex gap-2 overflow-x-auto pb-2 md:flex-col md:overflow-visible">
      {ITEMS.map(([href, label, icon]) => {
        const active = href === "/admin" ? path === "/admin" : path.startsWith(href);
        return (
          <Link key={href} href={href} className={cn("flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 font-label-md text-label-md transition md:rounded-xl", active ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface-variant hover:bg-primary-fixed")}>
            <Icon name={icon} className="text-[18px]" />{label}
          </Link>
        );
      })}
      <Link href="/" className="flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 font-label-md text-label-md text-primary md:mt-4"><Icon name="open_in_new" className="text-[18px]" />View site</Link>
    </nav>
  );
}
