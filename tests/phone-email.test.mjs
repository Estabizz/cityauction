import assert from "node:assert/strict";
import { test } from "node:test";
import { loadSource } from "./helpers/source-loader.mjs";

const EMAIL = "buyer@example.test";
const URL_RESULT = "https://user.phone.email/user_abcdefghijklmnop.json";
const CLIENT = "11716953482701480507";
const SECRET = "test-only-secret-with-more-than-32-characters";

function setup({ payload = { user_email_id: EMAIL }, status = 200, providerFailure = false } = {}) {
  let cookie;
  const rows = new Map();
  const requests = [];
  const issued = [];
  const account = { id: "buyer-1", email: EMAIL, mobile: null, fullName: "Buyer", accountType: "INDIVIDUAL", sessionVersion: 1, roles: [], isActive: true, deletedAt: null, isEmailVerified: true };
  const db = {
    emailOtpChallenge: {
      async create({ data }) {
        if (rows.has(data.id)) throw Object.assign(new Error("duplicate"), { code: "P2002" });
        rows.set(data.id, { attempts: 0, consumedAt: null, createdAt: new Date(), ...data });
        return rows.get(data.id);
      },
      async findUnique({ where }) { return rows.get(where.id) || null; },
      async updateMany({ where, data }) {
        let count = 0;
        for (const row of rows.values()) {
          if (where.id && row.id !== where.id) continue;
          if (where.email && row.email !== where.email) continue;
          if (where.consumedAt === null && row.consumedAt !== null) continue;
          if (where.expiresAt && row.expiresAt <= where.expiresAt.gt) continue;
          Object.assign(row, data); count++;
        }
        return { count };
      },
    },
    user: {
      async findUnique({ where }) { return Object.entries(where).every(([k, v]) => account[k] === v) ? { ...account } : null; },
      async update({ data }) {
        for (const [k, v] of Object.entries(data)) account[k] = v && typeof v === "object" && "increment" in v ? account[k] + v.increment : v;
        return { ...account };
      },
      async updateMany({ where, data }) {
        if (!Object.entries(where).every(([k, v]) => account[k] === v)) return { count: 0 };
        await this.update({ data }); return { count: 1 };
      },
    },
  };
  db.$transaction = async (fn) => {
    const savedRows = structuredClone([...rows]);
    const savedAccount = { ...account };
    try { return await fn(db); }
    catch (error) { rows.clear(); savedRows.forEach(([id, row]) => rows.set(id, row)); Object.assign(account, savedAccount); throw error; }
  };
  const mocks = {
    "@/lib/db": { db }, "./db": { db },
    "next/headers": { cookies: async () => ({ get: (name) => name === "cityauction_email_intent" && cookie ? { value: cookie } : undefined }) },
    "@/lib/auth": {
      getCurrentUser: async () => ({ userId: account.id }),
      signToken: async (value) => { issued.push(value); return "signed-session"; },
      hashPassword: async () => "new-password-hash", COOKIE_NAME: "cityauction_auth_token", isAdmin: () => false,
    },
  };
  const globals = {
    process: { env: { NODE_ENV: "production", AUTH_SECRET: SECRET } },
    fetch: async (url, options) => {
      requests.push({ url, options });
      if (providerFailure) throw new Error("provider offline");
      return new Response(JSON.stringify(payload), { status, headers: { "Content-Type": "application/json" } });
    },
  };
  const source = (file) => loadSource(file, mocks, globals);
  const provider = source("src/lib/phone-email.ts");
  async function start(email = EMAIL, purpose = "login") {
    const intent = await provider.createPhoneEmailIntent(email, purpose);
    cookie = intent.token;
    return intent;
  }
  return { db, rows, account, requests, issued, mocks, globals, source, provider, start,
    setCookie: (value) => { cookie = value; } };
}

function req(path, body, origin = "http://localhost") {
  return new Request(`http://localhost${path}`, { method: "POST", headers: { "Content-Type": "application/json", Origin: origin }, body: JSON.stringify(body) });
}

