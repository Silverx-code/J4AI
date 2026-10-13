"use client";
import { useState } from "react";

/** A URL input with an "Upload" helper that posts to /api/uploads (admin only) and fills the URL. */
export default function UploadField({ name, label, defaultValue = "", accept = "image/png,image/jpeg,image/webp,application/pdf" }: { name: string; label: string; defaultValue?: string | null; accept?: string }) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true); setErr("");
    const fd = new FormData(); fd.append("file", file);
    const res = await fetch("/api/uploads", { method: "POST", body: fd });
    const j = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) return setErr(j.error ?? "Upload failed");
    setValue(j.url);
  }
  return (
    <div>
      <label className="label">{label}</label>
      <div className="flex gap-2">
        <input name={name} value={value} onChange={(e) => setValue(e.target.value)} className="field" placeholder="https://… or upload →" />
        <label className="btn-outline shrink-0 cursor-pointer">{busy ? "…" : "Upload"}<input type="file" accept={accept} onChange={onFile} className="sr-only" /></label>
      </div>
      {err && <p className="mt-1 text-body-sm text-error">{err}</p>}
    </div>
  );
}
