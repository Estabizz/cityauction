import assert from "node:assert/strict";
import { test } from "node:test";
import React from "react";
import { loadSource } from "./helpers/source-loader.mjs";

function find(node, predicate) {
  if (!node || typeof node !== "object") return null;
  if (predicate(node)) return node;
  for (const child of React.Children.toArray(node.props?.children)) { const found = find(child, predicate); if (found) return found; }
  return null;
}
const values = { title: "Industrial property", address: "Surat industrial area", category: "INDUSTRIAL", locationId: "1", possessionStatus: "PHYSICAL", organizationId: "org-1", imagesText: "/first.jpg\n/second.jpg", area: "100", areaUnit: "sq m", estimatedValue: "" };
const auction = { auctionNumber: "NOTICE-1", propertyId: "prop-1", type: "DRT", status: "UPCOMING", reservePrice: "2500000.50", emd: "250000", bidIncrement: "1000", startDateTime: "2099-01-10T10:00", endDateTime: "2099-01-10T15:00", submissionDeadline: "2099-01-09T17:00", sourceListingId: "OFFICIAL-SOURCE-1" };
function harness(kind, initial, result, confirmed = false) {
  const slots = []; let cursor = 0, refCursor = 0; const refs = []; const requests = [], redirects = [];
  const seeds = { 0: { organizations: [{ id: "org-1", name: "Institution" }], locations: [{ id: 1, name: "Surat" }], properties: [{ id: "prop-1", name: "Property", updatedAt: "2026-10-01T00:00:00.000Z" }] }, 1: initial,
    2: kind === "auction" ? [{ name: "Official notice", type: "NOTICE", url: "/notice.pdf", isPublic: true, fileSize: 1, mimeType: "application/pdf" }] : [], 3: confirmed, 7: false };
  const react = { ...React, useEffect() {},
    useState: (initial) => { const key = cursor++; if (!(key in slots)) slots[key] = Object.hasOwn(seeds, key) ? seeds[key] : initial; return [slots[key], (value) => { slots[key] = typeof value === "function" ? value(slots[key]) : value; }]; },
    useRef: (initial) => refs[refCursor++] ??= { current: initial },
  };
  const { RecordEditor } = loadSource("src/components/admin/record-editor.tsx", {
    react, "next/navigation": { useRouter: () => ({ replace: (url) => redirects.push(url), refresh() {} }) }, "next/link": () => null,
  }, { fetch: async (url, options) => { requests.push({ url, options }); return await result; }, SubmitEvent: class {} });
  const render = () => { cursor = 0; refCursor = 0; return RecordEditor({ kind }); };
  const submit = (action) => render().props.onSubmit({ preventDefault() {}, nativeEvent: { submitter: { getAttribute: () => action } } });
  return { render, submit, requests, redirects, value: (name) => find(render(), (node) => node.props?.name === name)?.props.value };
}

test("property save sends ordered image URLs, retains exact values and makes one request for repeated clicks", async () => {
  let finish; const h = harness("property", values, new Promise((resolve) => { finish = resolve; }));
  const first = h.submit("draft"), second = h.submit("draft"); assert.equal(h.requests.length, 1);
  const body = JSON.parse(h.requests[0].options.body); assert.deepEqual(body.images, ["/first.jpg", "/second.jpg"]); assert.equal(body.locationId, 1); assert.equal(body.area, "100");
  finish(Response.json({ success: true, redirectTo: "/admin/properties/new" })); await Promise.all([first, second]); assert.deepEqual(h.redirects, ["/admin/properties/new"]);
});
test("failed saves retain the form and never redirect", async () => {
  const h = harness("property", values, Response.json({ success: false, error: "Record changed. Reload first." }, { status: 409 }));
  await h.submit("draft"); assert.equal(h.value("title"), values.title); assert.equal(h.value("address"), values.address); assert.equal(h.redirects.length, 0);
  assert.ok(find(h.render(), (node) => node.props?.role === "alert"));
});
test("publication is blocked until source confirmation; confirmed submission converts IST exactly", async () => {
  const blocked = harness("auction", auction, Response.json({ success: true })); await blocked.submit("publish"); assert.equal(blocked.requests.length, 0);
  const allowed = harness("auction", auction, Response.json({ success: true, redirectTo: "/admin/auctions/new" }), true); await allowed.submit("publish");
  const body = JSON.parse(allowed.requests[0].options.body); assert.equal(body.action, "publish"); assert.equal(body.startDateTime, "2099-01-10T04:30:00.000Z"); assert.equal(body.reservePrice, "2500000.50"); assert.equal(body.sourceConfirmed, true);
});
test("editing a checked field resets confirmation and stops an unreviewed publication", async () => {
  const h = harness("auction", auction, Response.json({ success: true }), true);
  find(h.render(), (node) => node.props?.name === "reservePrice").props.onChange({ target: { value: "3000000" } });
  await h.submit("publish"); assert.equal(h.requests.length, 0); assert.equal(h.value("reservePrice"), "3000000");
});
