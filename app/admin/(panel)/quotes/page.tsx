import Link from "next/link";
import { prisma } from "@/lib/db";
import {
  money,
  QUOTE_STATUSES,
  STATUS_COLORS,
  STATUS_LABELS,
} from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function QuotesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const filter = status && QUOTE_STATUSES.includes(status as never) ? status : undefined;

  const quotes = await prisma.quote.findMany({
    where: filter ? { status: filter } : undefined,
    orderBy: { createdAt: "desc" },
    include: { flooringType: true },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold text-brand">Orçamentos</h1>
        <a
          href="/admin/quotes/export"
          download
          className="rounded-lg border border-brand/20 bg-white px-4 py-2 text-sm font-bold text-brand hover:bg-cream"
        >
          ⬇ Exportar CSV
        </a>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href="/admin/quotes"
          className={`rounded-full px-4 py-1.5 text-sm font-semibold ${!filter ? "bg-brand text-white" : "bg-white text-ink border border-brand/20"}`}
        >
          Todos
        </Link>
        {QUOTE_STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/quotes?status=${s}`}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${filter === s ? "bg-brand text-white" : "bg-white text-ink border border-brand/20"}`}
          >
            {STATUS_LABELS[s]}
          </Link>
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-brand/10 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand text-white">
            <tr>
              <th className="px-4 py-3 font-semibold">Nº</th>
              <th className="px-4 py-3 font-semibold">Data</th>
              <th className="px-4 py-3 font-semibold">Cliente</th>
              <th className="px-4 py-3 font-semibold">Contato</th>
              <th className="px-4 py-3 font-semibold">Piso</th>
              <th className="px-4 py-3 font-semibold">Área</th>
              <th className="px-4 py-3 font-semibold">Estimativa</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((q) => (
              <tr key={q.id} className="border-t border-brand/5 hover:bg-cream">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/quotes/${q.id}`}
                    className="font-semibold text-brand underline decoration-accent underline-offset-2"
                  >
                    {q.quoteNumber}
                  </Link>
                </td>
                <td className="px-4 py-3 text-ink/60">
                  {q.createdAt.toLocaleDateString("en-US")}
                </td>
                <td className="px-4 py-3">{q.customerName}</td>
                <td className="px-4 py-3 text-ink/60">
                  {q.phone}
                  <span className="block text-xs">{q.email}</span>
                </td>
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
            {quotes.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-ink/50">
                  Nenhum orçamento encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
