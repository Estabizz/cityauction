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
const page = loadSource("src/app/(public)/resources/faqs/(browse)/page.tsx", { ...mocks, "next/link": Link });
const browser = loadSource("src/components/resources/faq-browser.tsx", { ...mocks, "next/link": Link });
const urls = loadSource("src/lib/faq-urls.ts");

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
  assert.equal(url.pathname, urls.faqTopicPath("topic-5"));
  assert.equal(url.searchParams.has("topic"), false);
  assert.equal(url.searchParams.has("group"), false);
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

test("legacy answer links redirect permanently to the readable answer page", async () => {
  await assert.rejects(page.default({ searchParams: Promise.resolve({ question: "faq-2505" }) }), error => {
    assert.match(error.digest, /NEXT_REDIRECT/);
    assert.ok(error.digest.includes(urls.faqQuestionPath("faq-2505")));
    assert.match(error.digest, /308/);
    return true;
  });
});

test("empty search states offer useful recovery and render search input as escaped text", async () => {
  const markup = renderToStaticMarkup(React.createElement(browser.FaqBrowser, { params: { q: '<script>alert("missing")</script>', group: "cityauction" } }));
  assert.match(markup, /No matching questions/);
  assert.match(markup, /Search all categories/);
  assert.match(markup, /Browse all questions/);
  assert.match(markup, /&lt;script&gt;/);
  assert.doesNotMatch(markup, /<script>alert/);
});

test("search pages avoid indexing user queries and legacy answer metadata uses its new canonical", async () => {
  const search = await page.generateMetadata({ searchParams: Promise.resolve({ q: "EMD refund" }) });
  assert.equal(search.robots.index, false);
  const direct = await page.generateMetadata({ searchParams: Promise.resolve({ question: "faq-2505" }) });
  assert.ok(!direct.alternates.canonical.includes("question="));
  assert.equal(direct.alternates.canonical, urls.faqAbsoluteUrl(urls.faqQuestionPath("faq-2505")));
});

