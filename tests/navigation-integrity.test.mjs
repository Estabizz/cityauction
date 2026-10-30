import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { loadSource } from "./helpers/source-loader.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
function files(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? files(path.join(directory, entry.name)) : [path.join(directory, entry.name)]);
}
const sourceFiles = files(path.join(root, "src")).filter((file) => /\.(tsx|ts)$/.test(file));
const pagePatterns = sourceFiles.filter((file) => file.endsWith("/page.tsx")).map((file) => {
  const route = "/" + path.relative(path.join(root, "src/app"), path.dirname(file)).split(path.sep).filter((part) => part && !part.startsWith("(")).join("/");
  return new RegExp("^" + route.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\\\[.*?\\\]/g, "[^/]+") + "/?$");
});
function links() {
  return sourceFiles.flatMap((file) => {
    const source = fs.readFileSync(file, "utf8");
    return [...source.matchAll(/(?:href=|(?:href|link):\s*)["'](\/[^"']*)["']/g)].map((match) => ({ file: path.relative(root, file), href: match[1] }));
  });
}

test("public navigation and resource links resolve to existing pages", () => {
  for (const { file, href } of links()) {
    const pathname = href.split(/[?#]/)[0];
    assert.ok(pagePatterns.some((pattern) => pattern.test(pathname)) || fs.existsSync(path.join(root, "public", pathname)), `${file}: missing page ${href}`);
  }
});

test("literal auction navigation links use supported search filters", () => {
  const { parseAuctionSearchParams } = loadSource("src/lib/auction-search.ts");
  for (const { file, href } of links().filter(({ href }) => href.startsWith("/auctions?"))) {
    assert.doesNotThrow(() => parseAuctionSearchParams(new URL(href, "https://cityauction.test").searchParams), `${file}: invalid filters ${href}`);
  }
});
