import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PILLARS } from "@/lib/constants";
import { Icon } from "@/components/ui";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-4">
      <div className="flex items-center gap-4">
        <Image src="/brand/j4ai-emblem.png" alt="J4AI logo" width={72} height={80} className="rounded-md" />
        <div><p className="font-label-sm text-label-sm uppercase text-primary">About us</p><h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg">Jesus For All Initiative</h1></div>
      </div>
      <section className="card p-5 md:p-8">
        <h2 className="font-headline-md text-headline-md">Who we are</h2>
        <p className="mt-2 font-body-lg text-body-lg text-on-surface-variant">
          Jesus For All Initiative (J4AI) is a faith-driven, community-led non-profit. Through our flagship <b>Pad A Girl</b> campaign we supply sanitary products and
          menstrual health education to schoolgirls and displaced young women in Borno State, Nigeria, so that no girl misses school because she cannot afford pads.
        </p>
        {/* TODO(content): replace with the organisation's own mission, vision, founding story and team. */}
      </section>
      <section className="grid gap-3 md:grid-cols-3">
        {PILLARS.map((p) => (
          <div key={p.title} className="card p-4"><div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-fixed text-primary"><Icon name={p.icon} /></div><p className="font-label-lg text-label-lg">{p.title}</p><p className="font-body-sm text-body-sm text-on-surface-variant">{p.body}</p></div>
        ))}
      </section>
      <div className="flex flex-wrap gap-2"><Link href="/editions" className="btn-primary">See our editions</Link><Link href="/get-involved" className="btn-outline">Get involved</Link></div>
    </main>
  );
}
