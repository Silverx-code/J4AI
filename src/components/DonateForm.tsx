"use client";
import { useState } from "react";
import { SPONSOR_TIERS } from "@/lib/constants";
import { cn, formatNaira } from "@/lib/utils";
import { Icon } from "./ui";

export default function DonateForm({ cost, editionId }: { cost: number; editionId?: string }) {
  const [amount, setAmount] = useState<string>(String(cost * 3));
  const [fileName, setFileName] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(""); setState("sending");
    const fd = new FormData(e.currentTarget);
    fd.set("amount", amount);
    if (editionId) fd.set("editionId", editionId);
    try {
      const res = await fetch("/api/donations", { method: "POST", body: fd });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error ?? "Something went wrong");
      setState("done");
    } catch (err) { setError((err as Error).message); setState("idle"); }
  }

  if (state === "done")
    return (
      <div className="card flex flex-col items-center gap-2 p-8 text-center">
        <Icon name="favorite" fill className="text-[48px] text-primary" />
        <h3 className="font-headline-md text-headline-md">Thank you for your generosity</h3>
        <p className="max-w-sm font-body-md text-body-md text-on-surface-variant">We&apos;ve received your notification. Our team will verify the transfer and send a confirmation to your email.</p>
      </div>
    );

  return (
    <div className="flex flex-col gap-6">
      <section>
        <h2 className="mb-2 flex items-center gap-2 font-label-sm text-label-sm uppercase text-on-surface-variant"><Icon name="trending_up" className="text-[16px] text-primary" />Select sponsorship tier <span className="ml-auto text-primary">100% goes to kits</span></h2>
        <div className="grid gap-3 md:grid-cols-3" role="radiogroup" aria-label="Sponsorship tier">
          {SPONSOR_TIERS.map((t) => {
            const value = cost * t.girls;
            const on = amount === String(value);
            return (
              <button key={t.girls} type="button" role="radio" aria-checked={on} onClick={() => setAmount(String(value))}
                className={cn("relative flex items-start gap-3 rounded-2xl border p-4 text-left transition", on ? "border-primary bg-primary-fixed/40 ring-2 ring-primary" : "border-[#F3D9E2] bg-surface-container-lowest hover:border-primary")}>
                {"popular" in t && t.popular && <span className="absolute -top-2 right-3 rounded-full bg-secondary-container px-2 py-0.5 font-label-sm text-[10px] uppercase text-white">Most popular</span>}
                <div className="flex-1">
                  <p className="font-headline-sm text-headline-sm">{formatNaira(value)} <span className="ml-1 rounded-full bg-surface-container px-2 py-0.5 font-label-sm text-label-sm text-on-surface-variant">{t.girls} {t.girls === 1 ? "girl" : "girls"}</span></p>
                  <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">{t.label}</p>
                </div>
                <span className={cn("mt-1 h-5 w-5 rounded-full border-2", on ? "border-primary bg-primary shadow-[inset_0_0_0_3px_white]" : "border-outline")} />
              </button>
            );
          })}
        </div>
      </section>

      <form onSubmit={onSubmit} className="card flex flex-col gap-4 p-5 md:p-8">
        <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-on-primary"><Icon name="mark_email_read" /></div>
          <div><h2 className="font-headline-sm text-headline-sm">Payment notification</h2><p className="font-body-sm text-body-sm text-on-surface-variant">After transferring, tell us so we can verify and send your receipt.</p></div></div>
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
        <div className="grid gap-4 md:grid-cols-2">
          <div><label className="label" htmlFor="donorName">Your full name *</label><input id="donorName" name="donorName" required minLength={2} className="field" placeholder="e.g. Amaka Okafor" /></div>
          <div><label className="label" htmlFor="email">Email address *</label><input id="email" name="email" type="email" required className="field" placeholder="amaka@example.com" /></div>
        </div>
        <div><label className="label" htmlFor="amount">Amount sent (NGN) *</label>
          <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-outline">₦</span>
            <input id="amount" inputMode="numeric" required value={amount} onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))} className="field !pl-9" placeholder="3500" /></div></div>
        <div>
          <label className="label" htmlFor="proof">Payment proof / screenshot</label>
          <label htmlFor="proof" className="flex cursor-pointer flex-col items-center gap-1 rounded-2xl border-2 border-dashed border-[#E5C5D3] bg-surface-container-low p-6 text-center transition hover:border-primary">
            <Icon name="cloud_upload" className="text-[32px] text-primary" />
            <span className="font-label-md text-label-md">{fileName || "Tap to attach transfer receipt"}</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">PNG, JPG, WEBP or PDF up to 10MB</span>
          </label>
          <input id="proof" name="proof" type="file" accept="image/png,image/jpeg,image/webp,application/pdf" className="sr-only" onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")} />
        </div>
        <div><label className="label" htmlFor="message">Message of encouragement (optional)</label><textarea id="message" name="message" rows={3} maxLength={1000} className="field" placeholder="Send a heartfelt note to the girls receiving your kit…" /></div>
        {error && <p role="alert" className="rounded-xl bg-error-container px-4 py-2 font-body-sm text-body-sm text-on-error-container">{error}</p>}
        <button type="submit" disabled={state === "sending" || !amount} className="btn-primary"><Icon name="send" className="text-[18px]" />{state === "sending" ? "Sending…" : "Notify admin of donation"}</button>
      </form>
    </div>
  );
}
