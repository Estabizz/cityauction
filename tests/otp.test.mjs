import assert from "node:assert/strict";
import { test } from "node:test";
import { loadSource } from "./helpers/source-loader.mjs";

const EMAIL = "buyer@example.test";
const globals = { process: { env: { NODE_ENV: "production", AUTH_SECRET: "test-only-secret-with-more-than-32-characters" } } };

function matches(row, where) {
  return Object.entries(where).every(([key, rule]) => {
    const actual = row[key];
    if (rule && typeof rule === "object" && !(rule instanceof Date)) {
      return Object.entries(rule).every(([operator, value]) =>
        operator === "not" ? actual !== value : operator === "lt" ? actual < value :
        operator === "gt" ? actual > value : operator === "gte" ? actual >= value :
        operator === "lte" ? actual <= value : false);
    }
    return actual === rule;
  });
}

function otpSetup({ configured = true, deliver = true, active = true, verified = true } = {}) {
  const rows = new Map();
  const sent = [];
  const issued = [];
  const user = { id: "buyer-1", email: EMAIL, mobile: null,
    fullName: "Buyer", accountType: "INDIVIDUAL", sessionVersion: 3, roles: [],
    isActive: active, deletedAt: null, isEmailVerified: verified, passwordHash: "old-hash",
    passwordSetToken: "old-reset-link", passwordSetExpires: new Date(Date.now() + 100000) };
  const db = {
    emailOtpChallenge: {
      findFirst: async ({ where }) => [...rows.values()].filter((r) => matches(r, where)).sort((a, b) => b.createdAt - a.createdAt)[0] || null,
      findUnique: async ({ where }) => rows.has(where.id) ? { ...rows.get(where.id) } : null,
      count: async ({ where }) => [...rows.values()].filter((r) => matches(r, where)).length,
      create: async ({ data }) => {
        const row = { attempts: 0, consumedAt: null, createdAt: new Date(), ...data };
        rows.set(row.id, row);
        return { ...row };
      },
      delete: async ({ where }) => rows.delete(where.id),
      updateMany: async ({ where, data }) => {
        let count = 0;
        for (const row of rows.values()) {
          if (!matches(row, where)) continue;
          for (const [key, value] of Object.entries(data)) {
            if (value && typeof value === "object" && "increment" in value) row[key] += value.increment;
            else row[key] = value;
          }
          count++;
        }
        return { count };
      },
    },
    user: {
      findUnique: async ({ where }) => Object.entries(where).every(([key, value]) => user[key] === value) ? { ...user } : null,
      update: async ({ data }) => {
        for (const [key, value] of Object.entries(data)) {
          if (value && typeof value === "object" && "increment" in value) user[key] += value.increment;
          else user[key] = value;
        }
        return { ...user };
      },
      updateMany: async ({ where, data }) => {
        if (!matches(user, where)) return { count: 0 };
        for (const [key, value] of Object.entries(data)) {
          if (value && typeof value === "object" && "increment" in value) user[key] += value.increment;
          else user[key] = value;
        }
        return { count: 1 };
      },
    },
  };
  db.$transaction = async (fn) => {
    const snapshot = structuredClone([...rows.entries()]);
    const userSnapshot = { ...user };
    try { return await fn(db); }
    catch (error) {
      rows.clear(); snapshot.forEach(([id, row]) => rows.set(id, row));
      Object.assign(user, userSnapshot);
      throw error;
    }
  };
  const mail = {
    emailConfigured: () => configured,
    emailSettingsPresent: () => configured,
    sendOtpEmail: async (email, code) => {
      if (!deliver) throw new Error("Provider unavailable");
      sent.push({ email, code });
    },
  };
  const auth = {
    hashPassword: async (password) => `hashed:${password}`,
    verifyPassword: async (password) => password === "correct-password",
    signToken: async (payload) => { issued.push(payload); return "otp-session"; },
    COOKIE_NAME: "cityauction_auth_token", isAdmin: () => false,
    getCurrentUser: async () => ({ userId: user.id, sv: user.sessionVersion }),
  };
  const mocks = { "./db": { db }, "@/lib/db": { db }, "./email": mail, "@/lib/auth": auth };
  const otp = loadSource("src/lib/otp.ts", mocks, globals);
  const loadRoute = (route) => loadSource(`src/app/api/auth/${route}/route.ts`, mocks, globals);
  return { rows, sent, issued, user, db, mocks, otp, loadRoute };
}
const request = (body) => ({ url: "http://localhost/api/auth/forgot-password", json: async () => body, headers: new Headers({ "x-real-ip": "127.0.0.1" }) });
const issue = (state, purpose = "reset-password") => state.otp.sendOtp(EMAIL, purpose, "127.0.0.1");
const lastCode = (state) => state.sent.at(-1).code;

