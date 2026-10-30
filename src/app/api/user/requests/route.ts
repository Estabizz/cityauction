import { publicAuctionWhere } from "@/lib/public-auctions";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { formatMobile } from "@/lib/mobile";
import { REQUEST_SOURCES, requestReference } from "@/lib/requests";
import { propertyRequestMessage } from "@/lib/property-actions";
import { DB_UNAVAILABLE, jsonError, validationError } from "@/app/api/auth/_lib";

// Buyer service requests: site inspections, support questions and data
// access / deletion requests. Each is an Enquiry tied to the buyer (and to the
// listing for inspections), so the team works them from the admin Leads page.

const schema = z.object({
  type: z.enum(["inspection", "support", "data-access", "data-deletion"]),
  auctionId: z.string().trim().max(64).optional(),
  subject: z.string().trim().max(150, "Subject is too long.").optional(),
  message: z.string().trim().max(4000, "Message is too long.").optional().default(""),
  preferredDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Please pick a valid date.")
    .refine((v) => {
      const d = new Date(`${v}T00:00:00Z`);
      return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v;
    }, "Please pick a valid calendar date.")
    .optional()
    .transform((v) => (v ? new Date(`${v}T00:00:00+05:30`) : null)),
});

const OPEN_LIMIT_PER_DAY = 15;

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

  if (input.type === "inspection" && !input.auctionId) return jsonError("Missing listing.", 400);
  if (input.type === "support" && input.message.length < 5) return jsonError("Please tell us how we can help.", 400);
  if (input.preferredDate && input.preferredDate.getTime() < new Date(`${new Date(Date.now() + 19_800_000).toISOString().slice(0, 10)}T00:00:00+05:30`).getTime()) {
    return jsonError("Please pick today or a future date.", 400);
  }

  try {
    const recent = await db.enquiry.count({
      where: { userId: session.userId, createdAt: { gt: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
    });
    if (recent >= OPEN_LIMIT_PER_DAY) {
      return jsonError("You've sent a lot of requests today. Please wait for our team to get back to you.", 429);
    }

    const user = await db.user.findUnique({ where: { id: session.userId }, select: { fullName: true, email: true, mobile: true, phone: true } });
    if (!user) return jsonError("Please sign in.", 401);

    let auction: { id: string; auctionNumber: string; propertyId: string; property: { title: string } } | null = null;
    if (input.auctionId) {
      auction = await db.auction.findFirst({
        where: { AND: [publicAuctionWhere(), { id: input.auctionId }] },
        select: { id: true, auctionNumber: true, propertyId: true, property: { select: { title: true } } },
      });
      if (!auction) return jsonError("This listing isn't available for requests right now. Please contact us instead.", 404);
    }

    const subject =
      input.type === "inspection"
        ? `Site inspection: ${auction!.property.title} (${auction!.auctionNumber})`.slice(0, 190)
        : input.type === "data-access"
          ? "Request for a copy of my data"
          : input.type === "data-deletion"
            ? "Request to delete my account and data"
            : input.subject || (auction ? `Property enquiry: ${auction.property.title} (${auction.auctionNumber})`.slice(0, 190) : "Support request");

    const enquiry = await db.enquiry.create({
      data: {
        name: user.fullName || "Buyer",
        email: user.email || "",
        phone: formatMobile(user.mobile) || user.phone || "",
        subject,
        message: input.message || subject,
        source: REQUEST_SOURCES[input.type],
        pagePath: auction ? `/auctions/${auction.id}` : "/dashboard/requests",
        userId: session.userId,
        auctionId: auction?.id ?? null,
        propertyId: auction?.propertyId ?? null,
        preferredDate: input.preferredDate,
        metadata: { requestType: input.type },
      },
    });

    return NextResponse.json({
      success: true,
      message: input.type === "inspection" ? propertyRequestMessage("inspection") : input.type === "support" && auction ? propertyRequestMessage("contact") : "Request received. Track its progress in My enquiries.",
      reference: requestReference(enquiry.id),
      id: enquiry.id,
    });
  } catch (error) {
    console.error("[user/requests] POST", error);
    return jsonError(DB_UNAVAILABLE, 503);
  }
}
