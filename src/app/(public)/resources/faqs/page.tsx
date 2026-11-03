import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, BookOpen, ChevronLeft, ChevronRight, Phone, Search, ShieldCheck } from "lucide-react";
import { FaqAccordion } from "@/components/resources/faq-accordion";
import { FAQ_GROUPS, FAQ_SOURCE, FAQ_STARTERS, FAQ_TOPICS, faqHref, findFaqs } from "@/lib/faq-library";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const result = findFaqs(await searchParams);
  const title = result.filters.topic ? FAQ_TOPICS.find(topic => topic.id === result.filters.topic)?.title : FAQ_GROUPS.find(group => group.id === result.filters.group)?.title;
  return {
    title: title ? `${title} FAQs` : "Frequently Asked Questions",
    description: "Explore 2,505 auction questions across 78 topics: EMD, bidding, title checks, possession, finance, taxes, liquidation and other assets.",
    alternates: { canonical: faqHref({ group: result.filters.group, topic: result.filters.topic, page: result.filters.page }) },
    robots: result.filters.q ? { index: false, follow: true } : { index: true, follow: true },
  };
}

export default async function FaqsPage({ searchParams }: Props) {
  const result = findFaqs(await searchParams);
  const { filters, items, counts, total, from, to, pageCount, topicOptions } = result;
  const selectedTopic = FAQ_TOPICS.find(topic => topic.id === filters.topic);
  const selectedGroup = FAQ_GROUPS.find(group => group.id === filters.group);
  const isFiltered = Boolean(filters.q || filters.group || filters.topic);
  const navigation = { q: filters.q, group: filters.group, topic: filters.topic };
  const pageNumbers = [...new Set([1, filters.page - 1, filters.page, filters.page + 1, pageCount])].filter(page => page >= 1 && page <= pageCount).sort((a, b) => a - b);

  return (
    <div className="min-h-screen bg-surface pb-16">
      <header className="border-b border-border bg-white">
        <div className="container-wide py-8 sm:py-12">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-6">
            <Link href="/" className="hover:text-primary">Home</Link><span aria-hidden="true">/</span>
            <Link href="/resources" className="hover:text-primary">Resources</Link><span aria-hidden="true">/</span>
            <span aria-current="page" className="text-gray-900">FAQs</span>
          </nav>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent mb-3">CityAuction help centre</p>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">Frequently asked questions</h1>
              <p className="mt-3 max-w-2xl text-sm sm:text-base leading-relaxed text-gray-600">Understand the auction process, check the risks and plan your next step. Find guidance from your first search to taking ownership.</p>
            </div>
            <div className="flex shrink-0 items-center gap-6 text-sm">
              <div><strong className="block text-2xl font-semibold text-primary">{FAQ_SOURCE.questionCount.toLocaleString("en-IN")}</strong><span className="text-xs text-gray-500">Questions answered</span></div>
              <div className="border-l border-border pl-6"><strong className="block text-2xl font-semibold text-primary">{FAQ_SOURCE.topicCount}</strong><span className="text-xs text-gray-500">Detailed topics</span></div>
            </div>
          </div>
          {!isFiltered && filters.page === 1 && <div className="mt-7 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs text-gray-500">Good places to start:</span>
            {FAQ_STARTERS.map(starter => <Link key={starter.id} href={faqHref({ question: starter.id }, starter.id)} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-medium text-primary hover:border-primary/40 hover:bg-surface">{starter.label}<ArrowRight aria-hidden="true" className="h-3 w-3" /></Link>)}
          </div>}
        </div>
      </header>

      <div className="container-wide pt-7 sm:pt-9">
        <section aria-label="Find an answer" className="rounded-2xl border border-border bg-white p-4 sm:p-6 shadow-xs">
          <form key={JSON.stringify(navigation)} action="/resources/faqs" method="get" role="search" className="space-y-4">
            {filters.group && <input type="hidden" name="group" value={filters.group} />}
            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
              <div>
                <label htmlFor="faq-search" className="mb-2 block text-sm font-semibold text-gray-900">What would you like to know?</label>
                <div className="relative">
                  <Search aria-hidden="true" className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input id="faq-search" name="q" type="search" maxLength={160} defaultValue={filters.q} placeholder="Try EMD refund, possession, home loan or Q2505" className="h-12 w-full rounded-xl border border-border bg-white pl-12 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2" />
                </div>
              </div>
              <button type="submit" className="h-12 rounded-xl bg-primary px-7 text-sm font-semibold text-white hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2">Search FAQs</button>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label htmlFor="faq-topic" className="shrink-0 text-xs font-medium text-gray-600">Refine by topic</label>
              <select id="faq-topic" name="topic" defaultValue={filters.topic} className="min-w-0 w-full sm:max-w-xl rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-gray-700 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2">
                <option value="">All topics{selectedGroup ? ` in ${selectedGroup.title}` : ""}</option>
                {topicOptions.map(topic => <option key={topic.id} value={topic.id}>{topic.title} ({topic.count})</option>)}
              </select>
              <span className="text-xs text-gray-500">Choose a topic, then select Search FAQs.</span>
            </div>
          </form>
        </section>

        <div className="my-5 flex flex-wrap items-start gap-2 rounded-xl bg-primary/5 px-4 py-3 text-xs leading-relaxed text-gray-600">
          <ShieldCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p className="min-w-0 flex-1">General guidance from the CityAuction FAQ library. The current auction notice and applicable rules govern each sale. Confirm property-specific legal, tax and payment details before bidding.</p>
        </div>

        <nav aria-label="FAQ categories" className="mb-6 flex gap-2 overflow-x-auto pb-2 lg:hidden">
          {[{ id: "", title: "All questions", count: result.allMatches }, ...counts].map(group => <Link key={group.id} href={faqHref({ q: filters.q, group: group.id }, "faq-results")} aria-current={filters.group === group.id ? "page" : undefined} className={`shrink-0 rounded-full border px-4 py-2.5 text-xs font-medium ${filters.group === group.id ? "border-primary bg-primary text-white" : "border-border bg-white text-gray-600"}`}>{group.title} <span className="ml-1 opacity-70">{group.count.toLocaleString("en-IN")}</span></Link>)}
        </nav>

        <div className="grid items-start gap-7 lg:grid-cols-[260px_minmax(0,1fr)] xl:gap-10">
          <aside className="hidden lg:block lg:sticky lg:top-28 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto lg:pr-1">
            <nav aria-label="FAQ categories" className="rounded-2xl border border-border bg-white p-3 shadow-xs">
              <h2 className="px-3 pt-3 pb-4 text-[11px] font-semibold uppercase tracking-wider text-gray-500">Browse by category</h2>
              {[{ id: "", title: "All questions", description: "Explore the complete FAQ library", count: result.allMatches }, ...counts].map(group => <Link key={group.id} href={faqHref({ q: filters.q, group: group.id }, "faq-results")} aria-current={filters.group === group.id ? "page" : undefined} className={`mb-1 block rounded-xl px-3 py-3 transition-colors ${filters.group === group.id ? "bg-primary text-white" : "text-gray-700 hover:bg-surface"}`}>
                <span className="flex items-center justify-between gap-3 text-sm font-semibold"><span>{group.title}</span><span className="text-xs font-normal opacity-70">{group.count.toLocaleString("en-IN")}</span></span>
                <span className="mt-1 block text-[11px] leading-relaxed opacity-65">{group.description}</span>
              </Link>)}
            </nav>
          </aside>

          <section id="faq-results" aria-labelledby="faq-results-title" className="min-w-0 scroll-mt-28">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 id="faq-results-title" className="text-xl font-semibold tracking-tight text-gray-900">{selectedTopic?.title || selectedGroup?.title || (filters.q ? "Search results" : "All questions")}</h2>
                <p role="status" className="mt-1.5 text-xs leading-relaxed text-gray-500">{total ? `Showing ${from.toLocaleString("en-IN")}–${to.toLocaleString("en-IN")} of ${total.toLocaleString("en-IN")} questions` : "No matching questions"}{filters.q && <> for <strong className="font-medium text-gray-700">“{filters.q}”</strong></>}</p>
              </div>
              {isFiltered && <Link href="/resources/faqs#faq-results" className="rounded-lg border border-border bg-white px-3 py-2 text-xs font-semibold text-primary hover:bg-gray-50">Clear filters</Link>}
            </div>
            {items.length ? <FaqAccordion key={JSON.stringify(filters)} items={items} selectedQuestion={filters.question} /> : <div className="rounded-2xl border border-border bg-white p-8 sm:p-12 text-center">
              <BookOpen aria-hidden="true" className="mx-auto mb-4 h-9 w-9 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900">Let’s try a broader search</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-gray-600">Use a shorter phrase such as “EMD”, “loan” or “possession”, or remove the category and topic filters.</p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                {filters.q && <Link href={faqHref({ q: filters.q }, "faq-results")} className="rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white">Search all categories</Link>}
                <Link href="/resources/faqs#faq-results" className="rounded-xl border border-border px-4 py-3 text-sm font-semibold text-primary">Browse all questions</Link>
              </div>
            </div>}

            {total > 0 && <nav aria-label="FAQ results pages" className="mt-7 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-white p-3 sm:p-4">
              {filters.page > 1 ? <Link rel="prev" href={faqHref({ ...navigation, page: filters.page - 1 }, "faq-results")} className="inline-flex min-h-10 items-center gap-1 rounded-lg px-2 text-xs font-semibold text-primary hover:bg-surface"><ChevronLeft aria-hidden="true" className="h-4 w-4" />Previous</Link> : <span aria-disabled="true" className="px-2 text-xs text-gray-400">Previous</span>}
              <div className="flex flex-wrap items-center gap-1">
                {pageNumbers.map((page, index) => <span key={page} className="flex items-center gap-1">
                  {index > 0 && pageNumbers[index - 1] < page - 1 && <span aria-hidden="true" className="px-1 text-xs text-gray-400">…</span>}
                  <Link href={faqHref({ ...navigation, page }, "faq-results")} aria-current={filters.page === page ? "page" : undefined} aria-label={`Page ${page}`} className={`inline-flex h-10 min-w-10 items-center justify-center rounded-lg px-2 text-xs font-semibold ${filters.page === page ? "bg-primary text-white" : "text-gray-600 hover:bg-surface"}`}>{page}</Link>
                </span>)}
              </div>
              {filters.page < pageCount ? <Link rel="next" href={faqHref({ ...navigation, page: filters.page + 1 }, "faq-results")} className="inline-flex min-h-10 items-center gap-1 rounded-lg px-2 text-xs font-semibold text-primary hover:bg-surface">Next<ChevronRight aria-hidden="true" className="h-4 w-4" /></Link> : <span aria-disabled="true" className="px-2 text-xs text-gray-400">Next</span>}
              <p className="w-full text-center text-[11px] text-gray-400">Page {filters.page} of {pageCount} · 20 questions per page</p>
            </nav>}

            <section aria-labelledby="faq-support-title" className="mt-8 flex flex-col gap-5 rounded-2xl border border-border bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
              <div><h2 id="faq-support-title" className="text-lg font-semibold text-gray-900">Need help with a specific auction?</h2><p className="mt-1 max-w-lg text-sm leading-relaxed text-gray-600">Share the listing or sale notice with our team for help with your next step.</p></div>
              <div className="flex shrink-0 flex-col gap-2">
                <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-700">Contact our team<ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
                <a href="tel:+919825669668" className="inline-flex items-center justify-center gap-2 py-2 text-xs font-medium text-gray-600"><Phone aria-hidden="true" className="h-3.5 w-3.5" />+91 98256 69668</a>
              </div>
            </section>
          </section>
        </div>
      </div>
    </div>
  );
}
