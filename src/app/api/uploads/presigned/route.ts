import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { FILE_UPLOAD_LIMITS } from "@/lib/constants";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { fileName, fileType, fileSize, documentType } = body;

    // Validate size
    if (fileSize > FILE_UPLOAD_LIMITS.maxDocumentSize) {
      return NextResponse.json(
        { success: false, error: "File size exceeds statutory maximum of 10MB" },
        { status: 400 }
      );
    }

    // Validate MIME type
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(fileType)) {
      return NextResponse.json(
        { success: false, error: "Only PDF, PNG, JPG, and WEBP documents are permitted." },
        { status: 400 }
      );
    }

    // Unique storage key
    const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileKey = `kyc/${user.userId}/${Date.now()}_${cleanFileName}`;

    // Return S3 presigned URL or direct upload path
    return NextResponse.json({
      success: true,
      data: {
        uploadUrl: `/api/uploads/direct`,
        fileKey,
        publicUrl: `https://cdn.cityauction.com/${fileKey}`,
        documentType,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}
