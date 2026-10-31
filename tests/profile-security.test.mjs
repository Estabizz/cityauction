import assert from "node:assert/strict";
import { test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadSource } from "./helpers/source-loader.mjs";

const schemas = loadSource("src/lib/profile-schema.ts");
const version = "2026-10-01T00:00:00.000Z";
const profile = { fullName: "Buyer Name", email: "buyer@example.test", phone: "+91 98765 43210", accountType: "INDIVIDUAL", companyName: "", gstNumber: "", buyerCategory: "BUSINESS_BUYER", address: "Gandhinagar", city: "Gandhinagar", state: "Gujarat", pincode: "382007", updatedAt: version };
const password = { currentPassword: "old-password", newPassword: "different-password", confirmPassword: "different-password" };
const req = (body) => new Request("https://cityauction.test/api/user/profile", { method: "PATCH", headers: { origin: "https://cityauction.test", "content-type": "application/json" }, body: JSON.stringify(body) });

for (const changes of [{ fullName: "x" }, { phone: "123" }, { accountType: "ADMIN" }, { accountType: "ORGANIZATION", companyName: "" }, { gstNumber: "wrong" }, { pincode: "<>" }, { updatedAt: "invalid" }]) {
  test(`profile validates supported details: ${JSON.stringify(changes)}`, () => assert.equal(schemas.profileSchema.safeParse({ ...profile, ...changes }).success, false));
}
test("company information is declared metadata and cannot introduce roles or institutional memberships", () => {
  const result = schemas.profileSchema.parse({ ...profile, accountType: "ORGANIZATION", companyName: "Example Bank", roles: ["ADMIN"], organizationId: "bank-owned-by-someone-else" });
  assert.equal(result.companyName, "Example Bank"); assert.equal("roles" in result, false); assert.equal("organizationId" in result, false);
});
for (const changes of [{ confirmPassword: "" }, { confirmPassword: "mismatch" }, { newPassword: "short", confirmPassword: "short" }, { newPassword: "old-password", confirmPassword: "old-password" }, { newPassword: "x".repeat(129), confirmPassword: "x".repeat(129) }]) {
  test(`password validation rejects unsafe input: ${JSON.stringify(changes).slice(0,100)}`, () => assert.equal(schemas.changePasswordSchema.safeParse({ ...password, ...changes }).success, false));
}
function profileApi({ company = null, stale = false, companyRace = false, revoked = false, signedIn = true, origin = true } = {}) {
  let state = { user: { id: "user-1", ...profile, phone: profile.phone, isPhoneVerified: true, isEmailVerified: true, isActive: true, deletedAt: null, sessionVersion: revoked ? 5 : 4, roles: [], bidderProfile: company }, companyWrites: [], userWrites: [] };
  const db = { user: {
    findUnique: async () => state.user,
    updateMany: async ({ where, data }) => { if (stale) return { count: 0 }; state.userWrites.push({ where, data }); Object.assign(state.user, data, { updatedAt: new Date("2026-10-02T00:00:00Z") }); return { count: 1 }; },
    findUniqueOrThrow: async () => state.user,
  }, bidderProfile: {
    create: async ({ data }) => { state.companyWrites.push(data); return data; },
    updateMany: async ({ where, data }) => { state.companyWrites.push({ where, data }); return { count: companyRace ? 0 : 1 }; },
  } };
  db.$transaction = async (work) => { const before = structuredClone(state); try { return await work(db); } catch (error) { state = before; throw error; } };
  const route = loadSource("src/app/api/user/profile/route.ts", {
    "@/lib/db": { db }, "@/lib/auth": { getCurrentUser: async () => signedIn ? { userId: "user-1", sv: 4 } : null },
    "@/lib/same-origin": { isSameOriginRequest: () => origin },
    "@/app/api/auth/_lib": { DB_UNAVAILABLE: "Database unavailable", jsonError: (error, status = 400) => Response.json({ success: false, error }, { status }), userWithRoles: {}, setSessionCookie: async () => {}, toSessionPayload: (user) => ({ roles: user.roles }) },
  });
  return { route, state: () => state };
}
test("profile updates are scoped to the session and changing contact phone resets its verification", async () => {
  const h = profileApi(); const response = await h.route.PATCH(req({ ...profile, userId: "victim", phone: "+919999988888", roles: ["ADMIN"] }));
  assert.equal(response.status, 200); assert.equal(h.state().userWrites[0].where.id, "user-1");
  assert.equal(h.state().userWrites[0].data.isPhoneVerified, false); assert.equal("roles" in h.state().userWrites[0].data, false);
});
test("company profiles can be saved without granting bank or admin access", async () => {
  const h = profileApi(); const response = await h.route.PATCH(req({ ...profile, accountType: "ORGANIZATION", companyName: "Example Bank" }));
  assert.equal(response.status, 200); assert.equal(h.state().companyWrites[0].companyName, "Example Bank");
  assert.equal("status" in h.state().companyWrites[0], false); assert.deepEqual(h.state().user.roles, []);
});
test("reviewed company details remain locked while personal details can still be changed", async () => {
  const company = { companyName: "Reviewed Company", gstNumber: "", status: "APPROVED", updatedAt: new Date(version) };
  const h = profileApi({ company });
  const denied = await h.route.PATCH(req({ ...profile, companyName: "Changed Company" })); assert.equal(denied.status, 409); assert.equal(h.state().userWrites.length, 0);
  const allowed = await h.route.PATCH(req({ ...profile, companyName: "Reviewed Company", fullName: "Updated person" })); assert.equal(allowed.status, 200); assert.equal(h.state().companyWrites.length, 0);
});
test("stale profile edits and a concurrent company review do not overwrite current data", async () => {
  const stale = profileApi({ stale: true }); assert.equal((await stale.route.PATCH(req(profile))).status, 409); assert.equal(stale.state().userWrites.length, 0);
  const race = profileApi({ company: { companyName: "", gstNumber: "", status: "INCOMPLETE", updatedAt: new Date(version) }, companyRace: true });
  assert.equal((await race.route.PATCH(req({ ...profile, fullName: "Unsaved name" }))).status, 409); assert.equal(race.state().user.fullName, profile.fullName);
});
test("profile endpoints require authentication, correct origin and verified email ownership", async () => {
  assert.equal((await profileApi({ signedIn: false }).route.PATCH(req(profile))).status, 401);
  assert.equal((await profileApi({ origin: false }).route.PATCH(req(profile))).status, 403);
  const h = profileApi(); assert.equal((await h.route.PATCH(req({ ...profile, email: "someone-else@example.test" }))).status, 400); assert.equal(h.state().userWrites.length, 0);
});

