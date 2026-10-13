import { getSettings, type SettingKey } from "@/lib/settings";
import { saveSettings } from "../actions";

const FIELDS: [SettingKey, string, string?][] = [
  ["site_name", "Organisation name"], ["tagline", "Tagline"],
  ["bank_name", "Bank name"], ["account_number", "Account number", "Use an ORGANISATION account where possible."],
  ["account_name", "Account name"], ["beneficiary_label", "Beneficiary label shown to donors"],
  ["cost_per_girl", "Cost to supply one girl (₦)", "Drives sponsorship tiers and campaign progress."],
  ["contact_email", "Contact email"], ["contact_phone", "Contact phone"], ["press_email", "Press email"], ["instagram_handle", "Instagram handle (no @)"],
];

export default async function SettingsAdmin({ searchParams }: { searchParams: { saved?: string } }) {
  const s = await getSettings();
  return (
    <form action={saveSettings} className="flex flex-col gap-4">
      <h1 className="font-headline-md text-headline-md">Site settings</h1>
      {searchParams.saved && <p className="rounded-xl bg-primary-fixed px-4 py-2 font-body-sm text-body-sm text-on-primary-fixed">Saved.</p>}
      <div className="card grid gap-4 p-5 md:grid-cols-2">
        {FIELDS.map(([k, label, hint]) => (
          <div key={k}><label className="label" htmlFor={k}>{label}</label><input id={k} name={k} defaultValue={s[k]} className="field" />{hint && <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">{hint}</p>}</div>
        ))}
      </div>
      <button className="btn-primary self-start">Save settings</button>
    </form>
  );
}
