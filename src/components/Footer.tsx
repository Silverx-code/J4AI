import Link from "next/link";
import { getSettings } from "@/lib/settings";

export default async function Footer() {
  const s = await getSettings();
  return (
    <footer className="mt-10 border-t border-[#F3D9E2] bg-surface-container-low pb-28 pt-8 md:pb-10">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 md:grid-cols-3">
        <div>
          <p className="font-headline-sm text-headline-sm">{s.site_name}</p>
          <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">{s.tagline}. Every girl deserves dignity, education and comfort.</p>
        </div>
        <div className="grid grid-cols-2 gap-1 font-body-sm text-body-sm">
          {[["/editions", "Editions"], ["/impact", "Impact & transparency"], ["/news", "News & press"], ["/get-involved", "Get involved"], ["/donate", "Donate"], ["/about", "About"], ["/contact", "Contact"]].map(([h, l]) => (
            <Link key={h} href={h} className="py-1 text-on-surface-variant hover:text-primary">{l}</Link>
          ))}
        </div>
        <div className="font-body-sm text-body-sm text-on-surface-variant">
          <p>{s.contact_email}</p>
          <p>{s.contact_phone}</p>
          <p>@{s.instagram_handle}</p>
        </div>
      </div>
      <p className="mx-auto mt-6 max-w-6xl px-4 font-label-sm text-[10px] uppercase text-outline">© {new Date().getFullYear()} Jesus For All Initiative</p>
    </footer>
  );
}
