import type { Metadata } from "next";
import { getNextEdition, getSponsorProgress } from "@/lib/queries";
import { formatDateRange } from "@/lib/utils";
import { getSettings } from "@/lib/settings";
import BankCard from "@/components/BankCard";
import DonateForm from "@/components/DonateForm";
import { HeroGradient, Icon, Progress } from "@/components/ui";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Donate" };

export default async function DonatePage() {
  const [next, s] = await Promise.all([getNextEdition(), getSettings()]);
  const progress = next ? await getSponsorProgress(next) : null;
  const cost = Math.max(1, parseInt(s.cost_per_girl, 10) || 3500);
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-3">
      <HeroGradient>
        {next && <div className="mb-3 flex flex-wrap gap-2"><span className="rounded-full bg-white/20 px-3 py-1 font-label-sm text-label-sm uppercase">Campaign {next.label}</span><span className="rounded-full bg-white/15 px-3 py-1 font-label-sm text-label-sm uppercase">{formatDateRange(next.startDate, next.endDate)}</span></div>}
        <h1 className="font-display-hero-mobile text-display-hero-mobile md:font-display-hero md:text-display-hero">Support a Girl,<br />Restore Her Dignity</h1>
        <p className="mt-2 max-w-xl font-body-sm text-body-sm text-primary-fixed md:text-body-lg">Directly fund sustainable menstrual health kits, education workbooks, and de-stigmatisation outreach for young schoolgirls.</p>
        {progress && progress.target > 0 && (
          <div className="mt-5 max-w-md rounded-2xl bg-white/15 p-4 backdrop-blur-md">
            <div className="flex items-center justify-between font-label-sm text-label-sm uppercase"><span>Campaign milestone</span><span className="rounded-full bg-white px-2.5 py-0.5 text-primary">{progress.percent}% funded</span></div>
            <p className="mt-1 font-headline-md text-headline-md">{progress.funded.toLocaleString()} / {progress.target.toLocaleString()} <span className="text-label-md font-semibold opacity-80">girls sponsored</span></p>
            <Progress percent={progress.percent} className="mt-2 !bg-white/30" />
          </div>
        )}
      </HeroGradient>

      <section className="card flex flex-col gap-3 p-4 md:p-6">
        <h2 className="flex items-center gap-2 font-label-sm text-label-sm uppercase text-on-surface-variant"><Icon name="account_balance" className="text-[16px] text-primary" />Direct bank transfer <span className="ml-auto text-primary">Instant · 0% fee</span></h2>
        <BankCard tone="plain" />
        <p className="font-body-sm text-body-sm text-on-surface-variant">Beneficiary: <b>{s.beneficiary_label}</b> · Currency NGN (₦)</p>
      </section>

      <DonateForm cost={cost} editionId={next?.id} />

      <section className="rounded-3xl bg-surface-container p-5">
        <h2 className="font-headline-sm text-headline-sm">Accountability guarantee</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm"><Icon name="inventory_2" className="text-primary" /><p className="font-label-lg text-label-lg">Direct delivery</p><p className="font-body-sm text-body-sm text-on-surface-variant">Pads and kits are delivered directly to participating schools.</p></div>
          <div className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm"><Icon name="receipt_long" className="text-primary" /><p className="font-label-lg text-label-lg">Financial transparency</p><p className="font-body-sm text-body-sm text-on-surface-variant">Post-campaign reports are published on our <a className="font-semibold text-primary" href="/impact">Impact page</a>.</p></div>
        </div>
      </section>
    </main>
  );
}
