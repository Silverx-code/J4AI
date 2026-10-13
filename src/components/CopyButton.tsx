"use client";
import { useState } from "react";
import { Icon } from "./ui";

export default function CopyButton({ value, label = "Copy", compact = false }: { value: string; label?: string; compact?: boolean }) {
  const [done, setDone] = useState(false);
  async function copy() {
    try { await navigator.clipboard.writeText(value); setDone(true); setTimeout(() => setDone(false), 2000); } catch {}
  }
  return (
    <button type="button" onClick={copy} aria-label={`${label} ${value}`}
      className={compact
        ? "flex h-11 w-11 items-center justify-center rounded-full bg-surface-container-lowest text-primary shadow-sm transition active:scale-90"
        : "btn-primary !px-4 !py-2"}>
      <Icon name={done ? "check" : "content_copy"} className="text-[18px]" />
      {!compact && (done ? "Copied" : label)}
    </button>
  );
}
