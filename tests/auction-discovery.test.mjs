import assert from "node:assert/strict";
import { test } from "node:test";
import { loadSource } from "./helpers/source-loader.mjs";

const date = (v) => new Date(v);
function fixture(id, changes = {}) {
  const state = { name: "Gujarat", type: "STATE", stateCode: "GJ", parent: null };
  const district = { name: "Surat District", type: "DISTRICT", stateCode: "GJ", parent: state };
  const city = { name: "Surat", type: "CITY", stateCode: "GJ", parent: district };
  return {
    id, auctionNumber: `CA-${id}`, type: "SARFAESI", status: "UPCOMING", deletedAt: null,
    publishedAt: date("2026-01-01"), updatedAt: date("2026-02-01"),
    sourceListingId: `notice-${id}`, sourceVerifiedAt: date("2026-01-02"),
    reservePrice: "2500000", emd: "250000", bidIncrement: "10000",
    startDateTime: date("2030-02-10T10:00:00+05:30"), endDateTime: date("2030-02-10T15:00:00+05:30"),
    submissionDeadline: date("2030-02-09T17:00:00+05:30"),
    organization: { id: "bank-1", name: "Example Bank", slug: "example-bank", type: "BANK", isActive: true, logo: null },
    propertyId: `property-${id}`,
    property: { id: `property-${id}`, title: "Warehouse in Sachin", slug: `warehouse-${id}`, deletedAt: null,
      description: "Industrial estate", address: "GIDC Road", possessionStatus: "PHYSICAL",
      area: 2000, areaUnit: "sq ft", images: [], category: { name: "Industrial", type: "INDUSTRIAL" },
      subType: { slug: "warehouse" }, location: { name: "Sachin", type: "LOCALITY", stateCode: "GJ", parent: city },
    },
    documents: [{ name: "Notice", type: "NOTICE", fileSize: 1024, url: "/public.pdf", isPublic: true },
      { name: "Internal", type: "OTHER", fileSize: 1024, url: "/private.pdf", isPublic: false }],
    ...changes,
  };
}

// A small, generic adapter for the Prisma operators used by public discovery.
// Visitor-facing assertions exercise the real service and handlers against
// mixed inventory, including records that must never become public.
function matches(value, where) {
  if (where == null || typeof where !== "object" || where instanceof Date) return value === where;
  if (value == null) return false;
  return Object.entries(where).every(([key, expected]) => {
    if (expected === undefined) return true;
    if (key === "AND") return (Array.isArray(expected) ? expected : [expected]).every((q) => matches(value, q));
    if (key === "OR") return expected.some((q) => matches(value, q));
    if (key === "NOT") return !(Array.isArray(expected) ? expected : [expected]).some((q) => matches(value, q));
    if (key === "not") return !matches(value, expected);
    if (key === "in") return expected.includes(value);
    if (key === "notIn") return !expected.includes(value);
    if (key === "contains") return String(value).toLowerCase().includes(String(expected).toLowerCase());
    if (key === "gte") return value >= expected;
    if (key === "lte") return value <= expected;
    if (key === "gt") return value > expected;
    if (key === "lt") return value < expected;
    return matches(value[key], expected);
  });
}

