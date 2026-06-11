import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Admin user
  const passwordHash = await bcrypt.hash("admin123", 10);
  await prisma.adminUser.upsert({
    where: { email: "admin@4arenovation.com" },
    update: {},
    create: { email: "admin@4arenovation.com", passwordHash, name: "4A Admin" },
  });

  // Flooring types (price per sq ft, installed)
  if ((await prisma.flooringType.count()) === 0) {
    await prisma.flooringType.createMany({
      data: [
        {
          name: "LVP Essential",
          description:
            "Entry-level luxury vinyl plank. 100% waterproof, great looks on a budget. Ideal for bedrooms and rentals.",
          wearLayer: "12–15 mil wear layer",
          priceMin: 5.5,
          priceMax: 7.0,
          sortOrder: 1,
        },
        {
          name: "LVP SPC Mid-Range",
          description:
            "Rigid stone-plastic core (SPC), dent resistant and fully waterproof. The most popular choice for Florida homes.",
          wearLayer: "20 mil wear layer, SPC core",
          priceMin: 7.0,
          priceMax: 9.0,
          sortOrder: 2,
        },
        {
          name: "LVP Premium",
          description:
            "Commercial-grade wear layer, widest planks, most realistic wood textures. Best durability for kitchens and high traffic.",
          wearLayer: "28+ mil wear layer",
          priceMin: 9.0,
          priceMax: 12.0,
          sortOrder: 3,
        },
        {
          name: "Tile (Porcelain / Ceramic)",
          description:
            "Porcelain and ceramic tile installation for kitchens, bathrooms, patios and commercial spaces. Includes mortar bed and grout.",
          wearLayer: "Porcelain / ceramic",
          priceMin: 10.0,
          priceMax: 14.0,
          sortOrder: 4,
        },
        {
          name: "Laminate",
          description:
            "Water-resistant laminate with attached underlayment. Warm feel and excellent value for living areas.",
          wearLayer: "AC4 rating",
          priceMin: 4.5,
          priceMax: 6.5,
          sortOrder: 5,
        },
      ],
    });
  }

  // Extras
  if ((await prisma.extra.count()) === 0) {
    await prisma.extra.createMany({
      data: [
        { name: "Existing floor removal & haul-away", pricePerUnit: 1.0, unit: "sqft", sortOrder: 1 },
        { name: "Subfloor leveling / prep", pricePerUnit: 1.5, unit: "sqft", sortOrder: 2 },
        { name: "New baseboards (per linear ft)", pricePerUnit: 3.5, unit: "linear_ft", sortOrder: 3 },
        { name: "Furniture moving", pricePerUnit: 150, unit: "flat", sortOrder: 4 },
      ],
    });
  }

  // Testimonials
  if ((await prisma.testimonial.count()) === 0) {
    await prisma.testimonial.createMany({
      data: [
        {
          customerName: "Karen M.",
          city: "Orlando, FL",
          rating: 5,
          text: "4ARenovation installed LVP in our entire first floor — 1,400 sq ft done in two days. The crew was punctual, clean and the floor looks amazing. Highly recommend!",
          approved: true,
        },
        {
          customerName: "Robert T.",
          city: "Kissimmee, FL",
          rating: 5,
          text: "Got an instant estimate on their website on Sunday, they called Monday morning and installed the following week. Fair price, zero surprises.",
          approved: true,
        },
        {
          customerName: "Fernanda S.",
          city: "Winter Garden, FL",
          rating: 5,
          text: "Equipe brasileira, atendimento impecável. Trocaram o carpete dos quartos por vinílico SPC e ficou perfeito. Preço justo e obra limpa.",
          approved: true,
        },
        {
          customerName: "James & Lisa P.",
          city: "Tampa, FL",
          rating: 5,
          text: "They leveled our slab and installed premium LVP in the kitchen and living room. Attention to detail on the trim work was outstanding.",
          approved: true,
        },
      ],
    });
  }

  // Gallery placeholders
  if ((await prisma.galleryItem.count()) === 0) {
    await prisma.galleryItem.createMany({
      data: [
        { url: "/gallery/project-1.svg", title: "Open-concept living room — LVP SPC", city: "Orlando, FL", sortOrder: 1 },
        { url: "/gallery/project-2.svg", title: "Kitchen remodel — Premium LVP", city: "Tampa, FL", sortOrder: 2 },
        { url: "/gallery/project-3.svg", title: "Master bedroom — LVP Essential", city: "Kissimmee, FL", sortOrder: 3 },
        { url: "/gallery/project-4.svg", title: "Whole-house install, 1,800 sq ft", city: "Winter Garden, FL", sortOrder: 4 },
        { url: "/gallery/project-5.svg", title: "Condo renovation — herringbone LVP", city: "Miami, FL", sortOrder: 5 },
        { url: "/gallery/project-6.svg", title: "Office space — commercial grade", city: "Lakeland, FL", sortOrder: 6 },
      ],
    });
  }

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