const Link = ({ href, children, ...props }) => React.createElement("a", { href, ...props }, children);
const nav = { useRouter: () => ({ refresh() {} }) };
test("profile form has associated field labels and clearly separates company details from access permissions", () => {
  const { ProfileForm } = loadSource("src/components/account/profile-forms.tsx", { "next/navigation": nav, "next/link": Link });
  const html = renderToStaticMarkup(React.createElement(ProfileForm, { initial: { ...profile, accountType: "ORGANIZATION", companyName: "Company" }, emailVerified: true }));
  for (const name of ["companyName", "gstNumber", "address", "pincode", "phone", "accountType"]) assert.ok(html.includes(`id="${name}"`));
  assert.match(html, /do not grant institution or admin access/);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]); assert.equal(ids.length, new Set(ids).size);
  for (const match of html.matchAll(/for="([^"]+)"/g)) assert.ok(ids.includes(match[1]));
});
test("password confirmation stays masked without a reveal button", () => {
  const { ChangePasswordForm } = loadSource("src/components/account/profile-forms.tsx", { "next/navigation": nav, "next/link": Link });
  const html = renderToStaticMarkup(React.createElement(ChangePasswordForm));
  assert.match(html, /id="confirmPassword"[^>]*type="password"|type="password"[^>]*id="confirmPassword"/);
  assert.doesNotMatch(html, /aria-controls="confirmPassword"/); assert.match(html, /aria-controls="newPassword"/);
});

function find(node, predicate) {
  if (!node || typeof node !== "object") return null; if (predicate(node)) return node;
  for (const child of React.Children.toArray(node.props?.children)) { const found = find(child, predicate); if (found) return found; }
  return null;
}
function formHarness(component, initial, resultPromise) {
  const states = [], refs = []; let cursor = 0, refCursor = 0; const calls = [];
  const fake = { ...React, useEffect() {}, useState: (value) => { const key = cursor++; if (!(key in states)) states[key] = key === 0 ? initial : value; return [states[key], (value) => { states[key] = typeof value === "function" ? value(states[key]) : value; }]; }, useRef: (value) => refs[refCursor++] ??= { current: value } };
  const module = loadSource("src/components/account/profile-forms.tsx", { react: fake, "next/navigation": nav, "next/link": Link,
    "./auth-ui": { postJson: async (...args) => { calls.push(args); return await resultPromise; }, Field: () => null, SelectField: () => null, SubmitButton: () => null, FormAlert: () => null } });
  const render = () => { cursor = 0; refCursor = 0; return module[component](component === "ProfileForm" ? { initial, emailVerified: true } : {}); };
  return { render, calls, submit: () => render().props.onSubmit({ preventDefault() {} }), values: () => states[0] };
}
test("profile save suppresses repeated submissions and retains edits after a server failure", async () => {
  let finish; const h = formHarness("ProfileForm", profile, new Promise((resolve) => { finish = resolve; }));
  const first = h.submit(), second = h.submit(); assert.equal(h.calls.length, 1);
  finish({ ok: false, data: { error: "Offline" } }); await Promise.all([first, second]); assert.equal(h.values().fullName, profile.fullName);
});
test("password changes clear inputs only after confirmed success", async () => {
  for (const ok of [true, false]) {
    const h = formHarness("ChangePasswordForm", password, Promise.resolve({ ok, data: { error: "Incorrect password" } }));
    await h.submit(); assert.equal(h.calls.length, 1); assert.equal(h.values().newPassword, ok ? "" : password.newPassword);
  }
});

test("an in-flight profile save cannot issue a replacement session after logout everywhere", async () => {
  const h = profileApi({ revoked: true });
  assert.equal((await h.route.PATCH(req(profile))).status, 401); assert.equal(h.state().userWrites.length, 0);
});
