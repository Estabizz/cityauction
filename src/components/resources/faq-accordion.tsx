"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Link2 } from "lucide-react";
import type { FaqResultItem } from "@/lib/faq-types";

export function FaqAccordion({ items, selectedQuestion = "" }: { items: FaqResultItem[]; selectedQuestion?: string }) {
  const [openIds, setOpenIds] = useState<string[]>([selectedQuestion || items[0]?.id].filter(Boolean));
  return (
    <section aria-label="Questions and answers" className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 text-xs">
        <p className="text-gray-500">Select a question to read its answer.</p>
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => setOpenIds(items.map(item => item.id))} className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4">Expand all</button>
          <button type="button" onClick={() => setOpenIds([])} className="font-semibold text-gray-600 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4">Collapse all</button>
        </div>
      </div>
      {items.map(faq => {
        const isOpen = openIds.includes(faq.id);
        return (
          <article key={faq.id} id={faq.id} className="scroll-mt-28 rounded-2xl border border-border bg-white shadow-xs overflow-hidden">
            <h3>
              <button type="button" aria-expanded={isOpen} aria-controls={`${faq.id}-answer`} id={`${faq.id}-question`}
                onClick={() => setOpenIds(previous => previous.includes(faq.id) ? previous.filter(id => id !== faq.id) : [...previous, faq.id])}
                className="group flex w-full items-start justify-between gap-4 p-5 text-left focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-[-3px] sm:p-6">
                <span className="min-w-0">
                  <span className="block mb-2 text-[11px] font-medium uppercase tracking-wide text-gray-500">{faq.topic}</span>
                  <span className="block text-sm sm:text-base leading-relaxed font-semibold text-gray-900 group-hover:text-primary">{faq.question}</span>
                </span>
                <ChevronDown aria-hidden="true" className={`mt-1 h-5 w-5 shrink-0 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>
            </h3>
            <div id={`${faq.id}-answer`} role="region" aria-labelledby={`${faq.id}-question`} hidden={!isOpen} className="border-t border-gray-100 px-5 py-5 sm:px-6">
              <p className="text-sm leading-7 text-gray-600 break-words">{faq.answer}</p>
              <Link href={`/resources/faqs?question=${faq.id}#${faq.id}`} className="mt-4 inline-flex items-center gap-1.5 rounded text-xs font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-4" aria-label={`Link to answer ${faq.number}: ${faq.question}`}>
                <Link2 className="h-3.5 w-3.5" aria-hidden="true" /> Link to this answer <span className="text-gray-400">· Q{faq.number}</span>
              </Link>
            </div>
          </article>
        );
      })}
    </section>
  );
}
