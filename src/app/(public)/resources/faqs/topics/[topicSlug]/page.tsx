import { notFound } from "next/navigation";
import { FaqBrowser } from "@/components/resources/faq-browser";
import { faqTopicId } from "@/lib/faq-urls";
import { faqBrowserMetadata } from "@/lib/faq-metadata";
import type { FaqSearchParams } from "@/lib/faq-types";

type Props = { params: Promise<{ topicSlug: string }>; searchParams: Promise<FaqSearchParams> };
async function filters(props: Props): Promise<FaqSearchParams> {
  const [{ topicSlug }, query] = await Promise.all([props.params, props.searchParams]);
  const topic = faqTopicId(topicSlug);
  if (!topic) notFound();
  return { q: query.q, page: query.page, topic };
}
export async function generateMetadata(props: Props) { return faqBrowserMetadata(await filters(props)); }
export default async function TopicFaqs(props: Props) { return <FaqBrowser params={await filters(props)} />; }
