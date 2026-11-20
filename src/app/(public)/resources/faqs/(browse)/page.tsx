import { permanentRedirect } from "next/navigation";
import { FaqBrowser } from "@/components/resources/faq-browser";
import { faqBrowserMetadata } from "@/lib/faq-metadata";
import { legacyFaqRedirect } from "@/lib/faq-urls";
import type { FaqSearchParams } from "@/lib/faq-types";

type Props = { searchParams: Promise<FaqSearchParams> };
export async function generateMetadata({ searchParams }: Props) {
  return faqBrowserMetadata(await searchParams);
}
export default async function FaqsPage({ searchParams }: Props) {
  const params = await searchParams;
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) if (typeof value === "string") query.set(key, value);
  const target = legacyFaqRedirect(query);
  if (target) permanentRedirect(target);
  return <FaqBrowser params={params} />;
}
