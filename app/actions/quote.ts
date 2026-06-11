"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { WASTE_FACTOR } from "@/lib/format";

const quoteInputSchema = z.object({
  flooringTypeId: z.number().int().positive(),
  rooms: z
    .array(
      z.object({
        name: z.string().trim().min(1).max(60),
        widthFt: z.number().positive().max(500),
        lengthFt: z.number().positive().max(500),
      })
    )
    .min(1)
    .max(30),
  extras: z
    .array(
      z.object({
        extraId: z.number().int().positive(),
        quantity: z.number().positive().max(100000),
      })
    )
    .max(20),
  customer: z.object({
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().email().max(150),
    phone: z.string().trim().min(7).max(30),
    zip: z.string().trim().min(3).max(12),
    contactTime: z.string().trim().max(60).optional().default(""),
    smsConsent: z.boolean().optional().default(false),
  }),
});

export type QuoteInput = z.input<typeof quoteInputSchema>;

export type QuoteResult =
  | {
      ok: true;
      quoteNumber: string;
      estimateMin: number;
      estimateMax: number;
      totalSqft: number;
    }
  | { ok: false; error: string };

export async function createQuote(input: QuoteInput): Promise<QuoteResult> {
  const parsed = quoteInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Please review the form — some fields are invalid." };
  }
  const data = parsed.data;

  const flooringType = await prisma.flooringType.findFirst({
    where: { id: data.flooringTypeId, active: true },
  });
  if (!flooringType) {
    return { ok: false, error: "Selected flooring type is no longer available." };
  }

  const rooms = data.rooms.map((r) => ({
    roomName: r.name,
    widthFt: r.widthFt,
    lengthFt: r.lengthFt,
    areaSqft: Math.round(r.widthFt * r.lengthFt * 100) / 100,
  }));
  const totalSqft = Math.round(rooms.reduce((s, r) => s + r.areaSqft, 0) * 100) / 100;
  const areaWithWaste = totalSqft * WASTE_FACTOR;

  // Recompute extras server-side from DB prices (client values are not trusted)
  const extraIds = data.extras.map((e) => e.extraId);
  const dbExtras = await prisma.extra.findMany({
    where: { id: { in: extraIds }, active: true },
  });
  const quoteExtras = dbExtras.map((dbExtra) => {
    const requested = data.extras.find((e) => e.extraId === dbExtra.id)!;
    const quantity =
      dbExtra.unit === "sqft"
        ? totalSqft
        : dbExtra.unit === "flat"
          ? 1
          : requested.quantity;
    return {
      extraId: dbExtra.id,
      quantity,
      subtotal: Math.round(quantity * dbExtra.pricePerUnit * 100) / 100,
    };
  });
  const extrasTotal = quoteExtras.reduce((s, e) => s + e.subtotal, 0);

  const estimateMin = Math.round(areaWithWaste * flooringType.priceMin + extrasTotal);
  const estimateMax = Math.round(areaWithWaste * flooringType.priceMax + extrasTotal);

  const quote = await prisma.quote.create({
    data: {
      customerName: data.customer.name,
      email: data.customer.email,
      phone: data.customer.phone,
      zip: data.customer.zip,
      contactTime: data.customer.contactTime,
      smsConsent: data.customer.smsConsent,
      flooringTypeId: flooringType.id,
      totalSqft,
      estimateMin,
      estimateMax,
      rooms: { create: rooms },
      extras: { create: quoteExtras },
    },
  });

  const quoteNumber = `4AR-${new Date().getFullYear()}-${String(quote.id).padStart(4, "0")}`;
  await prisma.quote.update({
    where: { id: quote.id },
    data: { quoteNumber },
  });

  return { ok: true, quoteNumber, estimateMin, estimateMax, totalSqft };
}
