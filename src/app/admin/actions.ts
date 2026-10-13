"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import type { FinanceLine, Pair } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { SETTING_DEFAULTS } from "@/lib/settings";
import { slugify, str } from "@/lib/utils";

const int = (v: FormDataEntryValue | null) => {
  const s = str(v).replace(/[,\s₦]/g, "");
  if (!s) return null;
  const n = parseInt(s, 10);
  return Number.isFinite(n) ? n : null;
};
const list = (v: FormDataEntryValue | null) => str(v).split(",").map((x) => x.trim()).filter(Boolean);
const lines = (v: FormDataEntryValue | null) => str(v).split("\n").map((x) => x.trim()).filter(Boolean);
const refresh = () => revalidatePath("/", "layout");
/** Only allow internal paths and http(s) links for editable URLs. */
const safeUrl = (v: FormDataEntryValue | null) => {
  const s = str(v);
  if (!s) return null;
  return s.startsWith("/") || /^https?:\/\//i.test(s) ? s : null;
};

/* ---------- signups / enquiries / donations ---------- */
export async function setSignupStatus(fd: FormData) {
  await requireAdmin();
  const status = str(fd.get("status")) as "PENDING" | "APPROVED" | "REJECTED";
  if (!["PENDING", "APPROVED", "REJECTED"].includes(status)) return;
  await db.update(schema.signups).set({ status }).where(eq(schema.signups.id, str(fd.get("id"))));
  revalidatePath("/admin/signups"); revalidatePath("/admin");
}

export async function deleteSignup(fd: FormData) {
  await requireAdmin();
  await db.delete(schema.signups).where(eq(schema.signups.id, str(fd.get("id"))));
  revalidatePath("/admin/signups"); revalidatePath("/admin");
}

export async function setEnquiryStatus(fd: FormData) {
  await requireAdmin();
  const status = str(fd.get("status")) as "UNREAD" | "READ" | "REPLIED";
  if (!["UNREAD", "READ", "REPLIED"].includes(status)) return;
  await db.update(schema.enquiries).set({ status }).where(eq(schema.enquiries.id, str(fd.get("id"))));
  revalidatePath("/admin/enquiries"); revalidatePath("/admin");
}

export async function setDonationStatus(fd: FormData) {
  await requireAdmin();
  const status = str(fd.get("status")) as "PENDING" | "CONFIRMED" | "REJECTED";
  if (!["PENDING", "CONFIRMED", "REJECTED"].includes(status)) return;
  await db.update(schema.donations).set({ status }).where(eq(schema.donations.id, str(fd.get("id"))));
  refresh();
}

export async function addManualDonation(fd: FormData) {
  await requireAdmin();
  const amount = int(fd.get("amount"));
  if (!amount || amount < 1) return;
  await db.insert(schema.donations).values({
    donorName: str(fd.get("donorName")) || "Anonymous", email: str(fd.get("email")) || null, amount,
    reference: str(fd.get("reference")) || null, editionId: str(fd.get("editionId")) || null,
    method: "manual_entry", status: "CONFIRMED",
  });
  refresh();
}

/* ---------- editions ---------- */
export async function saveEdition(fd: FormData) {
  await requireAdmin();
  const id = str(fd.get("id"));
  const label = str(fd.get("label"));
  if (!label) return;
  const [prog] = await db.select().from(schema.programs).limit(1);
  if (!prog) throw new Error("Run `npm run db:seed` first (no program found).");

  const objectives: Pair[] = lines(fd.get("objectives")).map((l) => {
    const [t, ...b] = l.split("|");
    return { title: t.trim(), body: b.join("|").trim() };
  }).filter((o) => o.title);

  const status = str(fd.get("status")) as "UPCOMING" | "ONGOING" | "COMPLETED_REPORT_PENDING" | "COMPLETED";
  const values = {
    label, slug: slugify(str(fd.get("slug")) || label),
    title: str(fd.get("title")) || `Pad A Girl ${label}`,
    tagline: str(fd.get("tagline")) || null,
    status: ["UPCOMING", "ONGOING", "COMPLETED_REPORT_PENDING", "COMPLETED"].includes(status) ? status : "UPCOMING",
    startDate: str(fd.get("startDate")) || null, endDate: str(fd.get("endDate")) || null,
    hostState: str(fd.get("hostState")) || null, locations: list(fd.get("locations")),
    schools: int(fd.get("schools")), attendance: int(fd.get("attendance")),
    reach: int(fd.get("reach")), targetReach: int(fd.get("targetReach")), enrolled: int(fd.get("enrolled")),
    summary: str(fd.get("summary")) || null, targetDescription: str(fd.get("targetDescription")) || null,
    partnerNote: str(fd.get("partnerNote")) || null, partners: list(fd.get("partners")), pillars: list(fd.get("pillars")),
    objectives, coverImage: safeUrl(fd.get("coverImage")), reportUrl: safeUrl(fd.get("reportUrl")),
    reportLabel: str(fd.get("reportLabel")) || null,
  };
  let editionId = id;
  if (id) await db.update(schema.editions).set(values).where(eq(schema.editions.id, id));
  else {
    const [row] = await db.insert(schema.editions).values({ ...values, programId: prog.id }).returning({ id: schema.editions.id });
    editionId = row.id;
  }
  refresh();
  redirect(`/admin/editions/${editionId}?saved=1`);
}

