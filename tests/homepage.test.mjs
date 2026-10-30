import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadSource } from "./helpers/source-loader.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { homeSearchHref } = loadSource("src/lib/home-search.ts");
const { parseAuctionSearchParams } = loadSource("src/lib/auction-search.ts");
const { PROPERTY_CATEGORIES, AUCTION_TYPES } = loadSource("src/lib/constants.ts");
const { BUDGET_RANGES } = loadSource("src/lib/buyer.ts");
const { homeEnquiryErrors, HOME_ENQUIRY_TYPES } = loadSource("src/lib/home-enquiry.ts");
const { HOME_ASSETS, HOME_SERVICES } = loadSource("src/content/homepage.ts");
const blank = { location: "", category: "", budget: "", channel: "" };
const filters = (href) => parseAuctionSearchParams(new URL(href, "https://cityauction.test").searchParams);

test("empty or unknown homepage search selections produce a usable marketplace URL", () => {
  assert.equal(homeSearchHref(blank), "/auctions");
  assert.equal(homeSearchHref({ location: "invalid", category: "INVENTED", budget: "invalid", channel: "ARC" }), "/auctions");
});

test("city-only search retains the published city landing page", () => {
  assert.equal(homeSearchHref({ ...blank, location: "ahmedabad" }), "/locations/gujarat/ahmedabad");
});

for (const category of PROPERTY_CATEGORIES) {
  test(`homepage search preserves the exact ${category.value} category`, () => {
    const href = homeSearchHref({ ...blank, category: category.value, location: "ahmedabad" });
    const parsed = filters(href);
    assert.equal(parsed.category, category.value); assert.equal(parsed.city, "Ahmedabad");
  });
}
for (const budget of BUDGET_RANGES) {
  test(`homepage budget ${budget.value} has the correct marketplace bounds`, () => {
    const parsed = filters(homeSearchHref({ ...blank, budget: budget.value }));
    assert.equal(parsed.minPrice, "min" in budget ? budget.min : undefined);
    assert.equal(parsed.maxPrice, "max" in budget ? budget.max : undefined);
  });
}
for (const channel of AUCTION_TYPES) {
  test(`homepage channel ${channel.value} stays separate from other legal routes`, () => {
    assert.equal(filters(homeSearchHref({ ...blank, channel: channel.value })).auctionType, channel.value);
  });
}

test("every homepage asset card uses a supported category rather than disguising OTHER as a specific asset", () => {
  for (const asset of HOME_ASSETS) {
    assert.ok(PROPERTY_CATEGORIES.some((item) => item.value === asset.value));
    assert.equal(filters(`/auctions?category=${asset.value}`).category, asset.value);
  }
  assert.equal(new Set(HOME_ASSETS.map((item) => item.value)).size, HOME_ASSETS.length);
});

const valid = { name: "Buyer", phone: "+91 98765 43210", email: "", subject: HOME_ENQUIRY_TYPES[0].value, message: "" };
test("homepage enquiry allows optional email and message while requiring a reachable mobile number", () => {
  assert.equal(Object.keys(homeEnquiryErrors(valid)).length, 0);
  assert.equal(Object.keys(homeEnquiryErrors({ ...valid, email: "buyer@example.test" })).length, 0);
  assert.ok(homeEnquiryErrors({ ...valid, phone: "123" }).phone);
  assert.ok(homeEnquiryErrors({ ...valid, phone: "+123456789012345678901234" }).phone);
  assert.ok(homeEnquiryErrors({ ...valid, email: "not-an-email" }).email);
  assert.ok(homeEnquiryErrors({ ...valid, name: " " }).name);
  assert.ok(homeEnquiryErrors({ ...valid, subject: "" }).subject);
  assert.ok(homeEnquiryErrors({ ...valid, message: "x".repeat(5001) }).message);
});

const Link = ({ href, children, ...props }) => React.createElement("a", { href, ...props }, children);
function pageMarkup() {
  const { default: HomePage } = loadSource("src/app/(public)/page.tsx", {
    "next/link": Link,
    "next/image": ({ src, alt }) => React.createElement("img", { src, alt }),
    "next/navigation": { useRouter: () => ({ push() {} }) },
  });
  return renderToStaticMarkup(React.createElement(HomePage));
}

