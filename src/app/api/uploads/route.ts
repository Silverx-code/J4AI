import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { saveFile, validateFile } from "@/lib/storage";

/** Admin-only uploads (post covers, edition images, reports). */
export async function POST(req: Request) {
  const s = await getSession();
  if (s?.user?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const fd = await req.formData().catch(() => null);
  const file = fd?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file" }, { status: 400 });
  const err = validateFile(file);
  if (err) return NextResponse.json({ error: err }, { status: 400 });
  try { return NextResponse.json({ url: await saveFile(file, "j4ai/site") }); }
  catch { return NextResponse.json({ error: "Upload failed" }, { status: 502 }); }
}
