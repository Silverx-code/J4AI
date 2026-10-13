import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/AuthForms";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <main className="mx-auto w-full max-w-md px-4 py-8">
      <h1 className="mb-1 font-headline-md text-headline-md">Welcome back</h1>
      <p className="mb-4 font-body-md text-body-md text-on-surface-variant">Log in to track your volunteer applications.</p>
      <Suspense><LoginForm /></Suspense>
    </main>
  );
}
