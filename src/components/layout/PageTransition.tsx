'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!overlayRef.current) return;
    const tl = gsap.timeline();
    tl.set(overlayRef.current, { scaleY: 0, transformOrigin: 'top' })
      .to(overlayRef.current, { scaleY: 1, duration: 0.6, ease: 'power3.inOut' })
      .to(overlayRef.current, { scaleY: 0, duration: 0.7, ease: 'power4.inOut', delay: 0.2 });
  }, [pathname]);

  return (
    // ↓ flex flex-col flex-1 meneruskan struktur dari body ke Navbar+main+Footer
    <div className="flex flex-col flex-1">
      {/* Overlay cinematic — fixed jadi tidak mempengaruhi layout */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-zinc-950 z-[100] origin-top scale-y-0 pointer-events-none"
      />
      {children}
    </div>
  );
}