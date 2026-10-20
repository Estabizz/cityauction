import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { jsonError, requireAdminApi } from "@/lib/admin/guard";
import { pageParams, userWhere } from "@/lib/admin/query";

export async function GET(req: Request) {
  const { actor, error } = await requireAdminApi();
  if (error) return error;

  try {
    const params = new URL(req.url).searchParams;
    const { page, pageSize, skip } = pageParams(params);
    const where = userWhere(params);

    const [total, rows] = await Promise.all([
      db.user.count({ where }),
      db.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
        // Never send password hashes or set-password tokens to the browser.
        select: {
          id: true,
          email: true,
          fullName: true,
          phone: true,
          city: true,
          state: true,
          accountType: true,
          isActive: true,
          isEmailVerified: true,
          createdAt: true,
          lastLoginAt: true,
          passwordHash: true,
          passwordSetExpires: true,
          roles: { select: { role: { select: { name: true } } } },
          _count: { select: { enquiries: true } },
        },
      }),
    ]);

    const now = Date.now();
    const data = rows.map(({ passwordHash, passwordSetExpires, roles, _count, ...user }) => ({
      ...user,
      roles: roles.map((r) => r.role.name),
      hasPassword: !!passwordHash,
      pendingLinkExpires: passwordSetExpires && passwordSetExpires.getTime() > now ? passwordSetExpires : null,
      leadCount: _count.enquiries,
    }));

    return NextResponse.json(
      {
        success: true,
        data,
        total,
        page,
        pageSize,
        viewer: { id: actor.id, isSuperAdmin: actor.isSuperAdmin },
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    console.error("[admin] users list failed", err);
    return jsonError("Could not load users.", 500);
  }
}
