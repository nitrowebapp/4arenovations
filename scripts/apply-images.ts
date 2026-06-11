// Assigns downloaded royalty-free photos to flooring types and gallery items
import { prisma } from "../lib/db";

const FLOORING_IMAGES: Record<string, string> = {
  "LVP Essential": "/images/floor-install.jpg",
  "LVP SPC Mid-Range": "/images/lvp-living-1.jpg",
  "LVP Premium": "/images/lvp-living-2.jpg",
  "Tile (Porcelain / Ceramic)": "/images/wood-floor-close.jpg",
  Laminate: "/images/living-dark.jpg",
};

const GALLERY_BY_SORT: Record<number, string> = {
  1: "/images/lvp-living-1.jpg",
  2: "/images/kitchen-1.jpg",
  3: "/images/floor-install.jpg",
  4: "/images/apartment.jpg",
  5: "/images/lvp-living-2.jpg",
  6: "/images/interior-modern.jpg",
};

const NEW_GALLERY = [
  { url: "/images/bathroom-tile.jpg", title: "Bathroom remodel — tile & waterproof vinyl", city: "Orlando, FL", sortOrder: 7 },
  { url: "/images/bathroom-2.jpg", title: "Guest bathroom — porcelain tile", city: "Kissimmee, FL", sortOrder: 8 },
  { url: "/images/interior-light.jpg", title: "Family room — light oak LVP", city: "Winter Garden, FL", sortOrder: 9 },
];

async function main() {
  for (const [name, imageUrl] of Object.entries(FLOORING_IMAGES)) {
    const r = await prisma.flooringType.updateMany({ where: { name }, data: { imageUrl } });
    console.log(`${name}: ${r.count} updated`);
  }

  for (const [sortOrder, url] of Object.entries(GALLERY_BY_SORT)) {
    const r = await prisma.galleryItem.updateMany({
      where: { sortOrder: Number(sortOrder), url: { startsWith: "/gallery/" } },
      data: { url },
    });
    console.log(`gallery #${sortOrder}: ${r.count} updated`);
  }

  for (const item of NEW_GALLERY) {
    const exists = await prisma.galleryItem.findFirst({ where: { url: item.url } });
    if (!exists) {
      await prisma.galleryItem.create({ data: { ...item, type: "photo", published: true } });
      console.log(`added: ${item.title}`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
