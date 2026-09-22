import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { verifyPassword, signToken, COOKIE_NAME } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  loginAs: z.enum(["bidder", "banker"]).default("bidder"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, loginAs } = loginSchema.parse(body);
    const normalizedEmail = email.toLowerCase().trim();

    let userSession: {
      userId: string;
      email: string;
      fullName: string;
      accountType: string;
      roles: string[];
    } | null = null;

    try {
      const dbUser = await db.user.findUnique({
        where: { email: normalizedEmail },
        include: {
          roles: {
            include: { role: true },
          },
        },
      });

      if (dbUser && dbUser.passwordHash) {
        const isValid = await verifyPassword(password, dbUser.passwordHash);
        if (isValid) {
          userSession = {
            userId: dbUser.id,
            email: dbUser.email,
            fullName: dbUser.fullName || "User",
            accountType: dbUser.accountType || "INDIVIDUAL",
            roles: dbUser.roles.map((r) => r.role.name),
          };
        }
      }
    } catch (dbError) {
      // Database offline/not yet connected
    }

    // Demo credentials fallback for offline development & client evaluation
    if (!userSession) {
      if (normalizedEmail === "admin@cityauction.com" && password === "CityAuction@2026") {
        userSession = {
          userId: "usr-admin-1",
          email: "admin@cityauction.com",
          fullName: "Chief Auction Administrator",
          accountType: "INDIVIDUAL",
          roles: ["SUPER_ADMIN", "ADMIN"],
        };
      } else if (normalizedEmail === "bidder@cityauction.com" && password === "CityAuction@2026") {
        userSession = {
          userId: "usr-bidder-1",
          email: "bidder@cityauction.com",
          fullName: "Vikramaditya Sharma",
          accountType: "INDIVIDUAL",
          roles: ["BIDDER", "REGISTERED"],
        };
      }
    }

    if (!userSession) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password. Please check your credentials." },
        { status: 401 }
      );
    }

    const token = await signToken(userSession);

    const response = NextResponse.json({
      success: true,
      message: "Login successful!",
      user: userSession,
    });

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
