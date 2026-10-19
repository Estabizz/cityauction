// Creates the base roles and the main admin account, then prints a one-time
// link where the admin chooses their own password (no password is stored in
// code or printed). Safe to re-run: it upserts, and each run issues a fresh link.
//
//   DATABASE_URL=... NEXT_PUBLIC_APP_URL=https://cityauction.in \
//     npx tsx scripts/bootstrap-admin.ts estabizz@gmail.com
import { randomBytes } from "node:crypto";
import { PrismaClient } from "@prisma/client";

const ROLES: Record<string, string> = {
  SUPER_ADMIN: "Full access, including managing admins",
  ADMIN: "Admin panel: leads, subscribers, users, site activity",
  REGISTERED: "Signed-up user",
  BIDDER: "Approved bidder",
};

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  if (!email) throw new Error("Usage: npx tsx scripts/bootstrap-admin.ts <admin-email>");
  const site = process.env.NEXT_PUBLIC_APP_URL || "https://cityauction.in";
  const db = new PrismaClient();

  try {
    for (const [name, description] of Object.entries(ROLES)) {
      await db.role.upsert({ where: { name }, update: { description }, create: { name, description } });
    }

    const token = randomBytes(32).toString("hex");
    const user = await db.user.upsert({
      where: { email },
      update: { passwordSetToken: token, passwordSetExpires: new Date(Date.now() + 24 * 3600 * 1000), isActive: true },
      create: {
        email,
        fullName: "CityAuction Admin",
        isActive: true,
        passwordSetToken: token,
        passwordSetExpires: new Date(Date.now() + 24 * 3600 * 1000),
      },
    });

    for (const name of ["SUPER_ADMIN", "ADMIN", "REGISTERED"]) {
      const role = await db.role.findUniqueOrThrow({ where: { name } });
      await db.userRole.upsert({
        where: { userId_roleId: { userId: user.id, roleId: role.id } },
        update: {},
        create: { userId: user.id, roleId: role.id },
      });
    }

    console.log(`Admin ready: ${email}`);
    console.log(`Set the password within 24 hours (one-time link, keep it private):`);
    console.log(`${site}/set-password?token=${token}`);
  } finally {
    await db.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