test("all questions and topics have unique readable URLs with complete reverse lookup", () => {
  const paths = [];
  for (const item of library.items) {
    const path = urls.faqQuestionPath(item.id);
    assert.match(path, /^\/resources\/faqs\/[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(!path.includes("?") && !path.includes("#"));
    const slug = path.split("/").at(-1);
    assert.equal(urls.faqQuestionId(slug), item.id);
    assert.equal(engine.getFaq(item.id).href, path);
    paths.push(path);
  }
  assert.equal(new Set(paths).size, 2505);
  assert.equal(urls.faqQuestionPath("faq-2"), "/resources/faqs/how-does-bank-auction-property-work");
  for (const topic of library.topics) assert.equal(urls.faqTopicId(urls.faqTopicPath(topic.id).split("/").at(-1)), topic.id);
  assert.equal(urls.faqQuestionPath("__proto__"), null);
  assert.equal(urls.faqQuestionPath("constructor"), null);
  assert.equal(urls.faqQuestionId("unknown-question"), undefined);
});

test("legacy topic/category URLs preserve search and page filters without numeric source IDs", () => {
  const target = urls.legacyFaqRedirect(new URLSearchParams("topic=topic-5&group=bidding-emd&q=EMD+refund&page=2"));
  const url = new URL(target, "https://cityauction.in");
  assert.equal(url.pathname, urls.faqTopicPath("topic-5"));
  assert.equal(url.searchParams.get("q"), "EMD refund");
  assert.equal(url.searchParams.get("page"), "2");
  assert.equal(url.searchParams.has("topic"), false);
  assert.equal(url.searchParams.has("group"), false);
  assert.equal(urls.legacyFaqRedirect(new URLSearchParams("question=faq-2&q=stale&topic=topic-78&page=3")), urls.faqQuestionPath("faq-2"));
  assert.equal(urls.legacyFaqRedirect(new URLSearchParams("group=institutions")), "/resources/faqs/categories/banks-and-institutions");
  assert.equal(urls.legacyFaqRedirect(new URLSearchParams("question=unknown&group=unknown&topic=unknown")), null);
});

const answerPage = loadSource("src/app/(public)/resources/faqs/[slug]/page.tsx", { ...mocks, "next/link": Link });

test("answer pages link to the previous and next question in the same topic only", async () => {
  for (const topic of library.topics) {
    const rows = library.items.filter(item => item.topicId === topic.id);
    assert.equal(engine.getFaqNeighbours(rows[0].id).previous, null);
    assert.equal(engine.getFaqNeighbours(rows.at(-1).id).next, null);
    assert.equal(engine.getFaqNeighbours(rows[1].id).previous.id, rows[0].id);
    assert.equal(engine.getFaqNeighbours(rows[1].id).next.href, urls.faqQuestionPath(rows[2].id));
  }
  const unknown = engine.getFaqNeighbours("unknown");
  assert.equal(unknown.previous, null); assert.equal(unknown.next, null);
  const markup = renderToStaticMarkup(await answerPage.default({ params: Promise.resolve({ slug: urls.faqQuestionPath("faq-2").split("/").pop() }) }));
  assert.match(markup, new RegExp(`rel="prev" href="${urls.faqQuestionPath("faq-1")}"|href="${urls.faqQuestionPath("faq-1")}"[^>]*rel="prev"`));
  assert.ok(markup.includes(urls.faqQuestionPath("faq-3")));
  const first = renderToStaticMarkup(await answerPage.default({ params: Promise.resolve({ slug: urls.faqQuestionPath("faq-1").split("/").pop() }) }));
  assert.doesNotMatch(first, /rel="prev"/);
  assert.match(first, /rel="next"/);
});

test("topic and category pages have their own heading and breadcrumb back to the library", async () => {
  const topicRoute = loadSource("src/app/(public)/resources/faqs/topics/[topicSlug]/page.tsx", { ...mocks, "next/link": Link });
  const topic = renderToStaticMarkup(await topicRoute.default({ params: Promise.resolve({ topicSlug: "emd-earnest-money-deposit" }), searchParams: Promise.resolve({}) }));
  assert.match(topic, /<h1[^>]*>EMD - Earnest Money Deposit: frequently asked questions<\/h1>/);
  assert.match(topic, /href="\/resources\/faqs"[^>]*>FAQs</);
  assert.ok(topic.includes(`href="${urls.faqCategoryPath(library.topics.find(t => t.id === "topic-5").groupId)}"`));
  assert.match(topic, /aria-current="page"[^>]*>EMD - Earnest Money Deposit</);
  const categoryRoute = loadSource("src/app/(public)/resources/faqs/categories/[categorySlug]/page.tsx", { ...mocks, "next/link": Link });
  const category = renderToStaticMarkup(await categoryRoute.default({ params: Promise.resolve({ categorySlug: "banks-and-institutions" }), searchParams: Promise.resolve({}) }));
  assert.match(category, /<h1[^>]*>Banks &amp; institutions: frequently asked questions<\/h1>/);
  assert.equal((category.match(/<h1/g) || []).length, 1);
  const home = renderToStaticMarkup(await page.default({ searchParams: Promise.resolve({}) }));
  assert.match(home, /<h1[^>]*>Frequently asked questions<\/h1>/);
  assert.match(home, /aria-current="page"[^>]*>FAQs</);
});
test("a dedicated answer page renders one question with its own canonical and related clean links", async () => {
  const params = Promise.resolve({ slug: "how-does-bank-auction-property-work" });
  const markup = renderToStaticMarkup(await answerPage.default({ params }));
  assert.equal((markup.match(/<h1/g) || []).length, 1);
  assert.ok(markup.includes(library.items[1].question));
  assert.ok(markup.includes(library.items[1].answer));
  assert.match(markup, /Related questions/);
  assert.doesNotMatch(markup, /\?question=|\?topic=|\?group=/);
  const meta = await answerPage.generateMetadata({ params });
  assert.equal(meta.alternates.canonical, urls.faqAbsoluteUrl(urls.faqQuestionPath("faq-2")));
  assert.equal(meta.openGraph.url, urls.faqAbsoluteUrl(urls.faqQuestionPath("faq-2")));
  assert.equal(meta.robots.index, true);
});

test("unknown question, topic and category slugs use the not-found path", async () => {
  for (const [file, key] of [["[slug]", "slug"], ["topics/[topicSlug]", "topicSlug"], ["categories/[categorySlug]", "categorySlug"]]) {
    const route = loadSource(`src/app/(public)/resources/faqs/${file}/page.tsx`, { ...mocks, "next/link": Link });
    await assert.rejects(route.default({ params: Promise.resolve({ [key]: "unknown-slug" }), searchParams: Promise.resolve({}) }), error => {
      assert.match(error.digest, /404/); return true;
    });
  }
});

test("clean topic/category routes keep their own scope and search without accepting conflicting IDs", async () => {
  for (const [file, key, slug, canonical, expected] of [
    ["topics/[topicSlug]", "topicSlug", "emd-earnest-money-deposit", urls.faqTopicPath("topic-5"), "EMD - Earnest Money Deposit"],
    ["categories/[categorySlug]", "categorySlug", "banks-and-institutions", urls.faqCategoryPath("institutions"), "Banks &amp; institutions"],
  ]) {
    const route = loadSource(`src/app/(public)/resources/faqs/${file}/page.tsx`, { ...mocks, "next/link": Link });
    const props = { params: Promise.resolve({ [key]: slug }), searchParams: Promise.resolve({ topic: "topic-78", question: "faq-2505" }) };
    const markup = renderToStaticMarkup(await route.default(props));
    assert.ok(markup.includes(expected));
    const meta = await route.generateMetadata(props);
    assert.equal(meta.alternates.canonical, urls.faqAbsoluteUrl(canonical));
  }
});

test("the sitemap includes every clean FAQ answer, topic and category once", () => {
  const paths = engine.faqSitemapPaths();
  assert.equal(paths.length, 2505 + 78 + 8);
  assert.equal(new Set(paths).size, paths.length);
  for (const path of paths) assert.match(path, /^\/resources\/faqs\/[a-z0-9/-]+$/);
  assert.ok(paths.includes(urls.faqQuestionPath("faq-2505")));
});

test("the actual sitemap publishes absolute FAQ URLs without invented modification dates", async () => {
  const sitemap = loadSource("src/app/sitemap.ts", {
    ...mocks,
    "@/services/auction.service": { getPublicAuctionSitemapEntries: async () => [] },
    "@/lib/constants": { PROPERTY_CATEGORIES: [] },
    "@/content/cities": { CITY_PAGES: [] },
    "@/content/cities/states": { getStateGroups: () => [], cityPath: () => "", statePath: () => "" },
  });
  const entries = await sitemap.default();
  const answers = entries.filter(entry => entry.url.startsWith("https://cityauction.in/resources/faqs/"));
  assert.equal(answers.length, 2505 + 78 + 8);
  assert.equal(new Set(answers.map(entry => entry.url)).size, answers.length);
  for (const entry of answers) {
    assert.equal(new URL(entry.url).search, "");
    assert.equal(new URL(entry.url).hash, "");
    assert.equal(Object.hasOwn(entry, "lastModified"), false);
  }
});

test("FAQ proxy redirects happen before auth; private page and API guards retain their behavior", async () => {
  let verified = 0;
  const proxy = loadSource("src/proxy.ts", { "@/lib/session-token": {
    COOKIE_NAME: "cityauction_auth_token", verifyToken: async token => { verified++; return token === "staff" ? { roles: ["ADMIN"] } : token === "member" ? { roles: [] } : null; },
    isAdmin: session => session.roles.includes("ADMIN"),
  } });
  const request = (path, token = "") => ({ url: `https://cityauction.in${path}`, nextUrl: new URL(`https://cityauction.in${path}`), cookies: { get: () => token ? { value: token } : undefined } });
  const redirect = await proxy.proxy(request("/resources/faqs?question=faq-2", "member"));
  assert.equal(redirect.status, 308);
  assert.equal(redirect.headers.get("location"), `https://cityauction.in${urls.faqQuestionPath("faq-2")}`);
  assert.equal(verified, 0);
  assert.equal((await proxy.proxy(request("/resources/faqs?q=EMD"))).headers.get("x-middleware-next"), "1");
  assert.equal((await proxy.proxy(request("/api/admin/users"))).status, 401);
  assert.equal((await proxy.proxy(request("/api/admin/users", "member"))).status, 403);
  assert.equal((await proxy.proxy(request("/admin/dashboard", "member"))).headers.get("location"), "https://cityauction.in/dashboard");
  assert.equal((await proxy.proxy(request("/admin/dashboard", "staff"))).headers.get("x-middleware-next"), "1");
  assert.equal((await proxy.proxy(request("/dashboard", "member"))).headers.get("x-middleware-next"), "1");
  const guest = await proxy.proxy(request("/dashboard/profile?tab=security"));
  assert.equal(guest.status, 307);
  assert.equal(new URL(guest.headers.get("location")).searchParams.get("next"), "/dashboard/profile?tab=security");
  for (const matcher of ["/admin/:path*", "/dashboard/:path*", "/api/admin/:path*", "/api/user/:path*"]) assert.ok(proxy.config.matcher.includes(matcher));
});

test("answer, topic and category routes are not wrapped in a loading boundary, so unknown slugs return HTTP 404", () => {
  // A loading.tsx streams the response and fixes the status at 200 before notFound() runs.
  const dir = new URL("../src/app/(public)/resources/faqs/", import.meta.url);
  for (const file of ["loading.tsx", "[slug]/loading.tsx", "topics/loading.tsx", "topics/[topicSlug]/loading.tsx", "categories/loading.tsx", "categories/[categorySlug]/loading.tsx"]) {
    assert.equal(fs.existsSync(new URL(file, dir)), false, file);
  }
  for (const segment of ["../", "../../", "../../../"]) assert.equal(fs.existsSync(new URL(`${segment}loading.tsx`, dir)), false);
});
