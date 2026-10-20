import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// Stable form names. The admin panel groups and filters enquiries by these.
const SOURCES = {
  contact: { label: "Contact enquiry", phone: true, email: false },
  homepage: { label: "Homepage enquiry", phone: true, email: false },
  "auction-alerts": { label: "Personalised auction alert", phone: true, email: false },
  career: { label: "Career application", phone: true, email: true },
  "investor-desk": { label: "Investor desk review", phone: true, email: false },
  "liquidate-asset": { label: "Liquidate an asset", phone: false, email: true },
  "institutional-mandate": { label: "Institutional mandate", phone: false, email: true },
  "next-chapter": { label: "Next Chapter private discussion", phone: false, email: true },
} as const;

type Source = keyof typeof SOURCES;

const SAVE_FAILED_MESSAGE =
  "We couldn't save your enquiry just now. Please try again in a few minutes, or reach us directly on WhatsApp at +91 98256 69668 or email info@estabizz.com.";

const optionalText = (max: number) =>
  z.string().trim().max(max).optional().transform((v) => v || undefined);

const enquirySchema = z
  .object({
    source: z.enum(Object.keys(SOURCES) as [Source, ...Source[]], {
      error: "Unknown form",
    }),
    name: z.string().trim().min(2, "Please enter your name").max(150, "Name is too long"),
    email: z
      .union([z.literal(""), z.email("Please enter a valid email address").max(190)])
      .optional()
      .transform((v) => v?.toLowerCase() || undefined),
    phone: z
      .union([
        z.literal(""),
        z
          .string()
          .trim()
          .regex(/^\+?[\d\s\-()]{7,20}$/, "Please enter a valid mobile number")
          .refine((v) => v.replace(/\D/g, "").length >= 10, "Please enter a valid mobile number"),
      ])
      .optional()
      .transform((v) => v || undefined),
    subject: optionalText(250),
    message: optionalText(5000),
    pagePath: optionalText(500),
    auctionId: optionalText(50),
    // Each form's own answers (asset type, budget, location...). Stored in metadata.
    fields: z
      .record(z.string().max(80), z.string().max(2000))
      .optional()
      .refine((f) => !f || Object.keys(f).length <= 30, "Too many fields"),
    // Honeypot: hidden from people, bots tend to fill it in.
    hp: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const rules = SOURCES[data.source];
    if (rules.phone && !data.phone) {
      ctx.addIssue({ code: "custom", path: ["phone"], message: "Please enter your mobile number" });
    }
    if (rules.email && !data.email) {
      ctx.addIssue({ code: "custom", path: ["email"], message: "Please enter your email address" });
    }
    if (!data.phone && !data.email) {
      ctx.addIssue({ code: "custom", path: ["email"], message: "Please give us an email or mobile number" });
    }
  });

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message || "Please check the form and try again" },
      { status: 400 }
    );
  }
  const data = parsed.data;

  // Bots get a normal-looking reply, but nothing is stored.
  if (data.hp) {
    return NextResponse.json({ success: true, message: "Enquiry received." });
  }

  const fields = Object.fromEntries(
    Object.entries(data.fields ?? {})
      .map(([k, v]) => [k.trim(), v.trim()] as const)
      .filter(([k, v]) => k && v)
  );

  const user = await getCurrentUser();

  const record: Prisma.EnquiryUncheckedCreateInput = {
    name: data.name,
    email: data.email ?? "",
    phone: data.phone ?? "",
    subject: data.subject || SOURCES[data.source].label,
    message: data.message ?? "",
    source: data.source,
    pagePath: data.pagePath ?? null,
    metadata: Object.keys(fields).length ? fields : Prisma.JsonNull,
    auctionId: data.auctionId ?? null,
    userId: user?.userId ?? null,
    status: "NEW",
  };

  try {
    const enquiry = await createEnquiry(record);
    return NextResponse.json({
      success: true,
      message: "Enquiry received. The CityAuction team will contact you shortly.",
      data: { id: enquiry.id },
    });
  } catch (error) {
    console.error("[enquiries] could not save enquiry", { source: data.source, error });
    return NextResponse.json({ success: false, error: SAVE_FAILED_MESSAGE }, { status: 503 });
  }
}

async function createEnquiry(record: Prisma.EnquiryUncheckedCreateInput) {
  try {
    return await db.enquiry.create({ data: record, select: { id: true } });
  } catch (error) {
    // A stale session or unknown auction id breaks a foreign key; keep the lead without the link.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003" &&
      (record.userId || record.auctionId)
    ) {
      return db.enquiry.create({
        data: { ...record, userId: null, auctionId: null },
        select: { id: true },
      });
    }
    throw error;
  }
}
