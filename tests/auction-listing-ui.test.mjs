import assert from "node:assert/strict";
import { test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadSource } from "./helpers/source-loader.mjs";

const ui = loadSource("src/lib/auction-discovery-ui.ts");
const { parseAuctionSearchParams } = loadSource("src/lib/auction-search.ts");

test("a complete filter edit applies atomically, removes aliases and resets the page", () => {
  const params = ui.applyAuctionFilters("q=old&type=DRT&page=7&sort=price_desc&subType=warehouse&minEmd=0", {
    keyword: " GIDC ", city: "Surat", district: "Surat District", category: "INDUSTRIAL", auctionType: "SARFAESI", minPrice: "5000000", maxPrice: "10000000", dateFrom: "2030-01-10", dateTo: "2030-01-11",
  });
  const parsed = parseAuctionSearchParams(params);
  assert.equal(parsed.keyword, "GIDC"); assert.equal(parsed.city, "Surat"); assert.equal(parsed.district, "Surat District");
  assert.equal(parsed.minPrice, 5000000); assert.equal(parsed.maxPrice, 10000000);
  assert.equal(parsed.sort, "price_desc"); assert.equal(parsed.page, 1); assert.equal(parsed.subType, "warehouse"); assert.equal(parsed.minEmd, 0);
  assert.equal(params.has("q"), false); assert.equal(params.has("type"), false);
});

test("inverted prices and dates are rejected together before navigation", () => {
  for (const values of [{ minPrice: "10", maxPrice: "5" }, { dateFrom: "2030-05-02", dateTo: "2030-05-01" }, { minPrice: "-1" }]) {
    assert.throws(() => ui.applyAuctionFilters("", values));
  }
});

test("removing a chip preserves unrelated filters and clears linked location/legacy values", () => {
  const current = "state=Gujarat&city=Surat&district=Surat&category=LAND&type=DRT&auctionType=DRT&q=site&keyword=site&page=8&sort=newest";
  const location = ui.removeAuctionFilter(current, "state");
  for (const key of ["state", "city", "district", "page"]) assert.equal(location.has(key), false);
  assert.equal(location.get("category"), "LAND"); assert.equal(location.get("sort"), "newest");
  for (const [key, aliases] of [["auctionType", ["type", "auctionType"]], ["keyword", ["q", "keyword"]]]) {
    const params = ui.removeAuctionFilter(current, key);
    for (const alias of aliases) assert.equal(params.has(alias), false);
  }
  assert.equal(ui.auctionSearchHref("/auctions", new URLSearchParams()), "/auctions");
});

test("filter chips show readable names and Indian currency rather than raw enums", () => {
  assert.equal(ui.auctionFilterLabel("category", "LAND"), "Property type: Land / Plot");
  assert.equal(ui.auctionFilterLabel("possession", "NOT_IN_POSSESSION"), "Possession: Not in Possession");
  assert.match(ui.auctionFilterLabel("minPrice", "2500000"), /₹25,00,000/);
});

test("notice prices remain exact and invalid values never become fabricated prices", () => {
  assert.equal(ui.auctionMoney("2500000.5"), "₹25,00,000.50");
  assert.equal(ui.auctionMoney(0), "₹0.00");
  for (const value of [undefined, null, "", "invalid", Infinity, -5]) assert.equal(ui.auctionMoney(value), "Not provided");
});

test("auction times always use IST across UTC date boundaries", () => {
  assert.match(ui.auctionDate("2030-01-01T20:00:00Z", true), /02 Jan 2030.*01:30.*am IST/i);
  assert.equal(ui.auctionDate("invalid", true), "Not provided");
});

const Link = ({ href, children, ...props }) => React.createElement("a", { href, ...props }, children);
const nav = { useRouter: () => ({ push() {}, refresh() {} }), usePathname: () => "/auctions", useSearchParams: () => new URLSearchParams() };
const cardMocks = {
  "next/link": Link,
  "@/components/account/save-listing-button": { SaveListingButton: ({ propertyTitle }) => React.createElement("button", { "aria-label": `Save property: ${propertyTitle}` }, "Save") },
};
const card = { id: "notice-1", title: "Industrial property", categoryName: "Industrial", city: "Surat", state: "Gujarat", organizationName: "Example Bank", auctionNumber: "CA-1", reservePrice: "2500000", emd: "250000", startDateTime: "2030-01-01T04:30:00Z", endDateTime: "2030-01-01T10:30:00Z", submissionDeadline: "2029-12-30T11:30:00Z", possessionStatus: "SYMBOLIC", status: "UPCOMING", auctionType: "SARFAESI", primaryImage: null };
for (const view of ["grid", "list"]) {
  test(`${view} cards expose all notice dates, readable possession, price and independent save action`, () => {
    const { AuctionCard } = loadSource("src/components/auction/auction-card.tsx", cardMocks);
    const html = renderToStaticMarkup(React.createElement(AuctionCard, { auction: card, view }));
    for (const value of ["₹25,00,000.00", "₹2,50,000.00", "Auction starts", "Auction ends", "Apply by", "Symbolic Possession", "Photo not available"]) assert.ok(html.includes(value), value);
    assert.equal((html.match(/<time\b/g) || []).length, 3);
    assert.equal((html.match(/ IST/g) || []).length, 3);
    for (const link of html.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/g)) assert.doesNotMatch(link[1], /<button\b/);
    assert.match(html, /Save property: Industrial property/);
  });
}

