import Link from "next/link";
import { LanguageSwitcher } from "@/components/site/LanguageSwitcher";
import type { Locale } from "@/lib/locales";
import type { Dictionary } from "@/lib/dictionaries";

const SERVICE_AREAS = [
  "Orlando",
  "Kissimmee",
  "Winter Garden",
  "Clermont",
  "Davenport",
  "Sanford",
  "Lake Nona",
  "Apopka",
];

export function Footer({
  locale,
  t,
}: {
  locale: Locale;
  t: Dictionary;
}) {
  return (
    <footer className="bg-brand-dark text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logo-dark.jpg"
            alt="4A Renovation & Floor LLC"
            className="w-44 rounded-xl"
          />
          <p className="mt-4 max-w-sm text-sm text-white/70">{t.footer.desc}</p>
          <p className="mt-4 text-sm text-white/70">
            (407) 227-9908 &middot; adson4arenovation@gmail.com
          </p>
          <a
            href="https://instagram.com/4arenovationllc"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-block text-sm font-semibold text-accent-light hover:text-white"
          >
            @4arenovationllc
          </a>
          <div className="mt-4">
            <LanguageSwitcher current={locale} dark />
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-accent-light">
            {t.footer.company}
          </h3>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link href="/services" className="hover:text-accent-light">{t.nav.services}</Link></li>
            <li><Link href="/gallery" className="hover:text-accent-light">{t.nav.gallery}</Link></li>
            <li><Link href="/testimonials" className="hover:text-accent-light">{t.nav.reviews}</Link></li>
            <li><Link href="/estimate" className="hover:text-accent-light">{t.footer.estimateLink}</Link></li>
            <li><Link href="/contact" className="hover:text-accent-light">{t.nav.contact}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-accent-light">
            {t.footer.areas}
          </h3>
          <ul className="grid grid-cols-2 gap-x-2 gap-y-2 text-sm text-white/80">
            {SERVICE_AREAS.map((city) => (
              <li key={city}>{city}, FL</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 text-xs text-white/50">
          <span>
            © {new Date().getFullYear()} 4A Renovation &amp; Floor LLC.{" "}
            {t.footer.rights}
          </span>
          <Link href="/admin" className="hover:text-accent-light">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
