import type { Prisma } from "@prisma/client";
import { createHash, randomUUID } from "node:crypto";
import { db } from "@/lib/db";
import { writeAudit } from "./audit";
import type { AdminActor } from "./guard";
import { PublishingError, validatePublicationTime, type AuctionInput, type PropertyInput } from "./publishing-schema";
import { PROPERTY_CATEGORIES } from "@/lib/constants";
import { generateSlug } from "@/lib/utils";

const propertyInclude = { category: true, location: { include: { parent: true } }, organization: true, images: { orderBy: { sortOrder: "asc" } } } satisfies Prisma.PropertyInclude;
export async function publishingCatalog() {
  const [organizations, locations, properties] = await Promise.all([
    db.organization.findMany({ where: { isActive: true }, select: { id: true, name: true }, orderBy: { name: "asc" }, take: 500 }),
    db.location.findMany({ where: { type: { in: ["CITY", "LOCALITY"] } }, select: { id: true, name: true, parent: { select: { name: true } } }, orderBy: { name: "asc" }, take: 1000 }),
    db.property.findMany({ where: { deletedAt: null }, select: { id: true, title: true, updatedAt: true }, orderBy: { title: "asc" }, take: 500 }),
  ]);
  return { organizations, locations: locations.map((item) => ({ id: item.id, name: [item.name, item.parent?.name].filter(Boolean).join(", ") })), properties: properties.map((item) => ({ id: item.id, name: item.title, updatedAt: item.updatedAt.toISOString() })) };
}
export async function propertyRecord(id: string) {
  const property = await db.property.findFirst({ where: { id, deletedAt: null }, include: propertyInclude });
  return property ? { ...property, area: property.area?.toString() ?? "", estimatedValue: property.estimatedValue?.toString() ?? "", updatedAt: property.updatedAt.toISOString(), images: property.images.map((image) => image.url) } : null;
}
export async function auctionRecord(id: string) {
  const auction = await db.auction.findFirst({ where: { id, deletedAt: null }, include: { documents: true } });
  return auction ? { ...auction, reservePrice: auction.reservePrice.toString(), emd: auction.emd.toString(), bidIncrement: auction.bidIncrement.toString(),
    startDateTime: auction.startDateTime.toISOString(), endDateTime: auction.endDateTime.toISOString(), submissionDeadline: auction.submissionDeadline.toISOString(),
    inspectionDate: auction.inspectionDate?.toISOString() ?? "", updatedAt: auction.updatedAt.toISOString(), publishedAt: auction.publishedAt?.toISOString() ?? null,
    sourceVerifiedAt: auction.sourceVerifiedAt?.toISOString() ?? null } : null;
}

async function resolveLocation(tx: Prisma.TransactionClient, input: PropertyInput) {
  if (input.locationId) {
    const location = await tx.location.findUnique({ where: { id: input.locationId } });
    if (!location) throw new PublishingError("The selected location no longer exists.");
    if (!["CITY", "LOCALITY"].includes(location.type)) throw new PublishingError("Choose a city or locality, or enter the state and city.");
    return location.id;
  }
  const stateName = input.state!, cityName = input.city!.trim();
  const state = await tx.location.findFirst({ where: { name: stateName, type: "STATE" } }) ?? await tx.location.upsert({
    where: { slug: `state-${generateSlug(stateName)}` }, update: {}, create: { name: stateName, slug: `state-${generateSlug(stateName)}`, type: "STATE" },
  });
  const city = await tx.location.findFirst({ where: { name: cityName, parentId: state.id, type: "CITY" } }) ?? await tx.location.upsert({
    where: { slug: `city-${state.id}-${generateSlug(cityName).slice(0, 80) || "city"}-${createHash("sha256").update(cityName.toLowerCase()).digest("hex").slice(0, 10)}` }, update: {}, create: { name: cityName, slug: `city-${state.id}-${generateSlug(cityName).slice(0, 80) || "city"}-${createHash("sha256").update(cityName.toLowerCase()).digest("hex").slice(0, 10)}`, type: "CITY", parentId: state.id },
  });
  return city.id;
}
export async function saveProperty(input: PropertyInput, id: string | null, actor: AdminActor, req: Request) {
  return db.$transaction(async (tx) => {
    if (id) await tx.$queryRaw`SELECT id FROM properties WHERE id = ${id} FOR UPDATE`;
    const before = id ? await tx.property.findFirst({ where: { id, deletedAt: null }, include: { category: true } }) : null;
    if (id && !before) throw new PublishingError("Property not found.", 404);
    if (id && (!input.updatedAt || before!.updatedAt.toISOString() !== input.updatedAt)) throw new PublishingError("This property changed in another session. Reload before saving.", 409);
    if (id && await tx.bid.count({ where: { auction: { propertyId: id } } })) throw new PublishingError("This property has recorded bidding activity and cannot be edited here.", 409);
    const organization = await tx.organization.findFirst({ where: { id: input.organizationId, isActive: true } });
    if (!organization) throw new PublishingError("Select an active institution.");
    const categoryInfo = PROPERTY_CATEGORIES.find((item) => item.value === input.category)!;
    const category = await tx.propertyCategory.findFirst({ where: { type: input.category } }) ?? await tx.propertyCategory.upsert({
      where: { slug: categoryInfo.slug }, update: {}, create: { name: categoryInfo.label, type: input.category, slug: categoryInfo.slug },
    });
    if (category.type !== input.category) throw new PublishingError("The category record needs correction before this property can be saved.", 409);
    const locationId = await resolveLocation(tx, input);
    const data = { title: input.title, description: input.description || null, address: input.address, organizationId: organization.id,
      locationId, categoryId: category.id, possessionStatus: input.possessionStatus, area: input.area || null, areaUnit: input.areaUnit || null, estimatedValue: input.estimatedValue || null,
      ...(before && before.categoryId !== category.id ? { subTypeId: null } : {}) };
    let savedId = id;
    if (id) {
      const changed = await tx.property.updateMany({ where: { id, updatedAt: new Date(input.updatedAt!), deletedAt: null }, data });
      if (changed.count !== 1) throw new PublishingError("This property changed. Reload before saving.", 409);
      // Public notices must be reviewed against the changed asset details.
      await tx.auction.updateMany({ where: { propertyId: id, deletedAt: null }, data: { publishedAt: null, sourceVerifiedAt: null } });
      await tx.propertyImage.deleteMany({ where: { propertyId: id } });
    } else {
      const created = await tx.property.create({ data: { ...data, slug: `${generateSlug(input.title).slice(0, 140) || "property"}-${randomUUID().slice(0, 8)}` } });
      savedId = created.id;
    }
    if (input.images.length) await tx.propertyImage.createMany({ data: [...new Set(input.images)].map((url, index) => ({ propertyId: savedId!, url, sortOrder: index, isPrimary: index === 0, altText: input.title })) });
    await writeAudit(actor, req, { action: id ? "PROPERTY_UPDATED" : "PROPERTY_CREATED", entity: "Property", entityId: savedId!,
      newValue: { title: input.title, organizationId: input.organizationId, images: input.images.length, linkedNoticesRequireReview: Boolean(id) } }, tx);
    return savedId!;
  });
}

