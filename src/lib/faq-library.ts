import "server-only";
import library from "@/content/faqs/library.json";
import type { FaqFilters, FaqResultItem } from "./faq-types";

export const FAQ_PAGE_SIZE = 20;
export const FAQ_SOURCE = library.source;
export const FAQ_GROUPS = [
  { id: "getting-started", title: "Getting started", description: "Finding auctions, notices, KYC and inspections" },
  { id: "bidding-emd", title: "Bidding & EMD", description: "Deposits, bidding rules, refunds and deadlines" },
  { id: "legal-possession", title: "Legal & possession", description: "Title, occupants, court proceedings and dues" },
  { id: "ownership", title: "After you win", description: "Sale documents, transfers, utilities and ownership" },
  { id: "finance-tax", title: "Finance & tax", description: "Loans, funding, TDS, GST and investment" },
  { id: "asset-types", title: "Property & other assets", description: "Land, buildings, machinery and movable assets" },
  { id: "institutions", title: "Banks & institutions", description: "Liquidation, institutional sellers and data rooms" },
  { id: "cityauction", title: "Using CityAuction", description: "Discovery, support and CityAuction services" },
] as const;
export const FAQ_TOPICS = library.topics;
const topicById = new Map(FAQ_TOPICS.map(topic => [topic.id, topic]));
const itemById = new Map(library.items.map(item => [item.id, item]));
const normalise = (value: string) => value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const index = library.items.map(item => ({ item, title: normalise(item.question), content: normalise(`${item.question} ${item.answer}`), text: normalise(`${item.question} ${item.answer} ${topicById.get(item.topicId)?.title} q${item.number}`) }));
const STOP_WORDS = new Set(["a", "an", "the", "is", "are", "of", "to", "i", "can", "how", "what", "does", "do", "for", "in", "and", "my", "should"]);
const ALIASES: Record<string, string[]> = { emd: ["emd", "earnest money deposit"], kyc: ["kyc", "know your customer"], dsc: ["dsc", "digital signature"], nri: ["nri", "non resident"], gst: ["gst", "goods and services tax"], tds: ["tds", "tax deducted"] };

export function faqHref(values: Partial<FaqFilters> = {}, anchor = ""): string {
  const params = new URLSearchParams();
  for (const key of ["q", "group", "topic", "question"] as const) if (values[key]) params.set(key, String(values[key]));
  if (values.page && values.page > 1) params.set("page", String(values.page));
  return `/resources/faqs${params.size ? `?${params}` : ""}${anchor ? `#${anchor}` : ""}`;
}

export function findFaqs(params: Record<string, string | string[] | undefined> = {}) {
  const get = (key: string) => typeof params[key] === "string" ? params[key] as string : "";
  const q = get("q").replace(/\s+/g, " ").trim().slice(0, 160);
  let group = FAQ_GROUPS.some(value => value.id === get("group")) ? get("group") : "";
  let topic = topicById.has(get("topic")) ? get("topic") : "";
  const selected = itemById.get(get("question"));
  // Answer links override stale search/category/page filters.
  if (selected) { topic = selected.topicId; group = topicById.get(topic)!.groupId; }
  else if (topic) group = topicById.get(topic)!.groupId;
  const terms = normalise(q).split(" ").filter(Boolean);
  const meaningful = terms.filter(term => !STOP_WORDS.has(term));
  const tokens = (meaningful.length ? meaningful : terms).slice(0, 12);
  const matches = (text: string) => tokens.every(token => (ALIASES[token] || [token]).some(alias => text.includes(alias)));
  const searched = selected ? index : index.filter(row => matches(tokens.length > 1 ? row.content : row.text));
  const counts = FAQ_GROUPS.map(value => ({ ...value, count: searched.filter(row => topicById.get(row.item.topicId)?.groupId === value.id).length }));
  const filtered = searched.filter(row => (!group || topicById.get(row.item.topicId)?.groupId === group) && (!topic || row.item.topicId === topic));
  function score(row: typeof index[number]) { return (row.title.includes(normalise(q)) ? 100 : 0) + tokens.reduce((sum, token) => sum + ((ALIASES[token] || [token]).some(alias => row.title.includes(alias)) ? 10 : 0), 0); }
  if (tokens.length && !selected) filtered.sort((a, b) => score(b) - score(a) || a.item.number - b.item.number);
  const pageCount = Math.max(1, Math.ceil(filtered.length / FAQ_PAGE_SIZE));
  const requestedPage = /^[1-9]\d{0,5}$/.test(get("page")) ? Number(get("page")) : 1;
  const page = selected ? Math.floor(filtered.findIndex(row => row.item.id === selected.id) / FAQ_PAGE_SIZE) + 1 : Math.min(requestedPage, pageCount);
  const filters: FaqFilters = { q: selected ? "" : q, group, topic, page, question: selected?.id || "" };
  const items: FaqResultItem[] = filtered.slice((page - 1) * FAQ_PAGE_SIZE, page * FAQ_PAGE_SIZE).map(row => ({ ...row.item, topic: topicById.get(row.item.topicId)!.title }));
  return { filters, items, counts, total: filtered.length, allMatches: searched.length, pageCount,
    from: filtered.length ? (page - 1) * FAQ_PAGE_SIZE + 1 : 0, to: Math.min(page * FAQ_PAGE_SIZE, filtered.length),
    topicOptions: FAQ_TOPICS.filter(value => !group || value.groupId === group) };
}

export const FAQ_STARTERS = [
  { label: "Bank auction basics", id: "faq-1" },
  { label: "EMD & refunds", id: "faq-141" },
  { label: "Title checks", id: "faq-316" },
  { label: "Physical vs symbolic possession", id: "faq-386" },
  { label: "Financing an auction purchase", id: "faq-666" },
  { label: "First-time buyer guide", id: "faq-1051" },
];
