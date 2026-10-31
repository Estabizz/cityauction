import assert from "node:assert/strict";
import { test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadSource } from "./helpers/source-loader.mjs";

const reply = (body, status = 200) => new Response(JSON.stringify(body), { status });
const savedStore = (fetch) => loadSource("src/components/account/saved-properties-store.ts", {}, { fetch });

test("all save buttons share one initial saved-properties request", async () => {
  let calls = 0;
  const store = savedStore(async () => { calls++; return reply({ success: true, data: ["property-a"] }); });
  await Promise.all([store.loadSavedProperties(), store.loadSavedProperties(), store.loadSavedProperties()]);
  assert.equal(calls, 1);
  assert.equal(store.savedPropertiesSnapshot().ids.has("property-a"), true);
});

test("failed saved-state refresh preserves the saved properties and permits retry", async () => {
  let calls = 0;
  const store = savedStore(async () => ++calls === 2 ? reply({ error: "offline" }, 503) : reply({ success: true, data: ["property-a"] }));
  assert.equal(await store.loadSavedProperties(), true);
  assert.equal(await store.loadSavedProperties(true), false);
  assert.equal(store.savedPropertiesSnapshot().ids.has("property-a"), true);
  assert.equal(store.savedPropertiesSnapshot().signedIn, true);
  assert.equal(await store.loadSavedProperties(true), true);
});

test("initial network failure can be retried without reloading the page", async () => {
  let calls = 0;
  const store = savedStore(async () => { if (++calls === 1) throw new Error("offline"); return reply({ success: true, data: [] }); });
  assert.equal(await store.loadSavedProperties(), false);
  assert.equal(store.savedPropertiesSnapshot().signedIn, null);
  assert.equal(await store.loadSavedProperties(), true);
  assert.equal(store.savedPropertiesSnapshot().signedIn, true);
});

test("save and remove update shared state only after server confirmation", async () => {
  const calls = [];
  const store = savedStore(async (url, options) => {
    calls.push({ url, options });
    return reply({ success: true, saved: options.method === "POST" });
  });
  const saved = await store.setPropertySaved("property-a", true);
  assert.equal(saved.ok, true);
  assert.match(saved.message, /Property saved/);
  assert.equal(store.savedPropertiesSnapshot().ids.has("property-a"), true);
  const removed = await store.setPropertySaved("property-a", false);
  assert.equal(removed.ok, true);
  assert.match(removed.message, /removed/);
  assert.equal(store.savedPropertiesSnapshot().ids.has("property-a"), false);
  assert.equal(calls[0].options.method, "POST");
  assert.equal(calls[1].options.method, "DELETE");
});

for (const failure of ["offline", "server", "malformed"]) {
  test(`save failure never shows success or changes state: ${failure}`, async () => {
    const store = savedStore(async () => {
      if (failure === "offline") throw new Error("offline");
      if (failure === "server") return reply({ success: false, error: "Database unavailable" }, 503);
      return reply({ success: true });
    });
    const result = await store.setPropertySaved("property-a", true);
    assert.equal(result.ok, false);
    assert.equal(store.savedPropertiesSnapshot().ids.size, 0);
    assert.equal(store.savedPropertiesSnapshot().message, null);
    assert.equal(store.savedPropertiesSnapshot().pending.size, 0);
  });
}

test("repeated save clicks across components share one request", async () => {
  let finish;
  let calls = 0;
  const store = savedStore(() => { calls++; return new Promise((resolve) => { finish = resolve; }); });
  const first = store.setPropertySaved("property-a", true);
  const second = store.setPropertySaved("property-a", true);
  assert.equal(first, second);
  assert.equal(calls, 1);
  assert.equal(store.savedPropertiesSnapshot().pending.has("property-a"), true);
  finish(reply({ success: true, saved: true }));
  await first;
  assert.equal(store.savedPropertiesSnapshot().pending.size, 0);
});

test("a slow saved-properties refresh cannot undo a completed save", async () => {
  let finishRefresh;
  const store = savedStore(async (_url, options) => {
    if (options.method) return reply({ success: true, saved: true });
    return new Promise((resolve) => { finishRefresh = resolve; });
  });
  const refresh = store.loadSavedProperties(true);
  await store.setPropertySaved("property-a", true);
  finishRefresh(reply({ success: true, data: [] }));
  await refresh;
  assert.equal(store.savedPropertiesSnapshot().ids.has("property-a"), true);
});

test("expired sessions clear saved-state and request sign-in without success", async () => {
  let calls = 0;
  const store = savedStore(async () => ++calls === 1 ? reply({ success: true, data: ["property-a"] }) : reply({ success: false }, 401));
  await store.loadSavedProperties();
  const result = await store.setPropertySaved("property-b", true);
  assert.equal(result.ok, false);
  assert.equal(result.status, 401);
  assert.equal(store.savedPropertiesSnapshot().signedIn, false);
  assert.equal(store.savedPropertiesSnapshot().ids.size, 0);
});

test("sign-in returns property actions to the selected property and correct section", () => {
  const { propertySignInHref } = loadSource("src/lib/property-actions.ts");
  for (const action of ["save", "inspection", "contact"]) {
    const href = new URL(propertySignInHref("property-a", action), "https://cityauction.test");
    const next = new URL(href.searchParams.get("next"), "https://cityauction.test");
    assert.equal(next.pathname, "/auctions/property-a");
    assert.equal(next.searchParams.get("action"), action);
    assert.equal(next.hash, action === "save" ? "#property-save" : "#property-actions");
  }
});

test("a property card never nests the save button inside the property link", () => {
  const { AuctionCard } = loadSource("src/components/auction/auction-card.tsx", {
    "next/link": ({ children, href, ...props }) => React.createElement("a", { href, ...props }, children),
    "@/components/account/save-listing-button": { SaveListingButton: () => React.createElement("button", null, "Save property") },
    "@/components/ui/badge": { Badge: ({ children }) => React.createElement("span", null, children), AuctionStatusBadge: () => null },
  });
  const html = renderToStaticMarkup(React.createElement(AuctionCard, { auction: { id: "property-a", title: "Example property", reservePrice: 100000, emd: 10000, startDateTime: "2026-12-01T00:00:00Z", submissionDeadline: "2026-11-20T00:00:00Z", city: "Surat", state: "Gujarat" } }));
  assert.match(html, /^<article/);
  for (const link of html.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/g)) assert.doesNotMatch(link[1], /<button\b/);
  assert.match(html, /<button/);
  assert.match(html, /View property: Example property/);
});
