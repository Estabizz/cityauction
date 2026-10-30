import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { defaultRequirementName, requirementSchema, withAllowedChannels } from "@/lib/requirement-schema";
import { DB_UNAVAILABLE, jsonError, validationError } from "@/app/api/auth/_lib";

const MAX_REQUIREMENTS = 20;

export async function GET() {
  const session = await getCurrentUser();
  if (!session) return jsonError("Please sign in.", 401);

  try {
    const data = await db.buyerRequirement.findMany({ where: { userId: session.userId }, orderBy: { createdAt: "desc" } });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("[user/requirements] GET", error);
    return jsonError(DB_UNAVAILABLE, 503);
  }
}

// Creates a requirement. `completeOnboarding` also marks the welcome step done.
export async function POST(req: Request) {
  const session = await getCurrentUser();
  if (!session) return jsonError("Please sign in.", 401);

  let input: z.infer<typeof requirementSchema>;
  let completeOnboarding = false;
  try {
    const body = await req.json();
    completeOnboarding = body?.completeOnboarding === true;
    input = requirementSchema.parse(body);
  } catch (error) {
    if (error instanceof z.ZodError) return validationError(error);
    return jsonError("Please check the form and try again.", 400);
  }

  try {
    const count = await db.buyerRequirement.count({ where: { userId: session.userId } });
    if (count >= MAX_REQUIREMENTS) {
      return jsonError(`You can keep up to ${MAX_REQUIREMENTS} requirements. Please delete one you no longer need.`, 400);
    }

    const [record] = await db.$transaction([
      db.buyerRequirement.create({
        data: { ...(await withAllowedChannels(input, session.userId)), name: input.name || defaultRequirementName(input), userId: session.userId },
      }),
      ...(completeOnboarding
        ? [db.user.updateMany({ where: { id: session.userId, onboardedAt: null }, data: { onboardedAt: new Date() } })]
        : []),
    ]);
    return NextResponse.json({ success: true, message: "Requirement saved.", data: record });
  } catch (error) {
    console.error("[user/requirements] POST", error);
    return jsonError(DB_UNAVAILABLE, 503);
  }
}
