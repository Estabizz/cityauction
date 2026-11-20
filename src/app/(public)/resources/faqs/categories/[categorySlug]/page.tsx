import { notFound } from "next/navigation";
import { FaqBrowser } from "@/components/resources/faq-browser";
import { faqCategoryId } from "@/lib/faq-urls";
import { faqBrowserMetadata } from "@/lib/faq-metadata";
import type { FaqSearchParams } from "@/lib/faq-types";

type Props = { params: Promise<{ categorySlug: string }>; searchParams: Promise<FaqSearchParams> };
async function filters(props: Props): Promise<FaqSearchParams> {
  const [{ categorySlug }, query] = await Promise.all([props.params, props.searchParams]);
  const group = faqCategoryId(categorySlug);
  if (!group) notFound();
  return { q: query.q, page: query.page, group };
}
export async function generateMetadata(props: Props) { return faqBrowserMetadata(await filters(props)); }
export default async function CategoryFaqs(props: Props) { return <FaqBrowser params={await filters(props)} />; }
