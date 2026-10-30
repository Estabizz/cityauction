import { NextResponse } from "next/server";
import { getAuctions } from "@/services/auction.service";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const filters = {
      state: searchParams.get("state") || undefined,
      city: searchParams.get("city") || undefined,
      district: searchParams.get("district") || undefined,
      category: searchParams.get("category") || undefined,
      auctionType: searchParams.get("type") || undefined,
      status: searchParams.get("status") || undefined,
      possession: searchParams.get("possession") || undefined,
      minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
      maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
      keyword: searchParams.get("keyword") || searchParams.get("q") || undefined,
      sort: searchParams.get("sort") || "date_asc",
      page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
      limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 12,
    };

    const result = await getAuctions(filters);

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch auctions" },
      { status: 500 }
    );
  }
}
