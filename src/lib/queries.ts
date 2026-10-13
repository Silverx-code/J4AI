import { cache } from "react";
import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { getSettings } from "./settings";
import { isDone } from "./utils";

const { editions, editionMedia, editionFinance, posts, donations } = schema;

export const getEditions = cache(async () =>
  db.select().from(editions).orderBy(desc(editions.startDate), desc(editions.createdAt)));

export const getEditionBySlug = cache(async (slug: string) => {
  const [e] = await db.select().from(editions).where(eq(editions.slug, slug)).limit(1);
  return e ?? null;
});

/** Soonest upcoming/ongoing edition (the "next campaign"). */
export const getNextEdition = cache(async () => {
  const rows = await db.select().from(editions)
    .where(inArray(editions.status, ["UPCOMING", "ONGOING"]))
    .orderBy(asc(editions.startDate)).limit(1);
  return rows[0] ?? null;
});

/** Most recent edition that has already taken place. */
export const getLatestDone = cache(async () => {
  const rows = await db.select().from(editions)
    .where(inArray(editions.status, ["COMPLETED", "COMPLETED_REPORT_PENDING"]))
    .orderBy(desc(editions.startDate)).limit(1);
  return rows[0] ?? null;
});

export const getMedia = cache(async (editionId: string) =>
  db.select().from(editionMedia).where(eq(editionMedia.editionId, editionId))
    .orderBy(asc(editionMedia.sortOrder)));

export const getFinance = cache(async (editionId: string) => {
  const [f] = await db.select().from(editionFinance).where(eq(editionFinance.editionId, editionId)).limit(1);
  return f ?? null;
});

/** Impact totals are computed ONLY from verified `reach` on completed editions (targets never count). */
export const getStats = cache(async () => {
  const rows = await db.select().from(editions);
  const done = rows.filter((e) => isDone(e.status));
  const [{ count }] = await db.select({ count: sql<number>`count(*)::int` }).from(editionMedia)
    .where(inArray(editionMedia.type, ["PRESS", "VIDEO"]));
  return {
    reach: done.reduce((n, e) => n + (e.reach ?? 0), 0),
    editions: done.length,
    schools: done.reduce((n, e) => n + (e.schools ?? 0), 0),
    pressFeatures: count,
  };
});

export const getPublishedPosts = cache(async (limit = 20) =>
  db.select().from(posts).where(eq(posts.status, "PUBLISHED"))
    .orderBy(desc(posts.publishedAt), desc(posts.createdAt)).limit(limit));

export const getPostBySlug = cache(async (slug: string) => {
  const [p] = await db.select().from(posts)
    .where(and(eq(posts.slug, slug), eq(posts.status, "PUBLISHED"))).limit(1);
  return p ?? null;
});

/** Sponsorship progress for an edition, from CONFIRMED donations only. */
export async function getSponsorProgress(edition: { id: string; targetReach: number | null }) {
  const s = await getSettings();
  const cost = Math.max(1, parseInt(s.cost_per_girl, 10) || 3500);
  const [{ total }] = await db.select({ total: sql<number>`coalesce(sum(${donations.amount}),0)::int` })
    .from(donations).where(and(eq(donations.editionId, edition.id), eq(donations.status, "CONFIRMED")));
  const funded = Math.floor(total / cost);
  const target = edition.targetReach ?? 0;
  return { total, funded, target, cost, percent: target ? Math.min(100, Math.round((funded / target) * 100)) : 0 };
}
