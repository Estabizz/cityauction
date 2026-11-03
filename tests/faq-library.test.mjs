import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadSource } from "./helpers/source-loader.mjs";

const library = JSON.parse(fs.readFileSync(new URL("../src/content/faqs/library.json", import.meta.url), "utf8"));
const mocks = { "server-only": {}, "@/content/faqs/library.json": library };
const engine = loadSource("src/lib/faq-library.ts", mocks);
const Link = ({ href, children, ...props }) => React.createElement("a", { href, ...props }, children);
const page = loadSource("src/app/(public)/resources/faqs/page.tsx", { ...mocks, "next/link": Link });

test("every source question is present exactly once, with its original number and a complete answer", () => {
  assert.equal(library.source.name, "CityAuction_FAQs.docx");
  assert.equal(library.items.length, 2505);
  assert.deepEqual(library.items.map(item => item.number), Array.from({ length: 2505 }, (_, i) => i + 1));
  assert.equal(new Set(library.items.map(item => item.id)).size, 2505);
  for (const item of library.items) {
    assert.match(item.question, /\?$/);
    assert.ok(item.answer.length > 40, item.id);
    assert.doesNotMatch(item.answer, /PARSED TEXT|GOOGLE \+ BING|Research & Regulatory Source|Category Index|CityAuction focus:|Bing long-tail focus:/);
  }
  assert.match(library.items.at(-1).answer, /whether the document specifically permits bidding/);
  assert.doesNotMatch(library.items.at(-1).answer, /-specific legal advice/);
});

test("all 78 original topics have correct boundaries and exactly one browsing category", () => {
  assert.equal(library.topics.length, 78);
  assert.equal(engine.FAQ_GROUPS.length, 8);
  for (const topic of library.topics) {
    assert.ok(engine.FAQ_GROUPS.some(group => group.id === topic.groupId));
    const rows = library.items.filter(item => item.topicId === topic.id);
    assert.equal(rows.length, topic.number <= 33 ? 35 : 30);
    assert.equal(topic.count, rows.length);
    assert.ok(rows.every(item => item.question && item.answer));
  }
});

test("pagination exposes the whole library with no missing or repeated questions and bounded page payloads", () => {
  const ids = [];
  const first = engine.findFaqs();
  assert.equal(first.pageCount, 126);
  for (let i = 1; i <= first.pageCount; i++) {
    const result = engine.findFaqs({ page: String(i) });
    assert.ok(result.items.length <= 20);
    assert.ok(JSON.stringify(result.items).length < 40000);
    ids.push(...result.items.map(item => item.id));
  }
  assert.deepEqual(ids, library.items.map(item => item.id));
});

test("category counts add up to all questions and topic filters return only that topic", () => {
  const result = engine.findFaqs();
  assert.equal(result.counts.reduce((sum, group) => sum + group.count, 0), 2505);
  for (const topic of library.topics) {
    const selected = engine.findFaqs({ topic: topic.id });
    assert.equal(selected.total, topic.count);
    assert.equal(selected.filters.group, topic.groupId);
    assert.ok(selected.items.every(item => item.topicId === topic.id));
  }
});

test("search combines keywords across questions and answers and ranks title matches first", () => {
  const emd = engine.findFaqs({ q: "EMD refund" });
  assert.ok(emd.total > 0 && emd.total < 2505);
  for (const item of emd.items) assert.match(`${item.question} ${item.answer}`, /refund/i);
  assert.match(emd.items[0].question, /EMD|earnest money/i);
  const answer = library.items.find(item => /disbursement/i.test(item.answer));
  assert.ok(engine.findFaqs({ question: answer.id }).items.some(item => item.id === answer.id));
  assert.ok(engine.findFaqs({ q: "disbursement" }).total > 0);
  assert.equal(engine.findFaqs({ q: "q2505" }).items[0].id, "faq-2505");
});

