import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { safeNextPath } from "@/components/account/safe-next";
import {
  DB_UNAVAILABLE,
  emailSchema,
  homeFor,
  jsonError,
  passwordSchema,
  phoneSchema,
  setSessionCookie,
  toSessionPayload,
  userWithRoles,
  validationError,
} from "../_lib";

const registerSchema = z
  .object({
    fullName: z.string().trim().min(2, "Please enter your full name.").max(120, "Name is too long."),
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string().optional(),
    next: z.string().optional(),
  })
  .refine((data) => data.confirmPassword === undefined || data.confirmPassword === data.password, {
    message: "The two passwords don't match.",
  });

const EMAIL_TAKEN = "An account with this email already exists. Please sign in instead.";

export async function POST(req: Request) {
  let input: z.infer<typeof registerSchema>;
  try {
    input = registerSchema.parse(await req.json());
  } catch (error) {
    if (error instanceof z.ZodError) return validationError(error);
    return jsonError("Please check the form and try again.", 400);
  }

  try {
    const existing = await db.user.findUnique({ where: { email: input.email }, select: { id: true } });
    if (existing) return jsonError(EMAIL_TAKEN, 409);

    const user = await db.user.create({
      data: {
        fullName: input.fullName,
        email: input.email,
        phone: input.phone,
        passwordHash: await hashPassword(input.password),
        accountType: "INDIVIDUAL",
        lastLoginAt: new Date(),
        roles: {
          create: {
            role: {
              connectOrCreate: {
                where: { name: "REGISTERED" },
                create: { name: "REGISTERED", description: "Signed-up user" },
              },
            },
          },
        },
      },
      include: userWithRoles,
    });

    const payload = toSessionPayload(user);
    const response = NextResponse.json({
      success: true,
      message: "Welcome to CityAuction!",
      user: payload,
      redirectTo: safeNextPath(input.next) || homeFor(payload),
    });
    await setSessionCookie(response, payload);
    return response;
  } catch (error) {
    // Two sign-ups with the same email at the same moment.
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return jsonError(EMAIL_TAKEN, 409);
    }
    console.error("[auth/register]", error);
    return jsonError(DB_UNAVAILABLE, 503);
  }
}
