import Link from "next/link";
import Image from "next/image";
import { getSession } from "@/lib/auth";
import { NAV } from "@/lib/constants";
import { getSettings } from "@/lib/settings";
import { Icon } from "./ui";

export default async function Header() {
  const [session, settings] = await Promise.all([getSession(), getSettings()]);
  const account = session?.user ? (session.user.role === "ADMIN" ? "/admin" : "/account") : "/login";
  const storeNumber = settings.store_whatsapp_number.replace(/\D/g, "");
  const storeUrl = `https://wa.me/${storeNumber}?text=${encodeURIComponent("Hi, I would like to shop from the J4AI store. Please share available products, prices, and delivery details.")}`;
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-primary pt-safe text-on-primary shadow-[0_1px_8px_rgba(0,0,0,0.12)]">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between border-b border-white/15 px-4">
        <Link href="/" className="flex items-center gap-2" aria-label="J4AI home">
          <Image src="/brand/j4ai-emblem.png" alt="J4AI logo" width={32} height={36} className="h-8 w-auto rounded-sm" priority />
          <div className="flex flex-col leading-tight">
            <span className="font-headline-sm text-[14px] font-bold text-white sm:text-[16px]">Jesus For All Initiative</span>
            <span className="font-label-sm text-[8px] leading-tight text-primary-fixed sm:text-[9px]">An initiative of Fruitfulvine Foundation</span>
          </div>
        </Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {[...NAV, { href: "/about", label: "About" }, { href: "/contact", label: "Contact" }].map((n) => (
            <Link key={n.href} href={n.href} className="rounded-full px-3 py-2 font-label-md text-[14px] font-extrabold tracking-wide text-white transition hover:bg-white/20">{n.label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a href={storeUrl} target="_blank" rel="noopener noreferrer" className="btn-outline !min-h-[40px] !px-3.5 !py-1.5" aria-label="Shop J4AI on WhatsApp"><Icon name="storefront" className="text-[18px]" /><span className="hidden sm:inline">Shop</span></a>
          <Link href="/donate" className="btn-secondary !min-h-[40px] !px-3.5 !py-1.5"><Icon name="favorite" fill className="text-[18px]" />Donate</Link>
          <Link href={account} aria-label={session?.user ? "Account" : "Log in"} className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-primary">
            <Icon name="person" className="text-[18px]" />
          </Link>
        </div>
      </div>
    </header>
  );
}
