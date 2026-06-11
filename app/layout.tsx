import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { getLocale } from "@/lib/i18n";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default:
      "4A Renovation & Floor LLC — Vinyl, Tile & Laminate Installation in Orlando, FL",
    template: "%s | 4A Renovation & Floor LLC",
  },
  description:
    "Commercial and residential floor installation in Orlando, FL — luxury vinyl plank, tile and laminate, plus general renovation. Get a free instant estimate online: choose your floor, enter your room sizes, see your price.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  return (
    <html lang={locale} className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
