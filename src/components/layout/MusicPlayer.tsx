'use client';

// src/components/layout/MusicPlayer.tsx  (versi baru — pakai bgAudio singleton)
// ─────────────────────────────────────────────────────────────────────────────
// Komponen ini HANYA mengontrol audio yang sudah distart oleh SplashScreen.
// Tidak perlu lagi mengurus autoplay / user gesture.

import { useState, useEffect, useRef, useCallback, useSyncExternalStore } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Music2, Play, Pause, SkipForward, SkipBack,
  Volume2, VolumeX, ChevronDown, X, ListMusic,
} from 'lucide-react';
import { useUIStore } from '@/store/useUIStore';
import { bgAudio, TRACKS } from '@/lib/bgAudio';

// ─── Helper ───────────────────────────────────────────────────────────────────
function fmt(s: number) {
  if (!s || isNaN(s) || !isFinite(s)) return '0:00';
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
}

// Custom hook: subscribe ke bgAudio singleton untuk trigger re-render
function useBgAudio() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const unsub = bgAudio.subscribe(() => setTick(t => t + 1));
    return () => { unsub(); };
  }, []);
  return tick; // hanya digunakan agar komponen re-render
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function MusicPlayer() {
  const { theme } = useUIStore();
  const [mounted, setMounted] = useState(false);
  useBgAudio(); // subscribe ke perubahan bgAudio

  const rafRef = useRef<number>(0);

  const [expanded,  setExpanded]  = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [showList,  setShowList]  = useState(false);
  const [volume,    setVolumeLocal] = useState(bgAudio.volume);
  const [muted,     setMuted]     = useState(false);
  const [progress,  setProgress]  = useState(0);
  const [curTime,   setCurTime]   = useState(0);
  const [duration,  setDuration]  = useState(0);

  useEffect(() => { const timer = setTimeout(() => setMounted(true), 0); return () => clearTimeout(timer); }, []);

  // ── rAF: update progress setiap frame ────────────────────────────────────
  useEffect(() => {
    if (!mounted) return;

    const tick = () => {
      const audio = bgAudio.instance;
      if (audio && !audio.paused) {
        setCurTime(audio.currentTime);
        setProgress(audio.duration ? audio.currentTime / audio.duration : 0);
        setDuration(audio.duration || 0);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafRef.current);
  }, [mounted]);

  // ── Sync volume ke bgAudio ────────────────────────────────────────────────
  const handleVolume = useCallback((v: number) => {
    setVolumeLocal(v);
    setMuted(false);
    bgAudio.setVolume(v);
  }, []);

  const handleMute = useCallback(() => {
    setMuted(m => {
      const next = !m;
      bgAudio.setVolume(next ? 0 : volume);
      return next;
    });
  }, [volume]);

  const seek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const audio = bgAudio.instance;
    if (!audio?.duration) return;
    const rect  = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * audio.duration;
    setProgress(ratio);
    setCurTime(ratio * audio.duration);
  }, []);

  if (!mounted || dismissed || !bgAudio.instance) return null;

  const isDark     = theme === 'dark';
  const isPlaying  = bgAudio.isPlaying;
  const track      = bgAudio.track;
  const trackIdx   = bgAudio.trackIdx;

  const glass = isDark
    ? 'bg-zinc-900/96 border-zinc-700/60 shadow-black/60'
    : 'bg-white/97 border-gray-200/70 shadow-zinc-200/50';

  const btnBase = isDark
    ? 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700/70'
    : 'text-zinc-500 hover:text-zinc-800 hover:bg-gray-100';

  return (
    <div className="fixed bottom-6 right-6 z-[200] select-none">
      <AnimatePresence mode="wait">

        {/* ══ FULL PLAYER ══════════════════════════════════════════════════ */}
        {expanded ? (
          <motion.div
            key="full"
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{    opacity: 0, y: 24, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            className={`w-[320px] rounded-3xl border backdrop-blur-2xl shadow-2xl overflow-hidden ${glass}`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={isPlaying ? { scale: [1, 1.18, 1] } : { scale: 1 }}
                  transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    isPlaying ? 'bg-cyan-500' : isDark ? 'bg-zinc-700' : 'bg-gray-200'
                  }`}
                >
                  <Music2 size={11} className="text-white" />
                </motion.div>
                <span className={`text-[10px] font-bold tracking-widest uppercase ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  {isPlaying ? 'Sedang Diputar' : 'Music Player'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowList(s => !s)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    showList ? 'bg-cyan-500 text-white' : btnBase
                  }`}
                >
                  <ListMusic size={13} />
                </button>
                <button onClick={() => setExpanded(false)} className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${btnBase}`}>
                  <ChevronDown size={15} />
                </button>
                <button onClick={() => setDismissed(true)} className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${btnBase}`}>
                  <X size={13} />
                </button>
              </div>
            </div>

            {/* Artwork / Tracklist */}
            <AnimatePresence mode="wait">
              {!showList ? (
                <motion.div key="art" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="mx-5 mb-3">
                  <div className={`h-32 rounded-2xl relative flex items-center justify-center overflow-hidden ${
                    isDark ? 'bg-gradient-to-br from-zinc-800 to-zinc-900' : 'bg-gradient-to-br from-amber-50/80 to-cyan-50/80'
                  }`}>
                    <motion.div
                      animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                      transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                      className={`w-20 h-20 rounded-full border-4 flex items-center justify-center shadow-lg ${
                        isDark ? 'border-zinc-700 bg-zinc-800' : 'border-white bg-white'
                      }`}
                    >
                      <span className="text-4xl">{track.emoji}</span>
                    </motion.div>
                    {isPlaying && (
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-end gap-[3px]">
                        {[0,1,2,3,4].map(i => (
                          <motion.div
                            key={i}
                            className="w-1.5 rounded-sm bg-cyan-500/80"
                            animate={{ height:['5px','16px','8px','19px','5px'] }}
                            transition={{ duration:0.65, repeat:Infinity, delay:i*0.11, ease:'easeInOut' }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div key="list" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="mx-5 mb-3">
                  <div className={`rounded-2xl overflow-hidden divide-y ${isDark ? 'divide-zinc-800 bg-zinc-800/50' : 'divide-gray-100 bg-gray-50'}`}>
                    {TRACKS.map((t, i) => (
                      <button
                        key={i}
                        onClick={() => { bgAudio.setTrack(i); setShowList(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                          trackIdx === i
                            ? isDark ? 'bg-cyan-500/15' : 'bg-cyan-50'
                            : isDark ? 'hover:bg-zinc-700/50' : 'hover:bg-gray-100'
                        }`}
                      >
                        <span className="text-xl">{t.emoji}</span>
                        <div className="min-w-0 flex-1">
                          <p className={`text-xs font-bold truncate ${trackIdx === i ? 'text-cyan-500' : isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>{t.title}</p>
                          <p className={`text-[10px] truncate ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>{t.artist}</p>
                        </div>
                        {trackIdx === i && isPlaying && (
                          <div className="flex items-end gap-[2px]">
                            {[0,1,2].map(j=>(
                              <motion.div key={j} className="w-1 rounded-sm bg-cyan-500"
                                animate={{height:['4px','11px','4px']}}
                                transition={{duration:0.5,repeat:Infinity,delay:j*0.13}}/>
                            ))}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Track info */}
            <div className="px-5 mb-3 text-center">
              <p className={`font-bold text-sm truncate ${isDark ? 'text-zinc-50' : 'text-zinc-900'}`}>{track.title}</p>
              <p className={`text-[11px] mt-0.5 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>{track.artist}</p>
            </div>

            {/* Progress */}
            <div className="px-5 mb-4">
              <div onClick={seek} className={`group h-1.5 rounded-full cursor-pointer overflow-hidden relative ${isDark ? 'bg-zinc-700' : 'bg-gray-200'}`}>
                <div className="h-full rounded-full bg-cyan-500 relative transition-none" style={{ width:`${progress*100}%` }}>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity -mr-1.5 shadow" />
                </div>
              </div>
              <div className={`flex justify-between mt-1.5 text-[10px] font-mono tabular-nums ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                <span>{fmt(curTime)}</span>
                <span>{fmt(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="px-5 mb-5 flex items-center justify-between">
              <button onClick={() => bgAudio.prev()} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${btnBase}`}>
                <SkipBack size={18} />
              </button>
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={() => isPlaying ? bgAudio.pause() : bgAudio.play()}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors ${
                  isPlaying
                    ? 'bg-cyan-500 hover:bg-cyan-600 shadow-cyan-500/35'
                    : isDark ? 'bg-zinc-700 hover:bg-zinc-600' : 'bg-zinc-800 hover:bg-zinc-900'
                }`}
              >
                {isPlaying ? <Pause size={23} className="text-white" /> : <Play size={23} className="text-white ml-0.5" />}
              </motion.button>
              <button onClick={() => bgAudio.next()} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${btnBase}`}>
                <SkipForward size={18} />
              </button>
            </div>

            {/* Volume + dots */}
            <div className={`px-5 pb-5 flex items-center gap-3 border-t pt-4 ${isDark ? 'border-zinc-800' : 'border-gray-100'}`}>
              <button onClick={handleMute} className={`flex-shrink-0 ${isDark ? 'text-zinc-400 hover:text-zinc-200' : 'text-zinc-500 hover:text-zinc-700'} transition-colors`}>
                {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
              </button>
              <input type="range" min={0} max={1} step={0.01} value={muted ? 0 : volume}
                onChange={e => handleVolume(+e.target.value)}
                className="flex-1 h-1 accent-cyan-500 cursor-pointer"
              />
              <div className="flex items-center gap-1.5">
                {TRACKS.map((_, i) => (
                  <button key={i} onClick={() => bgAudio.setTrack(i)}
                    className={`rounded-full transition-all duration-200 ${
                      trackIdx === i ? 'bg-cyan-500 w-4 h-2' : `w-2 h-2 ${isDark ? 'bg-zinc-600 hover:bg-zinc-400' : 'bg-gray-300 hover:bg-gray-400'}`
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

        ) : (
          /* ══ MINI PLAYER ═══════════════════════════════════════════════════ */
          <motion.div
            key="mini"
            initial={{ opacity:0, y:12, scale:0.90 }}
            animate={{ opacity:1, y:0,  scale:1    }}
            exit={{    opacity:0, y:12, scale:0.90 }}
            transition={{ type:'spring', stiffness:300, damping:26 }}
          >
            <div className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl border backdrop-blur-2xl shadow-xl ${glass}`}>
              <motion.button
                whileTap={{ scale: 0.86 }}
                onClick={() => isPlaying ? bgAudio.pause() : bgAudio.play()}
                className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center transition-colors ${
                  isPlaying ? 'bg-cyan-500 shadow-sm shadow-cyan-500/40' : isDark ? 'bg-zinc-700 hover:bg-zinc-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {isPlaying ? <Pause size={13} className="text-white" /> : <Play size={13} className="text-white ml-0.5" />}
              </motion.button>
              <div className="min-w-0 flex-1 cursor-pointer" onClick={() => setExpanded(true)}>
                <p className={`text-xs font-bold truncate leading-tight ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>{track.title}</p>
                <p className={`text-[10px] truncate ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>{isPlaying ? '▶ Memutar' : '⏸ Dijeda'}</p>
              </div>
              <button onClick={() => bgAudio.next()} className={`w-7 h-7 flex-shrink-0 rounded-full flex items-center justify-center transition-colors ${btnBase}`}>
                <SkipForward size={13} />
              </button>
              <button onClick={() => setExpanded(true)} className={`w-7 h-7 flex-shrink-0 rounded-full flex items-center justify-center transition-colors ${btnBase}`}>
                <Music2 size={12} />
              </button>
            </div>
            {/* Progress micro-bar */}
            <div className={`mt-1.5 h-[3px] rounded-full overflow-hidden ${isDark ? 'bg-zinc-800' : 'bg-gray-200'}`}>
              <div className="h-full bg-cyan-500 rounded-full transition-none" style={{ width:`${progress*100}%` }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