for (const url of [
  "http://user.phone.email/user_abcdefghijklmnop.json", "https://evil.test/user_abcdefghijklmnop.json",
  "https://user.phone.email.evil.test/user_abcdefghijklmnop.json", "https://127.0.0.1/user_abcdefghijklmnop.json",
  "file:///etc/passwd", "https://user:pass@user.phone.email/user_abcdefghijklmnop.json",
  "https://user.phone.email:8443/user_abcdefghijklmnop.json", `${URL_RESULT}?target=http://localhost`, `${URL_RESULT}#fragment`,
  "https://user.phone.email/private.json", "https://user.phone.email/a/user_abcdefghijklmnop.json",
]) {
  test(`provider URL rejects unsafe or undocumented targets: ${url}`, () => {
    const state = setup();
    assert.throws(() => state.provider.validatePhoneEmailUrl(url));
    assert.equal(state.requests.length, 0);
  });
}

test("verified identity is fetched from the documented host without redirects or caching", async () => {
  const state = setup();
  assert.equal(await state.provider.fetchPhoneEmailIdentity(URL_RESULT), EMAIL);
  assert.equal(state.requests[0].url, URL_RESULT);
  assert.equal(state.requests[0].options.redirect, "error");
  assert.equal(state.requests[0].options.cache, "no-store");
  assert.ok(state.requests[0].options.signal);
});

for (const options of [
  { providerFailure: true }, { status: 302 }, { status: 500 }, { payload: { user_email_id: "not-an-email" } },
  { payload: { email: EMAIL } }, { payload: { user_email_id: EMAIL, client_id: "another-client" } },
  { payload: { user_email_id: EMAIL, padding: "x".repeat(20000) } },
]) {
  test(`provider failure cannot yield an authenticated identity: ${Object.keys(options).join(",")}`, async () => {
    const state = setup(options);
    await assert.rejects(state.provider.fetchPhoneEmailIdentity(URL_RESULT));
  });
}

test("a documented client ID claim must match when present", async () => {
  assert.equal(await setup({ payload: { user_email_id: EMAIL, client_id: CLIENT } }).provider.fetchPhoneEmailIdentity(URL_RESULT), EMAIL);
});

test("browser intent is signed and tampering is rejected", async () => {
  const state = setup();
  const intent = await state.start();
  state.setCookie(`${intent.token}invalid`);
  await assert.rejects(state.provider.exchangePhoneEmailResult(URL_RESULT, intent.nonce));
  assert.equal(state.requests.length, 0);
});

test("wrong browser intent is rejected before a provider request", async () => {
  const state = setup();
  await state.start();
  await assert.rejects(state.provider.exchangePhoneEmailResult(URL_RESULT, "00000000-0000-4000-8000-000000000000"));
  assert.equal(state.requests.length, 0);
});

test("provider email must match the intended account email", async () => {
  const state = setup({ payload: { user_email_id: "other@example.test" } });
  const intent = await state.start();
  await assert.rejects(state.provider.exchangePhoneEmailResult(URL_RESULT, intent.nonce));
  assert.equal(state.rows.size, 0);
});

test("result URLs exchange once and local proofs authenticate once", async () => {
  const state = setup();
  const intent = await state.start();
  const proof = await state.provider.exchangePhoneEmailResult(URL_RESULT, intent.nonce);
  assert.match(proof.verificationToken, /^[a-f0-9]{64}$/);
  await assert.rejects(state.provider.exchangePhoneEmailResult(URL_RESULT, intent.nonce), (e) => e.status === 409);
  await state.provider.verifyPhoneEmailToken(proof.verificationToken, EMAIL, "login");
  await assert.rejects(state.provider.verifyPhoneEmailToken(proof.verificationToken, EMAIL, "login"));
});

test("parallel proof consumption has exactly one winner", async () => {
  const state = setup();
  const intent = await state.start();
  const proof = await state.provider.exchangePhoneEmailResult(URL_RESULT, intent.nonce);
  const results = await Promise.allSettled(Array.from({ length: 5 }, () => state.provider.verifyPhoneEmailToken(proof.verificationToken, EMAIL, "login")));
  assert.equal(results.filter((r) => r.status === "fulfilled").length, 1);
});

