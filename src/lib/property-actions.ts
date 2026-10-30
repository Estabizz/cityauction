import { accountAccessHref } from "@/components/account/access-route";

export const PROPERTY_ACTIONS = {
  save: "Save property",
  saved: "Property saved",
  remove: "Remove from saved properties",
  inspection: "Request inspection",
  contact: "Contact team",
  savedMessage: "Property saved. Find it in Saved properties.",
  removedMessage: "Property removed from Saved properties.",
};

export type PropertyRequestKind = "inspection" | "contact";
export function propertySignInHref(auctionId: string, action: "save" | PropertyRequestKind) {
  return accountAccessHref("login", `/auctions/${encodeURIComponent(auctionId)}?action=${action}#${action === "save" ? "property-save" : "property-actions"}`);
}

export function propertyRequestMessage(kind: PropertyRequestKind) {
  return kind === "inspection" ? "Inspection request sent. Our team will contact you to confirm availability and a date." : "Message sent. Our team will contact you about this property.";
}
