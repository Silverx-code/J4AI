import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import UploadField from "@/components/UploadField";
import { deletePost, savePost } from "../../actions";

export default async function PostEditor({ params, searchParams }: { params: { id: string }; searchParams: { saved?: string } }) {
  const isNew = params.id === "new";
  const [p] = isNew ? [null] : await db.select().from(schema.posts).where(eq(schema.posts.id, params.id)).limit(1);
  if (!isNew && !p) notFound();
  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-headline-md text-headline-md">{isNew ? "New post" : "Edit post"}</h1>
      {searchParams.saved && <p className="rounded-xl bg-primary-fixed px-4 py-2 font-body-sm text-body-sm text-on-primary-fixed">Saved.</p>}
      <form action={savePost} className="card flex flex-col gap-4 p-5">
        <input type="hidden" name="id" value={p?.id ?? ""} />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2"><label className="label">Title *</label><input name="title" required defaultValue={p?.title} className="field" /></div>
          <div><label className="label">Slug (auto if empty)</label><input name="slug" defaultValue={p?.slug} className="field" /></div>
          <div><label className="label">Category</label><input name="category" defaultValue={p?.category ?? "Update"} className="field" placeholder="Impact Report, Volunteer Call, Media Spotlight…" /></div>
        </div>
        <div><label className="label">Excerpt</label><textarea name="excerpt" rows={2} defaultValue={p?.excerpt ?? ""} className="field" /></div>
        <div><label className="label">Body (plain text; blank line = new paragraph)</label><textarea name="body" rows={10} defaultValue={p?.body} className="field" /></div>
        <UploadField name="coverImage" label="Cover image" defaultValue={p?.coverImage} accept="image/png,image/jpeg,image/webp" />
        <div className="grid gap-4 md:grid-cols-2"><div><label className="label">Button label</label><input name="ctaLabel" defaultValue={p?.ctaLabel ?? ""} className="field" /></div><div><label className="label">Button link</label><input name="ctaUrl" defaultValue={p?.ctaUrl ?? ""} className="field" placeholder="/get-involved or https://…" /></div></div>
        <div className="flex flex-wrap items-center gap-6">
          <label className="flex items-center gap-2 font-label-md text-label-md"><input type="checkbox" name="featured" defaultChecked={p?.featured} className="h-4 w-4 accent-[#b70051]" />Feature on News page</label>
          <label className="flex items-center gap-2 font-label-md text-label-md">Status <select name="status" defaultValue={p?.status ?? "DRAFT"} className="field !w-auto !py-2"><option value="DRAFT">Draft</option><option value="PUBLISHED">Published</option></select></label>
        </div>
        <button className="btn-primary self-start">Save post</button>
      </form>
      {p && <form action={deletePost}><input type="hidden" name="id" value={p.id} /><button className="btn !text-error">Delete post</button></form>}
    </div>
  );
}
