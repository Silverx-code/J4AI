"use client";
import { signOut } from "next-auth/react";
import { Icon } from "./ui";

export default function SignOutButton() {
  return <button onClick={() => signOut({ callbackUrl: "/" })} className="btn-outline"><Icon name="logout" className="text-[18px]" />Log out</button>;
}