function resultsMarkup(activeFilters = {}, unavailable = false) {
  const { AuctionResultsClient } = loadSource("src/components/auction/auction-results-client.tsx", {
    "next/navigation": nav, "next/link": Link,
    "@/components/auction/auction-card": { AuctionCard: () => null },
    "./auction-card": { AuctionCard: () => null },
  });
  return renderToStaticMarkup(React.createElement(AuctionResultsClient, { auctions: [], activeFilters, unavailable, pagination: { page: 1, limit: 12, total: 0, totalPages: 1, hasNext: false, hasPrev: false } }));
}
test("empty inventory, no matches and data outages have distinct recovery messages", () => {
  const empty = resultsMarkup();
  assert.match(empty, /No auction notices available yet/); assert.doesNotMatch(empty, /Clear filters/);
  const filtered = resultsMarkup({ city: "Surat" });
  assert.match(filtered, /No auctions match your filters/); assert.match(filtered, /Clear filters/);
  const outage = resultsMarkup({ city: "Surat" }, true);
  assert.match(outage, /Auction listings couldn’t be loaded/); assert.match(outage, /Your search filters are still here/);
  assert.doesNotMatch(outage, /No auctions match|No auction notices available|0 auction notices found|Showing/);
});

test("pagination summary shows the actual range rather than repeating page-one counts", () => {
  const { AuctionSortBar } = loadSource("src/components/auction/auction-sort-bar.tsx", { "next/navigation": nav });
  const html = renderToStaticMarkup(React.createElement(AuctionSortBar, { totalCount: 27, currentCount: 3, page: 3, limit: 12, activeFilterCount: 2, viewMode: "grid", onViewModeChange() {}, onOpenMobileFilters() {} }));
  assert.match(html, /25–27/); assert.match(html, /Filters \(2\)/); assert.match(html, /aria-haspopup="dialog"/);
});

test("filter forms have unique labels and expose separate city, district and IST dates", () => {
  const { AuctionFilters } = loadSource("src/components/auction/auction-filters.tsx", { "next/navigation": nav });
  const html = renderToStaticMarkup(React.createElement(AuctionFilters));
  for (const value of ['name="city"', 'name="district"', 'name="dateFrom"', 'name="dateTo"', 'name="deadlineBefore"', 'type="submit"', 'Apply filters', 'Indian Standard Time']) assert.ok(html.includes(value), value);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(ids.length, new Set(ids).size);
  for (const match of html.matchAll(/for="([^"]+)"/g)) assert.ok(ids.includes(match[1]));
});

function filterHarness(current = "") {
  const slots = []; let cursor = 0; const pushes = []; const focus = []; let applied = 0;
  const fakeReact = { ...React,
    useState: (initial) => { const key = cursor++; if (!(key in slots)) slots[key] = typeof initial === "function" ? initial() : initial; return [slots[key], (value) => { slots[key] = typeof value === "function" ? value(slots[key]) : value; }]; },
    useId: () => "test-filter", useTransition: () => [false, (work) => work()],
  };
  const { AuctionFilters } = loadSource("src/components/auction/auction-filters.tsx", {
    react: fakeReact,
    "next/navigation": { ...nav, useSearchParams: () => new URLSearchParams(current), useRouter: () => ({ push: (...args) => pushes.push(args) }) },
  });
  function render() { cursor = 0; const child = AuctionFilters({ onApply: () => { applied++; } }); return child.type(child.props); }
  function find(node, predicate) {
    if (!node || typeof node !== "object") return null;
    if (predicate(node)) return node;
    for (const child of React.Children.toArray(node.props?.children)) { const found = find(child, predicate); if (found) return found; }
    return null;
  }
  function change(name, value) { find(render(), (node) => node.props?.name === name).props.onChange({ target: { value } }); }
  function submit() { render().props.onSubmit({ preventDefault() {}, currentTarget: { querySelector: (selector) => ({ focus: () => focus.push(selector) }) } }); }
  return { render, change, submit, pushes, focus, applied: () => applied, value: (name) => find(render(), (node) => node.props?.name === name)?.props.value };
}

