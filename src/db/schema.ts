import {
  pgTable, pgEnum, uuid, text, integer, timestamp, boolean, jsonb, date,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["MEMBER", "ADMIN"]);
export const editionStatusEnum = pgEnum("edition_status", [
  "UPCOMING", "ONGOING", "COMPLETED_REPORT_PENDING", "COMPLETED",
]);
export const signupTypeEnum = pgEnum("signup_type", ["VOLUNTEER", "OUTREACH_REQUEST"]);
export const signupStatusEnum = pgEnum("signup_status", ["PENDING", "APPROVED", "REJECTED"]);
export const enquiryStatusEnum = pgEnum("enquiry_status", ["UNREAD", "READ", "REPLIED"]);
export const postStatusEnum = pgEnum("post_status", ["DRAFT", "PUBLISHED"]);
export const mediaTypeEnum = pgEnum("media_type", ["PHOTO", "VIDEO", "PRESS"]);
export const donationStatusEnum = pgEnum("donation_status", ["PENDING", "CONFIRMED", "REJECTED"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: roleEnum("role").notNull().default("MEMBER"),
  phone: text("phone"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const programs = pgTable("programs", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  summary: text("summary").notNull(),
});

export type Pair = { title: string; body: string };
export type FinanceLine = { category: string; percent: number; note?: string };

export const editions = pgTable("editions", {
  id: uuid("id").primaryKey().defaultRandom(),
  programId: uuid("program_id").notNull().references(() => programs.id),
  label: text("label").notNull(), // "3.0"
  slug: text("slug").notNull().unique(), // "3-0"
  title: text("title").notNull(),
  tagline: text("tagline"),
  status: editionStatusEnum("status").notNull().default("UPCOMING"),
  startDate: date("start_date"),
  endDate: date("end_date"),
  hostState: text("host_state"),
  locations: text("locations").array().notNull().default([]),
  schools: integer("schools"),
  attendance: integer("attendance"),
  reach: integer("reach"), // verified/actual only. Never put a target here.
  targetReach: integer("target_reach"),
  enrolled: integer("enrolled"),
  summary: text("summary"),
  targetDescription: text("target_description"),
  partnerNote: text("partner_note"),
  partners: text("partners").array().notNull().default([]),
  pillars: text("pillars").array().notNull().default([]),
  objectives: jsonb("objectives").$type<Pair[]>().notNull().default([]),
  coverImage: text("cover_image"),
  reportUrl: text("report_url"),
  reportLabel: text("report_label"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const editionMedia = pgTable("edition_media", {
  id: uuid("id").primaryKey().defaultRandom(),
  editionId: uuid("edition_id").notNull().references(() => editions.id, { onDelete: "cascade" }),
  type: mediaTypeEnum("type").notNull(),
  url: text("url").notNull(),
  title: text("title"),
  caption: text("caption"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const editionFinance = pgTable("edition_finance", {
  editionId: uuid("edition_id").primaryKey().references(() => editions.id, { onDelete: "cascade" }),
  totalIncome: integer("total_income"),
  totalExpenses: integer("total_expenses"),
  breakdown: jsonb("breakdown").$type<FinanceLine[]>().notNull().default([]),
  published: boolean("published").notNull().default(false),
});

export const signups = pgTable("signups", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  type: signupTypeEnum("type").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  units: text("units").array().notNull().default([]),
  location: text("location"),
  availability: text("availability"),
  organisation: text("organisation"),
  girlsCount: integer("girls_count"),
  message: text("message"),
  status: signupStatusEnum("status").notNull().default("PENDING"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const enquiries = pgTable("enquiries", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: enquiryStatusEnum("status").notNull().default("UNREAD"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  category: text("category").notNull().default("Update"),
  excerpt: text("excerpt"),
  body: text("body").notNull().default(""),
  coverImage: text("cover_image"),
  ctaLabel: text("cta_label"),
  ctaUrl: text("cta_url"),
  featured: boolean("featured").notNull().default(false),
  status: postStatusEnum("status").notNull().default("DRAFT"),
  authorId: uuid("author_id").references(() => users.id, { onDelete: "set null" }),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const donations = pgTable("donations", {
  id: uuid("id").primaryKey().defaultRandom(),
  editionId: uuid("edition_id").references(() => editions.id, { onDelete: "set null" }),
  donorName: text("donor_name"),
  email: text("email"),
  amount: integer("amount").notNull(),
  currency: text("currency").notNull().default("NGN"),
  method: text("method").notNull().default("bank_transfer"),
  reference: text("reference"),
  message: text("message"),
  proofUrl: text("proof_url"),
  status: donationStatusEnum("status").notNull().default("PENDING"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});

export type User = typeof users.$inferSelect;
export type Edition = typeof editions.$inferSelect;
export type EditionMedia = typeof editionMedia.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type Signup = typeof signups.$inferSelect;
export type Enquiry = typeof enquiries.$inferSelect;
export type Donation = typeof donations.$inferSelect;
