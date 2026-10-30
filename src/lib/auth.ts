import { cache } from "react";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { db } from "./db";

export {
  ADMIN_ROLES,
  COOKIE_NAME,
  isAdmin,
  signToken,
  verifyToken,
  type UserSessionPayload,
} from "./session-token";
import { COOKIE_NAME, verifyToken, type UserSessionPayload } from "./session-token";

// 1. Password Hashing
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// 4. Get Current User Session from Cookies (Server Components & Route Handlers)
// Also rejects sessions ended by "log out everywhere" (User.sessionVersion) and
// disabled accounts. proxy.ts only checks the signature, so this is the real gate.
export const getCurrentUser = cache(async (): Promise<UserSessionPayload | null> => {
  let session: UserSessionPayload | null;
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) return null;
    session = await verifyToken(token);
  } catch {
    return null;
  }
  if (!session) return null;

  try {
    const user = await db.user.findUnique({
      where: { id: session.userId },
      select: { sessionVersion: true, isActive: true, deletedAt: true },
    });
    if (!user || !user.isActive || user.deletedAt) return null;
    if ((session.sv ?? 0) !== user.sessionVersion) return null;
  } catch (error) {
    // A signature alone cannot establish whether the account or session is
    // still valid. Deny access when those checks cannot be completed.
    console.error("[auth] session check", error);
    return null;
  }
  return session;
});

// 5. Require Auth Helper
export async function requireAuth(): Promise<UserSessionPayload> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}
