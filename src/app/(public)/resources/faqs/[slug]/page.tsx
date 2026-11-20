import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";
import { faqQuestionId } from "@/lib/faq-urls";
import { faqHref, findFaqs, getFaq, getFaqNeighbours } from "@/lib/faq-library";
import { faqQuestionMetadata } from "@/lib/faq-metadata";

// Render answers on request; do not make Hostinger prerender 2,505 pages per build.
export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };
async function answer(params: Props["params"]) {
  const { slug } = await params;
  const id = faqQuestionId(slug);
  const faq = id ? getFaq(id) : null;
  if (!faq) notFound();
  return faq;
}
export async function generateMetadata({ params }: Props) { return faqQuestionMetadata(await answer(params)); }

export default async function FaqAnswer({ params }: Props) {
  const faq = await answer(params);
  const topicHref = faqHref({ topic: faq.topicId });
  const { previous, next } = getFaqNeighbours(faq.id);
  const nearby = new Set([previous?.id, next?.id]);
  const related = findFaqs({ topic: faq.topicId }).items.filter(item => item.id !== faq.id && !nearby.has(item.id)).slice(0, 5);
  return <div className="min-h-screen bg-surface py-8 sm:py-12">
    <div className="container-wide"><div className="mx-auto max-w-4xl">
      <nav aria-label="Breadcrumb" className="mb-7 flex flex-wrap items-center gap-2 text-xs leading-relaxed text-gray-500">
        <Link href="/" className="hover:text-primary">Home</Link><span aria-hidden="true">/</span>
        <Link href="/resources/faqs" className="hover:text-primary">FAQs</Link><span aria-hidden="true">/</span>
        <Link href={topicHref} className="hover:text-primary">{faq.topic}</Link><span aria-hidden="true">/</span>
        <span aria-current="page" className="text-gray-900">Answer</span>
      </nav>
      <article id={faq.id} className="scroll-mt-28 overflow-hidden rounded-2xl border border-border bg-white shadow-xs">
        <header className="border-b border-border p-6 sm:p-9">
          <Link href={topicHref} className="inline-flex items-center gap-2 text-xs font-medium text-primary hover:underline"><BookOpen aria-hidden="true" className="h-4 w-4" />{faq.topic}</Link>
          <h1 className="mt-4 text-2xl font-bold tracking-tight leading-snug text-gray-900 sm:text-3xl">{faq.question}</h1>
        </header>
        <div className="p-6 sm:p-9">
          <p className="break-words text-sm leading-8 text-gray-700 sm:text-base">{faq.answer}</p>
          <div className="mt-7 flex items-start gap-3 rounded-xl bg-surface p-4 text-xs leading-relaxed text-gray-600">
            <ShieldCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p>General guidance. Check the current sale notice and applicable rules, and confirm property-specific legal, tax and payment details before bidding.</p>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-xs">
            <Link href={topicHref} className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"><ArrowLeft aria-hidden="true" className="h-4 w-4" />All questions in this topic</Link>
            <span className="text-gray-400">CityAuction FAQ library · Q{faq.number}</span>
          </div>
        </div>
      </article>
      {(previous || next) && <nav aria-label="More questions in this topic" className="mt-5 grid gap-3 sm:grid-cols-2">
        {previous ? <Link href={previous.href} rel="prev" className="group flex min-w-0 items-start gap-3 rounded-2xl border border-border bg-white p-5 hover:border-primary/40">
          <ChevronLeft aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <span className="min-w-0"><span className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500">Previous question</span><span className="mt-1 block text-sm font-medium leading-relaxed text-gray-700 group-hover:text-primary">{previous.question}</span></span>
        </Link> : <span aria-hidden="true" className="hidden sm:block" />}
        {next && <Link href={next.href} rel="next" className="group flex min-w-0 items-start justify-end gap-3 rounded-2xl border border-border bg-white p-5 text-right hover:border-primary/40">
          <span className="min-w-0"><span className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500">Next question</span><span className="mt-1 block text-sm font-medium leading-relaxed text-gray-700 group-hover:text-primary">{next.question}</span></span>
          <ChevronRight aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        </Link>}
      </nav>}
      <section aria-labelledby="related-faq-title" className="mt-9">
        <h2 id="related-faq-title" className="mb-4 text-xl font-semibold tracking-tight text-gray-900">Related questions</h2>
        <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-white">
          {related.map(item => <Link key={item.id} href={item.href} className="flex items-start justify-between gap-4 p-5 text-sm font-medium leading-relaxed text-gray-700 hover:bg-surface hover:text-primary">
            <span>{item.question}</span><ArrowRight aria-hidden="true" className="mt-1 h-4 w-4 shrink-0" />
          </Link>)}
        </div>
      </section>
      <section aria-labelledby="faq-support-title" className="mt-7 flex flex-col gap-4 rounded-2xl bg-primary p-6 text-white sm:flex-row sm:items-center sm:justify-between">
        <div><h2 id="faq-support-title" className="font-semibold">Need help with a specific auction?</h2><p className="mt-1 text-sm leading-relaxed text-white/70">Share the listing or sale notice with our team.</p></div>
        <Link href="/contact" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-primary">Contact our team<ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
      </section>
    </div></div>
  </div>;
}
