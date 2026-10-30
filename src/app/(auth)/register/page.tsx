import { redirect } from "next/navigation";
import { accountAccessHref } from "@/components/account/access-route";

export default async function RegisterPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  redirect(accountAccessHref("register", (await searchParams).next));
}
