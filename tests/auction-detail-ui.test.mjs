import assert from "node:assert/strict";
import { test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadSource } from "./helpers/source-loader.mjs";

const detail = loadSource("src/lib/auction-detail.ts");
const now = Date.parse("2029-12-01T00:00:00Z");
const auction = {
  id: "notice-1", auctionNumber: "CA-1", title: "Industrial unit in Surat", categoryName: "Industrial", categoryType: "INDUSTRIAL", city: "Surat", state: "Gujarat", organizationName: "Example Bank",
  status: "UPCOMING", auctionType: "DRT", possessionStatus: "SYMBOLIC", reservePrice: "2500000.5", emd: "123456", bidIncrement: "4321",
  startDateTime: "2030-01-02T04:00:00Z", endDateTime: "2030-01-02T10:00:00Z", submissionDeadline: "2029-12-30T10:30:00Z", inspectionDate: "2029-12-28T04:30:00Z",
  primaryImage: null, images: [], sourceListingId: "notice-reference-123", sourceVerifiedAt: "2026-10-01T00:00:00Z", address: "GIDC Road", description: "A recorded property description.", terms: "Terms in the published notice.", area: 1800, areaUnit: "sq m",
  documents: [{ name: "Official auction notice", type: "NOTICE", size: "20 KB", url: "https://notice.example/notice.pdf" }],
  organization: { name: "Example Bank", website: "https://bank.example", logo: null }, contactOfficerName: "Officer name", contactOfficerPhone: "+91 98765 43210", contactOfficerEmail: "officer@example.test",
};

for (const url of ["javascript:alert(1)", "data:text/html,test", "//other.example/file", "https://user:secret@other.example", "/\\other.example", "http://other.example/file", "https://example.test/\nfile", ""]) {
  test(`unsafe or unusable notice links are not rendered: ${JSON.stringify(url)}`, () => assert.equal(detail.safeAuctionUrl(url), null));
}
test("safe public document links and image deduplication preserve real URLs", () => {
  assert.equal(detail.safeAuctionUrl("https://bank.example/notice.pdf"), "https://bank.example/notice.pdf");
  assert.equal(detail.safeAuctionUrl("/uploads/notice.pdf"), "/uploads/notice.pdf");
  assert.deepEqual(Array.from(detail.auctionImages(["", "/photo.jpg", "/photo.jpg", "javascript:alert(1)"], "/primary.jpg")), ["/primary.jpg", "/photo.jpg"]);
});

test("inspection availability follows recorded deadlines and explicit terminal states", () => {
  assert.equal(detail.auctionAvailability(auction, now).canInspect, true);
  for (const status of ["CANCELLED", "SOLD", "CLOSED"]) assert.equal(detail.auctionAvailability({ ...auction, status }, now).canInspect, false);
  assert.equal(detail.auctionAvailability(auction, Date.parse("2030-01-02T11:00:00Z")).title, "Auction date has passed");
  assert.equal(detail.auctionAvailability(auction, Date.parse("2029-12-30T10:30:00Z")).title, "Submission deadline has passed");
  assert.equal(detail.auctionAvailability({ ...auction, endDateTime: "invalid" }, now).canInspect, false);
  assert.equal(detail.auctionAvailability({ ...auction, submissionDeadline: "2030-01-04" }, now).canInspect, false);
});

test("preferred inspection dates respect today in IST and the submission day", () => {
  const clock = Date.parse("2029-12-01T20:00:00Z"); // Already 2 December in India.
  assert.match(detail.inspectionDateError(auction, "2029-12-01", clock), /today/);
  assert.equal(detail.inspectionDateError(auction, "2029-12-02", clock), null);
  assert.equal(detail.inspectionDateError(auction, "2029-12-30", clock), null);
  assert.match(detail.inspectionDateError(auction, "2029-12-31", clock), /submission deadline/);
  assert.equal(detail.inspectionDateError(auction, undefined, clock), null);
});

const Link = ({ href, children, ...props }) => React.createElement("a", { href, ...props }, children);
const mocks = {
  "next/link": Link,
  "@/components/account/save-listing-button": { SaveListingButton: () => React.createElement("button", null, "Save property") },
  "@/components/account/property-request": { PropertyRequest: () => React.createElement("button", null, "Contact team") },
  "@/components/account/inspection-request": { InspectionRequest: () => React.createElement("button", null, "Request inspection") },
};
function markup(changes = {}) {
  const { AuctionDetailClient } = loadSource("src/components/auction/auction-detail-client.tsx", mocks);
  return renderToStaticMarkup(React.createElement(AuctionDetailClient, { auction: { ...auction, ...changes }, initialNow: now }));
}

test("detail shows recorded amounts and IST times without fabricated percentage, hours or increments", () => {
  const html = markup();
  for (const text of ["₹25,00,000.50", "₹1,23,456.00", "₹4,321.00", "09:30 am IST", "03:30 pm IST", "04:00 pm IST", "Symbolic Possession", "1,800 sq m"]) assert.ok(html.includes(text), text);
  assert.doesNotMatch(html, /EMD \(10%\)|11:00 AM|05:00 PM|₹50,000|coming soon|SARFAESI Ref/);
  assert.match(html, /Request inspection/);
});

