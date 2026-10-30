import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { BUYER_CATEGORIES } from "@/lib/buyer";
import {
  DB_UNAVAILABLE,
  emailSchema,
  jsonError,
  phoneSchema,
  setSessionCookie,
  toSessionPayload,
  userWithRoles,
  validationError,
} from "@/app/api/auth/_lib";

const optionalText = (label: string) =>
  z
    .string()
    .trim()
    .max(80, `${label} is too long.`)
    .transform((value) => value || null);

// Email changes require OTP through /api/user/email. Phone is contact-only.
const schema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name.").max(120, "Name is too long."),
  email: z.union([z.literal(""), emailSchema]).transform((value) => value || null),
  phone: z.union([z.literal(""), phoneSchema]).optional().transform((v) => v === "" ? null : v),
  buyerCategory: z.union([z.literal(""), z.enum(BUYER_CATEGORIES.map((c) => c.value) as [string, ...string[]])]).transform((v) => v || null),
  city: optionalText("City"),
  state: optionalText("State"),
});

const EMAIL_TAKEN = "Another account already uses this email address.";

export async function PATCH(req: Request) {
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
    const current = await db.user.findUnique({
      where: { id: session.userId },
      select: { email: true, phone: true },
    });
    if (!current) return jsonError("Please sign in.", 401);
    if (input.email !== (current.email?.trim().toLowerCase() ?? null)) {
      return jsonError("Please verify the new email address using the email verification form.", 400);
    }

    const user = await db.user.update({
      where: { id: session.userId },
      data: {
        fullName: input.fullName,
        ...(input.phone !== undefined ? { phone: input.phone, ...(input.phone !== current.phone ? { isPhoneVerified: false } : {}) } : {}),
        buyerCategory: input.buyerCategory as never,
        city: input.city,
        state: input.state,

      },
      include: userWithRoles,
    });

    const response = NextResponse.json({
      success: true,
      message: "Profile saved.",
      profile: { fullName: user.fullName, email: user.email, city: user.city, state: user.state },
    });
    // The header shows the name from the session, so refresh it.
    await setSessionCookie(response, toSessionPayload(user));
    return response;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return jsonError(EMAIL_TAKEN, 409);
    console.error("[user/profile]", error);
    return jsonError(DB_UNAVAILABLE, 503);
  }
}
