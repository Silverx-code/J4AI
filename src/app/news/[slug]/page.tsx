import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/queries";
import { formatDate } from "@/lib/utils";
import { Icon } from "@/components/ui";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const p = await getPostBySlug(params.slug);
  return { title: p?.title ?? "News", description: p?.excerpt ?? undefined };
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const p = await getPostBySlug(params.slug);
  if (!p) notFound();
  // Plain-text body: paragraphs split on blank lines, rendered as text (never as HTML).
  const paras = p.body.split(/\n{2,}/).map((x) => x.trim()).filter(Boolean);
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-4">
      <Link href="/news" className="inline-flex items-center gap-1 font-label-md text-label-md text-primary"><Icon name="arrow_back" className="text-[18px]" />All news</Link>
      <article className="mt-4">
        <div className="flex items-center gap-2"><span className="chip">{p.category}</span><span className="font-label-sm text-label-sm text-on-surface-variant">{formatDate(p.publishedAt)}</span></div>
        <h1 className="mt-2 font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg">{p.title}</h1>
        {p.coverImage && <div className="relative mt-4 aspect-video overflow-hidden rounded-3xl bg-surface-container"><Image src={p.coverImage} alt="" fill sizes="768px" className="object-cover" priority /></div>}
        <div className="mt-5 flex flex-col gap-4 font-body-lg text-body-lg">{paras.map((t, i) => <p key={i} className="whitespace-pre-line">{t}</p>)}</div>
        {p.ctaUrl && <a href={p.ctaUrl} className="btn-primary mt-6">{p.ctaLabel ?? "Learn more"}</a>}
      </article>
    </main>
  );
}