function database(rows) {
  const writes = [];
  const calls = [];
  const db = {
    auction: {
      count: async (query) => { calls.push(query); return rows.filter((r) => matches(r, query.where)).length; },
      findMany: async (query) => {
        calls.push(query);
        const result = rows.filter((r) => matches(r, query.where));
        for (const rule of [...(Array.isArray(query.orderBy) ? query.orderBy : query.orderBy ? [query.orderBy] : [])].reverse()) {
          const [key, direction] = Object.entries(rule)[0];
          result.sort((a, b) => (a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0) * (direction === "desc" ? -1 : 1));
        }
        return result.slice(query.skip || 0, query.take ? (query.skip || 0) + query.take : undefined);
      },
      findFirst: async (query) => {
        calls.push(query);
        const row = rows.find((r) => matches(r, query.where));
        if (!row) return null;
        const docsWhere = query.include?.documents?.where;
        return { ...row, documents: docsWhere ? row.documents.filter((d) => matches(d, docsWhere)) : row.documents };
      },
    },
    user: { findUnique: async () => ({ id: "buyer-1", fullName: "Buyer", email: "buyer@example.test", mobile: "+919876543210" }) },
    favourite: { create: async (query) => { writes.push(query.data); return query.data; } },
    enquiry: {
      count: async () => 0,
      create: async (query) => { writes.push(query.data); return { id: "enquiry-123456", ...query.data }; },
    },
  };
  return { db, writes, calls };
}
function setup(rows = [], authenticated = true) {
  const state = database(rows);
  const mocks = {
    "@/lib/db": { db: state.db },
    "./db": { db: state.db },
    "@/lib/auth": { getCurrentUser: async () => authenticated ? { userId: "buyer-1" } : null },
  };
  return { ...state, mocks, service: loadSource("src/services/auction.service.ts", mocks) };
}
const request = (body) => ({ json: async () => body, headers: new Headers() });
const ids = (result) => Array.from(result.data, (r) => r.id);

const valid = fixture("published");
const hidden = [
  fixture("draft", { status: "DRAFT" }), fixture("unpublished", { publishedAt: null }),
  fixture("scheduled", { publishedAt: date("2099-01-01") }), fixture("deleted", { deletedAt: date("2026-01-01") }),
  fixture("unchecked", { sourceVerifiedAt: null }), fixture("future-check", { sourceVerifiedAt: date("2099-01-01") }),
  fixture("no-source", { sourceListingId: null }), fixture("empty-source", { sourceListingId: "" }),
  fixture("removed-property", { property: { ...valid.property, deletedAt: date("2026-01-01") } }),
  fixture("inactive-bank", { organization: { ...valid.organization, isActive: false } }),
];

test("only published, source-checked inventory is discoverable", async () => {
  const { service } = setup([valid, ...hidden]);
  assert.deepEqual(ids(await service.getAuctions()), ["published"]);
});

test("empty inventory and zero search matches stay empty without demo records", async () => {
  assert.equal((await setup().service.getAuctions()).data.length, 0);
  const result = await setup([valid]).service.getAuctions({ keyword: "does-not-exist" });
  assert.equal(result.data.length, 0);
  assert.equal(result.pagination.total, 0);
});

test("database outages produce a failure instead of inventory", async () => {
  const { service, db } = setup();
  db.auction.count = async () => { throw new Error("offline"); };
  await assert.rejects(service.getAuctions(), { name: "AuctionDataUnavailable" });
});

for (const hiddenRow of hidden) {
  test(`hidden inventory cannot be opened directly: ${hiddenRow.id}`, async () => {
    const { service } = setup([hiddenRow]);
    for (const id of [hiddenRow.id, hiddenRow.auctionNumber, hiddenRow.property.slug])
      assert.equal(await service.getAuctionById(id), null);
  });
}

test("detail exposes public documents only and uses full city/state labels", async () => {
  const detail = await setup([valid]).service.getAuctionById(valid.id);
  assert.equal(detail.city, "Surat");
  assert.equal(detail.state, "Gujarat");
  assert.equal(detail.documents.length, 1);
  assert.equal(detail.documents[0].url, "/public.pdf");
});

for (const filters of [
  { state: "Gujarat", city: "Surat", district: "Surat District" }, { state: "GJ" },
  { category: "INDUSTRIAL", possession: "PHYSICAL", subType: "warehouse" },
  { organization: "example-bank", auctionType: "SARFAESI", status: "UPCOMING" },
  { minPrice: 0, maxPrice: 2500000, minEmd: 0, maxEmd: 250000 },
  { dateFrom: "2030-02-10", dateTo: "2030-02-10", deadlineBefore: "2030-02-09" },
  { keyword: "Sachin" }, { keyword: "GIDC" }, { keyword: "Example Bank" }, { keyword: "CA-published" },
]) {
  test(`matching filters preserve the correct notice: ${JSON.stringify(filters)}`, async () => {
    assert.deepEqual(ids(await setup([valid]).service.getAuctions(filters)), ["published"]);
  });
}

