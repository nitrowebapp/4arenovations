import { prisma } from "@/lib/db";
import { updateFlooringType, updateExtra } from "@/app/actions/admin";
import { UNIT_LABELS } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminPricingPage() {
  const [flooringTypes, extras] = await Promise.all([
    prisma.flooringType.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.extra.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-extrabold text-brand">Tabela de preços</h1>
      <p className="mt-1 text-sm text-ink/60">
        Estes valores alimentam a calculadora de orçamento e as páginas do
        site. Alterações valem imediatamente.
      </p>

      <h2 className="mt-8 text-lg font-bold text-brand">
        Tipos de piso (preço por ft² instalado)
      </h2>
      <div className="mt-4 space-y-3">
        {flooringTypes.map((ft) => (
          <form
            key={ft.id}
            action={updateFlooringType}
            className="flex flex-wrap items-center gap-3 rounded-xl border border-brand/10 bg-white p-4 shadow-sm"
          >
            <input type="hidden" name="id" value={ft.id} />
            <div className="min-w-44 flex-1">
              <p className="font-bold text-brand">{ft.name}</p>
              <p className="text-xs text-ink/50">{ft.wearLayer}</p>
            </div>
            <label className="text-sm text-ink/60">
              Mín $
              <input
                name="priceMin"
                type="number"
                step="0.05"
                min="0.5"
                defaultValue={ft.priceMin}
                className="ml-1 w-24 rounded-md border border-brand/20 px-2 py-1.5 text-sm"
              />
            </label>
            <label className="text-sm text-ink/60">
              Máx $
              <input
                name="priceMax"
                type="number"
                step="0.05"
                min="0.5"
                defaultValue={ft.priceMax}
                className="ml-1 w-24 rounded-md border border-brand/20 px-2 py-1.5 text-sm"
              />
            </label>
            <label className="flex items-center gap-1.5 text-sm text-ink/60">
              <input
                type="checkbox"
                name="active"
                defaultChecked={ft.active}
                className="h-4 w-4 accent-[#3555e8]"
              />
              Ativo
            </label>
            <button
              type="submit"
              className="rounded-lg bg-brand px-4 py-2 text-sm font-bold text-white hover:bg-brand-light"
            >
              Salvar
            </button>
          </form>
        ))}
      </div>

      <h2 className="mt-10 text-lg font-bold text-brand">Serviços extras</h2>
      <div className="mt-4 space-y-3">
        {extras.map((ex) => (
          <form
            key={ex.id}
            action={updateExtra}
            className="flex flex-wrap items-center gap-3 rounded-xl border border-brand/10 bg-white p-4 shadow-sm"
          >
            <input type="hidden" name="id" value={ex.id} />
            <div className="min-w-44 flex-1">
              <p className="font-bold text-brand">{ex.name}</p>
              <p className="text-xs text-ink/50">{UNIT_LABELS[ex.unit]}</p>
            </div>
            <label className="text-sm text-ink/60">
              Preço $
              <input
                name="pricePerUnit"
                type="number"
                step="0.05"
                min="0.05"
                defaultValue={ex.pricePerUnit}
                className="ml-1 w-24 rounded-md border border-brand/20 px-2 py-1.5 text-sm"
              />
            </label>
            <label className="flex items-center gap-1.5 text-sm text-ink/60">
              <input
                type="checkbox"
                name="active"
                defaultChecked={ex.active}
                className="h-4 w-4 accent-[#3555e8]"
              />
              Ativo
            </label>
            <button
              type="submit"
              className="rounded-lg bg-brand px-4 py-2 text-sm font-bold text-white hover:bg-brand-light"
            >
              Salvar
            </button>
          </form>
        ))}
      </div>
    </div>
  );
}
