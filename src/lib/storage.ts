import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "application/pdf": "pdf",
};
export const MAX_BYTES = 10 * 1024 * 1024;

export function validateFile(file: File, allow: string[] = Object.keys(ALLOWED)) {
  if (!allow.includes(file.type) || !ALLOWED[file.type]) return "Unsupported file type. Use PNG, JPG, WEBP or PDF.";
  if (file.size > MAX_BYTES) return "File is too large (max 10MB).";
  if (file.size === 0) return "File is empty.";
  return null;
}

/** Cloudinary when configured (production); local /public/uploads otherwise (dev / self-hosted only). */
export async function saveFile(file: File, folder = "j4ai"): Promise<string> {
  const buf = Buffer.from(await file.arrayBuffer());
  const ext = ALLOWED[file.type];
  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;

  if (cloud && apiKey && secret) {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signature = crypto.createHash("sha1").update(`folder=${folder}&timestamp=${timestamp}${secret}`).digest("hex");
    const fd = new FormData();
    fd.append("file", new Blob([buf], { type: file.type }), `upload.${ext}`);
    fd.append("api_key", apiKey);
    fd.append("timestamp", timestamp);
    fd.append("folder", folder);
    fd.append("signature", signature);
    const kind = file.type === "application/pdf" ? "raw" : "image";
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/${kind}/upload`, { method: "POST", body: fd });
    if (!res.ok) throw new Error("Upload failed");
    const json = (await res.json()) as { secure_url: string };
    return json.secure_url;
  }

  const dir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(dir, { recursive: true });
  const name = `${Date.now()}-${crypto.randomBytes(5).toString("hex")}.${ext}`;
  await fs.writeFile(path.join(dir, name), buf);
  return `/uploads/${name}`;
}
