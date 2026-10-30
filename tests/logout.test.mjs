import assert from "node:assert/strict";
import { test } from "node:test";
import { loadSource } from "./helpers/source-loader.mjs";

for (const mode of ["ok", "rejected", "offline"]) {
  test(`logout ${mode}: navigation follows server confirmation only`, async () => {
    const navigations = [];
    const calls = [];
    const { logout } = loadSource("src/components/account/logout-button.tsx", {}, {
      fetch: async (url, options) => {
        calls.push({ url, options });
        if (mode === "offline") throw new Error("offline");
        return new Response("{}", { status: mode === "ok" ? 200 : 503 });
      },
      window: { location: { assign: (url) => navigations.push(url) } },
    });
    const error = await logout();
    assert.equal(calls[0].url, "/api/auth/logout");
    assert.equal(calls[0].options.method, "POST");
    assert.deepEqual(navigations, mode === "ok" ? ["/"] : []);
    if (mode === "ok") assert.equal(error, null);
    else assert.match(error, /try again/i);
  });
}

test("server logout expires session and unfinished provider intent cookies", async () => {
  const { POST } = loadSource("src/app/api/auth/logout/route.ts", { "@/lib/db": { db: {} }, "@/lib/auth": { COOKIE_NAME: "cityauction_auth_token" } });
  for (let attempt = 0; attempt < 2; attempt++) {
    const response = await POST();
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("cache-control"), "no-store");
    for (const name of ["cityauction_auth_token", "cityauction_email_intent"]) {
      const cookie = response.cookies.get(name);
      assert.equal(cookie.value, "");
      assert.equal(cookie.maxAge, 0);
      assert.equal(cookie.httpOnly, true);
    }
  }
});
