export interface FaqItem {
  id: string;
  number: number;
  topicId: string;
  question: string;
  answer: string;
}
export interface FaqResultItem extends FaqItem { topic: string; href: string }
export interface FaqFilters { q: string; group: string; topic: string; page: number; question: string }
export type FaqSearchParams = Record<string, string | string[] | undefined>;