test("detail has a single H1, working section links and unique IDs", () => {
  const html = markup();
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(ids.length, new Set(ids).size);
  for (const match of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(match[1]), match[1]);
  assert.doesNotMatch(html, /<main\b/);
  assert.match(html, /Auction contact/);
});

for (const status of ["CLOSED", "SOLD", "CANCELLED"]) {
  test(`${status} notices remain useful references without offering inspections`, () => {
    const html = markup({ status });
    assert.doesNotMatch(html, /Request inspection/); assert.match(html, /Contact team/); assert.match(html, /Save property/);
    assert.match(html, /inspection requests are unavailable/);
  });
}

test("missing information is explicit and no blank images, phone links or documents are invented", () => {
  const html = markup({ description: "", terms: "", address: "", area: 0, bidIncrement: "", documents: [], contactOfficerPhone: "", contactOfficerEmail: "", inspectionDate: "" });
  for (const text of ["Property photos not available", "No public documents have been supplied", "full property address has not been supplied", "Officer contact details have not been supplied", "Not provided"]) assert.ok(html.includes(text), text);
  assert.doesNotMatch(html, /src=""|href="tel:|href="mailto:|Photo 1 of 1|Format: PDF/);
});

test("document links identify a new tab and invalid URLs become unavailable messages", () => {
  const html = markup({ documents: [...auction.documents, { name: "Invalid file", size: "", url: "javascript:alert(1)" }] });
  assert.match(html, /Open Official auction notice \(new tab\)/); assert.match(html, /rel="noopener noreferrer"/);
  assert.match(html, /Document link unavailable/); assert.doesNotMatch(html, /javascript:|Format: PDF|Download/);
});

function find(node, predicate) {
  if (!node || typeof node !== "object") return null;
  if (predicate(node)) return node;
  for (const child of React.Children.toArray(node.props?.children)) { const result = find(child, predicate); if (result) return result; }
  return null;
}
function hooks() {
  const slots = []; let cursor = 0;
  return { reset: () => { cursor = 0; }, react: { ...React,
    useState: (initial) => { const key = cursor++; if (!(key in slots)) slots[key] = typeof initial === "function" ? initial() : initial; return [slots[key], (value) => { slots[key] = typeof value === "function" ? value(slots[key]) : value; }]; },
    useEffect() {}, useId: () => "gallery-heading", useRef: () => ({ current: null }),
  } };
}

test("gallery supports next/previous wrapping, broken-image fallback and an accessible enlarged viewer", () => {
  const state = hooks();
  const { PropertyGallery } = loadSource("src/components/auction/property-gallery.tsx", { react: state.react, "react-dom": { createPortal: (children) => children } }, { document: { body: {} } });
  const render = () => { state.reset(); return PropertyGallery({ images: ["/first.jpg", "/second.jpg"], primaryImage: null, title: "Property" }); };
  assert.equal(find(render(), (node) => node.type === "img").props.src, "/first.jpg");
  find(render(), (node) => node.props?.["aria-label"] === "Next property photo").props.onClick();
  assert.equal(find(render(), (node) => node.type === "img").props.src, "/second.jpg");
  find(render(), (node) => node.props?.["aria-label"] === "Previous property photo").props.onClick();
  assert.equal(find(render(), (node) => node.type === "img").props.src, "/first.jpg");
  find(render(), (node) => node.props?.["aria-label"] === "Enlarge property photo").props.onClick();
  assert.equal(find(render(), (node) => node.props?.role === "dialog").props["aria-modal"], "true");
  find(render(), (node) => node.props?.["aria-label"] === "Close photo viewer").props.onClick();
  assert.equal(find(render(), (node) => node.props?.role === "dialog"), null);
  find(render(), (node) => node.type === "img").props.onError();
  assert.ok(find(render(), (node) => node.type === "p" && node.props.children === "This photo couldn’t be loaded"));
});

for (const mode of ["clipboard", "failure", "native", "cancelled"]) {
  test(`sharing handles ${mode} without copying login/action query parameters`, async () => {
    const state = hooks(); const shares = [];
    const navigator = mode === "native" || mode === "cancelled" ? { share: async (data) => { if (mode === "cancelled") { const error = new Error("cancelled"); error.name = "AbortError"; throw error; } shares.push(data.url); } } : { clipboard: { writeText: async (url) => { if (mode === "failure") throw new Error("Permission denied"); shares.push(url); } } };
    const { AuctionDetailClient } = loadSource("src/components/auction/auction-detail-client.tsx", { ...mocks, react: state.react }, { Error, navigator, window: { location: { origin: "https://cityauction.test", href: "https://cityauction.test/auctions/notice-1?action=save#property-save" } } });
    const render = () => { state.reset(); return AuctionDetailClient({ auction, initialNow: now }); };
    const button = find(render(), (node) => node.type === "button" && node.props.children.includes("Share"));
    // The UI wraps its async handler, so flush its settled microtasks before inspecting the next render.
    button.props.onClick(); await new Promise((resolve) => setImmediate(resolve));
    if (mode === "clipboard" || mode === "native") assert.deepEqual(shares, ["https://cityauction.test/auctions/notice-1"]);
    if (mode === "failure") assert.equal(find(render(), (node) => node.type === "input" && node.props.readOnly)?.props.value, "https://cityauction.test/auctions/notice-1");
    if (mode === "cancelled") assert.equal(find(render(), (node) => node.props?.role === "status" && typeof node.props.children === "string"), null);
  });
}
