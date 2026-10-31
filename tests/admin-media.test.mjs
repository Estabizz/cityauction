import assert from "node:assert/strict";
import { test } from "node:test";
import { loadSource } from "./helpers/source-loader.mjs";

function storage(environment = {}, overrides = {}) {
  const files = new Map(); const writes = [];
  const module = loadSource("src/lib/admin/media-storage.ts", { "node:fs/promises": {
    mkdir: async (...args) => writes.push({ type: "mkdir", args }),
    writeFile: async (path, data, options) => { writes.push({ type: "file", options }); files.set(path, Buffer.from(data)); },
    readFile: async (path) => { if (!files.has(path)) throw new Error("missing"); return files.get(path); }, ...overrides,
  } }, { process: { env: environment, cwd: () => "/workspace/project" } });
  return { ...module, files, writes };
}
const pdf = Buffer.from("%PDF-1.7\nA test notice file.");
const png = Buffer.from([137,80,78,71,13,10,26,10,0,0,0,0]);

test("Hostinger media lives outside replaceable builds; other production hosts need explicit durable storage", () => {
  const s = storage({ NODE_ENV: "production" });
  assert.equal(s.mediaDirectory("/home/account/domains/cityauction.in/hbuilds/versions/release/nodejs"), "/home/account/domains/cityauction.in/private_storage/cityauction_media");
  assert.equal(s.mediaDirectory("/any/build", "/mnt/persistent/media"), "/mnt/persistent/media");
  assert.throws(() => s.mediaDirectory("/any/build"), /not configured/);
  assert.throws(() => s.mediaDirectory("/any/build", "relative/path"), /absolute/);
});
test("file signatures and byte limits reject executable content, wrong MIME and oversize files", () => {
  const s = storage();
  assert.equal(s.validateMedia(pdf, "application/pdf").ext, "pdf"); assert.equal(s.validateMedia(png, "image/png").ext, "png");
  for (const [bytes, mime] of [[Buffer.from("<html>bad</html>"), "application/pdf"], [pdf, "image/png"], [png, "image/svg+xml"], [Buffer.alloc(0), "image/jpeg"], [Buffer.alloc(5 * 1024 * 1024 + 1), "image/png"]]) assert.throws(() => s.validateMedia(bytes, mime));
});
test("stored files use random names, private permissions and exclusive writes, and can be read without path traversal", async () => {
  const s = storage(); const first = await s.storeMedia(pdf, "application/pdf"); const second = await s.storeMedia(pdf, "application/pdf");
  assert.notEqual(first.key, second.key); assert.equal(s.validMediaKey(first.key), true); assert.equal(first.url, `/api/media/${first.key}`);
  const read = await s.readMedia(first.key); assert.equal(read.mime, "application/pdf"); assert.deepEqual(read.bytes, pdf);
  for (const key of ["../../secret", "file.pdf", first.key + "/../secret", "\\secret", "<script>"]) { assert.equal(s.validMediaKey(key), false); assert.equal(await s.readMedia(key), null); }
  const writes = s.writes.filter((write) => write.type === "file"); assert.equal(writes[0].options.flag, "wx"); assert.equal(writes[0].options.mode, 0o600);
});
test("storage failures propagate instead of reporting successful uploads", async () => {
  const s = storage({}, { writeFile: async () => { throw new Error("disk full"); } });
  await assert.rejects(s.storeMedia(pdf, "application/pdf"), /disk full/);
});

test("media serving checks publication or a fresh admin session before reading a private file", async () => {
  const key = "12345678-1234-4123-8123-123456789abc.pdf";
  for (const [published, admin, expected] of [[false, false, 404], [false, true, 200], [true, false, 200]]) {
    let reads = 0; let query;
    const { GET } = loadSource("src/app/api/media/[key]/route.ts", {
      "@/lib/db": { db: { auction: { findFirst: async (input) => { query = input; return published ? { id: "notice" } : null; } } } },
      "@/lib/admin/guard": { getAdminActor: async () => admin ? { id: "admin" } : null },
      "@/lib/admin/media-storage": { validMediaKey: () => true, readMedia: async () => { reads++; return { bytes: pdf, mime: "application/pdf" }; } },
    });
    const response = await GET(null, { params: Promise.resolve({ key }) });
    assert.equal(response.status, expected); assert.equal(reads, expected === 200 ? 1 : 0);
    assert.match(JSON.stringify(query), /"isPublic":true/); assert.match(JSON.stringify(query), /sourceVerifiedAt/);
    if (response.status === 200) { assert.equal(response.headers.get("x-content-type-options"), "nosniff"); assert.equal(response.headers.get("cache-control"), "private, no-store"); }
  }
});
test("upload endpoints refuse non-admins and cross-origin writes before parsing file bytes", async () => {
  for (const admin of [true, false]) {
    let writes = 0;
    const { POST } = loadSource("src/app/api/admin/media/route.ts", {
      "@/lib/db": { db: {} }, "@/lib/admin/audit": { writeAudit() {} },
      "@/lib/admin/guard": { requireAdminApi: async () => admin ? { actor: { id: "admin" } } : { error: new Response(null, { status: 403 }) }, jsonError: (error, status = 400) => Response.json({ error }, { status }) },
      "@/lib/same-origin": { isSameOriginRequest: () => false }, "@/lib/admin/media-storage": { storeMedia: () => { writes++; } },
    });
    assert.equal((await POST(new Request("https://site.test/api/admin/media", { method: "POST" }))).status, 403); assert.equal(writes, 0);
  }
});

for (const succeeds of [true, false]) {
  test(`multipart upload reports ${succeeds ? "confirmed storage" : "storage failure"} accurately`, async () => {
    let writes = 0;
    const actual = storage();
    const { POST } = loadSource("src/app/api/admin/media/route.ts", {
      "@/lib/db": { db: { auditLog: { count: async () => 0 } } }, "@/lib/admin/audit": { writeAudit: async () => {} },
      "@/lib/admin/guard": { requireAdminApi: async () => ({ actor: { id: "admin" } }), jsonError: (error, status = 400) => Response.json({ success: false, error }, { status }) },
      "@/lib/same-origin": { isSameOriginRequest: () => true },
      "@/lib/admin/media-storage": { validateMedia: actual.validateMedia, storeMedia: async (bytes, mime) => { writes++; assert.equal(mime, "application/pdf"); assert.deepEqual(Buffer.from(bytes), pdf); if (!succeeds) throw new Error("Unavailable storage"); return { key: "safe.pdf", url: "/api/media/safe.pdf", mimeType: mime, fileSize: bytes.length }; } },
    });
    const form = new FormData(); form.set("file", new Blob([pdf], { type: "application/pdf" }), "notice.pdf");
    const response = await POST(new Request("https://site.test/api/admin/media", { method: "POST", body: form }));
    const result = await response.json(); assert.equal(writes, 1); assert.equal(result.success, succeeds); assert.equal(response.status, succeeds ? 200 : 503);
    if (succeeds) assert.equal(result.data.name, "notice.pdf"); else assert.equal(result.data, undefined);
  });
}
