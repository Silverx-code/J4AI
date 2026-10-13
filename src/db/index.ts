import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as { __sql?: ReturnType<typeof postgres> };

const sql =
  globalForDb.__sql ??
  postgres(process.env.DATABASE_URL ?? "postgresql://localhost:5432/j4ai", {
    // Vercel can create many short-lived instances. Keep each instance to one
    // connection so the Supabase session pooler's client limit isn't exhausted.
    max: process.env.NODE_ENV === "production" ? 1 : 3,
    idle_timeout: 20,
    prepare: false, // works with pooled connections (Neon / Supabase pooler)
  });
if (process.env.NODE_ENV !== "production") globalForDb.__sql = sql;

export const db = drizzle(sql, { schema });
export { schema };
