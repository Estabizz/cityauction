import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/auth";
import { safeNextPath } from "@/components/account/safe-next";
import {
  DB_UNAVAILABLE,
  homeFor,
  jsonError,
  setSessionCookie,
  toSessionPayload,
  userWithRoles,
  validationError,
} from "../_lib";

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Please enter a valid email address."),
  password: z.string().min(1, "Please enter your password."),
  next: z.string().optional(),
  // Older forms (investor / financial institution login) still send this; it is ignored.
  loginAs: z.string().optional(),
});

const INVALID = "Incorrect email or password.";

// Compared against when the email is unknown, so both cases take about as long
// and response timing doesn't reveal which emails have accounts.
const DUMMY_HASH = "$2b$10$bCF0Ec2jVGTaHVyXhpnUx.aOcIMFwBqUj4Rxv4ifzFP2oY6EW061y";

export async function POST(req: Request) {
  let input: z.infer<typeof loginSchema>;
  try {
    input = loginSchema.parse(await req.json());
  } catch (error) {
    if (error instanceof z.ZodError) return validationError(error);
    return jsonError("Please check the form and try again.", 400);
  }

  let user;
  try {
    user = await db.user.findUnique({ where: { email: input.email }, include: userWithRoles });
  } catch (error) {
    console.error("[auth/login]", error);
    return jsonError(DB_UNAVAILABLE, 503);
  }

  const passwordOk = await verifyPassword(input.password, user?.passwordHash || DUMMY_HASH);
  if (!user || !user.passwordHash || !passwordOk) return jsonError(INVALID, 401);
  if (!user.isActive || user.deletedAt) {
    return jsonError("This account has been disabled. Please contact info@estabizz.com.", 403);
  }

  try {
    await db.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  } catch (error) {
    // Not worth failing the sign-in over.
    console.error("[auth/login] lastLoginAt", error);
  }

  const payload = toSessionPayload(user);
  const response = NextResponse.json({
    success: true,
    message: "Signed in.",
    user: payload,
    redirectTo: safeNextPath(input.next) || homeFor(payload),
  });
  await setSessionCookie(response, payload);
  return response;
}
