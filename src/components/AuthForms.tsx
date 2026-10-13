"use client";
import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Icon } from "./ui";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setError("");
    const f = new FormData(e.currentTarget);
    const res = await signIn("credentials", { email: f.get("email"), password: f.get("password"), redirect: false });
    setBusy(false);
    if (res?.error) return setError("Invalid email or password.");
    const cb = params.get("callbackUrl");
    router.push(cb && cb.startsWith("/") ? cb : "/account");
    router.refresh();
  }
  return (
    <form onSubmit={onSubmit} className="card flex flex-col gap-4 p-6">
      <div><label className="label" htmlFor="email">Email</label><input id="email" name="email" type="email" required autoComplete="email" className="field" /></div>
      <div><label className="label" htmlFor="password">Password</label><input id="password" name="password" type="password" required autoComplete="current-password" className="field" /></div>
      {error && <p role="alert" className="rounded-xl bg-error-container px-4 py-2 font-body-sm text-body-sm text-on-error-container">{error}</p>}
      <button className="btn-primary" disabled={busy}><Icon name="login" className="text-[18px]" />{busy ? "Signing in…" : "Log in"}</button>
      <p className="text-center font-body-sm text-body-sm text-on-surface-variant">New here? <Link href="/register" className="font-semibold text-primary">Create an account</Link></p>
    </form>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setError("");
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const res = await fetch("/api/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) { setBusy(false); return setError(j.error ?? "Could not create account"); }
    await signIn("credentials", { email: f.email, password: f.password, redirect: false });
    router.push("/account"); router.refresh();
  }
  return (
    <form onSubmit={onSubmit} className="card flex flex-col gap-4 p-6">
      <div><label className="label" htmlFor="name">Full name</label><input id="name" name="name" required minLength={2} className="field" autoComplete="name" /></div>
      <div><label className="label" htmlFor="email">Email</label><input id="email" name="email" type="email" required className="field" autoComplete="email" /></div>
      <div><label className="label" htmlFor="phone">Phone (optional)</label><input id="phone" name="phone" type="tel" className="field" autoComplete="tel" /></div>
      <div><label className="label" htmlFor="password">Password (min. 8 characters)</label><input id="password" name="password" type="password" required minLength={8} className="field" autoComplete="new-password" /></div>
      {error && <p role="alert" className="rounded-xl bg-error-container px-4 py-2 font-body-sm text-body-sm text-on-error-container">{error}</p>}
      <button className="btn-primary" disabled={busy}><Icon name="person_add" className="text-[18px]" />{busy ? "Creating…" : "Create account"}</button>
      <p className="text-center font-body-sm text-body-sm text-on-surface-variant">Already registered? <Link href="/login" className="font-semibold text-primary">Log in</Link></p>
    </form>
  );
}