test("homepage has one primary heading, unique field IDs and working section anchors", () => {
  const html = pageMarkup();
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.doesNotMatch(html, /<main\b/); // The public layout supplies the main landmark.
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length);
  for (const match of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(match[1]), `Missing section ${match[1]}`);
  for (const match of html.matchAll(/for="([^"]+)"/g)) assert.ok(ids.includes(match[1]), `Missing field ${match[1]}`);
  for (const service of HOME_SERVICES) assert.ok(html.includes(service.title));
});

test("homepage omits unsupported inventory totals, false deadline filters and duplicate newsletter forms", () => {
  const html = pageMarkup();
  assert.doesNotMatch(html, /12,000|100\+|5,000|1 business day|production feed|fabricated urgency|View EMD Deadlines|View Inspection Deadlines|Customs Lot Discovery/);
  assert.doesNotMatch(html, /subscribe-section-email/);
  assert.match(html, /home-contact-message/);
  assert.match(html, /Property, location and how we can help\./);
  assert.doesNotMatch(html, /Tell us what you are looking for, what asset\/project/);
});

test("homepage hero is a small local asset with a preload instead of a remote stock dependency", () => {
  const html = pageMarkup();
  assert.match(html, /\/images\/cityauction-architecture\.webp/);
  assert.doesNotMatch(html, /images\.unsplash\.com/);
  assert.ok(fs.statSync(path.join(root, "public/images/cityauction-architecture.webp")).size < 200_000);
});

function enquiryHarness(resultPromise) {
  const slots = []; let cursor = 0; const calls = []; const focus = [];
  const fakeReact = { ...React,
    useState: (initial) => { const key = cursor++; if (!(key in slots)) slots[key] = initial; return [slots[key], (value) => { slots[key] = typeof value === "function" ? value(slots[key]) : value; }]; },
    useRef: (initial) => { const key = cursor++; return slots[key] ??= { current: initial }; },
  };
  const { HomeEnquiryForm } = loadSource("src/components/home/home-enquiry.tsx", {
    react: fakeReact,
    "@/components/account/auth-ui": { Field: "input", SelectField: "select", FormAlert: "div", SubmitButton: "button" },
    "@/components/forms/lead-submit": { Honeypot: () => null, SubmitErrorNotice: "error-notice", submitEnquiry: async (form, body) => { calls.push(body); return resultPromise; } },
  }, { document: { getElementById: (id) => ({ focus: () => focus.push(id) }) } });
  function render() { cursor = 0; return HomeEnquiryForm(); }
  const find = (element, id) => {
    if (!React.isValidElement(element)) return undefined;
    if (element.props.id === id) return element;
    for (const child of React.Children.toArray(element.props.children)) { const found = find(child, id); if (found) return found; }
  };
  function fill(values) { for (const [key, value] of Object.entries(values)) find(render(), `home-contact-${key}`).props.onChange({ target: { value } }); }
  return { calls, focus, render, find, fill, submit: () => render().props.onSubmit({ preventDefault() {}, currentTarget: {} }) };
}

test("invalid enquiry focuses the first error and never sends a request", async () => {
  const state = enquiryHarness(Promise.resolve({ ok: true, message: "saved" }));
  await state.submit();
  assert.equal(state.calls.length, 0); assert.equal(state.focus[0], "home-contact-name");
});

test("double enquiry submission produces one request and clears fields only after success", async () => {
  let resolve; const result = new Promise((done) => { resolve = done; });
  const state = enquiryHarness(result); state.fill(valid);
  const first = state.submit(); await state.submit();
  assert.equal(state.calls.length, 1);
  assert.equal(state.calls[0].source, "homepage");
  assert.equal(state.find(state.render(), "home-contact-name").props.value, "Buyer");
  resolve({ ok: true, message: "saved" }); await first;
  assert.equal(state.find(state.render(), "home-contact-name").props.value, "");
});

test("failed enquiry preserves the draft so the visitor can retry", async () => {
  const state = enquiryHarness(Promise.resolve({ ok: false, error: "Temporary failure" })); state.fill(valid);
  await state.submit();
  assert.equal(state.find(state.render(), "home-contact-name").props.value, "Buyer");
  assert.equal(state.find(state.render(), "home-contact-phone").props.value, valid.phone);
  await state.submit(); assert.equal(state.calls.length, 2);
});
