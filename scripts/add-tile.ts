// Adds the Tile flooring line to an existing database (idempotent)
import { prisma } from "../lib/db";

async function main() {
  const existing = await prisma.flooringType.findFirst({
    where: { name: { contains: "Tile" } },
  });
  if (existing) {
    console.log("Tile already exists, skipping.");
    return;
  }
  await prisma.flooringType.updateMany({
    where: { name: "Laminate" },
    data: { sortOrder: 5 },
  });
  await prisma.flooringType.create({
    data: {
      name: "Tile (Porcelain / Ceramic)",
      description:
        "Porcelain and ceramic tile installation for kitchens, bathrooms, patios and commercial spaces. Includes mortar bed and grout.",
      wearLayer: "Porcelain / ceramic",
      priceMin: 10.0,
      priceMax: 14.0,
      sortOrder: 4,
    },
  });
  console.log("Tile flooring type added.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