test("SMTP sign-up verifies and signs in an existing account without creating another", async () => {
  const state = otpSetup();
  const sent = await state.loadRoute("otp/send").POST(request({ email: EMAIL, purpose: "register" }));
  assert.equal(sent.status, 200);
  const { challengeId } = await sent.json();
  const response = await state.loadRoute("register").POST(request({ email: EMAIL, fullName: "Replacement name", password: "new-password", confirmPassword: "new-password", buyerCategory: "BUSINESS_BUYER", acceptTerms: true, challengeId, otp: lastCode(state), onboarded: true }));
  assert.equal(response.status, 200);
  assert.equal((await response.json()).existingAccount, true);
  assert.equal(state.user.fullName, "Buyer");
  assert.equal(state.issued.length, 1);
});

test("OTP delivery stores only a hash and never returns a production dev code", async () => {
  const state = otpSetup();
  const result = await issue(state);
  assert.match(lastCode(state), /^\d{6}$/);
  const row = state.rows.get(result.challengeId);
  assert.equal(row.codeHash.length, 64);
  assert.notEqual(row.codeHash, lastCode(state));
  assert.equal(result.devCode, undefined);
  assert.equal(row.purpose, "reset-password");
});

test("OTP codes are single-use and bound to email and purpose", async () => {
  const state = otpSetup();
  const { challengeId } = await issue(state);
  const code = lastCode(state);
  await assert.rejects(state.otp.verifyOtp(challengeId, EMAIL, "login", code));
  await assert.rejects(state.otp.verifyOtp(challengeId, "other@example.test", "reset-password", code));
  assert.equal(state.rows.get(challengeId).attempts, 0);
  await state.otp.verifyOtp(challengeId, EMAIL, "reset-password", code);
  await assert.rejects(state.otp.verifyOtp(challengeId, EMAIL, "reset-password", code));
});

test("expired OTPs cannot verify", async () => {
  const state = otpSetup();
  const { challengeId } = await issue(state);
  state.rows.get(challengeId).expiresAt = new Date(Date.now() - 1);
  await assert.rejects(state.otp.verifyOtp(challengeId, EMAIL, "reset-password", lastCode(state)), /expired/);
});

test("parallel wrong guesses cannot exceed the five-attempt limit", async () => {
  const state = otpSetup();
  const { challengeId } = await issue(state);
  const wrong = lastCode(state) === "000000" ? "111111" : "000000";
  const results = await Promise.allSettled(Array.from({ length: 20 }, () => state.otp.verifyOtp(challengeId, EMAIL, "reset-password", wrong)));
  assert.ok(results.every((r) => r.status === "rejected"));
  assert.equal(state.rows.get(challengeId).attempts, 5);
  await assert.rejects(state.otp.verifyOtp(challengeId, EMAIL, "reset-password", lastCode(state)));
});

test("parallel correct submissions allow exactly one verification", async () => {
  const state = otpSetup();
  const { challengeId } = await issue(state);
  const results = await Promise.allSettled(Array.from({ length: 4 }, () => state.otp.verifyOtp(challengeId, EMAIL, "reset-password", lastCode(state))));
  assert.equal(results.filter((r) => r.status === "fulfilled").length, 1);
});

test("resends enforce cooldown and invalidate the older code", async () => {
  const state = otpSetup();
  const first = await issue(state);
  await assert.rejects(issue(state), (e) => e.status === 429 && e.retryAfter > 0);
  state.rows.get(first.challengeId).createdAt = new Date(Date.now() - 31000);
  const oldCode = lastCode(state);
  await issue(state);
  await assert.rejects(state.otp.verifyOtp(first.challengeId, EMAIL, "reset-password", oldCode));
});

test("per-email and per-IP hourly send caps prevent extra messages", async () => {
  for (const scenario of ["email", "ip"]) {
    const state = otpSetup();
    const count = scenario === "email" ? 5 : 20;
    for (let i = 0; i < count; i++) state.rows.set(`existing-${i}`, {
      id: `existing-${i}`, email: scenario === "email" ? EMAIL : `other${i}@example.test`,
      ipAddress: "127.0.0.1", createdAt: new Date(Date.now() - 60000),
    });
    await assert.rejects(issue(state), (e) => e.status === 429);
    assert.equal(state.sent.length, 0);
  }
});

