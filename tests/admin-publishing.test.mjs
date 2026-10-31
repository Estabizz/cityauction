import assert from "node:assert/strict";
import { test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadSource } from "./helpers/source-loader.mjs";

const schema = loadSource("src/lib/admin/publishing-schema.ts");
const property = { title: "Industrial unit in Surat", address: "GIDC Road, Surat", organizationId: "org-1", category: "INDUSTRIAL", locationId: 1,
  possessionStatus: "SYMBOLIC", area: "1800", areaUnit: "sq m", images: ["/photo-a.jpg", "/photo-b.jpg"] };
const auction = { action: "draft", auctionNumber: "OFFICIAL-123", propertyId: "prop-1", type: "DRT", status: "UPCOMING", reservePrice: "2500000.50", emd: "250000", bidIncrement: "5000",
  startDateTime: "2099-01-10T10:00:00+05:30", endDateTime: "2099-01-10T15:00:00+05:30", submissionDeadline: "2099-01-09T17:00:00+05:30", documents: [] };
const checked = { ...auction, action: "publish", propertyUpdatedAt: "2026-10-01T00:00:00.000Z", sourceListingId: "https://bank.example/notices/123", sourceConfirmed: true, documents: [{ name: "Official notice", type: "NOTICE", url: "/notice.pdf", isPublic: true }] };
const version = "2026-10-01T00:00:00.000Z";
const actor = { id: "admin-1", email: "admin@example.test", roles: ["ADMIN"], isSuperAdmin: false };
const req = new Request("https://cityauction.test/api/admin/auctions", { method: "POST", headers: { origin: "https://cityauction.test" } });

test("drafts do not require source confirmation; publication requires explicit confirmation and a public notice", () => {
  assert.equal(schema.auctionSchema.safeParse(auction).success, true);
  assert.equal(schema.auctionSchema.safeParse({ ...auction, action: "publish" }).success, false);
  assert.equal(schema.auctionSchema.safeParse({ ...checked, sourceConfirmed: false }).success, false);
  assert.equal(schema.auctionSchema.safeParse({ ...checked, documents: [{ ...checked.documents[0], isPublic: false }] }).success, false);
  assert.equal(schema.auctionSchema.safeParse({ ...checked, documents: [{ ...checked.documents[0], type: "OTHER" }] }).success, false);
  assert.equal(schema.auctionSchema.safeParse(checked).success, true);
});
for (const patch of [{ reservePrice: "0" }, { emd: "3000000" }, { reservePrice: "1e8" }, { bidIncrement: "-5" }, { emd: "20.001" }, { endDateTime: auction.startDateTime }, { submissionDeadline: "2099-01-11T10:00:00Z" }, { startDateTime: "2099-02-30T10:00:00Z" }]) {
  test(`invalid recorded amounts or dates are rejected: ${JSON.stringify(patch)}`, () => assert.equal(schema.auctionSchema.safeParse({ ...auction, ...patch }).success, false));
}
for (const url of ["javascript:alert(1)", "//other.example/photo", "http://other.example/file", "https://user:secret@example.test/photo"]) {
  test(`unsafe public attachments cannot be saved: ${url}`, () => {
    assert.equal(schema.propertySchema.safeParse({ ...property, images: [url] }).success, false);
    assert.equal(schema.auctionSchema.safeParse({ ...checked, documents: [{ ...checked.documents[0], url }] }).success, false);
  });
}
test("property location, area unit, maximum attachment count and image-only media references are validated", () => {
  assert.equal(schema.propertySchema.safeParse({ ...property, locationId: undefined }).success, false);
  assert.equal(schema.propertySchema.safeParse({ ...property, locationId: undefined, state: "Gujarat", city: "Surat" }).success, true);
  assert.equal(schema.propertySchema.safeParse({ ...property, areaUnit: "" }).success, false);
  assert.equal(schema.propertySchema.safeParse({ ...property, images: Array(21).fill("/photo.jpg") }).success, false);
  assert.equal(schema.propertySchema.safeParse({ ...property, images: ["/api/media/notice.pdf"] }).success, false);
});
test("IST editor values round-trip exactly and invalid calendar dates are not silently moved", () => {
  assert.equal(schema.fromIstInput("2030-01-01T09:30"), "2030-01-01T04:00:00.000Z");
  assert.equal(schema.toIstInput("2030-01-01T04:00:00Z"), "2030-01-01T09:30");
  assert.equal(schema.fromIstInput("2030-02-30T09:30"), "2030-02-30T09:30");
});
test("status publication checks reject false live/upcoming claims but permit source-checked historical notices", () => {
  const parsed = schema.auctionSchema.parse(checked);
  assert.throws(() => schema.validatePublicationTime({ ...parsed, status: "LIVE" }, Date.parse("2098-01-01")), /cannot start in the future/);
  assert.throws(() => schema.validatePublicationTime(parsed, Date.parse("2100-01-01")), /future start/);
  assert.doesNotThrow(() => schema.validatePublicationTime({ ...parsed, status: "CLOSED" }, Date.parse("2100-01-01")));
});

