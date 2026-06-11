import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { WhatsAppFloat } from "@/components/site/WhatsAppButton";
import { getDict } from "@/lib/i18n";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { locale, t } = await getDict();

  return (
    <div className="flex min-h-screen flex-col">
      <Header locale={locale} nav={t.nav} />
      <main className="flex-1">{children}</main>
      <Footer locale={locale} t={t} />
      <WhatsAppFloat />
    </div>
  );
}
