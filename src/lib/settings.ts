import { cache } from "react";
import { db, schema } from "@/db";

export const SETTING_DEFAULTS = {
  site_name: "Jesus For All Initiative",
  tagline: "Breaking Period Stigma & Promoting Dignity",
  bank_name: "Moniepoint Microfinance Bank",
  account_number: "5311683286",
  account_name: "Darasimi Ewaoluwa Akinwande",
  beneficiary_label: "Pad A Girl / Jesus For All Initiative",
  cost_per_girl: "3500",
  contact_email: "jesusforallinitiative@gmail.com",
  contact_phone: "07066028592",
  press_email: "jesusforallinitiative@gmail.com",
  instagram_handle: "j4ai_africa",
} as const;

export type SettingKey = keyof typeof SETTING_DEFAULTS;
export type Settings = Record<SettingKey, string>;

export const getSettings = cache(async (): Promise<Settings> => {
  const rows = await db.select().from(schema.settings);
  const out: Record<string, string> = { ...SETTING_DEFAULTS };
  for (const r of rows) if (r.key in out) out[r.key] = r.value;
  return out as Settings;
});