for (const options of [{ configured: false }, { deliver: false }]) {
  test(`production provider failure never exposes an OTP: ${JSON.stringify(options)}`, async () => {
    const state = otpSetup(options);
    await assert.rejects(issue(state), (e) => e.status === 503);
    assert.equal(state.sent.length, 0);
    assert.equal(state.rows.size, 0);
  });
}

test("reset-write failure rolls back consumption but retains the attempt count", async () => {
  const state = otpSetup();
  const { challengeId } = await issue(state);
  await assert.rejects(state.otp.verifyOtp(challengeId, EMAIL, "reset-password", lastCode(state), async () => { throw new Error("write failed"); }), /write failed/);
  assert.equal(state.rows.get(challengeId).consumedAt, null);
  assert.equal(state.rows.get(challengeId).attempts, 1);
  await state.otp.verifyOtp(challengeId, EMAIL, "reset-password", lastCode(state));
});

test("reset API verifies OTP, revokes sessions and old codes, and clears the current cookie", async () => {
  const state = otpSetup();
  const { challengeId } = await issue(state);
  state.rows.set("old-login", { id: "old-login", email: EMAIL, purpose: "login", consumedAt: null,
    createdAt: new Date(Date.now() - 60000), expiresAt: new Date(Date.now() + 60000), attempts: 0 });
  const { POST } = state.loadRoute("reset-password");
  const body = { email: EMAIL, challengeId, otp: lastCode(state), password: "new-password", confirmPassword: "new-password" };
  const response = await POST(request(body));
  assert.equal(response.status, 200);
  assert.equal(state.user.passwordHash, "hashed:new-password");
  assert.equal(state.user.sessionVersion, 4);
  assert.equal(state.user.passwordSetToken, null);
  assert.ok(state.rows.get(challengeId).consumedAt);
  assert.ok(state.rows.get("old-login").consumedAt);
  assert.match(response.headers.get("set-cookie"), /Max-Age=0/);
  assert.equal(state.issued.length, 0);
  assert.equal((await POST(request(body))).status, 400);
});

test("mismatched passwords do not consume the OTP or change the password", async () => {
  const state = otpSetup();
  const { challengeId } = await issue(state);
  const { POST } = state.loadRoute("reset-password");
  const response = await POST(request({ email: EMAIL, challengeId, otp: lastCode(state), password: "new-password", confirmPassword: "different-password" }));
  assert.equal(response.status, 400);
  assert.equal(state.user.passwordHash, "old-hash");
  assert.equal(state.rows.get(challengeId).consumedAt, null);
});

test("a login-purpose code cannot reset a password", async () => {
  const state = otpSetup();
  const { challengeId } = await issue(state, "login");
  const { POST } = state.loadRoute("reset-password");
  assert.equal((await POST(request({ email: EMAIL, challengeId, otp: lastCode(state), password: "new-password", confirmPassword: "new-password" }))).status, 400);
  assert.equal(state.user.passwordHash, "old-hash");
});

test("verified email and password sign in directly without sending another OTP", async () => {
  const state = otpSetup();
  const response = await state.loadRoute("login").POST(request({ email: EMAIL, password: "correct-password", next: "/auctions/example" }));
  assert.equal(response.status, 200);
  assert.equal((await response.json()).redirectTo, "/auctions/example");
  assert.ok(response.headers.get("set-cookie"));
  assert.equal(state.issued.length, 1);
  assert.equal(state.sent.length, 0);
});

for (const settings of [{ verified: false }, { active: false }]) {
  test(`password login rejects an ineligible account: ${JSON.stringify(settings)}`, async () => {
    const state = otpSetup(settings);
    const response = await state.loadRoute("login").POST(request({ email: EMAIL, password: "correct-password" }));
    assert.equal(response.status, 403);
    assert.equal(state.issued.length, 0);
  });
}

test("OTP-only existing accounts cannot sign in with an unset password", async () => {
  const state = otpSetup(); state.user.passwordHash = null;
  const response = await state.loadRoute("login").POST(request({ email: EMAIL, password: "correct-password" }));
  assert.equal(response.status, 401); assert.equal(state.issued.length, 0);
});