test("proofs are bound to browser, email and action", async () => {
  const state = setup();
  const intent = await state.start();
  const proof = await state.provider.exchangePhoneEmailResult(URL_RESULT, intent.nonce);
  await assert.rejects(state.provider.verifyPhoneEmailToken(proof.verificationToken, "other@example.test", "login"));
  await assert.rejects(state.provider.verifyPhoneEmailToken(proof.verificationToken, EMAIL, "reset-password"));
  await state.start();
  await assert.rejects(state.provider.verifyPhoneEmailToken(proof.verificationToken, EMAIL, "login"));
});

test("expired receipts cannot authenticate", async () => {
  const state = setup();
  const intent = await state.start();
  const proof = await state.provider.exchangePhoneEmailResult(URL_RESULT, intent.nonce);
  state.rows.get(proof.verificationToken).expiresAt = new Date(Date.now() - 1);
  await assert.rejects(state.provider.verifyPhoneEmailToken(proof.verificationToken, EMAIL, "login"));
});

test("failed account writes roll back proof consumption", async () => {
  const state = setup();
  const intent = await state.start(EMAIL, "reset-password");
  const proof = await state.provider.exchangePhoneEmailResult(URL_RESULT, intent.nonce);
  await assert.rejects(state.provider.verifyPhoneEmailToken(proof.verificationToken, EMAIL, "reset-password", async () => { throw new Error("write failed"); }));
  assert.equal(state.rows.get(proof.verificationToken).consumedAt, null);
});

test("verification endpoints reject cross-origin requests", async () => {
  const state = setup();
  const start = state.source("src/app/api/auth/phone-email/start/route.ts");
  const verify = state.source("src/app/api/auth/phone-email/verify/route.ts");
  assert.equal((await start.POST(req("/api/auth/phone-email/start", { email: EMAIL, purpose: "login" }, "https://evil.test"))).status, 403);
  assert.equal((await verify.POST(req("/api/auth/phone-email/verify", {}, "https://evil.test"))).status, 403);
  assert.equal(state.requests.length, 0);
});

test("start endpoint issues an HttpOnly intent cookie without an auth session", async () => {
  const state = setup();
  const start = state.source("src/app/api/auth/phone-email/start/route.ts");
  const response = await start.POST(req("/api/auth/phone-email/start", { email: EMAIL, purpose: "login" }));
  assert.equal(response.status, 200);
  assert.match(response.headers.get("set-cookie"), /HttpOnly/);
  assert.match(response.headers.get("set-cookie"), /SameSite=strict/i);
  assert.equal(state.issued.length, 0);
});

test("Phone.Email proof completes the existing login flow", async () => {
  const state = setup();
  const intent = await state.start();
  const proof = await state.provider.exchangePhoneEmailResult(URL_RESULT, intent.nonce);
  const route = state.source("src/app/api/auth/login-otp/route.ts");
  const response = await route.POST(req("/api/auth/login-otp", { email: EMAIL, phoneEmailToken: proof.verificationToken, next: "/auctions/example" }));
  assert.equal(response.status, 200);
  assert.equal((await response.json()).redirectTo, "/auctions/example");
  assert.equal(state.issued.length, 1);
});

test("Phone.Email proof resets the password and revokes older sessions", async () => {
  const state = setup();
  const intent = await state.start(EMAIL, "reset-password");
  const proof = await state.provider.exchangePhoneEmailResult(URL_RESULT, intent.nonce);
  const route = state.source("src/app/api/auth/reset-password/route.ts");
  const response = await route.POST(req("/api/auth/reset-password", { email: EMAIL, phoneEmailToken: proof.verificationToken, password: "new-password", confirmPassword: "new-password" }));
  assert.equal(response.status, 200);
  assert.equal(state.account.passwordHash, "new-password-hash");
  assert.equal(state.account.sessionVersion, 2);
  assert.equal(state.issued.length, 0);
});

