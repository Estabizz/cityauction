import assert from "node:assert/strict";
import { test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadSource } from "./helpers/source-loader.mjs";

const EMAIL = "buyer@example.test";
const env = { NODE_ENV: "production", AUTH_SECRET: "password-journey-test-secret-at-least-32-characters" };
const request = (body) => new Request("http://internal:3000/api/auth/reset-password", {
  method: "POST", headers: { Origin: "https://cityauction.in", "Content-Type": "application/json" }, body: JSON.stringify(body),
});

function resetSetup() {
  const rows = new Map();
  let cookie;
  const user = { id: "buyer-1", email: EMAIL, isActive: true, deletedAt: null, isEmailVerified: true, sessionVersion: 2, passwordHash: null };
  const matches = (row, where) => Object.entries(where).every(([key, rule]) => {
    if (key === "expiresAt") return row.expiresAt > rule.gt;
    return row[key] === rule;
  });
  const db = {
    user: {
      async findUnique({ where }) { return matches(user, where) ? { ...user } : null; },
      async updateMany({ where, data }) {
        if (!matches(user, where)) return { count: 0 };
        for (const [key, value] of Object.entries(data)) user[key] = value && typeof value === "object" && "increment" in value ? user[key] + value.increment : value;
        return { count: 1 };
      },
    },
    emailOtpChallenge: {
      async create({ data }) { const row = { consumedAt: null, ...data }; rows.set(row.id, row); return row; },
      async findUnique({ where }) { return rows.get(where.id) || null; },
      async updateMany({ where, data }) {
        let count = 0;
        for (const row of rows.values()) if (matches(row, where)) { Object.assign(row, data); count++; }
        return { count };
      },
    },
  };
  db.$transaction = async (fn) => {
    const beforeRows = structuredClone([...rows]); const beforeUser = { ...user };
    try { return await fn(db); }
    catch (error) { rows.clear(); beforeRows.forEach(([id, row]) => rows.set(id, row)); Object.assign(user, beforeUser); throw error; }
  };
  const mocks = {
    "./db": { db }, "@/lib/db": { db },
    "next/headers": { cookies: async () => ({ get: (name) => name === "cityauction_password_reset" && cookie ? { value: cookie } : undefined }) },
    "./email-verification": {
      verifyEmailChallenge: async (proof, email, purpose, onVerified) => {
        if (proof.phoneEmailToken !== "a".repeat(64) || email !== EMAIL || purpose !== "reset-password") throw new Error("invalid email proof");
        await db.$transaction(onVerified);
      },
    },
    "@/lib/auth": { hashPassword: async (password) => `hashed:${password}`, COOKIE_NAME: "cityauction_auth_token" },
  };
  const source = (file) => loadSource(file, mocks, { process: { env } });
  const proof = source("src/lib/password-reset-proof.ts");
  const verifyRoute = source("src/app/api/auth/reset-password/verify/route.ts");
  const resetRoute = source("src/app/api/auth/reset-password/route.ts");
  async function issue() {
    const response = await verifyRoute.POST(request({ email: EMAIL, phoneEmailToken: "a".repeat(64) }));
    assert.equal(response.status, 200);
    cookie = response.cookies.get("cityauction_password_reset").value;
    return { response, token: (await response.json()).resetToken };
  }
  return { rows, user, db, proof, verifyRoute, resetRoute, issue, setCookie: (value) => { cookie = value; } };
}

const passwordInput = (token) => ({ email: EMAIL, password: "fresh-password-123", confirmPassword: "fresh-password-123", resetToken: token });

test("verified email creates a short-lived HttpOnly browser-bound reset grant without changing the password", async () => {
  const state = resetSetup();
  const { response, token } = await state.issue();
  assert.match(token, /^[a-f0-9]{64}$/);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.match(response.headers.get("set-cookie"), /HttpOnly/);
  assert.match(response.headers.get("set-cookie"), /SameSite=strict/i);
  assert.match(response.headers.get("set-cookie"), /Max-Age=300/);
  assert.equal(state.user.passwordHash, null);
  assert.ok(!state.rows.has(token)); // The database holds only a digest.
});

