import { NextResponse } from "next/server";
import { getOrganizations } from "@/services/organization.service";

export async function GET() {
  try {
    const data = await getOrganizations();
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch organizations" },
      { status: 500 }
    );
  }
}
