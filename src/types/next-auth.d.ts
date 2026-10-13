import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session { user: { id: string; name?: string | null; email?: string | null; role: "MEMBER" | "ADMIN" } }
  interface User { role: "MEMBER" | "ADMIN" }
}
declare module "next-auth/jwt" {
  interface JWT { id?: string; role?: "MEMBER" | "ADMIN" }
}
