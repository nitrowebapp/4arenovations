import Link from "next/link";
import { prisma } from "@/lib/db";
import { Stars } from "@/components/site/Stars";
import { getDict } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export const metadata = { title: "Reviews" };

export default async function TestimonialsPage() {
  const [{ t }, testimonials] = await Promise.all([
    getDict(),
    prisma.testimonial.findMany({
      where: { approved: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <h1 className="text-4xl font-extrabold text-brand">{t.reviews.title}</h1>
      <p className="mt-3 text-ink/70">{t.reviews.subtitle}</p>

      <div className="mt-10 space-y-6">
        {testimonials.map((tm) => (
          <figure
            key={tm.id}
            className="rounded-xl border border-brand/10 bg-white p-6 shadow-sm"
          >
            <Stars rating={tm.rating} />
            <blockquote className="mt-3 text-ink/80">“{tm.text}”</blockquote>
            <figcaption className="mt-4 font-bold text-brand">
              {tm.customerName}
              <span className="ml-2 text-sm font-medium text-ink/50">
                {tm.city}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-12 rounded-xl bg-brand p-8 text-center">
        <h2 className="text-xl font-extrabold text-white">
          {t.reviews.ctaTitle}
        </h2>
        <Link
          href="/estimate"
          className="mt-4 inline-block rounded-lg bg-accent px-6 py-3 font-bold text-white hover:bg-accent-dark"
        >
          {t.reviews.ctaBtn}
        </Link>
      </div>
    </div>
  );
}
