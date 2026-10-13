"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Icon } from "./ui";

export default function BottomNav() {
  const path = usePathname();
  if (path.startsWith("/admin")) return null;
  return (
    <nav aria-label="Primary" className="fixed inset-x-0 bottom-0 z-50 border-t border-white/15 bg-primary pb-safe text-on-primary md:hidden">
      <ul className="mx-auto flex h-16 max-w-md items-stretch justify-around px-2">
        {NAV.map((n) => {
          const active = n.href === "/" ? path === "/" : path.startsWith(n.href);
          return (
            <li key={n.href} className="flex-1">
              <Link href={n.href} aria-current={active ? "page" : undefined}
                className={cn("flex h-full flex-col items-center justify-center gap-0.5 font-label-sm text-[10px] uppercase transition",
                  active ? "text-white" : "text-white/75")}>
                <span className={cn("flex h-7 w-12 items-center justify-center rounded-full transition", active && "bg-white/20")}>
                  <Icon name={n.icon} fill={active} className="text-[22px]" />
                </span>
                {n.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
