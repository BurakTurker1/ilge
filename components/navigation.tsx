"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Castle, Clock3, Compass, FileText, Flag, Home, Map, Palette, Search, Shield, UserRound, Waves } from "lucide-react";

const items = [
  { href: "/", label: "Ana Sayfa", icon: Home },
  { href: "/harita", label: "Tarih Haritası", icon: Map },
  { href: "/zaman", label: "Zaman", icon: Clock3 },
  { href: "/devletler", label: "Devletler", icon: Flag },
  { href: "/savaslar", label: "Savaşlar", icon: Shield },
  { href: "/gocler", label: "Göçler", icon: Waves },
  { href: "/anlasmalar", label: "Anlaşmalar", icon: FileText },
  { href: "/kisiler", label: "Kişiler", icon: UserRound },
  { href: "/sehirler", label: "Şehirler", icon: Castle },
  { href: "/kavramlar", label: "Kavramlar", icon: BookOpen },
  { href: "/kultur", label: "Kültür", icon: Palette },
  { href: "/admin", label: "Yönetim", icon: Compass }
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-ink/95 px-2 py-2 backdrop-blur-xl lg:inset-y-0 lg:left-0 lg:right-auto lg:w-72 lg:border-r lg:border-t-0 lg:px-4 lg:py-6">
      <Link href="/" className="hidden items-center gap-3 px-3 pb-7 lg:flex">
        <div className="grid h-11 w-11 place-items-center border border-brass/50 bg-brass/15 text-xl font-black text-atlas shadow-glow">İL</div>
        <div>
          <p className="font-display text-2xl text-atlas">İLGE</p>
          <p className="text-xs uppercase tracking-[0.28em] text-white/45">Tarih Atlası</p>
        </div>
      </Link>
      <nav className="flex gap-1 overflow-x-auto lg:grid lg:gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex min-w-16 flex-col items-center justify-center gap-1 rounded px-2 py-2 text-[11px] transition lg:min-w-0 lg:flex-row lg:justify-start lg:gap-3 lg:px-3 lg:text-sm ${
                active ? "bg-brass/15 text-atlas" : "text-white/55 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="max-w-16 truncate lg:max-w-none">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-7 hidden rounded border border-white/10 bg-white/[0.03] p-3 text-xs text-white/50 lg:block">
        <div className="mb-2 flex items-center gap-2 text-atlas">
          <Search className="h-4 w-4" />
          Global arama
        </div>
        Selçuklu, Malazgirt, Kut veya İstanbul gibi başlıkları ana ekrandan arayabilirsin.
      </div>
    </aside>
  );
}
