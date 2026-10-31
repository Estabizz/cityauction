import path from "node:path";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";

const mediaTypes = {
  "image/jpeg": { ext: "jpg", limit: 5 * 1024 * 1024 }, "image/png": { ext: "png", limit: 5 * 1024 * 1024 },
  "image/webp": { ext: "webp", limit: 5 * 1024 * 1024 }, "application/pdf": { ext: "pdf", limit: 10 * 1024 * 1024 },
} as const;
export function mediaDirectory(cwd = process.cwd(), configured = process.env.CITYAUCTION_UPLOAD_DIR) {
  if (configured) { if (!path.isAbsolute(configured)) throw new Error("Upload directory must be absolute."); return configured; }
  // Hostinger builds are replaced on deployment. Keep files in the domain's
  // persistent directory, outside every hbuilds version and the public root.
  const domain = cwd.match(/^(\/home\/[^/]+\/domains\/[^/]+)\/hbuilds\/versions\//)?.[1];
  if (domain) return path.join(domain, "private_storage", "cityauction_media");
  if (process.env.NODE_ENV === "production") throw new Error("Durable upload storage is not configured.");
  return path.join(cwd, ".local", "media");
}
export function validateMedia(bytes: Uint8Array, mime: string) {
  const type = mediaTypes[mime as keyof typeof mediaTypes];
  if (!type || !bytes.length || bytes.length > type.limit) throw new Error("Use JPG, PNG or WebP photos up to 5 MB, or PDF documents up to 10 MB.");
  const data = Buffer.from(bytes);
  const valid = mime === "image/jpeg" ? data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff :
    mime === "image/png" ? data.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])) :
    mime === "image/webp" ? data.toString("ascii", 0, 4) === "RIFF" && data.toString("ascii", 8, 12) === "WEBP" : data.toString("ascii", 0, 5) === "%PDF-";
  if (!valid) throw new Error("The file content does not match its declared type.");
  return type;
}
export async function storeMedia(bytes: Uint8Array, mime: string) {
  const type = validateMedia(bytes, mime), directory = mediaDirectory();
  const key = `${randomUUID()}.${type.ext}`;
  await mkdir(directory, { recursive: true, mode: 0o700 });
  await writeFile(path.join(directory, key), bytes, { flag: "wx", mode: 0o600 });
  return { key, url: `/api/media/${key}`, mimeType: mime, fileSize: bytes.length };
}
export function validMediaKey(key: string) { return /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}\.(jpg|png|webp|pdf)$/.test(key); }
export async function readMedia(key: string) {
  if (!validMediaKey(key)) return null;
  try {
    const bytes = await readFile(path.join(mediaDirectory(), key));
    const ext = key.split(".").pop();
    return { bytes, mime: ext === "pdf" ? "application/pdf" : ext === "jpg" ? "image/jpeg" : `image/${ext}` };
  } catch { return null; }
}
