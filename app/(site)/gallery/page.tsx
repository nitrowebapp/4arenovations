import { prisma } from "@/lib/db";
import { getDict } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export const metadata = { title: "Gallery" };

export default async function GalleryPage() {
  const [{ t }, items] = await Promise.all([
    getDict(),
    prisma.galleryItem.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <h1 className="text-4xl font-extrabold text-brand">{t.gallery.title}</h1>
      <p className="mt-3 max-w-2xl text-ink/70">{t.gallery.subtitle}</p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <figure
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
            <figcaption className="p-4">
              <p className="font-semibold text-brand">{item.title}</p>
              {item.city && <p className="text-sm text-ink/60">{item.city}</p>}
            </figcaption>
          </figure>
        ))}
      </div>

      {items.length === 0 && (
        <p className="mt-10 text-ink/60">{t.gallery.comingSoon}</p>
      )}
    </div>
  );
}
