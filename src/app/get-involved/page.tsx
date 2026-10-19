import type { Metadata } from "next";
import Image from "next/image";
import { getNextEdition } from "@/lib/queries";
import { formatDateRange } from "@/lib/utils";
import { getSettings } from "@/lib/settings";
import InvolvedForms from "@/components/InvolvedForms";
import BankCard from "@/components/BankCard";
import { HeroGradient, Icon } from "@/components/ui";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Get Involved" };

export default async function GetInvolved({ searchParams }: { searchParams: { tab?: string } }) {
  const [next, s] = await Promise.all([getNextEdition(), getSettings()]);
  const perks = [
    ["verified", "Verified certificate of service", "Endorsed for university & career portfolios"],
    ["checkroom", "Advocacy merch & kit", "Official Pad A Girl tee, badge & field gear"],
    ["health_and_safety", "Menstrual health training", "Guided sessions led by qualified health experts"],
  ];
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-3">
      <HeroGradient>
        <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 font-label-sm text-label-sm uppercase"><Icon name="bolt" className="text-[14px]" />Be the catalyst</span>
        <h1 className="mt-3 font-display-hero-mobile text-display-hero-mobile md:font-display-hero md:text-display-hero">End Period Stigma.<br /><span className="text-primary-fixed">Promote Dignity.</span></h1>
        <p className="mt-2 max-w-xl font-body-sm text-body-sm text-primary-fixed md:text-body-lg">
          Join hands with Jesus For All Initiative (J4AI) to empower adolescent girls with hygienic products, mentorship, and health education.
          {next ? ` Our next campaign, ${next.title}, runs ${formatDateRange(next.startDate, next.endDate, true)}.` : ""}
        </p>
      </HeroGradient>
      <div className="grid gap-8 md:grid-cols-[1.4fr_1fr]">
        <InvolvedForms initialTab={searchParams.tab === "outreach" ? "outreach" : "volunteer"} eventLabel={next ? formatDateRange(next.startDate, next.endDate).replace(/ \d{4}$/, "") : undefined} />
        <aside className="flex flex-col gap-3">
          <div className="rounded-3xl bg-surface-container p-5">
            <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-on-primary"><Icon name="stars" fill /></div><div><h2 className="font-headline-sm text-headline-sm">Volunteer community perks</h2><p className="font-body-sm text-body-sm text-on-surface-variant">What you receive as a J4AI changemaker</p></div></div>
            <div className="mt-3 flex flex-col gap-2">
              {perks.map(([icon, t, b]) => (
                <div key={t} className="flex items-start gap-3 rounded-2xl bg-surface-container-lowest p-3 shadow-sm"><Icon name={icon} className="text-secondary" /><div><p className="font-label-lg text-label-lg">{t}</p><p className="font-body-sm text-body-sm text-on-surface-variant">{b}</p></div></div>
              ))}
            </div>
          </div>
          <figure className="card overflow-hidden">
            <div className="relative h-56">
              <Image src="/images/field-kit-handover.jpg" alt="J4AI volunteer handing a Pad A Girl kit to a participant" fill sizes="(max-width: 768px) 100vw, 400px" className="object-cover" />
            </div>
            <figcaption className="p-4">
              <p className="font-display-serif text-2xl">Your time can make a difference.</p>
              <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">Join a team supporting menstrual health education and practical care in the community.</p>
            </figcaption>
          </figure>
          <section className="card overflow-hidden p-4">
            <h2 className="font-headline-sm text-headline-sm">Advocacy merch &amp; kits</h2>
            <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">Pad A Girl campaign shirts for volunteers and supporters.</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <figure><div className="relative aspect-[4/5] overflow-hidden rounded-xl"><Image src="/images/merch/pad-a-girl-3-0-shirt-brown.jpg" alt="Brown Pad A Girl 3.0 campaign shirt" fill sizes="(max-width: 768px) 50vw, 200px" className="object-cover" /></div><figcaption className="mt-1 font-label-sm text-label-sm">Brown</figcaption></figure>
              <figure><div className="relative aspect-[4/5] overflow-hidden rounded-xl"><Image src="/images/merch/pad-a-girl-3-0-shirt-green.jpg" alt="Green Pad A Girl 3.0 campaign shirt" fill sizes="(max-width: 768px) 50vw, 200px" className="object-cover" /></div><figcaption className="mt-1 font-label-sm text-label-sm">Green</figcaption></figure>
            </div>
            <p className="mt-3 font-body-sm text-body-sm text-on-surface-variant">For shirt or kit payments, use the official account below. Please include “Merch” in your transfer note.</p>
            <div className="mt-3"><BankCard /></div>
          </section>
          <div className="card p-4 font-body-sm text-body-sm text-on-surface-variant">
            <p className="font-label-lg text-label-lg text-on-surface">Questions?</p>
            <p>{s.contact_email}</p><p>{s.additional_contact_email}</p><p>{s.contact_phone}</p><p>Instagram @{s.instagram_handle}</p>
          </div>
        </aside>
      </div>
    </main>
  );
}
