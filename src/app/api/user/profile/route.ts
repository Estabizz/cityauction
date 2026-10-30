import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import {
  DB_UNAVAILABLE,
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

const schema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name.").max(120, "Name is too long."),
  phone: z.union([z.literal(""), phoneSchema]).transform((value) => value || null),
  city: optionalText("City"),
  state: optionalText("State"),
});

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
    const user = await db.user.update({
      where: { id: session.userId },
      data: input,
      include: userWithRoles,
    });

    const response = NextResponse.json({
      success: true,
      message: "Profile saved.",
      profile: { fullName: user.fullName, phone: user.phone, city: user.city, state: user.state },
    });
    // The header shows the name from the session, so refresh it.
    await setSessionCookie(response, toSessionPayload(user));
    return response;
  } catch (error) {
    console.error("[user/profile]", error);
    return jsonError(DB_UNAVAILABLE, 503);
  }
}