test("Phone.Email proof completes registration with consent and no SMTP code", async () => {
  const state = setup();
  const intent = await state.start(EMAIL, "register");
  const proof = await state.provider.exchangePhoneEmailResult(URL_RESULT, intent.nonce);
  let created;
  const consents = [];
  state.db.user.findUnique = async () => null;
  state.db.user.create = async ({ data }) => { created = data; return { ...state.account, ...data, roles: [] }; };
  state.db.consentEvent = { create: async ({ data }) => consents.push(data), createMany: async ({ data }) => consents.push(...data) };
  const route = state.source("src/app/api/auth/register/route.ts");
  const response = await route.POST(req("/api/auth/register", { email: EMAIL, fullName: "Buyer", buyerCategory: "INDIVIDUAL_BUYER", acceptTerms: true, phoneEmailToken: proof.verificationToken, onboarded: true }));
  assert.equal(response.status, 200);
  assert.equal(created.isEmailVerified, true);
  assert.equal(created.phone, null);
  assert.ok(consents.some((row) => row.kind === "TERMS_PRIVACY" && row.granted));
  assert.equal(state.issued.length, 1);
});

test("Phone.Email proof securely changes the sign-in email", async () => {
  const email = "new@example.test";
  const state = setup({ payload: { user_email_id: email } });
  const intent = await state.start(email, "link-email:buyer-1");
  const proof = await state.provider.exchangePhoneEmailResult(URL_RESULT, intent.nonce);
  const route = state.source("src/app/api/user/email/route.ts");
  const response = await route.POST(req("/api/user/email", { email, phoneEmailToken: proof.verificationToken }));
  assert.equal(response.status, 200);
  assert.equal(state.account.email, email);
  assert.equal(state.account.sessionVersion, 2);
  assert.equal(state.issued.length, 1);
});

const registerInput = (proof) => ({ email: EMAIL, fullName: "Changed name", buyerCategory: "BUSINESS_BUYER", acceptTerms: true, marketingOptIn: true, phoneEmailToken: proof, onboarded: true, next: "/auctions/example" });

test("an existing verified buyer entering sign-up signs in without replacing profile or consent", async () => {
  const state = setup();
  state.db.user.create = async () => { throw new Error("Duplicate account creation attempted"); };
  const intent = await state.start(EMAIL, "register");
  const proof = await state.provider.exchangePhoneEmailResult(URL_RESULT, intent.nonce);
  const route = state.source("src/app/api/auth/register/route.ts");
  const response = await route.POST(req("/api/auth/register", registerInput(proof.verificationToken)));
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.existingAccount, true);
  assert.equal(body.redirectTo, "/auctions/example");
  assert.equal(state.account.fullName, "Buyer");
  assert.equal(state.account.marketingEmail, undefined);
  assert.equal(state.issued.length, 1);
  assert.ok(state.account.lastLoginAt);
  const replay = await route.POST(req("/api/auth/register", registerInput(proof.verificationToken)));
  assert.notEqual(replay.status, 200);
  assert.equal(state.issued.length, 1);
});

test("an existing buyer cannot use sign-up to sign in without valid proof", async () => {
  const state = setup();
  const response = await state.source("src/app/api/auth/register/route.ts").POST(req("/api/auth/register", registerInput("invalid-proof")));
  assert.notEqual(response.status, 200);
  assert.equal(state.issued.length, 0);
  assert.equal(state.account.lastLoginAt, undefined);
});

for (const changes of [{ isActive: false }, { deletedAt: new Date() }, { isEmailVerified: false }]) {
  test(`sign-up cannot bypass existing account restrictions: ${Object.keys(changes)[0]}`, async () => {
    const state = setup();
    Object.assign(state.account, changes);
    const intent = await state.start(EMAIL, "register");
    const proof = await state.provider.exchangePhoneEmailResult(URL_RESULT, intent.nonce);
    const response = await state.source("src/app/api/auth/register/route.ts").POST(req("/api/auth/register", registerInput(proof.verificationToken)));
    assert.equal(response.status, 403);
    assert.equal(state.issued.length, 0);
    assert.equal(state.account.lastLoginAt, undefined);
  });
}

