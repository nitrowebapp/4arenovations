import Link from "next/link";
import { prisma } from "@/lib/db";
import { Stars } from "@/components/site/Stars";
import { getDict } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [{ t }, flooringTypes, testimonials, gallery] = await Promise.all([
    getDict(),
    prisma.flooringType.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.testimonial.findMany({
      where: { approved: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.galleryItem.findMany({
      where: { published: true, type: "photo" },
      orderBy: { sortOrder: "asc" },
      take: 3,
    }),
  ]);

  return (
    <>
      {/* Hero */}
      <section
        className="relative bg-brand bg-cover bg-center text-white"
        style={{ backgroundImage: "url(/images/lvp-living-1.jpg)" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/95 via-brand-dark/80 to-brand-dark/40" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-accent-light">
              {t.hero.kicker}
            </p>
            <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
              {t.hero.title1}{" "}
              <span className="text-accent-light">{t.hero.title2}</span>
            </h1>
            <p className="mt-4 max-w-lg text-white/80">{t.hero.body}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/estimate"
                className="rounded-lg bg-accent px-6 py-3 font-bold text-white shadow-lg hover:bg-accent-dark"
              >
                {t.hero.ctaEstimate}
              </Link>
              <Link
                href="/gallery"
                className="rounded-lg border border-white/30 px-6 py-3 font-semibold text-white hover:bg-white/10"
              >
                {t.hero.ctaWork}
              </Link>
            </div>
            <div className="mt-8 flex gap-8 text-sm">
              <div>
                <div className="text-2xl font-extrabold text-accent-light">
                  {t.hero.statProjects}
                </div>
                <div className="text-white/70">{t.hero.statProjectsLabel}</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-accent-light">
                  {t.hero.statWarranty}
                </div>
                <div className="text-white/70">{t.hero.statWarrantyLabel}</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-accent-light">
                  {t.hero.statDays}
                </div>
                <div className="text-white/70">{t.hero.statDaysLabel}</div>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="grid grid-cols-2 gap-3">
              {gallery.map((item, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={item.id}
                  src={item.url}
                  alt={item.title}
                  className={`w-full rounded-xl object-cover shadow-xl ${i === 0 ? "col-span-2" : ""}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Flooring types */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-3xl font-extrabold text-brand">
          {t.floors.title}
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-ink/70">
          {t.floors.subtitle}
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {flooringTypes.map((ft) => (
            <div
              key={ft.id}
              className="flex flex-col overflow-hidden rounded-xl border border-brand/10 bg-white shadow-sm transition hover:shadow-md"
            >
              {ft.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={ft.imageUrl}
                  alt={ft.name}
                  className="aspect-[3/2] w-full object-cover"
                />
              )}
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg font-bold text-brand">{ft.name}</h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-accent-dark">
                  {ft.wearLayer}
                </p>
                <p className="mt-3 flex-1 text-sm text-ink/70">{ft.description}</p>
                <p className="mt-4 text-lg font-extrabold text-brand">
                  {t.floors.startingAt} ${ft.priceMin.toFixed(2)}
                  <span className="text-sm font-medium text-ink/50">
                    {" "}
                    {t.floors.perSqftInstalled}
                  </span>
                </p>
                <Link
                  href="/estimate"
                  className="mt-4 rounded-lg bg-brand px-4 py-2 text-center text-sm font-bold text-white hover:bg-brand-light"
                >
                  {t.floors.estimateBtn}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-center text-3xl font-extrabold text-brand">
            {t.process.title}
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-4">
            {t.process.steps.map((step, i) => (
              <div key={step.title}>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent font-extrabold text-white">
                  {i + 1}
                </div>
                <h3 className="mt-4 font-bold text-brand">{step.title}</h3>
                <p className="mt-2 text-sm text-ink/70">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-3xl font-extrabold text-brand">
          {t.testimonials.title}
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((tm) => (
            <figure
              key={tm.id}
              className="rounded-xl border border-brand/10 bg-white p-6 shadow-sm"
            >
              <Stars rating={tm.rating} />
              <blockquote className="mt-3 text-sm text-ink/80">
                “{tm.text}”
              </blockquote>
              <figcaption className="mt-4 text-sm font-bold text-brand">
                {tm.customerName}
                <span className="block text-xs font-medium text-ink/50">
                  {tm.city}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/testimonials"
            className="font-semibold text-brand underline decoration-accent decoration-2 underline-offset-4 hover:text-brand-light"
          >
            {t.testimonials.readAll}
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <h2 className="text-center text-3xl font-extrabold text-brand">
            {t.faq.title}
          </h2>
          <div className="mt-8 space-y-3">
            {t.faq.items.map((item) => (
              <details
                key={item.q}
                className="group rounded-lg border border-brand/10 bg-cream p-4"
              >
                <summary className="cursor-pointer font-semibold text-brand">
                  {item.q}
                </summary>
                <p className="mt-2 text-sm text-ink/70">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand">
        <div className="mx-auto max-w-6xl px-4 py-14 text-center">
          <h2 className="text-3xl font-extrabold text-white">
            {t.homeCta.title}
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-white/70">{t.homeCta.body}</p>
          <Link
            href="/estimate"
            className="mt-6 inline-block rounded-lg bg-accent px-8 py-3 font-bold text-white shadow-lg hover:bg-accent-dark"
          >
            {t.homeCta.btn}
          </Link>
        </div>
      </section>
    </>
  );
}
