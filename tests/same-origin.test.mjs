import assert from "node:assert/strict";
import { test } from "node:test";
import { loadSource } from "./helpers/source-loader.mjs";

function check(origin, { url = "http://127.0.0.1:3000/api/auth/phone-email/start", env = {}, headers = {} } = {}) {
  const { isSameOriginRequest } = loadSource("src/lib/same-origin.ts", {}, {
    process: { env: { NODE_ENV: "production", ...env } },
  });
  return isSameOriginRequest(new Request(url, { headers: { ...(origin === undefined ? {} : { origin }), ...headers } }));
}

test("production verification accepts the public HTTPS origin behind an internal HTTP proxy", () => {
  assert.equal(check("https://cityauction.in"), true);
  assert.equal(check("https://cityauction.in", { env: { NEXT_PUBLIC_APP_URL: "https://cityauction.in/" } }), true);
});

test("deployment configuration supports an explicit alternate public origin", () => {
  const env = { NEXT_PUBLIC_APP_URL: "https://www.cityauction.in" };
  assert.equal(check("https://www.cityauction.in", { env }), true);
  assert.equal(check("https://cityauction.in", { env }), false);
});

for (const origin of [undefined, "null", "https://attacker.test", "http://cityauction.in", "http://127.0.0.1:3000", "https://cityauction.in.attacker.test", "https://cityauction.in/path", "https://user:pass@cityauction.in", "https://cityauction.in, https://attacker.test"]) {
  test(`production verification rejects an untrusted or malformed origin: ${origin}`, () => {
    assert.equal(check(origin), false);
  });
}

test("spoofed forwarding headers cannot authorize a different origin", () => {
  assert.equal(check("https://attacker.test", { headers: {
    host: "attacker.test", "x-forwarded-host": "attacker.test", "x-forwarded-proto": "https", forwarded: "host=attacker.test;proto=https",
  } }), false);
});

test("production fails closed for invalid or insecure site configuration", () => {
  for (const configured of ["not a URL", "http://cityauction.in", "https://user:pass@cityauction.in"]) {
    assert.equal(check("https://cityauction.in", { env: { NEXT_PUBLIC_APP_URL: configured } }), false);
  }
});

test("local development accepts its own origin without opening production to localhost", () => {
  assert.equal(check("http://localhost:3000", { url: "http://localhost:3000/api/auth/phone-email/start", env: { NODE_ENV: "development" } }), true);
  assert.equal(check("https://attacker.test", { url: "http://localhost:3000/api/auth/phone-email/start", env: { NODE_ENV: "development" } }), false);
});
