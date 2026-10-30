"use client";

import Link from "next/link";
import { useHeaderSession } from "./session-provider";

export function FooterAccountLink({ institutional = false }: { institutional?: boolean }) {
  const session = useHeaderSession();
  if (session === undefined) return null;
  if (!session) return <Link href="/login">Sign in to CityAuction</Link>;
  return <Link href={institutional && session.isAdmin ? "/admin/dashboard" : "/dashboard"}>{institutional && session.isAdmin ? "Admin panel" : "My dashboard"}</Link>;
}