test("a login proof cannot be reused as registration proof for an existing account", async () => {
  const state = setup();
  const intent = await state.start();
  const proof = await state.provider.exchangePhoneEmailResult(URL_RESULT, intent.nonce);
  const response = await state.source("src/app/api/auth/register/route.ts").POST(req("/api/auth/register", registerInput(proof.verificationToken)));
  assert.notEqual(response.status, 200);
  assert.equal(state.issued.length, 0);
});

test("account journey: sign-up, verified session, dashboard, logout, and fresh OTP login", async () => {
  const state = setup();
  let exists = false;
  let created = 0;
  let sessionCookie;
  const consents = [];
  const originalCookieReader = state.mocks["next/headers"].cookies;
  state.mocks["next/headers"].cookies = async () => {
    const providerCookies = await originalCookieReader();
    return { get: (name) => name === "cityauction_auth_token" ? sessionCookie ? { value: sessionCookie } : undefined : providerCookies.get(name) };
  };
  state.db.user.findUnique = async ({ where }) => exists && Object.entries(where).every(([key, value]) => state.account[key] === value) ? { ...state.account } : null;
  state.db.user.create = async ({ data }) => {
    assert.equal(exists, false);
    created++;
    exists = true;
    Object.assign(state.account, { fullName: data.fullName, email: data.email, isEmailVerified: data.isEmailVerified, onboardedAt: data.onboardedAt });
    return { ...state.account };
  };
  state.db.consentEvent = { create: async ({ data }) => consents.push(data), createMany: async ({ data }) => consents.push(...data) };
  const tokens = state.source("src/lib/session-token.ts");
  const realAuth = state.source("src/lib/auth.ts");
  state.mocks["@/lib/auth"].getCurrentUser = realAuth.getCurrentUser;
  state.mocks["@/lib/auth"].signToken = tokens.signToken;
  state.mocks["next/navigation"] = { redirect: (destination) => { throw Object.assign(new Error("redirect"), { destination }); } };
  const me = state.source("src/app/api/auth/me/route.ts");
  const dashboard = state.source("src/components/account/dashboard-data.ts");
  assert.equal((await me.GET()).status, 401);

  const registrationIntent = await state.start(EMAIL, "register");
  assert.equal((await me.GET()).status, 401, "starting verification must not sign in");
  const registrationProof = await state.provider.exchangePhoneEmailResult(URL_RESULT, registrationIntent.nonce);
  assert.equal((await me.GET()).status, 401, "provider exchange alone must not sign in");
  const registered = await state.source("src/app/api/auth/register/route.ts").POST(req("/api/auth/register", { ...registerInput(registrationProof.verificationToken), next: undefined }));
  assert.equal(registered.status, 200);
  assert.equal((await registered.json()).redirectTo, "/dashboard");
  sessionCookie = registered.cookies.get("cityauction_auth_token").value;
  assert.ok(await tokens.verifyToken(sessionCookie));
  assert.equal((await me.GET()).status, 200);
  assert.equal((await dashboard.getAccount()).user.email, EMAIL);
  assert.equal(created, 1);
  assert.ok(consents.length > 0);

  const loggedOut = await state.source("src/app/api/auth/logout/route.ts").POST();
  assert.equal(loggedOut.cookies.get("cityauction_auth_token").maxAge, 0);
  sessionCookie = undefined;
  state.setCookie(undefined);
  assert.equal((await me.GET()).status, 401);
  await assert.rejects(dashboard.getAccount(), (error) => error.destination.startsWith("/login"));
  const loginIntent = await state.start();
  const loginProof = await state.provider.exchangePhoneEmailResult("https://user.phone.email/user_newloginresult123.json", loginIntent.nonce);
  const loggedIn = await state.source("src/app/api/auth/login-otp/route.ts").POST(req("/api/auth/login-otp", { email: EMAIL, phoneEmailToken: loginProof.verificationToken }));
  assert.equal(loggedIn.status, 200);
  sessionCookie = loggedIn.cookies.get("cityauction_auth_token").value;
  assert.equal((await me.GET()).status, 200);
  assert.equal((await dashboard.getAccount()).user.id, state.account.id);
  assert.equal(created, 1);
});

