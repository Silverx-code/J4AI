import type { Metadata } from "next";
import { getEditions } from "@/lib/queries";
import EditionBrowser from "@/components/EditionBrowser";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Pad A Girl Editions" };

export default async function EditionsPage() {
  const editions = await getEditions();
  const featured = editions.find((edition) => edition.status === "UPCOMING" || edition.status === "ONGOING") ?? null;
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-5 md:py-7">
      <p className="font-label-sm text-label-sm uppercase text-primary">Our campaign journey</p>
      <h1 className="mt-1 font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg">Pad A Girl Editions</h1>
      <p className="mt-2 max-w-2xl font-body-md text-body-md text-on-surface-variant">
        Every edition brings menstrual health education and practical support closer to girls in Borno State. We publish verified reach only when an edition&apos;s report has been reconciled.
      </p>
      <EditionBrowser editions={editions} featured={featured} />
    </main>
  );
}
