import { getSettings } from "@/lib/settings";
import CopyButton from "./CopyButton";
import { Icon } from "./ui";

export default async function BankCard({ tone = "light" }: { tone?: "light" | "plain" }) {
  const s = await getSettings();
  return (
    <div className={tone === "plain" ? "" : "rounded-2xl bg-surface-container-lowest p-3 shadow-sm"}>
      <div className="mb-2 flex items-center justify-between">
        <span className="font-label-sm text-label-sm uppercase text-on-surface-variant">Official transfer account</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-secondary-fixed/60 px-2 py-0.5 font-label-sm text-label-sm font-bold text-secondary">
          <Icon name="verified_user" className="text-[12px]" /> {s.bank_name}
        </span>
      </div>
      <div className="flex items-center justify-between gap-3 rounded-xl bg-surface-container-low px-3 py-2">
        <div className="min-w-0">
          <p className="truncate font-label-sm text-label-sm font-medium text-on-surface-variant">Account: {s.account_name}</p>
          <p className="font-mono text-[22px] font-extrabold tracking-wider text-on-surface">{s.account_number}</p>
        </div>
        <CopyButton value={s.account_number} compact label="Copy account number" />
      </div>
    </div>
  );
}