test("an OTP-only account can set its first password after email verification", async () => {
  const state = resetSetup(); const { token } = await state.issue();
  const response = await state.resetRoute.POST(request(passwordInput(token)));
  assert.equal(response.status, 200);
  assert.equal(state.user.passwordHash, "hashed:fresh-password-123");
  assert.equal(state.user.sessionVersion, 3);
  assert.match(response.headers.get("set-cookie"), /Max-Age=0/);
  assert.notEqual((await state.resetRoute.POST(request(passwordInput(token)))).status, 200);
});

for (const scenario of ["missing-cookie", "different-browser", "expired", "different-email", "changed-account", "already-used"]) {
  test(`reset grant rejects ${scenario}`, async () => {
    const state = resetSetup(); const { token } = await state.issue();
    const row = [...state.rows.values()][0];
    if (scenario === "missing-cookie") state.setCookie(undefined);
    if (scenario === "different-browser") state.setCookie("b".repeat(64));
    if (scenario === "expired") row.expiresAt = new Date(0);
    if (scenario === "different-email") row.email = "another@example.test";
    if (scenario === "changed-account") state.user.sessionVersion++;
    if (scenario === "already-used") row.consumedAt = new Date();
    const response = await state.resetRoute.POST(request(passwordInput(token)));
    assert.equal(response.status, 400); assert.equal(state.user.passwordHash, null);
  });
}

test("mismatched reset passwords preserve the grant for correction", async () => {
  const state = resetSetup(); const { token } = await state.issue();
  const response = await state.resetRoute.POST(request({ ...passwordInput(token), confirmPassword: "different-password" }));
  assert.equal(response.status, 400);
  assert.equal([...state.rows.values()][0].consumedAt, null);
  assert.equal((await state.resetRoute.POST(request(passwordInput(token)))).status, 200);
});

test("failed password writes roll back grant consumption for a retry", async () => {
  const state = resetSetup(); const { token } = await state.issue();
  const update = state.db.user.updateMany;
  state.db.user.updateMany = async () => { throw new Error("database unavailable"); };
  assert.equal((await state.resetRoute.POST(request(passwordInput(token)))).status, 503);
  assert.equal([...state.rows.values()][0].consumedAt, null);
  state.db.user.updateMany = update;
  assert.equal((await state.resetRoute.POST(request(passwordInput(token)))).status, 200);
});

test("concurrent password reset submissions can consume a grant only once", async () => {
  const state = resetSetup(); const { token } = await state.issue();
  // Keep the transaction mock serialized like conditional row updates in MySQL.
  let pending = Promise.resolve();
  const transaction = state.db.$transaction;
  state.db.$transaction = (fn) => { const run = pending.then(() => transaction(fn)); pending = run.catch(() => {}); return run; };
  const responses = await Promise.all([state.resetRoute.POST(request(passwordInput(token))), state.resetRoute.POST(request(passwordInput(token)))]);
  assert.deepEqual(responses.map((r) => r.status).sort(), [200, 400]);
});

test("cross-origin recovery cannot issue a reset grant", async () => {
  const state = resetSetup();
  const req = new Request("http://internal:3000/api/auth/reset-password/verify", { method: "POST", headers: { Origin: "https://attacker.test", "Content-Type": "application/json" }, body: JSON.stringify({ email: EMAIL, phoneEmailToken: "a".repeat(64) }) });
  assert.equal((await state.verifyRoute.POST(req)).status, 403); assert.equal(state.rows.size, 0);
});

test("invalid email proof cannot issue a reset grant", async () => {
  const state = resetSetup();
  const response = await state.verifyRoute.POST(request({ email: EMAIL, phoneEmailToken: "b".repeat(64) }));
  assert.notEqual(response.status, 200); assert.equal(state.rows.size, 0);
});

