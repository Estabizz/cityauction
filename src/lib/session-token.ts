import { SignJWT, jwtVerify } from "jose";

// Session token helpers with no database or next/headers imports, so they can
// run in proxy.ts as well as in route handlers and server components.

// AUTH_SECRET must be set (32+ random characters) in production; the old
// hard-coded fallback was public in the repo, so anyone could forge sessions.
function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (secret && secret.length >= 32) return new TextEncoder().encode(secret);
  if (process.env.NODE_ENV !== "production") {
    return new TextEncoder().encode("dev-only-insecure-secret-change-me-0123456789");
  }
  throw new Error("AUTH_SECRET is not set (needs at least 32 characters).");
}

export const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN"];

export function isAdmin(session: { roles?: string[] } | null | undefined): boolean {
  return !!session?.roles?.some((role) => ADMIN_ROLES.includes(role));
}

export const COOKIE_NAME = "cityauction_auth_token";

export interface UserSessionPayload {
  userId: string;
  email: string;
  fullName: string;
  accountType: string;
  roles: string[];
}

// 2. JWT Signing
export async function signToken(payload: UserSessionPayload, expiry = "7d"): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiry)
    .sign(getSecret());
}

// 3. JWT Verification
export async function verifyToken(token: string): Promise<UserSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as UserSessionPayload;
  } catch (error) {
    return null;
  }
}

