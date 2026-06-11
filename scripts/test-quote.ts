// Smoke test: exercises the same createQuote action used by the wizard
import { createQuote } from "../app/actions/quote";
import { prisma } from "../lib/db";

async function main() {
  const res = await createQuote({
    flooringTypeId: 2, // LVP SPC Mid-Range $7–9
    rooms: [
      { name: "Living Room", widthFt: 20, lengthFt: 15 }, // 300
      { name: "Kitchen", widthFt: 12, lengthFt: 10 }, // 120
    ],
    extras: [
      { extraId: 1, quantity: 1 }, // removal /sqft -> auto 420
      { extraId: 3, quantity: 80 }, // baseboards 80 lf
      { extraId: 4, quantity: 1 }, // furniture flat
    ],
    customer: {
      name: "Test Customer",
      email: "test@example.com",
      phone: "4075550199",
      zip: "32801",
      contactTime: "Morning",
      smsConsent: true,
    },
  });

  console.log(res);
  if (!res.ok) throw new Error("createQuote failed");

  // Expected: area 420, waste 462; floor 462*7=3234 .. 462*9=4158
  // extras: 420*1 + 80*3.5 + 150 = 420+280+150 = 850
  // min 4084, max 5008
  const expectMin = 4084;
  const expectMax = 5008;
  if (res.estimateMin !== expectMin || res.estimateMax !== expectMax) {
    throw new Error(
      `Math mismatch: got ${res.estimateMin}-${res.estimateMax}, expected ${expectMin}-${expectMax}`
    );
  }

  const saved = await prisma.quote.findUnique({
    where: { quoteNumber: res.quoteNumber },
    include: { rooms: true, extras: { include: { extra: true } } },
  });
  console.log(
    "Saved:",
    saved?.quoteNumber,
    "| rooms:",
    saved?.rooms.length,
    "| extras:",
    saved?.extras.map((e) => `${e.extra.name}=${e.subtotal}`).join(", ")
  );
  console.log("✓ Quote math and persistence verified");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
