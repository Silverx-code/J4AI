import type { Metadata } from "next";
import { getEditions } from "@/lib/queries";
import EditionCard from "@/components/EditionCard";
import { EmptyState } from "@/components/ui";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Pad A Girl Editions" };

export default async function EditionsPage() {
  const editions = await getEditions();
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-4">
      <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg">Pad A Girl Editions</h1>
      <p className="mt-1 max-w-2xl font-body-md text-body-md text-on-surface-variant">
        Each edition is a field campaign delivering dignity kits and menstrual health education to schoolgirls. Verified figures appear only once an edition has been reconciled.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {editions.length ? editions.map((e) => <EditionCard key={e.id} e={e} />) : <EmptyState title="No editions yet" />}
      </div>
    </main>
  );
}
