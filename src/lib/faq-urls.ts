// URL identities only: safe in the request proxy; never import answer content here.
import urls from "@/content/faqs/urls.json";
import type { FaqFilters } from "./faq-types";
export const FAQ_ORIGIN = "https://cityauction.in";
export const faqAbsoluteUrl = (path: string) => `${FAQ_ORIGIN}${path}`;

export const FAQ_CATEGORY_SLUGS: Record<string, string> = {
  "getting-started": "getting-started",
  "bidding-emd": "bidding-and-emd",
  "legal-possession": "legal-and-possession",
  ownership: "after-winning-an-auction",
  "finance-tax": "finance-and-tax",
  "asset-types": "property-and-other-assets",
  institutions: "banks-and-institutions",
  cityauction: "using-cityauction",
};
const questions: Readonly<Record<string, string>> = urls.questions;
const topics: Readonly<Record<string, string>> = urls.topics;
const questionIds = new Map(Object.entries(questions).map(([id, slug]) => [slug, id]));
const topicIds = new Map(Object.entries(topics).map(([id, slug]) => [slug, id]));
const categoryIds = new Map(Object.entries(FAQ_CATEGORY_SLUGS).map(([id, slug]) => [slug, id]));
export const faqQuestionId = (slug: string) => questionIds.get(slug);
export const faqTopicId = (slug: string) => topicIds.get(slug);
export const faqCategoryId = (slug: string) => categoryIds.get(slug);
export const faqQuestionPath = (id: string) => Object.hasOwn(questions, id) ? `/resources/faqs/${questions[id]}` : null;
export const faqTopicPath = (id: string) => Object.hasOwn(topics, id) ? `/resources/faqs/topics/${topics[id]}` : null;
export const faqCategoryPath = (id: string) => Object.hasOwn(FAQ_CATEGORY_SLUGS, id) ? `/resources/faqs/categories/${FAQ_CATEGORY_SLUGS[id]}` : null;

export function faqHref(values: Partial<FaqFilters> = {}, anchor = ""): string {
  const question = values.question && faqQuestionPath(values.question);
  if (question) return question;
  const path = (values.topic && faqTopicPath(values.topic)) || (values.group && faqCategoryPath(values.group)) || "/resources/faqs";
  const params = new URLSearchParams();
  if (values.q) params.set("q", values.q.trim().slice(0, 160));
  if (values.page && values.page > 1 && Number.isInteger(values.page)) params.set("page", String(values.page));
  return `${path}${params.size ? `?${params}` : ""}${anchor ? `#${anchor}` : ""}`;
}

export function legacyFaqRedirect(params: URLSearchParams): string | null {
  const question = params.get("question") || "";
  if (faqQuestionPath(question)) return faqQuestionPath(question);
  const topic = params.get("topic") || "", group = params.get("group") || "";
  if (!faqTopicPath(topic) && !faqCategoryPath(group)) return null;
  const rawPage = params.get("page") || "1";
  return faqHref({ topic, group, q: params.get("q") || "", page: /^[1-9]\d{0,5}$/.test(rawPage) ? Number(rawPage) : 1 });
}