test("a concurrent password reset cannot issue a session using the old password", async () => {
  const state = otpSetup();
  state.db.user.updateMany = async () => ({ count: 0 });
  const response = await state.loadRoute("login").POST(request({ email: EMAIL, password: "correct-password" }));
  assert.equal(response.status, 401); assert.equal(state.issued.length, 0);
});

test("incorrect passwords cannot send codes or issue sessions", async () => {
  const state = otpSetup();
  assert.equal((await state.loadRoute("login").POST(request({ email: state.user.email, password: "wrong-password" }))).status, 401);
  assert.equal(state.sent.length, 0);
  assert.equal(state.issued.length, 0);
});

test("public OTP sender cannot bypass the password step", async () => {
  const state = otpSetup();
  const response = await state.loadRoute("otp/send").POST(request({ email: EMAIL, purpose: "password-login" }));
  assert.equal(response.status, 400);
  assert.equal(state.sent.length, 0);
});

for (const options of [{ active: false }]) {
  test(`ineligible accounts cannot recover or use password login: ${JSON.stringify(options)}`, async () => {
    const state = otpSetup(options);
    const login = await state.loadRoute("login").POST(request({ email: state.user.email, password: "correct-password" }));
    assert.equal(login.status, 403);
    const response = await state.loadRoute("reset-password").POST(request({ email: EMAIL, challengeId: "invalid", otp: "123456", password: "new-password", confirmPassword: "new-password" }));
    assert.equal(response.status, 400);
    assert.equal(state.user.passwordHash, "old-hash");
    assert.equal(state.sent.length, 0);
  });
}

test("reset-code requests acknowledge unknown accounts without sending email", async () => {
  const state = otpSetup();
  const response = await state.loadRoute("otp/send").POST(request({ email: "unknown@example.test", purpose: "reset-password" }));
  assert.equal(response.status, 200);
  assert.match((await response.json()).message, /If this email/);
  assert.equal(state.sent.length, 0);
});

test("password changes invalidate unfinished legacy password-login verification", async () => {
  const state = otpSetup();
  const sent = await state.otp.sendOtp(EMAIL, `password-login:${state.user.id}:${state.user.sessionVersion}`, "127.0.0.1");
  state.user.sessionVersion++;
  const response = await state.loadRoute("login-password-otp").POST(request({ email: EMAIL, challengeId: sent.challengeId, otp: lastCode(state) }));
  assert.equal(response.status, 400); assert.equal(state.issued.length, 0);
});

test("public login OTP delivery does not leak production codes", async () => {
  const state = otpSetup();
  const response = await state.loadRoute("otp/send").POST(request({ email: EMAIL, purpose: "login" }));
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.devCode, undefined);
  assert.equal(state.sent.length, 1);
  assert.equal(response.headers.get("cache-control"), "no-store");
});

test("unverified legacy accounts cannot bypass email verification with a password", async () => {
  const state = otpSetup({ verified: false });
  const sender = state.loadRoute("otp/send");
  assert.equal((await sender.POST(request({ email: EMAIL, purpose: "login" }))).status, 403);
  assert.equal((await state.loadRoute("login").POST(request({ email: EMAIL, password: "correct-password" }))).status, 403);
  assert.equal(state.sent.length, 0);
  assert.equal(state.issued.length, 0);
});

test("legacy mobile requests cannot issue or verify email challenges", async () => {
  const state = otpSetup();
  assert.equal((await state.loadRoute("otp/send").POST(request({ mobile: "9876543210", purpose: "login" }))).status, 400);
  assert.equal((await state.loadRoute("login-otp").POST(request({ mobile: "9876543210", challengeId: "old-mobile", otp: "123456" }))).status, 400);
  assert.equal(state.sent.length, 0);
});

test("forgot-password compatibility endpoint sends an email reset code", async () => {
  const state = otpSetup();
  const response = await state.loadRoute("forgot-password").POST(request({ email: EMAIL }));
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(state.rows.get(body.challengeId).purpose, "reset-password");
  assert.equal(state.sent[0].email, EMAIL);
});

test("changing a sign-in email requires a user-bound email code and revokes other sessions", async () => {
  const state = otpSetup();
  const nextEmail = "new@example.test";
  const challenge = await state.otp.sendOtp(nextEmail, "link-email:buyer-1", "127.0.0.1");
  const route = loadSource("src/app/api/user/email/route.ts", state.mocks, globals);
  const response = await route.POST(request({ email: nextEmail, challengeId: challenge.challengeId, otp: lastCode(state) }));
  assert.equal(response.status, 200);
  assert.equal(state.user.email, nextEmail);
  assert.equal(state.user.isEmailVerified, true);
  assert.equal(state.user.sessionVersion, 4);
  assert.equal(state.user.passwordSetToken, null);
  assert.equal(state.issued.length, 1);
});

