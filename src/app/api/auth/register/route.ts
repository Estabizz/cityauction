import { emailVerificationFields, verifyEmailChallenge } from "@/lib/email-verification";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { ATTRIBUTION_COOKIE, parseAttribution } from "@/lib/attribution";
import { BUYER_CATEGORIES } from "@/lib/buyer";
import { recordMarketingChoices, recordTermsAcceptance } from "@/lib/consent";
import { defaultRequirementName, requirementSchema } from "@/lib/requirement-schema";
import { formatMobile, normalizeMobile } from "@/lib/mobile";
import { OtpError } from "@/lib/otp";
import { safeNextPath } from "@/components/account/safe-next";
import {
  DB_UNAVAILABLE,
  emailSchema,
  homeFor,
  jsonError,
  passwordSchema,
  setSessionCookie,
  toSessionPayload,
  userWithRoles,
  validationError,
} from "../_lib";

// Sign-up with a verified email address. The form sends the OTP
// first via /api/auth/otp/send (purpose "register"), then posts here with it.
const registerSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name.").max(120, "Name is too long."),
  countryCode: z.string().trim().default("91"),
  mobile: z.string().trim().max(25).optional().default(""),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  buyerCategory: z.enum(BUYER_CATEGORIES.map((c) => c.value) as [string, ...string[]], {
    error: "Please choose what best describes you.",
  }),
  acceptTerms: z.literal(true, { error: "Please accept the Terms and Privacy Notice to continue." }),
  marketingOptIn: z.boolean().default(false),
  ...emailVerificationFields,
  next: z.string().optional(),
  // From the buyer access page, which asks for preferences before the OTP.
  // `preferences` becomes the buyer's first requirement; `onboarded` means the
  // preferences step was shown (even if skipped), so don't show it again.
  preferences: requirementSchema.optional(),
  onboarded: z.boolean().optional(),
}).refine((value) => value.password === value.confirmPassword, {
  message: "The two passwords don't match.", path: ["confirmPassword"],
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

  const mobile = input.mobile ? normalizeMobile(input.countryCode, input.mobile) : null;
  if (input.mobile && !mobile) return jsonError("Please enter a valid mobile number.", 400);

  try {
    const emailOwner = await db.user.findUnique({ where: { email: input.email }, include: userWithRoles });
    if (emailOwner) {
      // An existing user can enter through sign-up. Email ownership must still
      // be verified before issuing a session; never overwrite their profile or consent.
      if (!emailOwner.isActive || emailOwner.deletedAt) return jsonError("This account is unavailable. Please contact support.", 403);
      if (!emailOwner.isEmailVerified) return jsonError("This existing account needs recovery. Please contact support.", 403);
      await verifyEmailChallenge(input, input.email, "register", async (tx) => {
        const { count } = await tx.user.updateMany({
          where: { id: emailOwner.id, email: input.email, isActive: true, deletedAt: null, isEmailVerified: true, sessionVersion: emailOwner.sessionVersion },
          data: { lastLoginAt: new Date() },
        });
        if (count !== 1) throw new OtpError("Your account changed during verification. Please start again.");
      });
      const payload = toSessionPayload(emailOwner);
      const response = NextResponse.json({ success: true, existingAccount: true, message: "You already have an account. Signed in successfully.", user: payload, redirectTo: safeNextPath(input.next) || homeFor(payload) });
      await setSessionCookie(response, payload);
      return response;
    }

    const attribution = parseAttribution((await cookies()).get(ATTRIBUTION_COOKIE)?.value);
    const marketing = {
      SMS: false,
      WHATSAPP: false,
      // Email updates only make sense with an email address.
      EMAIL: input.marketingOptIn && !!input.email,
    };

    let user: Prisma.UserGetPayload<{ include: typeof userWithRoles }> | undefined;
    const passwordHash = await hashPassword(input.password);
    await verifyEmailChallenge(input, input.email, "register", async (tx) => {
      const created = await tx.user.create({
        data: {
          fullName: input.fullName,
          passwordHash,
          phone: mobile ? formatMobile(mobile) : null,
          isPhoneVerified: false,
          isEmailVerified: true,
          email: input.email,
          buyerCategory: input.buyerCategory as never,
          accountType: input.buyerCategory === "BUSINESS_BUYER" ? "ORGANIZATION" : "INDIVIDUAL",
          marketingSms: marketing.SMS,
          marketingWhatsapp: marketing.WHATSAPP,
          marketingEmail: marketing.EMAIL,
          attribution: attribution ?? undefined,
          onboardedAt: input.onboarded ? new Date() : null,
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
      await recordTermsAcceptance(tx, created.id, "register", req);
      await recordMarketingChoices(tx, created.id, marketing, "register", req);
      const prefs = input.preferences;
      if (prefs && (prefs.assetClasses.length || prefs.cities.length || prefs.budgetRange || prefs.objective || prefs.timeline)) {
        await tx.buyerRequirement.create({
          data: {
            ...prefs,
            name: prefs.name || defaultRequirementName(prefs),
            alertChannels: ["EMAIL"],
            userId: created.id,
          },
        });
      }
      user = created;
    });

    if (!user) throw new Error("Registration did not create an account.");

    const payload = toSessionPayload(user);
    const next = safeNextPath(input.next);
    const response = NextResponse.json({
      success: true,
      message: "Welcome to CityAuction!",
      user: payload,
      // Short, skippable preferences step first (unless already asked); it sends them on to `next`.
      redirectTo: input.onboarded
        ? next || "/dashboard"
        : next
          ? `/dashboard/welcome?next=${encodeURIComponent(next)}`
          : "/dashboard/welcome",
    });
    await setSessionCookie(response, payload);
    return response;
  } catch (error) {
    if (error instanceof OtpError) return jsonError(error.message, error.status);
    // Two sign-ups with the same email at the same moment.
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return jsonError(EMAIL_TAKEN, 409);
    }
    console.error("[auth/register]", error);
    return jsonError(DB_UNAVAILABLE, 503);
  }
}