for (const filters of [
  { state: "Maharashtra" }, { city: "Mumbai" }, { district: "Other district" },
  { category: "RESIDENTIAL" }, { possession: "SYMBOLIC" }, { organization: "another-bank" },
  { auctionType: "DRT" }, { status: "SOLD" }, { maxPrice: 0 }, { minEmd: 250001 },
  { dateTo: "2030-02-09" }, { dateFrom: "2030-02-11" }, { deadlineBefore: "2030-02-08" },
]) {
  test(`nonmatching filter never falls back: ${JSON.stringify(filters)}`, async () => {
    assert.equal((await setup([valid]).service.getAuctions(filters)).data.length, 0);
  });
}

test("date ranges include the entire selected day in IST", async () => {
  const rows = [
    fixture("before", { startDateTime: date("2030-02-09T23:59:59+05:30") }),
    fixture("early", { startDateTime: date("2030-02-10T00:00:00+05:30") }),
    fixture("late", { startDateTime: date("2030-02-10T23:59:59+05:30") }),
    fixture("after", { startDateTime: date("2030-02-11T00:00:00+05:30") }),
  ];
  assert.deepEqual(ids(await setup(rows).service.getAuctions({ dateFrom: "2030-02-10", dateTo: "2030-02-10" })), ["early", "late"]);
});

test("all offered sort orders work with stable pagination", async () => {
  const rows = [fixture("a", { reservePrice: "1000000", publishedAt: date("2026-01-02"), startDateTime: date("2030-02-12"), endDateTime: date("2030-02-14") }),
    fixture("b", { reservePrice: "3000000", publishedAt: date("2026-01-01"), startDateTime: date("2030-02-11"), endDateTime: date("2030-02-13") })];
  for (const [sort, expected] of [["price_asc", ["a", "b"]], ["price_desc", ["b", "a"]], ["newest", ["a", "b"]], ["date_asc", ["b", "a"]], ["closing_soon", ["b", "a"]]]) {
    assert.deepEqual(ids(await setup(rows).service.getAuctions({ sort })), expected);
  }
  const result = await setup(rows).service.getAuctions({ sort: "price_asc", limit: 1, page: 999 });
  assert.deepEqual(ids(result), ["b"]);
  assert.equal(result.pagination.page, 2);
  assert.equal(result.pagination.hasNext, false);
});

test("API accepts both auction type aliases and keyword q", async () => {
  for (const query of ["type=SARFAESI&q=Sachin", "auctionType=SARFAESI&keyword=Sachin"]) {
    const state = setup([valid]);
    const { GET } = loadSource("src/app/api/auctions/route.ts", state.mocks);
    const response = await GET(new Request(`http://localhost/api/auctions?${query}`));
    assert.equal(response.status, 200);
    assert.deepEqual(ids(await response.json()), ["published"]);
  }
});

for (const query of ["minPrice=-1", "maxPrice=NaN", "maxPrice=Infinity", "minPrice=5&maxPrice=4", "status=DRAFT", "page=1.5", "page=0", "limit=51", "dateFrom=2030-02-30", "dateFrom=2030-02-12&dateTo=2030-02-10", "category=invalid"]) {
  test(`invalid query is rejected before database access: ${query}`, async () => {
    const state = setup([valid]);
    const { GET } = loadSource("src/app/api/auctions/route.ts", state.mocks);
    const response = await GET(new Request(`http://localhost/api/auctions?${query}`));
    assert.equal(response.status, 400);
    assert.equal(state.calls.length, 0);
  });
}

test("API and detail distinguish unavailable data from missing inventory", async () => {
  const state = setup();
  state.db.auction.count = async () => { throw new Error("offline"); };
  const { GET } = loadSource("src/app/api/auctions/route.ts", state.mocks);
  assert.equal((await GET(new Request("http://localhost/api/auctions"))).status, 503);
  const detail = loadSource("src/app/api/auctions/[id]/route.ts", state.mocks);
  assert.equal((await detail.GET(null, { params: Promise.resolve({ id: "missing" }) })).status, 404);
  state.db.auction.findFirst = async () => { throw new Error("offline"); };
  assert.equal((await detail.GET(null, { params: Promise.resolve({ id: "missing" }) })).status, 503);
});

