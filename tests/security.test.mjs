import assert from "node:assert/strict";
import { test } from "node:test";
import { loadSource } from "./helpers/source-loader.mjs";

const disabledRoutes = [
  ["payments/create-order", "POST"],
  ["payments/verify", "POST"],
  ["payments/history", "GET"],
  ["bidding/place-bid", "POST"],
  ["bidding/[id]", "GET"],
  ["kyc/submit", "POST"],
  ["kyc/review", "PATCH"],
  ["uploads/presigned", "POST"],
];

for (const [route, method] of disabledRoutes) {
  test(`${method} /api/${route} refuses transactions without touching infrastructure`, async () => {
    const handler = loadSource(`src/app/api/${route}/route.ts`)[method];
    const request = { json() { throw new Error("Must not process transaction input"); } };
    const response = await handler(request);
    assert.equal(response.status, 503);
    assert.equal(response.headers.get("cache-control"), "no-store");
    const body = await response.json();
    assert.equal(body.success, false);
    assert.equal(body.code, "FEATURE_NOT_AVAILABLE");
    assert.equal(body.payment, undefined);
    assert.equal(body.state, undefined);
  });
}

function sessionReader(user, version = 3) {
  return loadSource("src/lib/auth.ts", {
    react: { cache: (fn) => fn },
    "next/headers": { cookies: async () => ({ get: () => ({ value: "token" }) }) },
    "./session-token": {
      COOKIE_NAME: "cityauction_auth_token",
      verifyToken: async () => ({ userId: "buyer-1", sv: version }),
    },
    "./db": { db: { user: { findUnique: async () => {
      if (user instanceof Error) throw user;
      return user;
    } } } },
  }).getCurrentUser;
}

test("session validation accepts an active account with the current version", async () => {
  const result = await sessionReader({ isActive: true, deletedAt: null, sessionVersion: 3 })();
  assert.equal(result.userId, "buyer-1");
});

for (const [reason, user] of [
  ["missing account", null],
  ["disabled account", { isActive: false, deletedAt: null, sessionVersion: 3 }],
  ["deleted account", { isActive: true, deletedAt: new Date(), sessionVersion: 3 }],
  ["revoked session", { isActive: true, deletedAt: null, sessionVersion: 4 }],
  ["database outage", new Error("Database unavailable")],
]) {
  test(`session validation denies access for ${reason}`, async () => {
    assert.equal(await sessionReader(user)(), null);
  });
}

function passwordHandlers({ passwordValid = true, resetCount = 1 } = {}) {
  const account = {
    id: "buyer-1", email: "buyer@example.test", mobile: null, fullName: "Buyer",
    accountType: "INDIVIDUAL", sessionVersion: 3, roles: [],
  };
  const writes = [];
  const issued = [];
  const db = { user: {
    findUnique: async (query) => query.include ? account : ({ id: account.id, isActive: true, deletedAt: null, passwordHash: "old-hash", sessionVersion: account.sessionVersion, email: account.email }),
    update: async (query) => {
      writes.push(query);
      account.sessionVersion += query.data.sessionVersion.increment;
      return account;
    },
    updateMany: async (query) => {
      writes.push(query);
      if (resetCount) account.sessionVersion += query.data.sessionVersion.increment;
      return { count: resetCount };
    },
  } };
  db.emailOtpChallenge = { updateMany: async () => ({ count: 1 }) };
  db.$transaction = async (work) => work(db);
  const mocks = {
    "@/lib/same-origin": { isSameOriginRequest: () => true },
    "@/lib/db": { db },
    "@/lib/auth": {
      getCurrentUser: async () => ({ userId: account.id, sv: 3 }),
      hashPassword: async () => "new-hash",
      verifyPassword: async () => passwordValid,
      COOKIE_NAME: "cityauction_auth_token", isAdmin: () => false,
      signToken: async (payload) => { issued.push(payload); return "new-session"; },
    },
  };
  return { mocks, writes, issued };
}

const jsonRequest = (body) => ({ json: async () => body });

