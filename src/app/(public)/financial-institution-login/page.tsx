import { redirect } from "next/navigation";
import { accountAccessHref } from "@/components/account/access-route";

// Buyers and institutional users use the same sign-in; backend roles determine access.
export default async function LegacyLoginPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  redirect(accountAccessHref("login", (await searchParams).next));
}