test("sitemap inventory uses only source-checked published database records", async () => {
  const entries = await setup([valid, ...hidden]).service.getPublicAuctionSitemapEntries();
  assert.deepEqual(entries.map((r) => r.id), ["published"]);
});

test("buyers can save a public listing; guests and hidden listings cannot create saves", async () => {
  const state = setup([valid, ...hidden]);
  const route = loadSource("src/app/api/favourites/route.ts", state.mocks);
  assert.equal((await route.POST(request({ auctionId: valid.id }))).status, 200);
  assert.equal(state.writes[0].userId, "buyer-1");
  assert.equal(state.writes[0].auctionId, valid.id);
  assert.equal((await route.POST(request({ auctionId: "draft" }))).status, 404);
  assert.equal(state.writes.length, 1);
  const guest = setup([valid], false);
  assert.equal((await loadSource("src/app/api/favourites/route.ts", guest.mocks).POST(request({ auctionId: valid.id }))).status, 401);
});

test("inspection requests retain the buyer, auction, property and tracking reference", async () => {
  const state = setup([valid, ...hidden]);
  const { POST } = loadSource("src/app/api/user/requests/route.ts", state.mocks);
  const response = await POST(request({ type: "inspection", auctionId: valid.id, preferredDate: "2099-01-10" }));
  assert.equal(response.status, 200);
  assert.equal((await response.json()).reference, "CA-123456");
  assert.equal(state.writes[0].userId, "buyer-1");
  assert.equal(state.writes[0].auctionId, valid.id);
  assert.equal(state.writes[0].propertyId, valid.propertyId);
  assert.equal(state.writes[0].source, "inspection-request");
  assert.equal((await POST(request({ type: "inspection", auctionId: "draft" }))).status, 404);
  assert.equal((await POST(request({ type: "inspection", auctionId: valid.id, preferredDate: "2099-02-30" }))).status, 400);
  assert.equal(state.writes.length, 1);
});

test("contact-team requests retain the property context and provide a tracking reference", async () => {
  const state = setup([valid]);
  const { POST } = loadSource("src/app/api/user/requests/route.ts", state.mocks);
  const response = await POST(request({ type: "support", auctionId: valid.id, message: "Please share more details about this property." }));
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.reference, "CA-123456");
  assert.match(body.message, /Message sent/);
  assert.equal(state.writes[0].auctionId, valid.id);
  assert.equal(state.writes[0].propertyId, valid.propertyId);
  assert.equal(state.writes[0].userId, "buyer-1");
  assert.equal(state.writes[0].pagePath, `/auctions/${valid.id}`);
  assert.match(state.writes[0].subject, /Property enquiry:/);
});

test("property enquiries retain canonical property details and reject hidden listings", async () => {
  const state = setup([valid, ...hidden]);
  const { POST } = loadSource("src/app/api/enquiries/route.ts", state.mocks);
  const body = { source: "contact", name: "Example Buyer", phone: "9876543210", auctionId: valid.id, fields: { Property: "forged title" } };
  const response = await POST(request(body));
  assert.equal(response.status, 200);
  assert.equal(state.writes[0].auctionId, valid.id);
  assert.equal(state.writes[0].propertyId, valid.propertyId);
  assert.equal(state.writes[0].metadata.Property, valid.property.title);
  assert.equal(state.writes[0].metadata["Auction number"], valid.auctionNumber);
  assert.equal((await POST(request({ ...body, auctionId: "draft" }))).status, 404);
  assert.equal(state.writes.length, 1);
});

test("buyer matches apply the same publication rules as public search", async () => {
  const state = setup([valid, ...hidden]);
  const { matchesForRequirement } = loadSource("src/lib/matching.ts", state.mocks);
  const rows = await matchesForRequirement({ assetClasses: ["INDUSTRIAL"], cities: ["Surat"], budgetRange: null, minBudget: 0, maxBudget: 3000000 });
  assert.deepEqual(rows.map((r) => r.id), ["published"]);
});

test("source-checked historical notices remain searchable by explicit status", async () => {
  const rows = [valid, fixture("closed", { status: "CLOSED" }), fixture("cancelled", { status: "CANCELLED" })];
  assert.deepEqual(ids(await setup(rows).service.getAuctions({ status: "CLOSED" })), ["closed"]);
});

