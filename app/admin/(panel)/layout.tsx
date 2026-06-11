import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { logout } from "@/app/actions/admin";
import { LogoMark } from "@/components/Logo";

const NAV = [
  { href: "/admin", label: "📊 Dashboard" },
  { href: "/admin/quotes", label: "📋 Orçamentos" },
  { href: "/admin/gallery", label: "🖼️ Galeria" },
  { href: "/admin/testimonials", label: "💬 Depoimentos" },
  { href: "/admin/pricing", label: "💲 Tabela de preços" },
  { href: "/admin/settings", label: "⚙️ Configurações" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="flex min-h-screen bg-cream">
      <aside className="flex w-60 flex-col bg-brand-dark text-white">
        <Link href="/admin" className="flex items-center gap-2.5 px-5 py-5">
          <LogoMark size={34} />
          <span className="font-extrabold">
            4A<span className="text-accent-light">Admin</span>
          </span>
        </Link>
        <nav className="flex-1 space-y-1 px-3">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="space-y-1 p-3">
          <Link
            href="/"
            className="block rounded-lg px-3 py-2 text-sm text-white/60 hover:bg-white/10"
          >
            ← Ver o site
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="w-full rounded-lg px-3 py-2 text-left text-sm text-white/60 hover:bg-white/10"
            >
              Sair
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 overflow-x-auto p-8">{children}</main>
    </div>
  );
}
