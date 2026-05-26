'use client';

// src/components/layout/SplashScreen.tsx
// ─── TIDAK perlu import bgAudio ───────────────────────────────────────────────
// Audio distart oleh ClientWrapper.handleEnter() yang memanggil onEnter()
// Komponen ini murni UI saja

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  onEnter: () => void;
}

export default function SplashScreen({ onEnter }: Props) {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    if (loading) return;
    setLoading(true);
    // ── Panggil onEnter() langsung di sini (dalam user gesture context!) ──
    // ClientWrapper akan menjalankan bgAudio.start() dari sini
    onEnter();
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.65, ease: 'easeInOut' }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-zinc-950 overflow-hidden"
    >
      {/* ── Latar: lingkaran cahaya ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] rounded-full bg-teal-500/8 blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff06_1px,transparent_1px)] [background-size:32px_32px]" />
      </div>

      {/* ── Orbit animasi ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[280, 380, 480].map((size, i) => (
          <motion.div
            key={i}
            style={{ width: size, height: size }}
            animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
            transition={{ duration: 20 + i * 8, repeat: Infinity, ease: 'linear' }}
            className="absolute rounded-full border border-white/[0.04]"
          >
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${
              i === 0 ? 'bg-emerald-400/60' : i === 1 ? 'bg-teal-400/50' : 'bg-green-400/40'
            }`} />
          </motion.div>
        ))}
      </div>

      {/* ── Konten ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/8 text-emerald-400 text-xs font-bold tracking-widest uppercase"
        >
          🌴 Selamat Datang
        </motion.div>

        {/* Judul */}
        <motion.h1
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter text-white mb-2 leading-none"
        >
          Jembrana
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="text-2xl sm:text-3xl font-black tracking-tighter bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 bg-clip-text text-transparent mb-6"
        >
          Tourism
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="text-zinc-400 text-base sm:text-lg leading-relaxed mb-10 max-w-sm"
        >
          Temukan keindahan budaya, alam, dan kuliner Jembrana — Bali Barat
        </motion.p>

        {/* Tombol Masuk */}
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.70 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleClick}
          disabled={loading}
          className="group relative px-10 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-base tracking-wide shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-shadow duration-300 disabled:opacity-70"
        >
          {/* Shine */}
          <span className="absolute inset-0 rounded-2xl overflow-hidden">
            <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </span>

          <span className="relative flex items-center gap-2.5">
            {loading ? (
              <>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full"
                />
                Memuat...
              </>
            ) : (
              <>
                🎵 Mulai Jelajahi
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                >
                  →
                </motion.span>
              </>
            )}
          </span>
        </motion.button>

        {/* Keterangan musik */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-5 text-zinc-600 text-xs flex items-center gap-1.5"
        >
          <span>🎵</span> Musik tradisional Jembrana akan diputar otomatis
        </motion.p>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
        className="absolute bottom-6 left-0 right-0 text-center"
      >
        <p className="text-zinc-700 text-xs">© 2025 Dinas Pariwisata Kabupaten Jembrana</p>
      </motion.div>
    </motion.div>
  );
}