function harness() {
  let state = { properties: [{ id: "prop-1", title: property.title, address: property.address, categoryId: 1, organizationId: "org-1", organization: { isActive: true }, updatedAt: new Date(version), deletedAt: null }],
    auctions: [{ id: "auc-1", propertyId: "prop-1", status: "UPCOMING", publishedAt: new Date(version), sourceVerifiedAt: new Date(version), sourceListingId: "old-source", updatedAt: new Date(version), deletedAt: null }],
    images: [], documents: [], audits: [], bidCount: 0, auditFails: false, locks: 0 };
  const match = (row, where) => (!where.id || row.id === where.id) && (!where.propertyId || row.propertyId === where.propertyId) && (!where.updatedAt || row.updatedAt.getTime() === where.updatedAt.getTime());
  const tx = {
    $queryRaw: async () => { state.locks++; return []; },
    property: { findFirst: async ({ where }) => state.properties.find((row) => row.id === where.id) || null,
      updateMany: async ({ where, data }) => { let count = 0; for (const row of state.properties) if (match(row, where)) { Object.assign(row, data, { updatedAt: new Date() }); count++; } return { count }; },
      create: async ({ data }) => { const row = { ...data, id: "new-property", updatedAt: new Date() }; state.properties.push(row); return row; } },
    organization: { findFirst: async () => ({ id: "org-1", isActive: true }) },
    propertyCategory: { findFirst: async () => ({ id: 1, type: "INDUSTRIAL" }) },
    location: { findUnique: async ({ where }) => where.id === 1 ? { id: 1, type: "CITY" } : null },
    bid: { count: async () => state.bidCount },
    propertyImage: { deleteMany: async () => { state.images = []; }, createMany: async ({ data }) => { state.images.push(...data); } },
    auction: { findFirst: async ({ where }) => state.auctions.find((row) => row.id === where.id) || null,
      create: async ({ data }) => { const row = { ...data, id: "new-auction", updatedAt: new Date() }; state.auctions.push(row); return row; },
      updateMany: async ({ where, data }) => { let count = 0; for (const row of state.auctions) if (match(row, where)) { Object.assign(row, data, { updatedAt: new Date() }); count++; } return { count }; } },
    auctionDocument: { deleteMany: async () => { state.documents = []; }, createMany: async ({ data }) => state.documents.push(...data) },
  };
  const db = { ...tx, $transaction: async (work) => { const backup = structuredClone(state); try { return await work(tx); } catch (error) { state = backup; throw error; } } };
  const service = loadSource("src/lib/admin/publishing.ts", { "@/lib/db": { db }, "./audit": { writeAudit: async (_actor, _req, entry) => { if (state.auditFails) throw new Error("audit unavailable"); state.audits.push(entry); } } });
  return { service, state: () => state };
}

