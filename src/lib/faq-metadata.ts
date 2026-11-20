import type { Metadata } from "next";
import { FAQ_GROUPS, FAQ_TOPICS, faqHref, findFaqs, getFaq } from "./faq-library";
import type { FaqSearchParams } from "./faq-types";
import { faqAbsoluteUrl } from "./faq-urls";

export function faqBrowserMetadata(params: FaqSearchParams): Metadata {
  const result = findFaqs(params);
  const title = result.filters.topic ? FAQ_TOPICS.find(topic => topic.id === result.filters.topic)?.title : FAQ_GROUPS.find(group => group.id === result.filters.group)?.title;
  const canonical = result.filters.question ? faqHref({ question: result.filters.question }) : faqHref({ group: result.filters.group, topic: result.filters.topic, page: result.filters.page });
  return {
    title: title ? `${title} FAQs` : "Frequently Asked Questions",
    description: "Explore 2,505 auction questions across 78 topics: EMD, bidding, title checks, possession, finance, taxes, liquidation and other assets.",
    alternates: { canonical: faqAbsoluteUrl(canonical) },
    robots: result.filters.q ? { index: false, follow: true } : { index: true, follow: true },
  };
}

export function faqQuestionMetadata(faq: NonNullable<ReturnType<typeof getFaq>>): Metadata {
  const preview = faq.answer.length > 160 ? `${faq.answer.slice(0, 157).replace(/\s+\S*$/, "")}…` : faq.answer;
  return {
    title: faq.question,
    description: preview,
    alternates: { canonical: faqAbsoluteUrl(faq.href) },
    robots: { index: true, follow: true },
    openGraph: { title: faq.question, description: preview, url: faqAbsoluteUrl(faq.href), type: "article" },
  };
}
