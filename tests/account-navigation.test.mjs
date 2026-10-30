import assert from "node:assert/strict";
import { test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadSource } from "./helpers/source-loader.mjs";

const member = { fullName: "Existing buyer", email: "buyer@example.test", isAdmin: false };
const Link = ({ href, children, ...props }) => React.createElement("a", { href, ...props }, children);

function headerFor(session) {
  const { Header } = loadSource("src/components/layout/header.tsx", {
    "next/link": Link,
    "next/image": () => null,
    "next/navigation": { usePathname: () => "/auctions/example" },
    "@/components/account/account-menu": { useHeaderSession: () => session, AccountMenu: () => React.createElement("span", null, "Your account") },
    "@/components/account/logout-button": { LogoutButton: () => null },
  });
  return renderToStaticMarkup(React.createElement(Header));
}

test("signed-in navigation offers the account instead of sign-up or login", () => {
  const html = headerFor(member);
  assert.match(html, /Your account/);
  assert.doesNotMatch(html, /Create account|Sign in|href="\/login/);
});

test("signed-out navigation preserves the current listing for both account entries", () => {
  const html = headerFor(null);
  assert.match(html, /Create account/);
  assert.match(html, /href="\/login\?next=%2Fauctions%2Fexample"/);
  assert.match(html, /href="\/login\?view=register&amp;next=%2Fauctions%2Fexample"/);
});

test("unresolved account state never flashes sign-up controls", () => {
  const html = headerFor(undefined);
  assert.match(html, /Checking account/);
  assert.doesNotMatch(html, /Create account|Sign in/);
});

for (const [admin, next, expected] of [[false, undefined, "/dashboard"], [true, undefined, "/admin/dashboard"], [false, "/auctions/example", "/auctions/example"], [false, "/buyer/access", "/dashboard"]]) {
  test(`signed-in visitors skip account creation and reach ${expected}`, async () => {
    const { default: LoginPage } = loadSource("src/app/(auth)/login/page.tsx", {
      "next/navigation": { redirect: (destination) => { throw Object.assign(new Error("redirect"), { destination }); } },
      "@/lib/auth": { getCurrentUser: async () => member, isAdmin: () => admin },
      "@/components/account/account-access": { AccountAccess: () => { throw new Error("Signed-in visitor saw the registration form"); } },
    });
    await assert.rejects(LoginPage({ searchParams: Promise.resolve({ view: "register", next }) }), (error) => error.destination === expected);
  });
}

for (const [session, expected, forbidden] of [[null, "Sign in to CityAuction", "My dashboard"], [member, "My dashboard", "Sign in"], [{ ...member, isAdmin: true }, "Admin panel", "Sign in"]]) {
  test(`footer account entry matches session: ${expected}`, () => {
    const { FooterAccountLink } = loadSource("src/components/account/footer-account-links.tsx", {
      "next/link": Link,
      "./session-provider": { useHeaderSession: () => session },
    });
    const html = renderToStaticMarkup(React.createElement(FooterAccountLink, { institutional: true }));
    assert.match(html, new RegExp(expected));
    assert.doesNotMatch(html, new RegExp(forbidden));
  });
}
