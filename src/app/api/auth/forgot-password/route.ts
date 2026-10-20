import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { DB_UNAVAILABLE, emailSchema, jsonError, validationError } from "../_lib";

// There is no email service yet, so a reset request becomes an Enquiry with
// source "password-reset". Admins see it in the admin panel and issue a
// /set-password?token=... link (User.passwordSetToken, valid 24h).
const schema = z.object({ email: emailSchema });

const NEUTRAL =
  "If an account exists for this email, our team will send you a link to set a new password, usually within one working day.";

export async function POST(req: Request) {
  let email: string;
  try {
    ({ email } = schema.parse(await req.json()));
  } catch (error) {
    if (error instanceof z.ZodError) return validationError(error);
    return jsonError("Please check the form and try again.", 400);
  }

  try {
    const user = await db.user.findUnique({
      where: { email },
      select: { id: true, email: true, fullName: true, phone: true, isActive: true, deletedAt: true },
    });

    if (user && user.isActive && !user.deletedAt) {
      // One open request per hour is enough; don't flood the admin inbox.
      const recent = await db.enquiry.findFirst({
        where: {
          source: "password-reset",
          userId: user.id,
          status: "NEW",
          createdAt: { gt: new Date(Date.now() - 60 * 60 * 1000) },
        },
        select: { id: true },
      });

      if (!recent) {
        await db.enquiry.create({
          data: {
            name: user.fullName || user.email,
            email: user.email,
            phone: user.phone || "",
            subject: "Password reset request",
            message: `${user.email} asked to reset their password on the website. Issue a set-password link from the admin panel and send it to them.`,
            source: "password-reset",
            pagePath: "/forgot-password",
            userId: user.id,
          },
        });
      }
    }
  } catch (error) {
    // Fails the same way for every email, so it reveals nothing.
    console.error("[auth/forgot-password]", error);
    return jsonError(DB_UNAVAILABLE, 503);
  }

  return NextResponse.json({ success: true, message: NEUTRAL });
}
