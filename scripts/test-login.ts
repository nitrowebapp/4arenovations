// Smoke test: verifies the seeded admin credentials
import bcrypt from "bcryptjs";
import { prisma } from "../lib/db";

async function main() {
  const u = await prisma.adminUser.findUnique({
    where: { email: "admin@4arenovation.com" },
  });
  const ok = u ? await bcrypt.compare("admin123", u.passwordHash) : false;
  console.log("user found:", !!u, "| senha admin123 ok:", ok);
  if (!ok) throw new Error("Admin credentials check failed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
