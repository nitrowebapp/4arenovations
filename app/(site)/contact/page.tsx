import Link from "next/link";
import { getDict } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export const metadata = { title: "Contact" };

export default async function ContactPage() {
  const { t } = await getDict();

  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <h1 className="text-4xl font-extrabold text-brand">{t.contact.title}</h1>
      <p className="mt-3 max-w-2xl text-ink/70">{t.contact.intro}</p>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-brand/10 bg-white p-6 shadow-sm">
          <h2 className="font-bold text-brand">{t.contact.phone}</h2>
          <p className="mt-2 text-ink/70">
            <a href="tel:+14072279908" className="hover:text-accent">
              (407) 227-9908
            </a>
          </p>
          <p className="text-sm text-ink/50">{t.contact.phoneHours}</p>
        </div>
        <div className="rounded-xl border border-brand/10 bg-white p-6 shadow-sm">
          <h2 className="font-bold text-brand">{t.contact.email}</h2>
          <p className="mt-2 break-all text-ink/70">
            <a
              href="mailto:adson4arenovation@gmail.com"
              className="hover:text-accent"
            >
              adson4arenovation@gmail.com
            </a>
          </p>
        </div>
        <div className="rounded-xl border border-brand/10 bg-white p-6 shadow-sm">
          <h2 className="font-bold text-brand">{t.contact.instagram}</h2>
          <p className="mt-2 text-ink/70">
            <a
              href="https://instagram.com/4arenovationllc"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-accent hover:text-accent-dark"
            >
              @4arenovationllc
            </a>
          </p>
          <p className="text-sm text-ink/50">{t.contact.instagramSub}</p>
        </div>
        <div className="rounded-xl border border-brand/10 bg-white p-6 shadow-sm">
          <h2 className="font-bold text-brand">{t.contact.area}</h2>
          <p className="mt-2 text-ink/70">{t.contact.areaText}</p>
        </div>
      </div>

      <div className="mt-12 rounded-xl bg-brand p-8 text-center">
        <h2 className="text-2xl font-extrabold text-white">
          {t.contact.ctaTitle}
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-white/70">{t.contact.ctaBody}</p>
        <Link
          href="/estimate"
          className="mt-5 inline-block rounded-lg bg-accent px-6 py-3 font-bold text-white hover:bg-accent-dark"
        >
          {t.contact.ctaBtn}
        </Link>
      </div>
    </div>
  );
}
