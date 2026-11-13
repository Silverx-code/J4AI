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
      locations: ["Government Technical College, Njimtilo"], schools: 1, attendance: 250, reach: 200,
      summary: "The 28 October 2025 outreach at Government Technical College, Njimtilo recorded 250 people: 200 girls, 30 mothers, 10 staff, and 10 volunteers. The team distributed menstrual pads and provided hygiene education.",
      reportUrl: "/brand/PAG%201.0%20AND%202.0%20REPORT.pdf", reportLabel: "PAG 1.0 & 2.0 official field report",
      coverImage: "/images/PAG%201.0%20FLIERS.jpeg",
    },
    {
      programId: program.id, label: "2.0", slug: "2-0", title: "Pad A Girl 2.0", status: "COMPLETED",
      tagline: "Three schools, one mission", startDate: "2026-01-22", endDate: "2026-01-26", hostState: "Borno State",
      locations: ["Government Girls Secondary School, Yerwa", "Continuing Education Institute / Agency for Mass Literacy", "Federal Government Girls College, Monguno"], schools: 3, attendance: 440, reach: 265, targetReach: 600,
      summary: "Held January 22 to 26, 2026 across three institutions: Government Girls Secondary School, Yerwa; Continuing Education Institute / Agency for Mass Literacy; and Federal Government Girls College, Monguno. The report records 440 people: 410 students, 14 volunteers, and 16 staff across the three schools.",
      reportUrl: "/brand/PAG%201.0%20AND%202.0%20REPORT.pdf", reportLabel: "PAG 1.0 & 2.0 official field report",
    },
    {
      programId: program.id, label: "3.0", slug: "3-0", title: "Pad A Girl 3.0", status: "COMPLETED_REPORT_PENDING",
      tagline: "Children's Day Dignity Drive", startDate: "2026-05-25", endDate: "2026-05-31", hostState: "Borno State",
      locations: ["Maiduguri"], targetReach: 395, attendance: 325, reach: 260,
      targetDescription: "Campaign goal: reach 395 girls through public secondary schools and IDP camps in Borno State.",
      partners: ["UNFPA"], partnerNote: "Organised by Jesus For All Initiative in collaboration with the United Nations Population Fund.",
      pillars: ["Hygiene Kits", "Stigma Eradication", "Dignity Workshops"],
      summary: "The 25–31 May 2026 drive in Maiduguri recorded 325 people: 260 young girls, 50 mothers, 10 volunteers, and 5 staff members. It provided pads and hygiene kits, menstrual health sensitisation, and support to keep girls in school.",
      objectives: [
        { title: "Donate pads and hygiene kits", body: "Direct distribution of sanitary pads and hygiene kits to girls." },
        { title: "Sensitise on menstrual health", body: "Education sessions at public secondary schools and IDP camps." },
        { title: "Keep girls in school", body: "Support so no girl misses school because she cannot afford pads." },
      ],
      coverImage: "/images/pag-3-0-flier.jpg",
    },
    {
      programId: program.id, label: "4.0", slug: "4-0", title: "Pad A Girl 4.0", status: "COMPLETED",
      tagline: "Breaking Period Stigma & Promoting Dignity", startDate: "2026-10-23", endDate: "2026-10-23", hostState: "Borno State",
      targetReach: 500, attendance: 264, reach: 150, schools: 1, locations: ["Government Secondary School, Maiduguri"], pillars: ["Hygiene Kits", "Stigma Eradication", "Dignity Workshops", "Boys' Education"],
      summary: "The October 23, 2026 outreach at Government Secondary School, Maiduguri recorded 264 people: 150 girls, 100 boys, 5 male teachers, and 9 volunteers. The official report is pending.",
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
    { title: "Pad A Girl 4.0: Outreach figures", slug: "pad-a-girl-4-0-announced", category: "Impact Report", featured: true, status: "PUBLISHED",
      excerpt: "The October 23, 2026 outreach at Government Secondary School, Maiduguri recorded 264 people, including 150 girls, 100 boys, 5 male teachers, and 9 volunteers.",
      body: "Pad A Girl 4.0 took place on October 23, 2026 at Government Secondary School, Maiduguri. The outreach recorded 264 people: 150 girls, 100 boys, 5 male teachers, and 9 volunteers.\n\nThe official field report is pending. See the Impact page for figures from all four editions.",
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
