import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getNextEdition, getPublishedPosts, getStats } from "@/lib/queries";
import { formatDate, formatDateRange } from "@/lib/utils";
import { getSettings } from "@/lib/settings";
import { EmptyState, HeroGradient, Icon } from "@/components/ui";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "News & Press" };

export default async function NewsPage() {
  const [posts, next, stats, s] = await Promise.all([getPublishedPosts(30), getNextEdition(), getStats(), getSettings()]);
  const featured = posts.find((p) => p.featured);
  const rest = posts.filter((p) => p.id !== featured?.id);
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-3">
      <div><h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg">News &amp; Press</h1><p className="font-body-md text-body-md text-on-surface-variant">Official updates and outreach notices from Jesus For All Initiative.</p></div>

      {next && (
        <HeroGradient>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 font-label-sm text-label-sm uppercase">Special announcement · {next.title}</span>
          <h2 className="mt-3 font-headline-lg-mobile text-headline-lg-mobile uppercase md:font-headline-lg md:text-headline-lg">{next.tagline ?? s.tagline}</h2>
          <p className="mt-1 font-body-md text-body-md text-primary-fixed">Outreach date: <b>{formatDateRange(next.startDate, next.endDate, true)}</b></p>
          <div className="mt-4 flex flex-wrap gap-2"><Link href={`/editions/${next.slug}`} className="btn-white">Campaign details</Link><Link href="/get-involved" className="btn-glass">Volunteer</Link></div>
        </HeroGradient>
      )}

      <section className="grid grid-cols-3 gap-3 text-center">
        {[[stats.reach.toLocaleString() + "+", "Girls reached"], [String(stats.schools), "Schools visited"], [String(stats.editions), "Editions held"]].map(([v, l]) => (
          <div key={l} className="card p-3"><p className="font-headline-md text-headline-md font-extrabold text-primary">{v}</p><p className="font-label-sm text-label-sm uppercase text-on-surface-variant">{l}</p></div>
        ))}
      </section>

      <section aria-labelledby="pag-3-feature" className="grid overflow-hidden rounded-3xl border border-[#F3D9E2] bg-surface-container-lowest shadow-warm md:grid-cols-[0.9fr_1.1fr]">
        <div className="relative min-h-[24rem] bg-surface-container sm:min-h-[30rem]">
          <Image
            src="/images/pad-a-girl-banner.jpg"
            alt="Pad A Girl 3.0 Children's Day Dignity Drive campaign flyer"
            fill
            sizes="(max-width: 768px) 100vw, 42vw"
            className="object-cover object-center"
          />
        </div>
        <div className="flex flex-col items-start justify-center p-6 sm:p-9 lg:p-12">
          <span className="chip">Featured campaign · Pad A Girl 3.0</span>
          <h2 id="pag-3-feature" className="mt-4 font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg">
            Dignity, health, and learning for every girl
          </h2>
          <p className="mt-4 font-body-md text-body-md text-on-surface-variant">
            The Children’s Day Dignity Drive set out to support 1,000 girls in Borno State with menstrual health education, pads, and hygiene kits. By bringing practical care and trusted information to schools and IDP camps, the campaign aimed to help girls stay healthy, confident, and in class throughout the month.
          </p>
          <p className="mt-3 font-label-sm text-label-sm text-on-surface-variant">
            Maiduguri · 25–31 May 2026 · Verified reach is pending
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/editions/3-0" className="btn-primary">Explore the campaign</Link>
            <Link href="/get-involved" className="btn-outline">Get involved</Link>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-headline-sm text-headline-sm">Recent notices &amp; bulletins</h2>
        {featured && <PostCard p={featured} big />}
        {rest.length ? <div className="grid gap-3 md:grid-cols-2">{rest.map((p) => <PostCard key={p.id} p={p} />)}</div>
          : !featured && <EmptyState icon="newspaper" title="No posts yet" body="Check back soon for field updates." />}
      </section>

      <section className="rounded-3xl bg-surface-container p-5 text-center">
        <p className="font-label-sm text-label-sm uppercase text-on-surface-variant">Media &amp; press inquiries</p>
        <p className="font-body-md text-body-md">{s.press_email} · {s.contact_phone}</p>
      </section>
    </main>
  );
}

function PostCard({ p, big }: { p: { slug: string; title: string; category: string; excerpt: string | null; coverImage: string | null; publishedAt: Date | null; ctaLabel: string | null; ctaUrl: string | null }; big?: boolean }) {
  return (
    <article className={`card flex overflow-hidden ${big ? "flex-col md:flex-row" : "flex-col"}`}>
      {p.coverImage && <div className={`relative ${big ? "h-56 md:h-auto md:w-2/5" : "h-40"} bg-surface-container`}><Image src={p.coverImage} alt="" fill sizes="(max-width: 768px) 100vw, 480px" className="object-cover" /></div>}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between"><span className="chip">{p.category}</span><span className="font-label-sm text-label-sm text-on-surface-variant">{formatDate(p.publishedAt)}</span></div>
        <Link href={`/news/${p.slug}`} className="font-headline-sm text-headline-sm hover:text-primary">{p.title}</Link>
        {p.excerpt && <p className="font-body-sm text-body-sm text-on-surface-variant">{p.excerpt}</p>}
        <div className="mt-auto flex items-center gap-4 pt-2">
          <Link href={`/news/${p.slug}`} className="inline-flex items-center gap-1 font-label-md text-label-md text-primary">Read more <Icon name="arrow_forward" className="text-[16px]" /></Link>
          {p.ctaUrl && <a href={p.ctaUrl} className="font-label-md text-label-md text-secondary">{p.ctaLabel ?? "Learn more"}</a>}
        </div>
      </div>
    </article>
  );
}
