import assert from "node:assert/strict";
import { test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadSource } from "./helpers/source-loader.mjs";

function overviewSetup(failure) {
  const calls = [];
  const query = (section, value) => async (args) => {
    calls.push({ section, ...args });
    if (failure === section) throw new Error(`${section} unavailable`);
    return value;
  };
  const db = {
    favourite: { count: query("saved", 2), findMany: query("saved", [{ auction: { id: "saved-a" } }]) },
    enquiry: { count: query("enquiries", 3), findMany: query("enquiries", [{ id: "request-a" }]) },
  };
  const matching = { matchInclude: {}, matchesForUser: async (userId, take) => {
    calls.push({ section: "matches", userId, take });
    if (failure === "matches") throw new Error("matching unavailable");
    return { total: 4, requirements: [{ id: "requirement-a" }], auctions: [{ id: "match-a" }] };
  } };
  return { calls, ...loadSource("src/lib/dashboard-overview.ts", { "./db": { db }, "./matching": matching }) };
}

test("dashboard counts and previews cover saved properties, enquiries and matches", async () => {
  const state = overviewSetup();
  const result = await state.loadDashboardOverview("buyer-a", "verified@example.test");
  assert.equal(result.saved.count, 2);
  assert.equal(result.saved.auctions[0].id, "saved-a");
  assert.equal(result.enquiries.count, 3);
  assert.equal(result.matches.total, 4);
  assert.equal(state.calls.find((call) => call.section === "matches").userId, "buyer-a");
  assert.equal(state.calls.find((call) => call.section === "saved").where.userId, "buyer-a");
});

for (const failure of ["saved", "enquiries", "matches"]) {
  test(`a ${failure} outage does not hide the other dashboard sections`, async () => {
    const result = await overviewSetup(failure).loadDashboardOverview("buyer-a");
    assert.equal(result[failure], null);
    for (const section of ["saved", "enquiries", "matches"].filter((value) => value !== failure)) assert.notEqual(result[section], null);
  });
}

test("enquiry totals and previews share the same verified-owner scope", async () => {
  const state = overviewSetup();
  await state.loadDashboardOverview("buyer-a", "verified@example.test");
  const enquiries = state.calls.filter((call) => call.section === "enquiries");
  assert.equal(enquiries.length, 2);
  for (const call of enquiries) {
    assert.equal(JSON.stringify(call.where), JSON.stringify({ OR: [{ userId: "buyer-a" }, { email: "verified@example.test" }] }));
  }
  const unverified = overviewSetup();
  await unverified.loadDashboardOverview("buyer-a");
  assert.equal(JSON.stringify(unverified.calls.find((call) => call.section === "enquiries").where), JSON.stringify({ OR: [{ userId: "buyer-a" }] }));
});

const Link = ({ href, children, ...props }) => React.createElement("a", { href, ...props }, children);

for (const admin of [false, true]) {
  test(`dashboard navigation exposes ready sections only (admin: ${admin})`, () => {
    const { DashboardShell } = loadSource("src/components/account/dashboard-shell.tsx", {
      "next/link": Link,
      "next/navigation": { usePathname: () => "/dashboard/requirements" },
      "./logout-button": { LogoutButton: () => React.createElement("button", null, "Log out") },
    });
    const html = renderToStaticMarkup(React.createElement(DashboardShell, { name: "Buyer", email: "buyer@example.test", initials: "B", admin }, "Dashboard content"));
    for (const path of ["/dashboard/favourites", "/dashboard/requests", "/dashboard/matches", "/dashboard/profile"]) assert.ok(html.includes(`href="${path}"`));
    for (const path of ["/dashboard/notifications", "/dashboard/payments", "/dashboard/kyc", "/dashboard/bids", "/dashboard/documents", "/dashboard/applications"]) assert.ok(!html.includes(`href="${path}"`));
    assert.match(html, /aria-current="page"[^>]*>.*?Matching opportunities/s);
    assert.equal(html.includes('href="/admin/dashboard"'), admin);
  });
}

test("an unavailable dashboard section never pretends to be an empty account", async () => {
  const { default: DashboardPage } = loadSource("src/app/dashboard/page.tsx", {
    "next/link": Link,
    "@/lib/dashboard-overview": { loadDashboardOverview: async () => ({ saved: null, enquiries: { count: 0, recent: [] }, matches: { total: 0, requirements: [], auctions: [] } }) },
    "@/components/account/dashboard-data": { getAccount: async () => ({ session: { userId: "buyer-a", fullName: "Buyer" }, user: null, dbError: false }) },
    "@/components/account/dashboard-ui": { DbErrorNote: () => React.createElement("p", { role: "alert" }, "Account details unavailable"), Panel: ({ title, children }) => React.createElement("section", null, React.createElement("h2", null, title), children) },
    "@/components/account/listing-row": { ListingRow: () => null },
  });
  const html = renderToStaticMarkup(await DashboardPage());
  assert.match(html, /saved properties couldn’t be loaded/);
  assert.doesNotMatch(html, /No saved properties yet|Active alerts|Profile completeness/);
  assert.match(html, /No enquiries yet/);
  assert.match(html, /What are you looking for/);
});

test("match preferences keep matching fields while hiding unfinished alert controls", () => {
  const forms = loadSource("src/components/account/requirement-form.tsx", {
    "./auth-ui": {
      Field: ({ label }) => React.createElement("label", null, label),
      SelectField: ({ label }) => React.createElement("label", null, label),
      FormAlert: ({ children }) => React.createElement("p", null, children),
      SubmitButton: ({ children }) => React.createElement("button", null, children),
    },
  });
  assert.equal(forms.EMPTY_REQUIREMENT.alertsEnabled, false);
  const formHtml = renderToStaticMarkup(React.createElement(forms.RequirementForm, { hasEmail: true, onSaved() {} }));
  assert.doesNotMatch(formHtml, /Alert me|WhatsApp|Pause alerts|Resume alerts/);
  assert.match(formHtml, /budget/i);
  const { RequirementsManager } = loadSource("src/components/account/requirements-manager.tsx", {
    "next/link": Link,
    "next/navigation": { useRouter: () => ({ refresh() {} }) },
    "./requirement-form": forms,
  });
  const html = renderToStaticMarkup(React.createElement(RequirementsManager, { hasEmail: true, rows: [{ id: "requirement-a", matchCount: 2, values: { ...forms.EMPTY_REQUIREMENT, name: "Surat properties", alertsEnabled: true, alertChannels: ["EMAIL"] } }] }));
  assert.match(html, /2 matching auctions/);
  assert.doesNotMatch(html, /Alerts on|Alerts paused|Pause alerts|Resume alerts/);
  assert.match(html, /Edit/);
});
