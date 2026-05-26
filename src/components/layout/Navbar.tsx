'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useUIStore } from '@/store/useUIStore';

export default function Navbar() {
  // Ambil state dan fungsi toggle langsung dari store
  const { lang, theme, toggleTheme, toggleLang } = useUIStore();
  
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // 1. Hindari Hydration Error
  // 2. Sinkronisasi class 'dark' ke elemen HTML agar Tailwind merespons
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return () => clearTimeout(timer);
  }, [theme]);

  const navLinks = [
    { href: '/', label_id: 'Beranda', label_en: 'Home' },
    { href: '/trace', label_id: 'Trace', label_en: 'Trace' },
    { href: '/telusuri', label_id: 'Telusuri', label_en: 'Explore' },
    { href: '/budaya', label_id: 'Budaya', label_en: 'Culture' },
  ];

  // Cegah render sebelum client siap (agar tidak flicker)
  if (!mounted) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl border-b border-zinc-100 dark:border-zinc-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          {/* Ganti "logo.png" dengan nama file gambar aslimu di folder public/images/ */}
          <img 
            src="/images/logo.png" 
            alt="Logo J-Smart Cacao" 
            className="w-12 h-12 object-contain" 
          />
          <div className="font-bold text-3xl tracking-[-2px]">
            <span className="text-zinc-900 dark:text-white transition-colors duration-300">J-SMART</span>
            <span className="text-emerald-600">CACAO</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[15px] font-medium transition-colors relative group ${
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                {lang === 'id' ? link.label_id : link.label_en}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-emerald-600 dark:bg-emerald-400 transition-all duration-300 ${
                  isActive ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            );
          })}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div 
            onClick={toggleLang}
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-700 cursor-pointer hover:border-emerald-200 dark:hover:border-emerald-700 transition-all active:scale-95"
          >
            <span className="text-sm font-semibold tracking-wider text-zinc-700 dark:text-zinc-300">
              {lang === "id" ? "ID" : "EN"}
            </span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-11 h-11 flex items-center justify-center rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:border-emerald-200 dark:hover:border-emerald-700 transition-all active:scale-95"
          >
            {theme === 'dark' ? (
              <span className="text-amber-500 text-lg">☀︎</span>
            ) : (
              <span className="text-zinc-700 text-lg">☾</span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden w-11 h-11 flex items-center justify-center rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700"
          >
            {isOpen ? <X size={28} className="text-zinc-900 dark:text-white" /> : <Menu size={28} className="text-zinc-900 dark:text-white" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-800 transition-colors duration-300">
          <div className="px-6 py-8 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block py-4 px-6 text-lg font-medium rounded-2xl transition-colors ${
                  (pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href)))
                    ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-l-4 border-emerald-500'
                    : 'hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                {lang === 'id' ? link.label_id : link.label_en}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}