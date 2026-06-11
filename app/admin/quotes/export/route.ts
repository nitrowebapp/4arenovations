import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { STATUS_LABELS } from "@/lib/format";

function csvCell(value: string | number): string {
  const s = String(value);
  return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.redirect(new URL("/admin/login", process.env.APP_URL ?? "http://localhost:3000"));
  }

  const quotes = await prisma.quote.findMany({
    orderBy: { createdAt: "desc" },
    include: { flooringType: true, rooms: true },
  });

  const header = [
    "Numero",
    "Data",
    "Cliente",
    "Telefone",
    "Email",
    "ZIP",
    "Piso",
    "Ambientes",
    "Area (sqft)",
    "Estimativa Min (USD)",
    "Estimativa Max (USD)",
    "Status",
    "Notas",
  ];

  const rows = quotes.map((q) =>
    [
      q.quoteNumber,
      q.createdAt.toISOString().slice(0, 10),
      q.customerName,
      q.phone,
      q.email,
      q.zip,
      q.flooringType.name,
      q.rooms.map((r) => `${r.roomName} (${r.widthFt}x${r.lengthFt})`).join(" | "),
      q.totalSqft,
      q.estimateMin,
      q.estimateMax,
      STATUS_LABELS[q.status] ?? q.status,
      q.notes,
    ]
      .map(csvCell)
      .join(",")
  );

  // BOM so Excel opens it with correct accents
  const csv = "﻿" + [header.join(","), ...rows].join("\r\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="orcamentos-4a-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
