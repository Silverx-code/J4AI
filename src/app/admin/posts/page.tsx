import Link from "next/link";
import { desc } from "drizzle-orm";
import { db, schema } from "@/db";
import { formatDate } from "@/lib/utils";

export default async function PostsAdmin() {
  const rows = await db.select().from(schema.posts).orderBy(desc(schema.posts.createdAt));
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between"><h1 className="font-headline-md text-headline-md">News posts</h1><Link href="/admin/posts/new" className="btn-primary">New post</Link></div>
      <div className="card divide-y divide-[#F3D9E2]">
        {rows.map((p) => (
          <Link key={p.id} href={`/admin/posts/${p.id}`} className="flex items-center justify-between gap-3 p-4 hover:bg-surface-container-low">
            <div><p className="font-label-lg text-label-lg">{p.title}</p><p className="font-body-sm text-body-sm text-on-surface-variant">{p.category} · {formatDate(p.publishedAt ?? p.createdAt)}{p.featured ? " · featured" : ""}</p></div>
            <span className="chip">{p.status}</span>
          </Link>
        ))}
        {!rows.length && <p className="p-6 text-center font-body-sm text-body-sm text-on-surface-variant">No posts yet.</p>}
      </div>
    </div>
  );
}
