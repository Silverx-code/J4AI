import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import ContactForm from "@/components/ContactForm";
import { Icon } from "@/components/ui";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage() {
  const s = await getSettings();
  return (
    <main className="mx-auto grid w-full max-w-5xl gap-8 px-4 py-4 md:grid-cols-[1fr_1.4fr]">
      <div>
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg">Contact us</h1>
        <p className="mt-1 font-body-md text-body-md text-on-surface-variant">Questions, partnerships or press? We&apos;d love to hear from you.</p>
        <div className="mt-5 flex flex-col gap-3">
          {[["mail", s.contact_email, `mailto:${s.contact_email}`], ["call", s.contact_phone, `tel:${s.contact_phone}`], ["photo_camera", `@${s.instagram_handle}`, `https://instagram.com/${s.instagram_handle}`]].map(([icon, t, href]) => (
            <a key={t} href={href} className="card flex items-center gap-3 p-4 transition hover:shadow-glow"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-fixed text-primary"><Icon name={icon} /></div><span className="font-label-lg text-label-lg">{t}</span></a>
          ))}
        </div>
      </div>
      <ContactForm />
    </main>
  );
}
