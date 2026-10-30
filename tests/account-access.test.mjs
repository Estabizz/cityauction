import assert from "node:assert/strict";
import { test } from "node:test";
import { loadSource } from "./helpers/source-loader.mjs";

const { accountAccessHref, accountView } = loadSource("src/components/account/access-route.ts");

test("account links share one page and preserve the requested tab", () => {
  assert.equal(accountAccessHref(), "/login");
  assert.equal(accountAccessHref("register"), "/login?view=register");
  assert.equal(accountAccessHref("callback"), "/login?view=callback");
});

test("account links preserve a listing return path including its query", () => {
  const destination = "/auctions/property-123?source=saved&tab=details";
  const link = new URL(accountAccessHref("register", destination), "https://cityauction.test");
  assert.equal(link.searchParams.get("view"), "register");
  assert.equal(link.searchParams.get("next"), destination);
});

test("legacy account redirects reject external destinations and authentication loops", () => {
  for (const destination of ["https://other.test", "//other.test", "/\\other.test", "/login?view=register", "/register", ["/dashboard"], "/dashboard\n", "/buyer/access?view=register", "/investor-login", "/financial-institution-login", "/auctions/../login", "/%6cogin", "/login#access", "/%2fother.test", "/%5cother.test"]) {
    assert.equal(accountAccessHref("register", destination), "/login?view=register");
  }
});

test("unknown or repeated tab parameters fall back to the entry point default", () => {
  assert.equal(accountView("register"), "register");
  assert.equal(accountView("callback"), "callback");
  assert.equal(accountView("unknown"), "login");
  assert.equal(accountView(["login", "register"]), "login");
  assert.equal(accountView(undefined, "register"), "register");
});
