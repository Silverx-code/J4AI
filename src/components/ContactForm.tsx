"use client";
import { useState } from "react";
import { Icon } from "./ui";

export default function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError(""); setState("sending");
    const f = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error ?? "Something went wrong");
      setState("done");
    } catch (err) { setError((err as Error).message); setState("idle"); }
  }
  if (state === "done") return (
    <div className="card flex flex-col items-center gap-2 p-8 text-center"><Icon name="mark_email_read" fill className="text-[44px] text-primary" /><h3 className="font-headline-sm text-headline-sm">Message sent</h3><p className="font-body-md text-body-md text-on-surface-variant">Thanks for reaching out. We&apos;ll reply as soon as we can.</p></div>
  );
  return (
    <form onSubmit={onSubmit} className="card flex flex-col gap-4 p-5 md:p-8">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="grid gap-4 md:grid-cols-2">
        <div><label className="label" htmlFor="name">Name *</label><input id="name" name="name" required minLength={2} className="field" /></div>
        <div><label className="label" htmlFor="email">Email *</label><input id="email" name="email" type="email" required className="field" /></div>
      </div>
      <div><label className="label" htmlFor="subject">Subject *</label><input id="subject" name="subject" required minLength={2} className="field" /></div>
      <div><label className="label" htmlFor="message">Message *</label><textarea id="message" name="message" required minLength={5} rows={5} maxLength={4000} className="field" /></div>
      {error && <p role="alert" className="rounded-xl bg-error-container px-4 py-2 font-body-sm text-body-sm text-on-error-container">{error}</p>}
      <button type="submit" disabled={state === "sending"} className="btn-primary"><Icon name="send" className="text-[18px]" />{state === "sending" ? "Sending…" : "Send message"}</button>
    </form>
  );
}
