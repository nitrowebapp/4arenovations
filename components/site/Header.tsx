"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { LanguageSwitcher } from "@/components/site/LanguageSwitcher";
import type { Locale } from "@/lib/locales";
import type { Dictionary } from "@/lib/dictionaries";

export function Header({
  locale,
  nav,
}: {
  locale: Locale;
  nav: Dictionary["nav"];
}) {
  const [open, setOpen] = useState(false);

  const items = [
    { href: "/", label: nav.home },
    { href: "/services", label: nav.services },
    { href: "/gallery", label: nav.gallery },
    { href: "/testimonials", label: nav.reviews },
    { href: "/contact", label: nav.contact },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-brand/10 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-5 md:flex">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-ink hover:text-brand"
            >
              {item.label}
            </Link>
          ))}
          <LanguageSwitcher current={locale} />
          <Link
            href="/estimate"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-bold text-white shadow hover:bg-accent-dark"
          >
            {nav.cta}
          </Link>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher current={locale} />
          <button
            className="rounded-lg border border-brand/20 p-2 text-brand"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              {open ? (
                <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="2" />
              ) : (
                <path d="M2 5h16M2 10h16M2 15h16" stroke="currentColor" strokeWidth="2" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-brand/10 bg-white px-4 py-3 md:hidden">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block py-2 text-sm font-medium text-ink"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/estimate"
            onClick={() => setOpen(false)}
            className="mt-2 block rounded-lg bg-accent px-4 py-2 text-center text-sm font-bold text-white"
          >
            {nav.cta}
          </Link>
        </nav>
      )}
    </header>
  );
}
