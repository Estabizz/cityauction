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
export async function getCurrentUser(): Promise<UserSessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) return null;
    return await verifyToken(token);
  } catch (error) {
    return null;
  }
}

// 5. Require Auth Helper
export async function requireAuth(): Promise<UserSessionPayload> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}
