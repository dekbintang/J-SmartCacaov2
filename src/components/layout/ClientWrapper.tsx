'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import SplashScreen from '@/components/layout/SplashScreen';
import MusicPlayer from '@/components/layout/MusicPlayer';
import { bgAudio } from '@/lib/bgAudio';

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => { const timer = setTimeout(() => setMounted(true), 0); return () => clearTimeout(timer); }, []);

  const handleEnter = () => {
    bgAudio.start(0.55);
    setEntered(true);
  };

  return (
    // ↓ flex flex-col flex-1 meneruskan struktur dari body
    <div className="flex flex-col flex-1">
      {mounted && (
        <AnimatePresence>
          {!entered && (
            <SplashScreen key="splash" onEnter={handleEnter} />
          )}
        </AnimatePresence>
      )}

      {/* children = PageTransition > Navbar + main + Footer */}
      {children}

      {mounted && entered && <MusicPlayer />}
    </div>
  );
}