"use client";
import { useState } from "react";
import { AVAILABILITY, LOCATIONS, VOLUNTEER_UNITS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Icon } from "./ui";

type Tab = "volunteer" | "outreach";

export default function InvolvedForms({ initialTab = "volunteer", eventLabel }: { initialTab?: Tab; eventLabel?: string }) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [units, setUnits] = useState<string[]>([]);
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(""); setState("sending");
    const f = new FormData(e.currentTarget);
    const g = (k: string) => String(f.get(k) ?? "");
    const payload = tab === "volunteer"
      ? { type: "VOLUNTEER", name: g("name"), email: g("email"), phone: g("phone"), units, location: g("location"), availability: g("availability"), message: g("message"), website: g("website") }
      : { type: "OUTREACH_REQUEST", name: g("name"), email: g("email"), phone: g("phone"), organisation: g("organisation"), location: g("location"), girlsCount: g("girlsCount") || undefined, message: g("message"), website: g("website") };
    try {
      const res = await fetch("/api/signups", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error ?? "Something went wrong");
      setState("done");
    } catch (err) { setError((err as Error).message); setState("idle"); }
  }

  if (state === "done")
    return (
      <div className="card flex flex-col items-center gap-2 p-8 text-center">
        <Icon name="check_circle" fill className="text-[48px] text-primary" />
        <h3 className="font-headline-md text-headline-md">Thank you!</h3>
        <p className="max-w-sm font-body-md text-body-md text-on-surface-variant">
          {tab === "volunteer" ? "Your volunteer application has been received. We'll reach out on WhatsApp or email shortly." : "Your outreach request has been received. Our team will contact you to discuss next steps."}
        </p>
        <button className="btn-outline mt-2" onClick={() => { setState("idle"); setUnits([]); }}>Submit another</button>
      </div>
    );

  return (
    <div>
      <div role="tablist" className="mb-4 grid grid-cols-2 gap-1 rounded-full bg-surface-container p-1">
        {([["volunteer", "person_add", "Volunteer"], ["outreach", "campaign", "Request Outreach"]] as const).map(([k, icon, label]) => (
          <button key={k} role="tab" aria-selected={tab === k} type="button" onClick={() => { setTab(k); setError(""); }}
            className={cn("flex min-h-[44px] items-center justify-center gap-1.5 rounded-full font-label-md text-label-md transition", tab === k ? "bg-primary text-on-primary shadow-md" : "text-on-surface-variant")}>
            <Icon name={icon} className="text-[18px]" />{label}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} className="card flex flex-col gap-4 p-5 md:p-8">
        <div>
          <h2 className="font-headline-md text-headline-md">{tab === "volunteer" ? "Volunteer Application" : "Request an Outreach"}</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">{tab === "volunteer" ? "Empower girls on the frontlines" : "Invite Pad A Girl to your school or community"}</p>
        </div>
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

        <div><label className="label" htmlFor="name">Full name *</label><input id="name" name="name" required minLength={2} className="field" placeholder="e.g. Darasimi Akinwande" /></div>
        <div className="grid gap-4 md:grid-cols-2">
          <div><label className="label" htmlFor="email">Email address *</label><input id="email" name="email" type="email" required className="field" placeholder="you@example.org" /></div>
          <div><label className="label" htmlFor="phone">Phone (WhatsApp preferred) *</label><input id="phone" name="phone" type="tel" required minLength={7} className="field" placeholder="+234 810 000 0000" /></div>
        </div>

        {tab === "volunteer" ? (
          <>
            <div>
              <div className="flex items-center justify-between"><span className="label !mb-0">Preferred unit(s) *</span><span className="font-label-sm text-label-sm text-primary">{units.length} selected</span></div>
              <div className="mt-2 flex flex-wrap gap-2">
                {VOLUNTEER_UNITS.map((u) => {
                  const on = units.includes(u);
                  return (
                    <button key={u} type="button" aria-pressed={on} onClick={() => setUnits(on ? units.filter((x) => x !== u) : [...units, u])}
                      className={cn("min-h-[40px] rounded-full px-4 py-2 font-label-md text-label-md transition", on ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface-variant hover:bg-primary-fixed")}>{u}</button>
                  );
                })}
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div><label className="label" htmlFor="location">Primary location</label><select id="location" name="location" className="field">{LOCATIONS.map((l) => <option key={l}>{l}</option>)}</select></div>
              <div><label className="label" htmlFor="availability">Availability{eventLabel ? ` (${eventLabel})` : ""}</label><select id="availability" name="availability" className="field">{AVAILABILITY.map((l) => <option key={l}>{l}</option>)}</select></div>
            </div>
          </>
        ) : (
          <>
            <div><label className="label" htmlFor="organisation">School / community name *</label><input id="organisation" name="organisation" required minLength={2} className="field" placeholder="e.g. Government Girls Secondary School" /></div>
            <div className="grid gap-4 md:grid-cols-2">
              <div><label className="label" htmlFor="location">Town / LGA / State *</label><input id="location" name="location" required minLength={2} className="field" placeholder="e.g. Maiduguri, Borno" /></div>
              <div><label className="label" htmlFor="girlsCount">Approx. number of girls</label><input id="girlsCount" name="girlsCount" type="number" min={1} className="field" placeholder="e.g. 150" /></div>
            </div>
          </>
        )}

        <div><label className="label" htmlFor="message">{tab === "volunteer" ? "Why do you want to join Pad A Girl?" : "Tell us about the need"}</label><textarea id="message" name="message" rows={4} maxLength={2000} className="field" placeholder={tab === "volunteer" ? "Share your motivation, heart for advocacy, or past community experience…" : "Describe the school or community and how we can help…"} /></div>

        {error && <p role="alert" className="rounded-xl bg-error-container px-4 py-2 font-body-sm text-body-sm text-on-error-container">{error}</p>}
        <button type="submit" disabled={state === "sending" || (tab === "volunteer" && units.length === 0)} className="btn-primary">
          <Icon name="send" className="text-[18px]" />{state === "sending" ? "Sending…" : tab === "volunteer" ? "Submit volunteer application" : "Send outreach request"}
        </button>
      </form>
    </div>
  );
}