test("saving a property keeps one ordered cover photo and withdraws linked notices for review", async () => {
  const h = harness();
  await h.service.saveProperty(schema.propertySchema.parse({ ...property, updatedAt: version }), "prop-1", actor, req);
  assert.equal(h.state().auctions[0].publishedAt, null); assert.equal(h.state().auctions[0].sourceVerifiedAt, null);
  assert.equal(h.state().images.length, 2); assert.equal(h.state().images[0].isPrimary, true); assert.equal(h.state().images[1].isPrimary, false);
  assert.equal(h.state().audits[0].action, "PROPERTY_UPDATED"); assert.equal(h.state().locks, 1);
});
test("property edits reject stale sessions and recorded bidding activity", async () => {
  const h = harness();
  await assert.rejects(h.service.saveProperty(schema.propertySchema.parse({ ...property, updatedAt: "2020-01-01T00:00:00.000Z" }), "prop-1", actor, req), /another session/);
  h.state().bidCount = 1;
  await assert.rejects(h.service.saveProperty(schema.propertySchema.parse({ ...property, updatedAt: version }), "prop-1", actor, req), /bidding activity/);
  assert.equal(h.state().images.length, 0); assert.ok(h.state().auctions[0].publishedAt);
});
test("a draft stays private even when source values are provided; publication records an actual review time", async () => {
  const h = harness();
  await h.service.saveAuction(schema.auctionSchema.parse({ ...checked, action: "draft" }), null, actor, req);
  const draft = h.state().auctions.find((row) => row.id === "new-auction");
  assert.equal(draft.status, "DRAFT"); assert.equal(draft.sourceVerifiedAt, null); assert.equal(draft.publishedAt, null);
  const before = Date.now();
  await h.service.saveAuction(schema.auctionSchema.parse({ ...checked, updatedAt: version }), "auc-1", actor, req);
  const published = h.state().auctions[0];
  assert.equal(published.status, "UPCOMING"); assert.ok(published.sourceVerifiedAt.getTime() >= before);
  assert.equal(published.organizationId, "org-1"); assert.equal(h.state().documents[0].isPublic, true);
});
test("auction edits reject stale versions and existing bid activity without writing documents", async () => {
  const h = harness();
  await assert.rejects(h.service.saveAuction(schema.auctionSchema.parse({ ...checked, updatedAt: "2020-01-01T00:00:00.000Z" }), "auc-1", actor, req), /another session/);
  h.state().bidCount = 1;
  await assert.rejects(h.service.saveAuction(schema.auctionSchema.parse({ ...checked, updatedAt: version }), "auc-1", actor, req), /bidding activity/);
  assert.equal(h.state().documents.length, 0);
});
test("an audit failure rolls back record changes, photo replacement and publication state", async () => {
  const h = harness(); h.state().auditFails = true;
  await assert.rejects(h.service.saveProperty(schema.propertySchema.parse({ ...property, title: "Changed property title", updatedAt: version }), "prop-1", actor, req), /audit unavailable/);
  assert.equal(h.state().properties[0].title, property.title); assert.ok(h.state().auctions[0].publishedAt); assert.equal(h.state().images.length, 0);
  await assert.rejects(h.service.saveAuction(schema.auctionSchema.parse(checked), null, actor, req), /audit unavailable/);
  assert.equal(h.state().auctions.length, 1); assert.equal(h.state().documents.length, 0);
});
test("withdrawing a notice clears public access flags while retaining its status and record", async () => {
  const h = harness(); await h.service.unpublishAuction("auc-1", version, actor, req);
  assert.equal(h.state().auctions.length, 1); assert.equal(h.state().auctions[0].status, "UPCOMING"); assert.equal(h.state().auctions[0].publishedAt, null);
  assert.equal(h.state().audits[0].action, "AUCTION_UNPUBLISHED");
});

test("publishing APIs require current admin access and same-origin writes before any mutation", async () => {
  let calls = 0;
  for (const admin of [false, true]) {
    const { recordHandlers } = loadSource("src/lib/admin/publishing-api.ts", {
      "./guard": { requireAdminApi: async () => admin ? { actor } : { error: new Response(null, { status: 403 }) }, jsonError: (message, status = 400) => Response.json({ success: false, error: message }, { status }) },
      "@/lib/same-origin": { isSameOriginRequest: () => false }, "./publishing": { saveAuction: async () => { calls++; } },
    });
    assert.equal((await recordHandlers("auction").save(new Request("https://site.test", { method: "POST", body: JSON.stringify(checked) }))).status, 403);
  }
  assert.equal(calls, 0);
});
test("private previews suppress saving, sharing and buyer submissions", () => {
  const { AuctionDetailClient } = loadSource("src/components/auction/auction-detail-client.tsx", {
    "next/link": ({ href, children, ...props }) => React.createElement("a", { href, ...props }, children),
    "@/components/account/save-listing-button": { SaveListingButton: () => React.createElement("button", null, "Save property") },
    "@/components/account/property-request": { PropertyRequest: () => React.createElement("button", null, "Contact team") },
  });
  const data = { ...auction, id: "preview", title: property.title, categoryName: "Industrial", city: "Surat", state: "Gujarat", organizationName: "Bank", organization: { name: "Bank", website: "" },
    contactOfficerPhone: "", contactOfficerEmail: "", images: [], primaryImage: null, description: "", address: "", terms: "", documents: [] };
  const html = renderToStaticMarkup(React.createElement(AuctionDetailClient, { auction: data, initialNow: Date.now(), preview: true }));
  assert.match(html, /Preview only/); assert.doesNotMatch(html, />Share<|>Save property<|>Contact team<|Request inspection/);
});