test("editing multiple fields does not navigate until Apply, and a bad range preserves the draft", () => {
  const form = filterHarness("city=Surat&sort=price_desc&page=3");
  form.change("keyword", "warehouse"); form.change("minPrice", "10000000"); form.change("maxPrice", "5000000");
  assert.equal(form.pushes.length, 0);
  form.submit(); assert.equal(form.pushes.length, 0); assert.equal(form.applied(), 0);
  assert.deepEqual(form.focus, ['[name="maxPrice"]']);
  assert.equal(form.value("keyword"), "warehouse");
  form.change("maxPrice", "15000000"); form.submit();
  assert.equal(form.pushes.length, 1); assert.equal(form.applied(), 1);
  const params = new URL(form.pushes[0][0], "https://cityauction.test").searchParams;
  assert.equal(params.get("keyword"), "warehouse"); assert.equal(params.get("sort"), "price_desc"); assert.equal(params.has("page"), false);
});

test("changing state clears stale city and district before applying", () => {
  const form = filterHarness("state=Gujarat&city=Surat&district=Surat");
  form.change("state", "Maharashtra");
  assert.equal(form.value("city"), ""); assert.equal(form.value("district"), "");
  form.submit();
  const params = new URL(form.pushes[0][0], "https://cityauction.test").searchParams;
  assert.equal(params.has("city"), false); assert.equal(params.has("district"), false); assert.equal(params.get("state"), "Maharashtra");
});

function saveHarness(signedIn, result = { ok: true, message: "Saved" }) {
  const redirects = []; const calls = []; let stopped = 0;
  const snapshot = { ids: new Set(), pending: new Set(), signedIn };
  const { SaveListingButton } = loadSource("src/components/account/save-listing-button.tsx", {
    react: { ...React, useState: (value) => [value, () => {}], useRef: (value) => ({ current: value }), useEffect() {}, useSyncExternalStore: (_subscribe, get) => get() },
    "next/link": Link, "next/navigation": nav,
    "./saved-properties-store": { loadSavedProperties: async () => true, savedPropertiesSnapshot: () => snapshot, subscribeSavedProperties() {}, SERVER_SAVED_PROPERTIES: snapshot,
      setPropertySaved: async (...args) => { calls.push(args); return result; } },
  }, { window: { location: { pathname: "/auctions", assign: (href) => redirects.push(href) } } });
  const element = SaveListingButton({ auctionId: "notice-1", propertyTitle: "Warehouse" });
  const button = React.Children.toArray(element.props.children).find((child) => child?.type === "button");
  const click = () => button.props.onClick({ preventDefault() {}, stopPropagation() { stopped++; } });
  return { redirects, calls, click, stopped: () => stopped, button };
}

test("guest saves go through sign-in and return to the exact listing save action", async () => {
  const state = saveHarness(false); await state.click();
  assert.equal(state.calls.length, 0); assert.equal(state.stopped(), 1);
  const url = new URL(state.redirects[0], "https://cityauction.test");
  assert.equal(url.pathname, "/login"); assert.equal(url.searchParams.get("next"), "/auctions/notice-1?action=save#property-save");
  assert.equal(state.button.props["aria-label"], "Save property: Warehouse");
});

test("signed-in saves remain on the page and duplicate clicks make one mutation", async () => {
  const state = saveHarness(true); await Promise.all([state.click(), state.click()]);
  assert.equal(state.calls.length, 1); assert.equal(state.calls[0][0], "notice-1"); assert.equal(state.calls[0][1], true);
  assert.equal(state.redirects.length, 0);
});

test("expired save sessions return to sign-in while server errors do not redirect", async () => {
  const expired = saveHarness(true, { ok: false, status: 401, error: "Expired" }); await expired.click();
  assert.equal(expired.redirects.length, 1);
  const offline = saveHarness(true, { ok: false, status: 503, error: "Unavailable" }); await offline.click();
  assert.equal(offline.redirects.length, 0);
});

test("mobile drawer has a persistent Apply control attached to its form and unique field IDs", () => {
  const { AuctionResultsClient } = loadSource("src/components/auction/auction-results-client.tsx", {
    react: { ...React, useState: (initial) => React.useState(initial === false ? true : initial), useEffect() {} },
    "react-dom": { createPortal: (children) => children }, "next/navigation": nav, "next/link": Link,
  }, { document: { body: {} } });
  const html = renderToStaticMarkup(React.createElement(AuctionResultsClient, { auctions: [], activeFilters: {}, pagination: { page: 1, limit: 12, total: 0, totalPages: 1, hasNext: false, hasPrev: false } }));
  assert.match(html, /role="dialog" aria-modal="true"/);
  const formId = html.match(/<form id="([^"]+)"/)?.[1];
  assert.ok(formId); assert.ok(html.includes(`form="${formId}"`)); assert.match(html, /Close filters/);
  assert.doesNotMatch(html, /Show Results/);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(ids.length, new Set(ids).size);
});
