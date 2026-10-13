import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import AdminNav from "@/components/AdminNav";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-4 pb-24 md:grid-cols-[220px_1fr]">
      <aside><p className="mb-2 font-label-sm text-label-sm uppercase text-primary">J4AI admin</p><AdminNav /></aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