test("password change revokes older sessions and refreshes the current device", async () => {
  const state = passwordHandlers();
  const { POST } = loadSource("src/app/api/user/password/route.ts", state.mocks);
  const response = await POST(jsonRequest({ currentPassword: "old-password", newPassword: "new-password", confirmPassword: "new-password" }));
  assert.equal(response.status, 200);
  assert.equal(state.writes.length, 1);
  assert.equal(state.writes[0].data.sessionVersion.increment, 1);
  assert.equal(state.writes[0].data.passwordSetToken, null);
  assert.equal(state.issued[0].sv, 4);
  assert.match(response.headers.get("set-cookie"), /cityauction_auth_token=new-session/);
});

test("incorrect current password does not write or issue a new session", async () => {
  const state = passwordHandlers({ passwordValid: false });
  const { POST } = loadSource("src/app/api/user/password/route.ts", state.mocks);
  const response = await POST(jsonRequest({ currentPassword: "wrong-password", newPassword: "new-password", confirmPassword: "new-password" }));
  assert.equal(response.status, 400);
  assert.equal(state.writes.length, 0);
  assert.equal(state.issued.length, 0);
});

test("password reset revokes older sessions before issuing the replacement", async () => {
  const state = passwordHandlers();
  // The reset handler reloads the fresh account through the shared auth helper.
  state.mocks["@/lib/db"].db.user.findUnique = async () => ({
    id: "buyer-1", email: "buyer@example.test", mobile: null, fullName: "Buyer",
    accountType: "INDIVIDUAL", sessionVersion: state.writes.length ? 4 : 3,
    roles: [], isActive: true, deletedAt: null,
  });
  const { POST } = loadSource("src/app/api/auth/set-password/route.ts", state.mocks);
  const response = await POST(jsonRequest({ token: "a".repeat(64), password: "new-password" }));
  assert.equal(response.status, 200);
  assert.equal(state.writes[0].data.sessionVersion.increment, 1);
  assert.equal(state.writes[0].where.passwordSetToken, "a".repeat(64));
  assert.equal(state.issued[0].sv, 4);
});

test("expired or already used reset link does not issue a session", async () => {
  const state = passwordHandlers({ resetCount: 0 });
  const { POST } = loadSource("src/app/api/auth/set-password/route.ts", state.mocks);
  const response = await POST(jsonRequest({ token: "a".repeat(64), password: "new-password" }));
  assert.equal(response.status, 400);
  assert.equal(state.issued.length, 0);
});

test("a concurrent password reset cannot be overwritten by an earlier change-password attempt", async () => {
  const state = passwordHandlers({ resetCount: 0 });
  const { POST } = loadSource("src/app/api/user/password/route.ts", state.mocks);
  const response = await POST(jsonRequest({ currentPassword: "old-password", newPassword: "different-password", confirmPassword: "different-password" }));
  assert.equal(response.status, 409); assert.equal(state.issued.length, 0);
  assert.equal(state.writes[0].where.passwordHash, "old-hash"); assert.equal(state.writes[0].where.sessionVersion, 3);
});

test("repeated incorrect password changes are rate limited", async () => {
  const state = passwordHandlers({ passwordValid: false });
  const { POST } = loadSource("src/app/api/user/password/route.ts", state.mocks);
  for (let attempt = 0; attempt < 10; attempt++) assert.equal((await POST(jsonRequest({ currentPassword: "wrong-password", newPassword: "different-password", confirmPassword: "different-password" }))).status, 400);
  assert.equal((await POST(jsonRequest({ currentPassword: "wrong-password", newPassword: "different-password", confirmPassword: "different-password" }))).status, 429);
  assert.equal(state.writes.length, 0);
});

test("a password change cannot resume a session revoked after the first authentication check", async () => {
  const state = passwordHandlers(); state.mocks["@/lib/auth"].getCurrentUser = async () => ({ userId: "buyer-1", sv: 2 });
  const { POST } = loadSource("src/app/api/user/password/route.ts", state.mocks);
  const response = await POST(jsonRequest({ currentPassword: "old-password", newPassword: "different-password", confirmPassword: "different-password" }));
  assert.equal(response.status, 401); assert.equal(state.writes.length, 0); assert.equal(state.issued.length, 0);
});