test("registration preserves the listing return path and records buyer consent", async () => {
  const state = setup([], false);
  const events = [];
  const account = { id: "new-buyer", email: "buyer@example.test", mobile: "+919876543210", fullName: "New Buyer", accountType: "INDIVIDUAL", sessionVersion: 0, roles: [] };
  state.db.user.findUnique = async () => null;
  state.db.user.create = async (query) => { state.writes.push(query.data); return account; };
  state.db.consentEvent = { create: async (q) => events.push(q.data), createMany: async (q) => events.push(...q.data) };
  state.db.$transaction = async (fn) => fn(state.db);
  const verified = [];
  state.mocks["next/headers"] = { cookies: async () => ({ get: () => undefined }) };
  state.mocks["@/lib/otp"] = { OtpError: class extends Error {}, verifyOtp: async (...args) => { verified.push(args); if (args[4]) await state.db.$transaction(args[4]); } };
  state.mocks["@/lib/auth"] = { hashPassword: async () => "registration-hash", COOKIE_NAME: "cityauction_auth_token", signToken: async () => "registered-session", isAdmin: () => false };
  const { POST } = loadSource("src/app/api/auth/register/route.ts", state.mocks);
  const response = await POST(request({ fullName: "New Buyer", email: "buyer@example.test", password: "new-password", confirmPassword: "new-password", buyerCategory: "INDIVIDUAL_BUYER", acceptTerms: true, challengeId: "challenge-1", otp: "123456", onboarded: true, next: "/auctions/published" }));
  assert.equal(response.status, 200);
  assert.equal((await response.json()).redirectTo, "/auctions/published");
  assert.equal(verified[0][2], "register");
  assert.equal(state.writes[0].phone, null);
  assert.equal(state.writes[0].isEmailVerified, true);
  assert.equal(events.filter((e) => e.kind === "TERMS_PRIVACY" && e.granted).length, 1);
  assert.match(response.headers.get("set-cookie"), /registered-session/);
});

test("OTP login returns the buyer to their listing and blocks external redirects", async () => {
  for (const [next, expected] of [["/auctions/published", "/auctions/published"], ["https://other.example", "/dashboard"]]) {
    const state = setup();
    state.db.user.findUnique = async () => ({ id: "buyer-1", email: "buyer@example.test", mobile: "+919876543210", fullName: "Buyer", accountType: "INDIVIDUAL", sessionVersion: 0, roles: [], isActive: true, deletedAt: null, isEmailVerified: true });
    state.db.user.updateMany = async () => ({ count: 1 });
    state.db.$transaction = async (fn) => fn(state.db);
    state.mocks["@/lib/otp"] = { OtpError: class extends Error {}, verifyOtp: async (...args) => { if (args[4]) await state.db.$transaction(args[4]); } };
    state.mocks["@/lib/auth"] = { COOKIE_NAME: "cityauction_auth_token", signToken: async () => "login-session", isAdmin: () => false };
    const { POST } = loadSource("src/app/api/auth/login-otp/route.ts", state.mocks);
    const response = await POST(request({ email: "buyer@example.test", challengeId: "challenge-1", otp: "123456", next }));
    assert.equal(response.status, 200);
    assert.equal((await response.json()).redirectTo, expected);
  }
});

test("ending-soon searches exclude expired, closed and cancelled notices", async () => {
  const rows = [
    fixture("upcoming"),
    fixture("expired", { endDateTime: date("2020-01-01") }),
    fixture("closed", { status: "CLOSED" }),
    fixture("cancelled", { status: "CANCELLED" }),
    fixture("sold", { status: "SOLD" }),
  ];
  assert.deepEqual(ids(await setup(rows).service.getAuctions({ sort: "closing_soon" })), ["upcoming"]);
  assert.equal((await setup(rows).service.getAuctions({ sort: "closing_soon", status: "CLOSED" })).data.length, 0);
  assert.deepEqual(ids(await setup(rows).service.getAuctions({ status: "CLOSED" })), ["closed"]);
});