test("registration requires matching passwords before touching the database", async () => {
  const touched = [];
  const { POST } = loadSource("src/app/api/auth/register/route.ts", {
    "@/lib/db": { db: { user: { findUnique: async () => touched.push(true) } } },
    "./db": { db: {} },
    "@/lib/auth": { hashPassword: async () => "hash" },
  });
  for (const passwordFields of [{}, { password: "short", confirmPassword: "short" }, { password: "long-enough", confirmPassword: "different" }]) {
    const response = await POST(request({ email: EMAIL, fullName: "Buyer", buyerCategory: "INDIVIDUAL_BUYER", acceptTerms: true, ...passwordFields }));
    assert.equal(response.status, 400);
  }
  assert.equal(touched.length, 0);
});

const Link = ({ href, children, ...props }) => React.createElement("a", { href, ...props }, children);
const ui = loadSource("src/components/account/auth-ui.tsx", { "next/link": Link });

test("only the primary password field has an eye toggle; confirmation stays masked", () => {
  const html = renderToStaticMarkup(React.createElement("div", null,
    React.createElement(ui.Field, { id: "password", label: "Password", type: "password" }),
    React.createElement(ui.Field, { id: "confirm", label: "Confirm password", type: "password", allowReveal: false }),
  ));
  assert.equal((html.match(/aria-label="Show password"/g) || []).length, 1);
  assert.match(html, /id="confirm"[^>]*type="password"/);
  assert.match(html, /aria-controls="password"/);
  assert.doesNotMatch(html, /allowReveal/);
});

for (const view of ["login", "register"]) {
  test(`unified ${view} has the requested password controls`, () => {
    const { AccountAccess } = loadSource("src/components/account/account-access.tsx", {
      "next/link": Link,
      "@/components/layout/header": { AccountHeader: () => null },
      "@/components/buyer/callback-form": { CallbackForm: () => null },
    });
    const html = renderToStaticMarkup(React.createElement(AccountAccess, { initialView: view }));
    assert.match(html, /id="account-password"[^>]*type="password"/);
    assert.equal((html.match(/aria-label="Show password"/g) || []).length, 1);
    if (view === "register") assert.match(html, /id="account-confirm-password"[^>]*type="password"/);
    else { assert.match(html, /Forgot password\?/); assert.doesNotMatch(html, /id="account-confirm-password"/); }
    assert.doesNotMatch(html, /No password needed/);
  });
}

test("forgot password begins with email, before asking for a new password", () => {
  const { ForgotPasswordForm } = loadSource("src/components/account/forgot-password-form.tsx", { "next/link": Link });
  const html = renderToStaticMarkup(React.createElement(ForgotPasswordForm));
  assert.match(html, /Registered email address/);
  assert.doesNotMatch(html, /id="new-password"|id="confirm-password"/);
});

test("the eye toggles the primary password while confirmation stays masked even when reveal state is true", () => {
  let visible = false;
  const { Field } = loadSource("src/components/account/auth-ui.tsx", {
    "next/link": Link,
    react: { ...React, useState: () => [visible, (updater) => { visible = updater(visible); }] },
  });
  const props = { id: "primary", label: "Password", type: "password" };
  const find = (element, type) => {
    if (!React.isValidElement(element)) return undefined;
    if (element.type === type) return element;
    for (const child of React.Children.toArray(element.props.children)) { const found = find(child, type); if (found) return found; }
  };
  let field = Field(props);
  assert.equal(find(field, "input").props.type, "password");
  find(field, "button").props.onClick(); field = Field(props);
  assert.equal(find(field, "input").props.type, "text");
  assert.equal(find(field, "button").props["aria-label"], "Hide password");
  const confirmation = Field({ ...props, id: "confirmation", allowReveal: false });
  assert.equal(find(confirmation, "input").props.type, "password");
  assert.equal(find(confirmation, "button"), undefined);
});
