import { NextResponse } from "next/server";

// These workflows are not live. Do not import the legacy demo services from
// their route handlers: they can accept bids or mark payments as cleared.
export function marketplaceUnavailable(feature: string) {
  return NextResponse.json(
    {
      success: false,
      code: "FEATURE_NOT_AVAILABLE",
      error: `${feature} is not available on CityAuction yet. Please contact our team for assistance.`,
    },
    { status: 503, headers: { "Cache-Control": "no-store" } }
  );
}
