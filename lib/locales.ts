export const LOCALES = ["en", "pt", "es"] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_META: Record<Locale, { flag: string; label: string; name: string }> = {
  en: { flag: "🇺🇸", label: "EN", name: "English" },
  pt: { flag: "🇧🇷", label: "PT", name: "Português" },
  es: { flag: "🇲🇽", label: "ES", name: "Español" },
};

export const LOCALE_COOKIE = "4ar_locale";
