import type { Metadata } from "next";
import { RegisterForm } from "@/components/AuthForms";

export const metadata: Metadata = { title: "Create account" };

export default function RegisterPage() {
  return (
    <main className="mx-auto w-full max-w-md px-4 py-8">
      <h1 className="mb-1 font-headline-md text-headline-md">Join the community</h1>
      <p className="mb-4 font-body-md text-body-md text-on-surface-variant">Create a free account to follow your applications.</p>
      <RegisterForm />
    </main>
  );
}
