import { prisma } from "@/lib/db";
import {
  createTestimonial,
  toggleTestimonialApproved,
  deleteTestimonial,
} from "@/app/actions/admin";
import { Stars } from "@/components/site/Stars";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-extrabold text-brand">Depoimentos</h1>
      <p className="mt-1 text-sm text-ink/60">
        Somente depoimentos aprovados aparecem no site.
      </p>

      {/* Add */}
      <form
        action={createTestimonial}
        className="mt-6 grid gap-3 rounded-xl border border-brand/10 bg-white p-6 shadow-sm sm:grid-cols-3"
      >
        <h2 className="font-bold text-brand sm:col-span-3">
          Adicionar depoimento
        </h2>
        <input
          name="customerName"
          required
          placeholder="Nome do cliente"
          className="rounded-md border border-brand/20 px-3 py-2 text-sm"
        />
        <input
          name="city"
          placeholder="Cidade (ex.: Orlando, FL)"
          className="rounded-md border border-brand/20 px-3 py-2 text-sm"
        />
        <select
          name="rating"
          defaultValue="5"
          className="rounded-md border border-brand/20 px-3 py-2 text-sm"
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n} estrelas
            </option>
          ))}
        </select>
        <textarea
          name="text"
          required
          rows={3}
          placeholder="Texto do depoimento"
          className="rounded-md border border-brand/20 px-3 py-2 text-sm sm:col-span-3"
        />
        <button
          type="submit"
          className="rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-white hover:bg-accent-dark sm:justify-self-start"
        >
          + Adicionar
        </button>
      </form>

      {/* List */}
      <div className="mt-8 space-y-4">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="rounded-xl border border-brand/10 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <Stars rating={t.rating} />
                <p className="font-bold text-brand">
                  {t.customerName}
                  <span className="ml-2 text-sm font-medium text-ink/50">
                    {t.city}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-bold ${t.approved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                >
                  {t.approved ? "Aprovado" : "Pendente"}
                </span>
                <form action={toggleTestimonialApproved}>
                  <input type="hidden" name="id" value={t.id} />
                  <button
                    type="submit"
                    className="rounded-md border border-brand/20 px-3 py-1.5 text-xs font-semibold text-brand hover:bg-cream"
                  >
                    {t.approved ? "Despublicar" : "Aprovar"}
                  </button>
                </form>
                <form action={deleteTestimonial}>
                  <input type="hidden" name="id" value={t.id} />
                  <button
                    type="submit"
                    className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                  >
                    Excluir
                  </button>
                </form>
              </div>
            </div>
            <p className="mt-2 text-sm text-ink/70">“{t.text}”</p>
          </div>
        ))}
      </div>
    </div>
  );
}
