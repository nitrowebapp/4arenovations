import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import {
  moneyExact,
  money,
  QUOTE_STATUSES,
  STATUS_LABELS,
  STATUS_COLORS,
  UNIT_LABELS,
} from "@/lib/format";
import { updateQuoteStatus, updateQuoteNotes } from "@/app/actions/admin";

export const dynamic = "force-dynamic";

export default async function QuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const quote = await prisma.quote.findUnique({
    where: { id: Number(id) || 0 },
    include: {
      flooringType: true,
      rooms: true,
      extras: { include: { extra: true } },
    },
  });
  if (!quote) notFound();

  return (
    <div className="max-w-4xl">
      <Link
        href="/admin/quotes"
        className="text-sm font-semibold text-ink/60 hover:text-brand"
      >
        ← Voltar para orçamentos
      </Link>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold text-brand">
          {quote.quoteNumber}
        </h1>
        <span
          className={`rounded-full px-3 py-1 text-sm font-bold ${STATUS_COLORS[quote.status]}`}
        >
          {STATUS_LABELS[quote.status]}
        </span>
      </div>
      <p className="mt-1 text-sm text-ink/60">
        Recebido em {quote.createdAt.toLocaleString("en-US")}
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {/* Customer */}
        <div className="rounded-xl border border-brand/10 bg-white p-6 shadow-sm">
          <h2 className="font-bold text-brand">Cliente</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink/60">Nome</dt>
              <dd className="font-semibold">{quote.customerName}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink/60">Telefone</dt>
              <dd className="font-semibold">{quote.phone}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink/60">E-mail</dt>
              <dd className="font-semibold">{quote.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink/60">ZIP</dt>
              <dd className="font-semibold">{quote.zip}</dd>
            </div>
            {quote.contactTime && (
              <div className="flex justify-between">
                <dt className="text-ink/60">Melhor horário</dt>
                <dd className="font-semibold">{quote.contactTime}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-ink/60">Aceita SMS</dt>
              <dd className="font-semibold">{quote.smsConsent ? "Sim" : "Não"}</dd>
            </div>
          </dl>
        </div>

        {/* Status */}
        <div className="rounded-xl border border-brand/10 bg-white p-6 shadow-sm">
          <h2 className="font-bold text-brand">Atualizar status</h2>
          <form action={updateQuoteStatus} className="mt-3 flex gap-2">
            <input type="hidden" name="id" value={quote.id} />
            <select
              name="status"
              defaultValue={quote.status}
              className="flex-1 rounded-md border border-brand/20 px-3 py-2 text-sm"
            >
              {QUOTE_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded-lg bg-brand px-4 py-2 text-sm font-bold text-white hover:bg-brand-light"
            >
              Salvar
            </button>
          </form>

          <h2 className="mt-6 font-bold text-brand">Notas internas</h2>
          <form action={updateQuoteNotes} className="mt-3">
            <input type="hidden" name="id" value={quote.id} />
            <textarea
              name="notes"
              rows={4}
              defaultValue={quote.notes}
              placeholder="Ex.: visita agendada para sexta 10h..."
              className="w-full rounded-md border border-brand/20 px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="mt-2 rounded-lg bg-brand px-4 py-2 text-sm font-bold text-white hover:bg-brand-light"
            >
              Salvar notas
            </button>
          </form>
        </div>
      </div>

      {/* Estimate detail */}
      <div className="mt-6 rounded-xl border border-brand/10 bg-white shadow-sm">
        <div className="border-b border-brand/10 p-6">
          <h2 className="font-bold text-brand">Detalhes do orçamento</h2>
          <p className="mt-1 text-sm text-ink/60">
            Piso: <strong>{quote.flooringType.name}</strong> ($
            {quote.flooringType.priceMin.toFixed(2)}–$
            {quote.flooringType.priceMax.toFixed(2)}/ft² instalado)
          </p>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-cream">
            <tr>
              <th className="px-6 py-2.5 font-semibold">Ambiente</th>
              <th className="px-6 py-2.5 font-semibold">Medidas</th>
              <th className="px-6 py-2.5 text-right font-semibold">Área</th>
            </tr>
          </thead>
          <tbody>
            {quote.rooms.map((r) => (
              <tr key={r.id} className="border-t border-brand/5">
                <td className="px-6 py-2.5">{r.roomName}</td>
                <td className="px-6 py-2.5 text-ink/60">
                  {r.widthFt} × {r.lengthFt} ft
                </td>
                <td className="px-6 py-2.5 text-right">
                  {r.areaSqft.toFixed(0)} ft²
                </td>
              </tr>
            ))}
            {quote.extras.map((e) => (
              <tr key={`x-${e.id}`} className="border-t border-brand/5">
                <td className="px-6 py-2.5">{e.extra.name}</td>
                <td className="px-6 py-2.5 text-ink/60">
                  {e.quantity.toFixed(0)} {UNIT_LABELS[e.extra.unit]}
                </td>
                <td className="px-6 py-2.5 text-right">
                  {moneyExact(e.subtotal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between border-t border-brand/10 bg-brand px-6 py-4 text-white">
          <span className="font-bold">
            Total estimado ({quote.totalSqft.toFixed(0)} ft² + 10% recorte)
          </span>
          <span className="text-xl font-extrabold text-accent-light">
            {money(quote.estimateMin)} – {money(quote.estimateMax)}
          </span>
        </div>
      </div>
    </div>
  );
}
