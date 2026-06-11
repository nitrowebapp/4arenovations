import Link from "next/link";
import { prisma } from "@/lib/db";
import { UNIT_LABELS } from "@/lib/format";
import { getDict } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export const metadata = { title: "Services" };

export default async function ServicesPage() {
  const [{ t }, flooringTypes, extras] = await Promise.all([
    getDict(),
    prisma.flooringType.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.extra.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <h1 className="text-4xl font-extrabold text-brand">{t.services.title}</h1>
      <p className="mt-3 max-w-2xl text-ink/70">{t.services.intro}</p>

      <h2 className="mt-12 text-2xl font-extrabold text-brand">
        {t.services.linesTitle}
      </h2>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {flooringTypes.map((ft) => (
          <div
            key={ft.id}
            className="overflow-hidden rounded-xl border border-brand/10 bg-white shadow-sm"
          >
            {ft.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={ft.imageUrl}
                alt={ft.name}
                className="aspect-[3/1.2] w-full object-cover"
              />
            )}
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-brand">{ft.name}</h3>
                  <p className="text-xs font-semibold uppercase tracking-wide text-accent-dark">
                    {ft.wearLayer}
                  </p>
                </div>
                <p className="whitespace-nowrap text-lg font-extrabold text-brand">
                  ${ft.priceMin.toFixed(2)}–${ft.priceMax.toFixed(2)}
                  <span className="text-xs font-medium text-ink/50">
                    {" "}
                    {t.floors.perSqft}
                  </span>
                </p>
              </div>
              <p className="mt-3 text-sm text-ink/70">{ft.description}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-12 text-2xl font-extrabold text-brand">
        {t.services.addonsTitle}
      </h2>
      <div className="mt-6 overflow-hidden rounded-xl border border-brand/10 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand text-white">
            <tr>
              <th className="px-5 py-3 font-semibold">{t.services.serviceCol}</th>
              <th className="px-5 py-3 font-semibold">{t.services.priceCol}</th>
            </tr>
          </thead>
          <tbody>
            {extras.map((ex) => (
              <tr key={ex.id} className="border-t border-brand/5">
                <td className="px-5 py-3">{ex.name}</td>
                <td className="px-5 py-3 font-semibold text-brand">
                  ${ex.pricePerUnit.toFixed(2)} {UNIT_LABELS[ex.unit]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-12 rounded-xl bg-brand p-8 text-center">
        <h2 className="text-2xl font-extrabold text-white">
          {t.services.ctaTitle}
        </h2>
        <Link
          href="/estimate"
          className="mt-4 inline-block rounded-lg bg-accent px-6 py-3 font-bold text-white hover:bg-accent-dark"
        >
          {t.services.ctaBtn}
        </Link>
      </div>
    </div>
  );
}
