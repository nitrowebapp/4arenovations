import Link from "next/link";
import { prisma } from "@/lib/db";
import { money, STATUS_COLORS, STATUS_LABELS } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [totalQuotes, newQuotes, monthQuotes, closedQuotes, recent] =
    await Promise.all([
      prisma.quote.count(),
      prisma.quote.count({ where: { status: "NEW" } }),
      prisma.quote.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.quote.count({ where: { status: "CLOSED" } }),
      prisma.quote.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        include: { flooringType: true },
      }),
    ]);

  const cards = [
    { label: "Orçamentos no mês", value: monthQuotes },
    { label: "Novos (aguardando contato)", value: newQuotes },
    { label: "Fechados", value: closedQuotes },
    { label: "Total geral", value: totalQuotes },
  ];

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-brand">Dashboard</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-xl border border-brand/10 bg-white p-5 shadow-sm"
          >
            <p className="text-3xl font-extrabold text-brand">{c.value}</p>
            <p className="mt-1 text-sm text-ink/60">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-lg font-bold text-brand">Orçamentos recentes</h2>
        <Link
          href="/admin/quotes"
          className="text-sm font-semibold text-brand underline decoration-accent underline-offset-4"
        >
          Ver todos →
        </Link>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-brand/10 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand text-white">
            <tr>
              <th className="px-4 py-3 font-semibold">Nº</th>
              <th className="px-4 py-3 font-semibold">Cliente</th>
              <th className="px-4 py-3 font-semibold">Piso</th>
              <th className="px-4 py-3 font-semibold">Área</th>
              <th className="px-4 py-3 font-semibold">Estimativa</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((q) => (
              <tr key={q.id} className="border-t border-brand/5 hover:bg-cream">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/quotes/${q.id}`}
                    className="font-semibold text-brand underline decoration-accent underline-offset-2"
                  >
                    {q.quoteNumber}
                  </Link>
                </td>
                <td className="px-4 py-3">{q.customerName}</td>
                <td className="px-4 py-3 text-ink/70">{q.flooringType.name}</td>
                <td className="px-4 py-3">{q.totalSqft.toFixed(0)} ft²</td>
                <td className="px-4 py-3 font-semibold">
                  {money(q.estimateMin)}–{money(q.estimateMax)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_COLORS[q.status]}`}
                  >
                    {STATUS_LABELS[q.status]}
                  </span>
                </td>
              </tr>
            ))}
            {recent.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink/50">
                  Nenhum orçamento ainda. Quando um cliente usar a calculadora,
                  aparecerá aqui.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