test("search within a category and topic keeps both restrictions and correct result counts", () => {
  const result = engine.findFaqs({ q: "EMD", group: "bidding-emd", topic: "topic-5" });
  assert.ok(result.total > 0);
  assert.ok(result.items.every(item => item.topicId === "topic-5"));
  assert.equal(result.counts.reduce((sum, value) => sum + value.count, 0), result.allMatches);
});

test("answer links override stale filters and locate every question on the right page", () => {
  for (const item of library.items) {
    const result = engine.findFaqs({ question: item.id, q: "impossiblewordzz", group: "cityauction", page: "999999" });
    assert.equal(result.filters.q, "");
    assert.equal(result.filters.topic, item.topicId);
    assert.ok(result.items.some(value => value.id === item.id), item.id);
  }
});

test("invalid filters, repeated parameters and huge pages have safe, usable fallbacks", () => {
  const result = engine.findFaqs({ q: ["bad"], topic: "unknown", group: "unknown", page: "-3", question: "no-such-question" });
  assert.equal(result.total, 2505);
  assert.equal(result.filters.page, 1);
  assert.equal(engine.findFaqs({ page: "999999" }).filters.page, 126);
  assert.equal(engine.findFaqs({ q: "a".repeat(1000) }).filters.q.length, 160);
  assert.equal(engine.findFaqs({ q: "inexistentwordzzzz" }).total, 0);
  assert.equal(engine.findFaqs({ q: "inexistentwordzzzz" }).from, 0);
});

test("pagination URLs preserve filters and safely encode search terms", () => {
  const href = engine.faqHref({ q: "EMD & refund", topic: "topic-5", group: "bidding-emd", page: 2 }, "faq-results");
  const url = new URL(href, "https://cityauction.in");
  assert.equal(url.searchParams.get("q"), "EMD & refund");
  assert.equal(url.searchParams.get("page"), "2");
  assert.equal(url.searchParams.get("topic"), "topic-5");
  assert.equal(url.hash, "#faq-results");
});

test("the SSR page has working search, topic/category controls, bounded accordion and next-page links", async () => {
  const markup = renderToStaticMarkup(await page.default({ searchParams: Promise.resolve({}) }));
  assert.match(markup, /2,505/);
  assert.match(markup, /role="search"/);
  assert.match(markup, /name="q"/);
  assert.match(markup, /name="topic"/);
  assert.match(markup, /aria-label="FAQ categories"/);
  assert.match(markup, /rel="next"/);
  assert.match(markup, /aria-expanded="true"/);
  assert.match(markup, /aria-controls="faq-1-answer"/);
  assert.equal((markup.match(/id="faq-\d+-question"/g) || []).length, 20);
  assert.doesNotMatch(markup, /id="faq-2505-question"/);
});

test("the final source answer is open and linked when directly requested", async () => {
  const markup = renderToStaticMarkup(await page.default({ searchParams: Promise.resolve({ question: "faq-2505" }) }));
  assert.match(markup, /id="faq-2505-question"/);
  assert.match(markup, /id="faq-2505-answer" role="region" aria-labelledby="faq-2505-question" class=/);
  assert.match(markup, /question=faq-2505#faq-2505/);
});

test("empty search states offer useful recovery and render search input as escaped text", async () => {
  const markup = renderToStaticMarkup(await page.default({ searchParams: Promise.resolve({ q: '<script>alert("missing")</script>', group: "cityauction" }) }));
  assert.match(markup, /No matching questions/);
  assert.match(markup, /Search all categories/);
  assert.match(markup, /Browse all questions/);
  assert.match(markup, /&lt;script&gt;/);
  assert.doesNotMatch(markup, /<script>alert/);
});

test("search pages avoid indexing user queries and answer links have a stable canonical topic page", async () => {
  const search = await page.generateMetadata({ searchParams: Promise.resolve({ q: "EMD refund" }) });
  assert.equal(search.robots.index, false);
  const direct = await page.generateMetadata({ searchParams: Promise.resolve({ question: "faq-2505" }) });
  assert.ok(!direct.alternates.canonical.includes("question="));
  assert.ok(direct.alternates.canonical.includes("topic=topic-78"));
  assert.ok(direct.alternates.canonical.includes("page=2"));
});
