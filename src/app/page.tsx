import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getEditionBySlug, getNextEdition, getPublishedPosts, getStats } from "@/lib/queries";
import { formatDate, formatDateRange } from "@/lib/utils";
import { Icon, StatusChip } from "@/components/ui";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Home" };

export default async function HomePage() {
  const [nextEdition, campaign, stats, posts] = await Promise.all([
    getNextEdition(),
    getEditionBySlug("3-0"),
    getStats(),
    getPublishedPosts(3),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 py-6 md:gap-24 md:py-10">
      <section aria-labelledby="home-hero-title" className="grid overflow-hidden rounded-[2rem] bg-primary text-white shadow-xl md:min-h-[34rem] md:grid-cols-[1.05fr_0.95fr]">
        <div className="flex flex-col items-start justify-center p-6 sm:p-9 lg:p-12">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 font-label-sm text-label-sm uppercase tracking-[0.12em] text-white">
            <span className="h-2 w-2 rounded-full bg-secondary-fixed" />Jesus For All Initiative
          </span>
          <h1 id="home-hero-title" className="mt-6 max-w-2xl font-display-serif text-5xl leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
            Every girl deserves <em className="text-primary-fixed">dignity.</em>
          </h1>
          <p className="mt-5 max-w-xl font-body-md text-body-md text-white/85 md:text-body-lg">
            We help girls access menstrual health education and practical support so they can learn, grow, and take part in school with confidence.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/get-involved" className="btn-white">Get involved <Icon name="arrow_forward" className="text-[18px]" /></Link>
            <Link href="/donate" className="btn-glass">Support the campaign</Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 font-label-sm text-label-sm uppercase tracking-wide text-primary-fixed">
            <span className="inline-flex items-center gap-1.5"><Icon name="school" className="text-[17px]" />Education</span>
            <span className="inline-flex items-center gap-1.5"><Icon name="health_and_safety" className="text-[17px]" />Health</span>
            <span className="inline-flex items-center gap-1.5"><Icon name="favorite" className="text-[16px]" />Dignity</span>
          </div>
        </div>

        <div className="relative min-h-[20rem] bg-primary-container md:min-h-full">
          <Image
            src="/images/pag-3-0-shirt.jpg"
            alt="Pad A Girl campaign shirt"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 48vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent md:bg-gradient-to-l md:from-black/10 md:via-transparent md:to-transparent" />
          <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/25 bg-white/90 p-4 text-on-surface shadow-lg backdrop-blur-sm sm:bottom-7 sm:left-7 sm:right-7">
            <p className="font-label-sm text-label-sm uppercase text-primary">Pad A Girl</p>
            <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">Menstrual health, practical care, and the confidence to stay in school.</p>
          </div>
        </div>
      </section>

      {nextEdition && <UpcomingCampaign edition={nextEdition} />}

      <section aria-labelledby="impact-title">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-label-sm text-label-sm uppercase tracking-[0.12em] text-primary">Progress we can verify</p>
            <h2 id="impact-title" className="mt-1 font-display-serif text-4xl leading-tight sm:text-5xl">Our impact so far</h2>
          </div>
          <Link href="/impact" className="inline-flex items-center gap-1 font-label-md text-label-md text-primary hover:underline">See impact &amp; transparency <Icon name="arrow_forward" className="text-[17px]" /></Link>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { value: stats.reach.toLocaleString(), label: "Girls reached", icon: "groups" },
            { value: stats.schools.toLocaleString(), label: "Schools visited", icon: "school" },
            { value: stats.editions.toLocaleString(), label: "Editions held", icon: "event_available" },
          ].map((item) => (
            <div key={item.label} className="card flex items-center gap-4 p-4 sm:p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-fixed text-primary"><Icon name={item.icon} className="text-[25px]" /></div>
              <div>
                <p className="font-display-serif text-4xl leading-none text-primary">{item.value}</p>
                <p className="mt-1 font-label-sm text-label-sm uppercase text-on-surface-variant">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 font-body-sm text-body-sm text-on-surface-variant">Figures include verified results from completed campaigns only; planned targets are not counted.</p>
      </section>

      {campaign && <CampaignFeature campaign={campaign} />}

      <section aria-labelledby="what-we-do-title">
        <div className="mb-6 max-w-2xl">
          <p className="font-label-sm text-label-sm uppercase tracking-[0.12em] text-primary">What we do</p>
          <h2 id="what-we-do-title" className="mt-1 font-display-serif text-4xl leading-tight sm:text-5xl">Care that keeps girls learning</h2>
          <p className="mt-3 font-body-md text-body-md text-on-surface-variant">We pair practical support with useful information, meeting girls with care, respect, and an invitation to shape their own futures.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Pillar icon="menu_book" title="Education" tone="bg-primary-fixed text-primary" body="Clear, age-appropriate menstrual health education that helps girls understand their bodies and make informed choices." />
          <Pillar icon="health_and_safety" title="Health" tone="bg-secondary-fixed text-secondary" body="Pads and hygiene kits, alongside practical guidance that supports health, comfort, and everyday wellbeing." />
          <Pillar icon="sentiment_satisfied" title="Dignity" tone="bg-[#E4F4F2] text-[#176B62]" body="Creating supportive spaces where periods do not stand between girls and school, confidence, or opportunity." />
        </div>
      </section>

      <section aria-labelledby="news-title">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="font-label-sm text-label-sm uppercase tracking-[0.12em] text-primary">From the field</p>
            <h2 id="news-title" className="mt-1 font-display-serif text-4xl leading-tight sm:text-5xl">Stories &amp; updates</h2>
          </div>
          <Link href="/news" className="hidden items-center gap-1 font-label-md text-label-md text-primary hover:underline sm:inline-flex">All news <Icon name="arrow_forward" className="text-[17px]" /></Link>
        </div>
        {posts.length ? (
          <div className="grid gap-4 md:grid-cols-3">
            {posts.map((post) => <NewsCard key={post.id} post={post} />)}
          </div>
        ) : (
          <div className="card p-6"><p className="font-body-sm text-body-sm text-on-surface-variant">Campaign updates will appear here.</p></div>
        )}
        <Link href="/news" className="btn-outline mt-4 sm:hidden">View all updates <Icon name="arrow_forward" className="text-[18px]" /></Link>
      </section>

      <section className="overflow-hidden rounded-3xl bg-primary px-6 py-8 text-center text-white shadow-xl sm:px-10 sm:py-12">
        <p className="font-label-sm text-label-sm uppercase tracking-[0.14em] text-primary-fixed">Be part of the change</p>
        <h2 className="mx-auto mt-2 max-w-3xl font-display-serif text-4xl leading-tight sm:text-5xl">A girl’s future should never be limited by her period.</h2>
        <p className="mx-auto mt-3 max-w-2xl font-body-md text-body-md text-white/85">Volunteer your time, support a dignity kit, or learn more about the work happening in Borno State.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/get-involved" className="btn-white">Volunteer</Link>
          <Link href="/donate" className="btn-glass">Donate</Link>
          <Link href="/about" className="btn-glass">About J4AI</Link>
        </div>
      </section>
    </main>
  );
}

function UpcomingCampaign({ edition }: { edition: NonNullable<Awaited<ReturnType<typeof getNextEdition>>> }) {
  return (
    <section aria-labelledby="upcoming-title" className="grid overflow-hidden rounded-3xl border border-[#F3D9E2] bg-white shadow-warm md:grid-cols-[1.2fr_0.8fr]">
      <div className="p-5 sm:p-8 lg:p-10">
        <div className="flex flex-wrap items-center gap-2">
          <StatusChip status={edition.status} />
          <span className="font-label-sm text-label-sm uppercase text-on-surface-variant">Next campaign · {formatDateRange(edition.startDate, edition.endDate, true)}</span>
        </div>
        <h2 id="upcoming-title" className="mt-4 font-display-serif text-4xl leading-[1.05] sm:text-5xl">{edition.tagline ?? edition.title}</h2>
        {edition.summary && <p className="mt-3 max-w-2xl font-body-md text-body-md text-on-surface-variant">{edition.summary}</p>}
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={`/editions/${edition.slug}`} className="btn-primary">Campaign details</Link>
          <Link href="/get-involved" className="btn-outline">Volunteer for {edition.label}</Link>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 bg-surface-container-low p-5 sm:p-8">
        <div className="rounded-2xl bg-white p-4 sm:p-5">
          <Icon name="flag" className="text-[24px] text-primary" />
          <p className="mt-4 font-label-sm text-label-sm uppercase text-on-surface-variant">Campaign target</p>
          <p className="mt-1 font-display-serif text-4xl leading-none text-primary">{edition.targetReach?.toLocaleString() ?? "—"}</p>
          <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">girls planned</p>
        </div>
        <div className="rounded-2xl bg-white p-4 sm:p-5">
          <Icon name="location_on" className="text-[24px] text-secondary" />
          <p className="mt-4 font-label-sm text-label-sm uppercase text-on-surface-variant">Venue</p>
          <p className="mt-1 font-display-serif text-3xl leading-tight">{edition.hostState ?? edition.locations[0] ?? "To be announced"}</p>
          <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">{edition.locations[0] ?? "Location details to follow"}</p>
        </div>
      </div>
    </section>
  );
}

function CampaignFeature({ campaign }: { campaign: NonNullable<Awaited<ReturnType<typeof getEditionBySlug>>> }) {
  return (
    <section aria-labelledby="campaign-feature-title" className="grid overflow-hidden rounded-3xl border border-[#F3D9E2] bg-white shadow-warm md:grid-cols-[0.9fr_1.1fr]">
      <div className="relative min-h-[20rem] bg-surface-container sm:min-h-[25rem]">
        <Image src="/images/pag-3-0-shirt.jpg" alt="Pad A Girl 3.0 campaign shirt" fill sizes="(max-width: 768px) 100vw, 42vw" className="object-cover" />
        <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-4 py-2 font-label-sm text-label-sm uppercase text-primary shadow backdrop-blur-sm">Children’s Day Dignity Drive</div>
      </div>
      <div className="flex flex-col items-start justify-center p-6 sm:p-9 lg:p-12">
        <p className="font-label-sm text-label-sm uppercase tracking-[0.12em] text-primary">Featured campaign · Pad A Girl {campaign.label}</p>
        <h2 id="campaign-feature-title" className="mt-2 font-display-serif text-4xl leading-tight sm:text-5xl">Dignity, health, and learning for every girl.</h2>
        <p className="mt-4 font-body-md text-body-md text-on-surface-variant">{campaign.summary}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {campaign.startDate && <span className="chip"><Icon name="event" className="text-[15px]" />{formatDateRange(campaign.startDate, campaign.endDate, true)}</span>}
          {campaign.targetReach != null && <span className="chip">Target · {campaign.targetReach.toLocaleString()} girls</span>}
        </div>
        {campaign.reach == null && <p className="mt-3 font-label-sm text-label-sm text-on-surface-variant">Verified reach is pending.</p>}
        <Link href={`/editions/${campaign.slug}`} className="btn-outline mt-6">Explore the campaign <Icon name="arrow_forward" className="text-[18px]" /></Link>
      </div>
    </section>
  );
}

function Pillar({ icon, title, tone, body }: { icon: string; title: string; tone: string; body: string }) {
  return (
    <article className="card flex flex-col gap-4 p-5 sm:p-6">
      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tone}`}><Icon name={icon} className="text-[25px]" /></div>
      <div>
        <h3 className="font-display-serif text-3xl leading-tight">{title}</h3>
        <p className="mt-2 font-body-sm text-body-sm leading-relaxed text-on-surface-variant">{body}</p>
      </div>
    </article>
  );
}

function NewsCard({ post }: { post: { slug: string; title: string; category: string; excerpt: string | null; coverImage: string | null; publishedAt: Date | null } }) {
  return (
    <article className="card flex h-full flex-col overflow-hidden">
      {post.coverImage && (
        <div className="relative h-44 bg-surface-container">
          <Image src={post.coverImage} alt="" fill sizes="(max-width: 768px) 100vw, 400px" className="object-cover" />
        </div>
      )}
      <div className="flex flex-1 flex-col items-start p-5">
        <div className="flex w-full items-center justify-between gap-2"><span className="chip">{post.category}</span><span className="font-label-sm text-label-sm text-on-surface-variant">{formatDate(post.publishedAt)}</span></div>
        <h3 className="mt-4 font-display-serif text-3xl leading-tight">{post.title}</h3>
        {post.excerpt && <p className="mt-2 line-clamp-3 font-body-sm text-body-sm text-on-surface-variant">{post.excerpt}</p>}
        <Link href={`/news/${post.slug}`} className="mt-auto inline-flex items-center gap-1 pt-5 font-label-md text-label-md text-primary hover:underline">Read update <Icon name="arrow_forward" className="text-[17px]" /></Link>
      </div>
    </article>
  );
}
