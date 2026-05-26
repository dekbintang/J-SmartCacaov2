'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Leaf, MapPin, Mail, Globe, ExternalLink, ArrowUpRight } from 'lucide-react';
import { useUIStore } from '@/store/useUIStore';
import { Suspense } from 'react';

const NAV_LINKS = [
  { href: '/', label_id: 'Beranda', label_en: 'Home' },
  { href: '/trace', label_id: 'Trace', label_en: 'Trace' },
  { href: '/telusuri', label_id: 'Telusuri', label_en: 'Explore' },
  { href: '/budaya', label_id: 'Budaya', label_en: 'Culture' },
];

const COPY = {
  id: {
    tagline: 'Platform inovatif untuk petani kakao Jembrana — menghubungkan tradisi dengan teknologi.',
    nav: 'Navigasi',
    contact: 'Kontak',
    rights: '© 2025 J-Smart Cacao. Hak cipta dilindungi.',
    built: 'Dibangun bersama Universitas Udayana',
  },
  en: {
    tagline: 'Innovative platform for Jembrana cacao farmers — bridging tradition with technology.',
    nav: 'Navigation',
    contact: 'Contact',
    rights: '© 2025 J-Smart Cacao. All rights reserved.',
    built: 'Built with Universitas Udayana',
  },
};

// Pisahkan bagian yang pakai usePathname ke komponen sendiri
function FooterNav({ lang, colorClass }: { lang: 'id' | 'en'; colorClass: { body: string; hover: string } }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {NAV_LINKS.map((link) => {
        const isActive = pathname === link.href;
        const label = lang === 'id' ? link.label_id : link.label_en;
        return (
          <Link key={link.href} href={link.href}
            className={`inline-flex items-center gap-1.5 py-1 text-sm transition-colors duration-150 group ${isActive
              ? 'text-emerald-500 font-semibold'
              : `${colorClass.body} ${colorClass.hover} font-normal`
              }`}
          >
            {isActive && <span className="w-1 h-1 rounded-full bg-emerald-500 flex-shrink-0" />}
            {label}
            {!isActive && (
              <ArrowUpRight size={11} className="opacity-0 group-hover:opacity-50 transition-opacity -mb-0.5" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export default function Footer() {
  const { theme, lang } = useUIStore();
  const isDark = theme === 'dark';
  const c = COPY[lang];

  const base = isDark ? 'bg-zinc-950 border-zinc-800/60' : 'bg-white border-zinc-200';
  const muted = isDark ? 'text-zinc-500' : 'text-zinc-400';
  const body = isDark ? 'text-zinc-400' : 'text-zinc-500';
  const head = isDark ? 'text-white' : 'text-zinc-900';
  const hover = isDark ? 'hover:text-white' : 'hover:text-zinc-900';
  const divider = isDark ? 'border-zinc-800/60' : 'border-zinc-100';
  const iconBtn = isDark
    ? 'bg-zinc-900 border-zinc-700/60 text-zinc-400 hover:border-emerald-600/40 hover:text-emerald-400'
    : 'bg-zinc-50 border-zinc-200 text-zinc-400 hover:border-emerald-500/50 hover:text-emerald-600';

  return (
    <footer className={`border-t transition-colors duration-300 ${base}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-10 mb-12">

          {/* Brand */}
          <div className="sm:col-span-5">
            <Link href="/" className="inline-flex items-center gap-3 mb-4 group">
              <img
                src="/images/logo.png"
                alt="Logo J-Smart Cacao"
                className="w-10 h-10 object-contain"
              />
              <span className={`font-bold text-xl tracking-tight ${head} transition-colors`}>
                J-SMART <span className="text-emerald-500">CACAO</span>
              </span>
            </Link>
            <p className={`text-sm leading-relaxed max-w-xs ${body}`}>{c.tagline}</p>
            <div className="flex gap-2 mt-5">
              {[
                { Icon: Globe, label: 'Website', href: '#' },
                { Icon: Mail, label: 'Email', href: 'mailto:hello@jsmartcacao.id' },
                { Icon: ExternalLink, label: 'External', href: '#' },
              ].map(({ Icon, label, href }) => (
                <a key={label} href={href} aria-label={label}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-all duration-200 ${iconBtn}`}
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation — dibungkus Suspense karena pakai usePathname */}
          <div className="sm:col-span-3">
            <p className={`text-[10px] font-bold uppercase tracking-widest mb-4 ${muted}`}>{c.nav}</p>
            <Suspense fallback={
              <div className="flex flex-col gap-2">
                {NAV_LINKS.map(l => (
                  <Link key={l.href} href={l.href}
                    className={`text-sm py-1 ${body} ${hover} transition-colors`}
                  >
                    {lang === 'id' ? l.label_id : l.label_en}
                  </Link>
                ))}
              </div>
            }>
              <FooterNav lang={lang} colorClass={{ body, hover }} />
            </Suspense>
          </div>

          {/* Contact */}
          <div className="sm:col-span-4">
            <p className={`text-[10px] font-bold uppercase tracking-widest mb-4 ${muted}`}>{c.contact}</p>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-2.5">
                <MapPin size={13} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                <span className={`text-sm leading-relaxed ${body}`}>
                  Jembrana, Bali, Indonesia
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={13} className="text-emerald-500 flex-shrink-0" />
                <a href="mailto:hello@jsmartcacao.id"
                  className={`text-sm transition-colors ${body} ${hover}`}
                >
                  hello@jsmartcacao.id
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={`pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 ${divider}`}>
          <p className={`text-xs ${muted}`}>{c.rights}</p>
          <p className={`text-xs ${muted} flex items-center gap-1`}>
            <Leaf size={11} className="text-emerald-500" />
            {c.built}
          </p>
        </div>
      </div>
    </footer>
  );
}