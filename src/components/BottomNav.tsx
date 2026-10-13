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
    <nav aria-label="Primary" className="fixed inset-x-0 bottom-0 z-50 border-t border-[#F3D9E2] bg-surface/90 pb-safe backdrop-blur-xl md:hidden">
      <ul className="mx-auto flex h-16 max-w-md items-stretch justify-around px-2">
        {NAV.map((n) => {
          const active = n.href === "/" ? path === "/" : path.startsWith(n.href);
          return (
            <li key={n.href} className="flex-1">
              <Link href={n.href} aria-current={active ? "page" : undefined}
                className={cn("flex h-full flex-col items-center justify-center gap-0.5 font-label-sm text-[10px] uppercase transition",
                  active ? "text-primary" : "text-on-surface-variant")}>
                <span className={cn("flex h-7 w-12 items-center justify-center rounded-full transition", active && "bg-primary-fixed")}>
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
