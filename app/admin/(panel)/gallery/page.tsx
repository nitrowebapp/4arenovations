import { prisma } from "@/lib/db";
import {
  uploadGalleryItem,
  toggleGalleryPublished,
  deleteGalleryItem,
} from "@/app/actions/admin";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const items = await prisma.galleryItem.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-brand">Galeria</h1>
      <p className="mt-1 text-sm text-ink/60">
        Fotos e vídeos exibidos no site público.
      </p>

      {/* Upload */}
      <form
        action={uploadGalleryItem}
        className="mt-6 grid gap-3 rounded-xl border border-brand/10 bg-white p-6 shadow-sm sm:grid-cols-2"
      >
        <h2 className="font-bold text-brand sm:col-span-2">
          Adicionar foto ou vídeo
        </h2>
        <input
          type="file"
          name="file"
          required
          accept=".jpg,.jpeg,.png,.webp,.svg,.mp4,.webm"
          className="rounded-md border border-brand/20 px-3 py-2 text-sm file:mr-3 file:rounded file:border-0 file:bg-brand file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white sm:col-span-2"
        />
        <input
          name="title"
          required
          placeholder="Título (ex.: Sala de estar — LVP Premium)"
          className="rounded-md border border-brand/20 px-3 py-2 text-sm"
        />
        <input
          name="city"
          placeholder="Cidade (ex.: Orlando, FL)"
          className="rounded-md border border-brand/20 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-white hover:bg-accent-dark sm:col-span-2 sm:justify-self-start"
        >
          ⬆ Enviar
        </button>
      </form>

      {/* Items */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="overflow-hidden rounded-xl border border-brand/10 bg-white shadow-sm"
          >
            {item.type === "video" ? (
              <video
                src={item.url}
                controls
                className="aspect-[8/5] w-full bg-brand-dark object-cover"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.url}
                alt={item.title}
                className="aspect-[8/5] w-full object-cover"
              />
            )}
            <div className="p-4">
              <p className="text-sm font-semibold text-brand">{item.title}</p>
              <p className="text-xs text-ink/50">
                {item.city || "—"} ·{" "}
                {item.published ? (
                  <span className="font-bold text-green-700">Publicado</span>
                ) : (
                  <span className="font-bold text-gray-500">Oculto</span>
                )}
              </p>
              <div className="mt-3 flex gap-2">
                <form action={toggleGalleryPublished}>
                  <input type="hidden" name="id" value={item.id} />
                  <button
                    type="submit"
                    className="rounded-md border border-brand/20 px-3 py-1.5 text-xs font-semibold text-brand hover:bg-cream"
                  >
                    {item.published ? "Ocultar" : "Publicar"}
                  </button>
                </form>
                <form action={deleteGalleryItem}>
                  <input type="hidden" name="id" value={item.id} />
                  <button
                    type="submit"
                    className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                  >
                    Excluir
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