test("registration database failure preserves verification for a retry", async () => {
  const state = setup();
  const intent = await state.start(EMAIL, "register");
  const proof = await state.provider.exchangePhoneEmailResult(URL_RESULT, intent.nonce);
  state.db.user.findUnique = async () => null;
  state.db.user.create = async () => { throw new Error("database write failed"); };
  const route = state.source("src/app/api/auth/register/route.ts");
  const failed = await route.POST(req("/api/auth/register", registerInput(proof.verificationToken)));
  assert.equal(failed.status, 503);
  assert.equal(state.rows.get(proof.verificationToken).consumedAt, null);
  assert.equal(state.issued.length, 0);
  state.db.user.create = async () => ({ ...state.account });
  state.db.consentEvent = { create: async () => {}, createMany: async () => {} };
  const retried = await route.POST(req("/api/auth/register", registerInput(proof.verificationToken)));
  assert.equal(retried.status, 200);
  assert.equal(state.issued.length, 1);
});

test("login database failure preserves verification for a retry", async () => {
  const state = setup();
  const intent = await state.start();
  const proof = await state.provider.exchangePhoneEmailResult(URL_RESULT, intent.nonce);
  const update = state.db.user.updateMany;
  state.db.user.updateMany = async () => { throw new Error("database unavailable"); };
  const route = state.source("src/app/api/auth/login-otp/route.ts");
  const input = { email: EMAIL, phoneEmailToken: proof.verificationToken };
  assert.equal((await route.POST(req("/api/auth/login-otp", input))).status, 503);
  assert.equal(state.rows.get(proof.verificationToken).consumedAt, null);
  assert.equal(state.issued.length, 0);
  state.db.user.updateMany = update;
  assert.equal((await route.POST(req("/api/auth/login-otp", input))).status, 200);
  assert.equal(state.issued.length, 1);
});

for (const purpose of ["register", "login"]) {
  test(`expired ${purpose} proof cannot issue an authenticated session`, async () => {
    const state = setup();
    const intent = await state.start(EMAIL, purpose);
    const proof = await state.provider.exchangePhoneEmailResult(URL_RESULT, intent.nonce);
    state.rows.get(proof.verificationToken).expiresAt = new Date(Date.now() - 1);
    const path = purpose === "register" ? "register" : "login-otp";
    const input = purpose === "register" ? registerInput(proof.verificationToken) : { email: EMAIL, phoneEmailToken: proof.verificationToken };
    const response = await state.source(`src/app/api/auth/${path}/route.ts`).POST(req(`/api/auth/${path}`, input));
    assert.equal(response.status, 400);
    assert.equal(state.issued.length, 0);
    assert.equal(state.account.lastLoginAt, undefined);
  });
}

test("same-host requests from a different scheme are cross-origin", async () => {
  const state = setup();
  const route = state.source("src/app/api/auth/phone-email/start/route.ts");
  const response = await route.POST(req("/api/auth/phone-email/start", { email: EMAIL, purpose: "login" }, "https://localhost"));
  assert.equal(response.status, 403);
});

test("verification endpoint ignores an email supplied by the browser callback", async () => {
  const state = setup();
  const intent = await state.start();
  const route = state.source("src/app/api/auth/phone-email/verify/route.ts");
  const response = await route.POST(req("/api/auth/phone-email/verify", { user_json_url: URL_RESULT, intentId: intent.nonce, user_email_id: "admin@example.test" }));
  assert.equal(response.status, 200);
  assert.equal((await response.json()).email, EMAIL);
  assert.equal(state.issued.length, 0);
});

test("verification intent tokens cannot be used as authentication session tokens", async () => {
  const state = setup();
  const intent = await state.start();
  const auth = state.source("src/lib/session-token.ts");
  assert.equal(await auth.verifyToken(intent.token), null);
});
