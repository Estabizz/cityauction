"use client";

import { AccountAccess } from "@/components/account/account-access";
import type { AccountView } from "@/components/account/access-route";

export type AccessView = AccountView;

// Compatibility export: there is one account experience for every entry point.
export function BuyerAccess({ initialView, next }: { initialView: AccessView; next?: string }) {
  return <AccountAccess initialView={initialView} next={next} />;
}