test("a code for another user's email-link flow cannot change this account", async () => {
  const state = otpSetup();
  const challenge = await state.otp.sendOtp("new@example.test", "link-email:another-user", "127.0.0.1");
  const route = loadSource("src/app/api/user/email/route.ts", state.mocks, globals);
  const response = await route.POST(request({ email: "new@example.test", challengeId: challenge.challengeId, otp: lastCode(state) }));
  assert.equal(response.status, 400);
  assert.equal(state.user.email, EMAIL);
  assert.equal(state.issued.length, 0);
});

test("ordinary profile edits cannot change the sign-in email without OTP", async () => {
  const state = otpSetup();
  state.mocks["@/lib/same-origin"] = { isSameOriginRequest: () => true };
  const route = loadSource("src/app/api/user/profile/route.ts", state.mocks, globals);
  const response = await route.PATCH(request({ fullName: "Buyer", email: "new@example.test", accountType: "INDIVIDUAL", updatedAt: "2026-10-01T00:00:00.000Z", buyerCategory: "", city: "Surat", state: "Gujarat" }));
  assert.equal(response.status, 400);
  assert.equal(state.user.email, EMAIL);
});

test("email normalization keeps challenge ownership consistent", async () => {
  const state = otpSetup();
  const challenge = await state.otp.sendOtp("  BUYER@EXAMPLE.TEST  ", "login", "127.0.0.1");
  assert.equal(state.rows.get(challenge.challengeId).email, EMAIL);
  assert.equal(state.sent[0].email, EMAIL);
  await state.otp.verifyOtp(challenge.challengeId, "BUYER@EXAMPLE.TEST", "login", lastCode(state));
});

test("partial SMTP configuration in development fails without exposing a code", async () => {
  const state = otpSetup({ configured: false });
  state.mocks["./email"].emailSettingsPresent = () => true;
  const otp = loadSource("src/lib/otp.ts", state.mocks, { process: { env: { NODE_ENV: "development" } } });
  await assert.rejects(otp.sendOtp(EMAIL, "login", "127.0.0.1"), (error) => error.status === 503);
  assert.equal(state.sent.length, 0);
  assert.equal(state.rows.size, 0);
});

test("unconfigured local development can verify a test code without sending email", async () => {
  const state = otpSetup({ configured: false });
  const otp = loadSource("src/lib/otp.ts", state.mocks, { process: { env: { NODE_ENV: "development" } } });
  const challenge = await otp.sendOtp(EMAIL, "login", "127.0.0.1");
  assert.match(challenge.devCode, /^\d{6}$/);
  assert.equal(state.sent.length, 0);
  await otp.verifyOtp(challenge.challengeId, EMAIL, "login", challenge.devCode);
});

test("SMTP recovery verifies the actual OTP before issuing a reset grant and accepts it once", async () => {
  const state = otpSetup();
  let browserCookie;
  state.mocks["next/headers"] = { cookies: async () => ({ get: (name) => name === "cityauction_password_reset" && browserCookie ? { value: browserCookie } : undefined }) };
  const sent = await issue(state);
  const verify = state.loadRoute("reset-password/verify");
  const startRequest = new Request("http://internal:3000/api/auth/reset-password/verify", { method: "POST", headers: { Origin: "https://cityauction.in", "Content-Type": "application/json" }, body: JSON.stringify({ email: EMAIL, challengeId: sent.challengeId, otp: lastCode(state) }) });
  const response = await verify.POST(startRequest);
  assert.equal(response.status, 200);
  assert.ok(state.rows.get(sent.challengeId).consumedAt);
  assert.equal(state.user.passwordHash, "old-hash");
  browserCookie = response.cookies.get("cityauction_password_reset").value;
  const { resetToken } = await response.json();
  const reset = state.loadRoute("reset-password");
  const input = { email: EMAIL, password: "my-new-password", confirmPassword: "my-new-password", resetToken };
  assert.equal((await reset.POST(request(input))).status, 200);
  assert.equal(state.user.passwordHash, "hashed:my-new-password");
  assert.equal((await reset.POST(request(input))).status, 400);
});
