"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { setLocale } from "@/app/actions/locale";
import { LOCALES, LOCALE_META, type Locale } from "@/lib/locales";

export function LanguageSwitcher({
  current,
  dark = false,
}: {
  current: Locale;
  dark?: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function choose(locale: Locale) {
    if (locale === current) return;
    startTransition(async () => {
      await setLocale(locale);
      router.refresh();
    });
  }

  return (
    <span
      className={`flex items-center gap-1 ${pending ? "opacity-50" : ""}`}
      aria-label="Language"
    >
      {LOCALES.map((locale) => {
        const meta = LOCALE_META[locale];
        const active = locale === current;
        return (
          <button
            key={locale}
            type="button"
            onClick={() => choose(locale)}
            title={meta.name}
            className={`flex items-center gap-1 rounded-md px-1.5 py-1 text-xs font-bold transition ${
              active
                ? dark
                  ? "bg-white/15 text-white"
                  : "bg-brand/10 text-brand"
                : dark
                  ? "text-white/60 hover:bg-white/10 hover:text-white"
                  : "text-ink/50 hover:bg-brand/5 hover:text-brand"
            }`}
          >
            <span className="text-base leading-none">{meta.flag}</span>
            {meta.label}
          </button>
        );
      })}
    </span>
  );
}