test("catalogue property choices have usable names, including on an unseeded site", async () => {
  const { publishingCatalog } = loadSource("src/lib/admin/publishing.ts", { "@/lib/db": { db: {
    organization: { findMany: async () => [] }, location: { findMany: async () => [{ id: 1, name: "Surat", parent: { name: "Gujarat" } }] },
    property: { findMany: async () => [{ id: "property-1", title: "Actual property title", updatedAt: new Date(version) }] },
  } }, "./audit": { writeAudit() {} } });
  const result = await publishingCatalog();
  assert.equal(result.properties[0].name, "Actual property title"); assert.equal(result.locations[0].name, "Surat, Gujarat"); assert.equal(result.organizations.length, 0);
});

test("API maps validation, duplicate keys and stale versions to reviewable errors without false success", async () => {
  for (const [failure, status] of [[null, 400], [{ code: "P2002" }, 409], [new schema.PublishingError("Record changed", 409), 409]]) {
    const { recordHandlers } = loadSource("src/lib/admin/publishing-api.ts", {
      "./guard": { requireAdminApi: async () => ({ actor }), jsonError: (error, status = 400) => Response.json({ success: false, error }, { status }) },
      "@/lib/same-origin": { isSameOriginRequest: () => true }, "./publishing-schema": schema,
      "./publishing": { saveAuction: async () => { throw failure; } },
    });
    const response = await recordHandlers("auction").save(new Request("https://site.test/api/admin/auctions", { method: "POST", body: JSON.stringify(failure ? checked : {}) }));
    assert.equal(response.status, status); assert.equal((await response.json()).success, false);
  }
});

test("publication rejects a property changed after the editor's review snapshot", async () => {
  const h = harness();
  const input = schema.auctionSchema.parse({ ...checked, propertyUpdatedAt: "2020-01-01T00:00:00.000Z" });
  await assert.rejects(h.service.saveAuction(input, null, actor, req), /selected property changed/);
  assert.equal(h.state().auctions.length, 1); assert.equal(h.state().documents.length, 0);
});

test("admin page guards fail closed when the current role cannot be checked", async () => {
  const { requireAdminPage } = loadSource("src/lib/admin/guard.ts", {
    "@/lib/auth": { getCurrentUser: async () => ({ userId: "admin" }), isAdmin: () => true, ADMIN_ROLES: ["ADMIN", "SUPER_ADMIN"] },
    "@/lib/db": { db: { user: { findUnique: async () => { throw new Error("database offline"); } } } },
    "next/navigation": { redirect: () => { throw new Error("redirect"); } },
  });
  await assert.rejects(requireAdminPage(), /could not be verified/);
});

test("first property creation can populate category and city without publishing any notice", async () => {
  const createdCities = []; const savedProperties = [];
  // Use a minimal unseeded catalogue to exercise the real hierarchy resolver.
  const tx = {
    organization: { findFirst: async () => ({ id: "org-1", isActive: true }) },
    propertyCategory: { findFirst: async () => null, upsert: async ({ create }) => ({ ...create, id: 1 }) },
    location: { findFirst: async () => null, upsert: async ({ create }) => { if (create.type === "STATE") return { ...create, id: 1 }; createdCities.push(create); return { ...create, id: createdCities.length + 1 }; } },
    property: { create: async ({ data }) => { savedProperties.push(data); return { ...data, id: "new-property" }; } },
    propertyImage: { createMany: async () => {} },
  };
  const { saveProperty } = loadSource("src/lib/admin/publishing.ts", { "@/lib/db": { db: { $transaction: async (work) => work(tx) } }, "./audit": { writeAudit: async () => {} } });
  for (const city of ["सूरत", "अहमदाबाद"]) await saveProperty(schema.propertySchema.parse({ ...property, locationId: undefined, state: "Gujarat", city }), null, actor, req);
  assert.equal(createdCities.length, 2); assert.notEqual(createdCities[0].slug, createdCities[1].slug);
  assert.equal(savedProperties.length, 2); assert.equal(savedProperties[0].organizationId, "org-1");
});

test("editing a saved schedule preserves recorded seconds and milliseconds", () => {
  for (const value of ["2030-01-01T04:00:30.000Z", "2030-01-01T04:00:00.125Z", "2030-01-01T04:00:30.125Z"]) {
    assert.equal(schema.fromIstInput(schema.toIstInput(value)), value);
  }
  assert.equal(schema.fromIstInput("2030-01-01T09:30:00"), "2030-01-01T04:00:00.000Z");
});

test("well-formed Indian and international price grouping is accepted without guessing malformed amounts", () => {
  assert.equal(schema.money.parse("25,00,000.50"), "2500000.50"); assert.equal(schema.money.parse("2,500,000"), "2500000");
  assert.equal(schema.money.safeParse("1,2").success, false); assert.equal(schema.money.safeParse("25,00,00").success, false);
});
