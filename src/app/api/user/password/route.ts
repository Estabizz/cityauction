import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser, hashPassword, verifyPassword } from "@/lib/auth";
import {
  DB_UNAVAILABLE, jsonError, passwordSchema, setSessionCookie,
  toSessionPayload, userWithRoles, validationError,
} from "@/app/api/auth/_lib";

const schema = z
  .object({
    currentPassword: z.string().min(1, "Please enter your current password."),
    newPassword: passwordSchema,
    confirmPassword: z.string().optional(),
  })
  .refine((data) => data.confirmPassword === undefined || data.confirmPassword === data.newPassword, {
    message: "The two new passwords don't match.",
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "Your new password must be different from the current one.",
  });

export async function POST(req: Request) {
  const session = await getCurrentUser();
  if (!session) return jsonError("Please sign in.", 401);

  let input: z.infer<typeof schema>;
  try {
    input = schema.parse(await req.json());
  } catch (error) {
    if (error instanceof z.ZodError) return validationError(error);
    return jsonError("Please check the form and try again.", 400);
  }

  try {
    const user = await db.user.findUnique({ where: { id: session.userId }, select: { passwordHash: true } });
    if (!user?.passwordHash || !(await verifyPassword(input.currentPassword, user.passwordHash))) {
      return jsonError("Your current password is incorrect.", 400);
    }

    const updated = await db.user.update({
      where: { id: session.userId },
      // Also void any outstanding set-password link.
      data: {
        passwordHash: await hashPassword(input.newPassword),
        passwordSetToken: null,
        passwordSetExpires: null,
        sessionVersion: { increment: 1 },
      },
      include: userWithRoles,
    });
    // Keep this device signed in with the new version; all older tokens expire.
    const response = NextResponse.json({ success: true, message: "Password changed." });
    await setSessionCookie(response, toSessionPayload(updated));
    return response;
  } catch (error) {
    console.error("[user/password]", error);
    return jsonError(DB_UNAVAILABLE, 503);
  }
}
