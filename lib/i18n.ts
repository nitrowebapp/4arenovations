import { cookies } from "next/headers";
import { dictionaries, type Dictionary } from "./dictionaries";
import { LOCALES, LOCALE_COOKIE, type Locale } from "./locales";

export { LOCALES, LOCALE_META, LOCALE_COOKIE, type Locale } from "./locales";

export async function getLocale(): Promise<Locale> {
  const value = (await cookies()).get(LOCALE_COOKIE)?.value;
  return LOCALES.includes(value as Locale) ? (value as Locale) : "en";
}

export async function getDict(): Promise<{ locale: Locale; t: Dictionary }> {
  const locale = await getLocale();
  return { locale, t: dictionaries[locale] };
}
