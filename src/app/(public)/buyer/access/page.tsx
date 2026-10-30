import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { accountAccessHref, accountView } from "@/components/account/access-route";

export const metadata: Metadata = {
  title: "CityAuction account",
  robots: { index: false, follow: true },
};

export default async function BuyerAccessPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  redirect(accountAccessHref(accountView(params.view, "register"), params.next));
}
