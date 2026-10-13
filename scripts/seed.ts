import "dotenv/config";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as s from "../src/db/schema";

/**
 * Seed: only facts taken from the PAG 1.0/2.0 report and the PAG 3.0 flier.
 * Anything unverified (e.g. 3.0 reach, 3.0 finances) is deliberately left EMPTY for the admin to fill in.
 * Idempotent: safe to run more than once (existing rows are left untouched).
 */
async function main() {
  const sql = postgres(process.env.DATABASE_URL!, { max: 1 });
  const db = drizzle(sql, { schema: s });

  // --- admin user ---
  const email = (process.env.ADMIN_EMAIL ?? "admin@example.org").toLowerCase();
  const [existing] = await db.select().from(s.users).where(eq(s.users.email, email)).limit(1);
  if (!existing) {
    await db.insert(s.users).values({
      name: process.env.ADMIN_NAME ?? "J4AI Admin", email,
      passwordHash: await bcrypt.hash(process.env.ADMIN_PASSWORD ?? "change-this-password", 12), role: "ADMIN",
    });
    console.log(`Admin created: ${email}`);
  }

  // --- program ---
  await db.insert(s.programs).values({
    name: "Pad A Girl", slug: "pad-a-girl",
    summary: "Menstrual hygiene education and sanitary pad distribution for schoolgirls in Borno State, Nigeria.",
  }).onConflictDoNothing();
  const [program] = await db.select().from(s.programs).where(eq(s.programs.slug, "pad-a-girl")).limit(1);

  const editions: (typeof s.editions.$inferInsert)[] = [
    {
      programId: program.id, label: "1.0", slug: "1-0", title: "Pad A Girl 1.0", status: "COMPLETED",
      tagline: "Where it began", startDate: "2025-10-28", endDate: "2025-10-28", hostState: "Borno State",
      locations: ["Government Technical Secondary School, Njimtilo"], schools: 1, attendance: 250,
      summary: "The foundational outreach: menstrual hygiene education and sanitary pad distribution at Government Technical Secondary School, Njimtilo, attended by about 250 people including 200+ students and 30 mothers.",
    },
    {
      programId: program.id, label: "2.0", slug: "2-0", title: "Pad A Girl 2.0", status: "COMPLETED",
      tagline: "Three schools, one mission", startDate: "2026-01-22", endDate: "2026-01-26", hostState: "Borno State",
      locations: ["Maiduguri", "Monguno"], schools: 3, reach: 395,
      summary: "A five-day outreach across three schools in Maiduguri and Monguno, supplying hygiene kits and menstrual health education to students and young mothers.",
    },
    {
      programId: program.id, label: "3.0", slug: "3-0", title: "Pad A Girl 3.0", status: "COMPLETED_REPORT_PENDING",
      tagline: "Children's Day Dignity Drive", startDate: "2026-05-25", endDate: "2026-05-31", hostState: "Borno State",
      locations: ["Maiduguri"], targetReach: 1000,
      targetDescription: "Planned reach: 1,000 girls through public secondary schools and IDP camps in Borno State.",
      partners: ["UNFPA"], partnerNote: "Organised by Jesus For All Initiative in collaboration with the United Nations Population Fund.",
      pillars: ["Hygiene Kits", "Stigma Eradication", "Dignity Workshops"],
      summary: "A Children's Day dignity drive for girls in Borno State: pads and hygiene kits, menstrual health sensitisation, and support to keep girls in school every day of the month.",
      objectives: [
        { title: "Donate pads and hygiene kits", body: "Direct distribution of sanitary pads and hygiene kits to girls." },
        { title: "Sensitise on menstrual health", body: "Education sessions at public secondary schools and IDP camps." },
        { title: "Keep girls in school", body: "Support so no girl misses school because she cannot afford pads." },
      ],
      coverImage: "/images/pad-a-girl-banner.jpg",
    },
    {
      programId: program.id, label: "4.0", slug: "4-0", title: "Pad A Girl 4.0", status: "UPCOMING",
      tagline: "Breaking Period Stigma & Promoting Dignity", startDate: "2026-10-15", endDate: "2026-10-16",
      targetReach: 1200, locations: [], pillars: ["Hygiene Kits", "Stigma Eradication", "Dignity Workshops"],
      summary: "The next Pad A Girl outreach. Volunteers and sponsors are being mobilised now.",
    },
  ];
  for (const e of editions) await db.insert(s.editions).values(e).onConflictDoNothing();

  const [e3] = await db.select().from(s.editions).where(eq(s.editions.slug, "3-0")).limit(1);
  const [haveMedia] = await db.select().from(s.editionMedia).where(eq(s.editionMedia.editionId, e3.id)).limit(1);
  if (!haveMedia) {
    await db.insert(s.editionMedia).values([
      { editionId: e3.id, type: "VIDEO", url: "/media/nta-coverage.mp4", title: "NTA news coverage", caption: "Television coverage of the Pad A Girl campaign.", sortOrder: 0 },
      { editionId: e3.id, type: "PHOTO", url: "/images/pag-3-0-flier.jpg", title: "Official campaign flier", caption: "Pad A Girl 3.0 · Children's Day Dignity Drive", sortOrder: 1 },
    ]);
  }

  const posts: (typeof s.posts.$inferInsert)[] = [
    { title: "Pad A Girl 4.0 is coming: 15–16 October 2026", slug: "pad-a-girl-4-0-announced", category: "Announcement", featured: true, status: "PUBLISHED",
      excerpt: "Our next outreach is set for 15–16 October 2026. Volunteers and sponsors are invited to join.",
      body: "Pad A Girl 4.0 takes place on 15–16 October 2026.\n\nEvery girl deserves dignity, education and comfort. You can help by volunteering on one of our field units or by sponsoring dignity kits.\n\nVisit the Get Involved page to apply, or the Donate page to sponsor a girl.",
      ctaLabel: "Get involved", ctaUrl: "/get-involved", publishedAt: new Date("2026-10-01T09:00:00Z") },
    { title: "Pad A Girl 3.0: Children's Day Dignity Drive", slug: "pad-a-girl-3-0-childrens-day", category: "Impact Report", status: "PUBLISHED",
      excerpt: "The 3.0 drive ran 25–31 May 2026 in Maiduguri. The full verified report is being finalised.",
      body: "Pad A Girl 3.0 was a Children's Day dignity drive for girls in Borno State, held 25–31 May 2026 in collaboration with UNFPA.\n\nOur team is reconciling field records and finances. Certified figures and the full report will be published on the Impact page as soon as they are ready.",
      ctaLabel: "See the edition", ctaUrl: "/editions/3-0", publishedAt: new Date("2026-06-15T09:00:00Z") },
    { title: "Volunteer call for Pad A Girl 4.0", slug: "volunteer-call-pad-a-girl-4-0", category: "Volunteer Call", status: "PUBLISHED",
      excerpt: "We need volunteers in organisation and registration, publicity, logistics, technical, welfare and MC units.",
      body: "We are welcoming passionate young people and health advocates to join the Pad A Girl 4.0 team.\n\nUnits: Organization & Registration, Publicity & Media, Logistics & Transport, Technical & Sound, Welfare & Care, and Master of Ceremonies.\n\nApply on the Get Involved page.",
      ctaLabel: "Apply as a volunteer", ctaUrl: "/get-involved", publishedAt: new Date("2026-10-02T09:00:00Z") },
  ];
  for (const p of posts) await db.insert(s.posts).values(p).onConflictDoNothing();

  console.log("Seed complete.");
  await sql.end();
}
main().catch((e) => { console.error(e); process.exit(1); });
