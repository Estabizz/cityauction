import { NextResponse } from "next/server";
import { getCategories } from "@/services/property.service";

export async function GET() {
  try {
    const data = await getCategories();
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
