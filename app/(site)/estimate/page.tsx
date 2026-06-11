import { prisma } from "@/lib/db";
import { getDict } from "@/lib/i18n";
import { EstimateWizard } from "./EstimateWizard";

export const dynamic = "force-dynamic";

export const metadata = { title: "Free Instant Estimate" };

export default async function EstimatePage() {
  const [{ t }, flooringTypes, extras] = await Promise.all([
    getDict(),
    prisma.flooringType.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        name: true,
        description: true,
        wearLayer: true,
        priceMin: true,
        priceMax: true,
        imageUrl: true,
      },
    }),
    prisma.extra.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
      select: { id: true, name: true, pricePerUnit: true, unit: true },
    }),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-center text-4xl font-extrabold text-brand">
        {t.estimate.pageTitle}
      </h1>
      <p className="mx-auto mt-3 max-w-xl text-center text-ink/70">
        {t.estimate.pageSubtitle}
      </p>
      <div className="mt-8">
        <EstimateWizard
          flooringTypes={flooringTypes}
          extras={extras}
          t={t.estimate}
        />
      </div>
    </div>
  );
}