export async function deleteEdition(fd: FormData) {
  await requireAdmin();
  await db.delete(schema.editions).where(eq(schema.editions.id, str(fd.get("id"))));
  refresh();
  redirect("/admin/editions");
}

export async function addMedia(fd: FormData) {
  await requireAdmin();
  const editionId = str(fd.get("editionId"));
  const url = safeUrl(fd.get("url"));
  const type = str(fd.get("type")) as "PHOTO" | "VIDEO" | "PRESS";
  if (!editionId || !url || !["PHOTO", "VIDEO", "PRESS"].includes(type)) return;
  await db.insert(schema.editionMedia).values({ editionId, url, type, title: str(fd.get("title")) || null, caption: str(fd.get("caption")) || null });
  refresh(); redirect(`/admin/editions/${editionId}?saved=1`);
}

export async function deleteMedia(fd: FormData) {
  await requireAdmin();
  await db.delete(schema.editionMedia).where(eq(schema.editionMedia.id, str(fd.get("id"))));
  refresh(); redirect(`/admin/editions/${str(fd.get("editionId"))}?saved=1`);
}

export async function saveFinance(fd: FormData) {
  await requireAdmin();
  const editionId = str(fd.get("editionId"));
  const breakdown: FinanceLine[] = lines(fd.get("breakdown")).map((l) => {
    const [category, pct, ...note] = l.split("|");
    return { category: category.trim(), percent: Math.max(0, Math.min(100, parseInt(pct ?? "0", 10) || 0)), note: note.join("|").trim() || undefined };
  }).filter((x) => x.category);
  const values = { totalIncome: int(fd.get("totalIncome")), totalExpenses: int(fd.get("totalExpenses")), breakdown, published: fd.get("published") === "on" };
  await db.insert(schema.editionFinance).values({ editionId, ...values }).onConflictDoUpdate({ target: schema.editionFinance.editionId, set: values });
  refresh(); redirect(`/admin/editions/${editionId}?saved=1`);
}

/* ---------- posts ---------- */
export async function savePost(fd: FormData) {
  const s = await requireAdmin();
  const id = str(fd.get("id"));
  const title = str(fd.get("title"));
  if (!title) return;
  const status = str(fd.get("status")) === "PUBLISHED" ? "PUBLISHED" : "DRAFT";
  const values = {
    title, slug: slugify(str(fd.get("slug")) || title), category: str(fd.get("category")) || "Update",
    excerpt: str(fd.get("excerpt")) || null, body: str(fd.get("body")), coverImage: safeUrl(fd.get("coverImage")),
    ctaLabel: str(fd.get("ctaLabel")) || null, ctaUrl: safeUrl(fd.get("ctaUrl")),
    featured: fd.get("featured") === "on", status: status as "DRAFT" | "PUBLISHED",
  };
  let postId = id;
  if (id) {
    const [prev] = await db.select().from(schema.posts).where(eq(schema.posts.id, id)).limit(1);
    await db.update(schema.posts).set({ ...values, publishedAt: status === "PUBLISHED" ? prev?.publishedAt ?? new Date() : null }).where(eq(schema.posts.id, id));
  } else {
    const [row] = await db.insert(schema.posts).values({ ...values, authorId: s.user.id, publishedAt: status === "PUBLISHED" ? new Date() : null }).returning({ id: schema.posts.id });
    postId = row.id;
  }
  refresh(); redirect(`/admin/posts/${postId}?saved=1`);
}

export async function deletePost(fd: FormData) {
  await requireAdmin();
  await db.delete(schema.posts).where(eq(schema.posts.id, str(fd.get("id"))));
  refresh(); redirect("/admin/posts");
}

/* ---------- settings ---------- */
export async function saveSettings(fd: FormData) {
  await requireAdmin();
  for (const key of Object.keys(SETTING_DEFAULTS)) {
    const value = str(fd.get(key));
    if (!value) continue;
    await db.insert(schema.settings).values({ key, value }).onConflictDoUpdate({ target: schema.settings.key, set: { value } });
  }
  refresh(); redirect("/admin/settings?saved=1");
}