export async function saveAuction(input: AuctionInput, id: string | null, actor: AdminActor, req: Request) {
  validatePublicationTime(input);
  return db.$transaction(async (tx) => {
    // Serialize publication with property edits that withdraw linked notices.
    await tx.$queryRaw`SELECT id FROM properties WHERE id = ${input.propertyId} FOR UPDATE`;
    const property = await tx.property.findFirst({ where: { id: input.propertyId, deletedAt: null }, include: { organization: true } });
    if (!property || !property.organization.isActive) throw new PublishingError("Select a property belonging to an active institution.");
    const before = id ? await tx.auction.findFirst({ where: { id, deletedAt: null } }) : null;
    if (id && !before) throw new PublishingError("Auction not found.", 404);
    if (id && (!input.updatedAt || before!.updatedAt.toISOString() !== input.updatedAt)) throw new PublishingError("This auction changed in another session. Reload before saving.", 409);
    if (id && await tx.bid.count({ where: { auctionId: id } })) throw new PublishingError("This auction has recorded bidding activity and cannot be edited here.", 409);
    if (input.action === "publish" && property.updatedAt.toISOString() !== input.propertyUpdatedAt) throw new PublishingError("The selected property changed. Refresh choices, preview and review it again before publishing.", 409);
    if (input.action === "publish" && (!property.address?.trim() || !property.title?.trim())) throw new PublishingError("Complete the property title and address before publishing.");
    const published = input.action === "publish";
    const data = { auctionNumber: input.auctionNumber, propertyId: property.id, organizationId: property.organizationId, type: input.type,
      status: published ? input.status : "DRAFT" as const, reservePrice: input.reservePrice, emd: input.emd, bidIncrement: input.bidIncrement,
      startDateTime: new Date(input.startDateTime), endDateTime: new Date(input.endDateTime), submissionDeadline: new Date(input.submissionDeadline), inspectionDate: input.inspectionDate ? new Date(input.inspectionDate) : null,
      contactOfficerName: input.contactOfficerName || null, contactOfficerPhone: input.contactOfficerPhone || null, contactOfficerEmail: input.contactOfficerEmail || null,
      description: input.description || null, terms: input.terms || null, sourceListingId: input.sourceListingId || null,
      sourceVerifiedAt: published ? new Date() : null, publishedAt: published ? (before?.publishedAt ?? new Date()) : null };
    let savedId = id;
    if (id) {
      const changed = await tx.auction.updateMany({ where: { id, updatedAt: new Date(input.updatedAt!), deletedAt: null }, data });
      if (changed.count !== 1) throw new PublishingError("This auction changed. Reload before saving.", 409);
      await tx.auctionDocument.deleteMany({ where: { auctionId: id } });
    } else savedId = (await tx.auction.create({ data })).id;
    if (input.documents.length) await tx.auctionDocument.createMany({ data: input.documents.map((doc) => ({ ...doc, auctionId: savedId! })) });
    await writeAudit(actor, req, { action: published ? "AUCTION_PUBLISHED" : "AUCTION_DRAFT_SAVED", entity: "Auction", entityId: savedId!,
      previousValue: before ? { status: before.status, published: Boolean(before.publishedAt), source: before.sourceListingId } : undefined,
      newValue: { status: data.status, propertyId: property.id, source: data.sourceListingId, reservePrice: data.reservePrice, emd: data.emd, documents: input.documents.length } }, tx);
    return savedId!;
  });
}
export async function unpublishAuction(id: string, updatedAt: string, actor: AdminActor, req: Request) {
  return db.$transaction(async (tx) => {
    const result = await tx.auction.updateMany({ where: { id, updatedAt: new Date(updatedAt), deletedAt: null }, data: { publishedAt: null, sourceVerifiedAt: null } });
    if (result.count !== 1) throw new PublishingError("This auction changed or no longer exists. Reload before continuing.", 409);
    await writeAudit(actor, req, { action: "AUCTION_UNPUBLISHED", entity: "Auction", entityId: id }, tx);
    return id;
  });
}
