'use client';

import {
  useRef, useState, useEffect, useCallback, useMemo,
} from 'react';
import {
  Canvas, useFrame, useThree,
} from '@react-three/fiber';
import {
  OrbitControls, Environment, Html, Float, Sparkles,
} from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useUIStore } from '@/store/useUIStore';
import { Playfair_Display, DM_Sans } from 'next/font/google';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700', '800', '900'],
  variable: '--font-playfair',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
});

// ─── TYPES ────────────────────────────────────────────────────────────────────
type SceneKey = 'jegog' | 'mekepung' | 'kakao';
type Lang = 'id' | 'en';

// ─── CAMERA CONFIG — defined at top to avoid reference-before-init ────────────
const CAMERA_CONFIG: Record<SceneKey, [number, number, number]> = {
  jegog: [2, 3.2, 15],
  mekepung: [0, 3.2, 13],
  kakao: [0, 2.5, 9],
};
const KAKAO_POD_CAM: [number, number, number] = [0, 0.2, 5.5];

// ─── BILINGUAL COPY ───────────────────────────────────────────────────────────
const copy = {
  id: {
    badge: 'Budaya Jembrana',
    title: 'Warisan Budaya',
    titleAccent: 'Jembrana',
    subtitle: 'Sentuh. Dengar. Rasakan. Jelajahi kekayaan seni, tradisi, dan alam Jembrana dalam satu halaman.',
    hint: 'Drag untuk memutar · Scroll untuk zoom',
    clickHint: {
      jegog: 'Klik model untuk memainkan suara Jegog',
      mekepung: 'Klik untuk memecut kerbau!',
      kakao0: 'Klik pohon untuk fokus ke buah kakao',
      kakao1: 'Klik buah untuk membelah dan melihat biji',
      kakao2: 'Klik untuk kembali ke pohon',
    },
    btns: { jegog: 'Gamelan Jegog', mekepung: 'Mekepung', kakao: 'Pohon Kakao' },
    sceneLabel: {
      jegog: 'Gamelan Jegog — Melodi Bambu dari Jembrana',
      mekepung: 'Mekepung — Derap Kerbau di Sawah Jembrana',
      kakao: 'Pohon Kakao — Dari Kebun Jembrana ke Cokelat Dunia',
    },
    soundPlay: 'Mainkan Suara Jegog',
    soundStop: 'Stop Suara',
    soundLabel: 'Klik untuk mendengar nada gamelan Jegog',
    info: {
      jegog: {
        cat: 'ALAT MUSIK TRADISIONAL',
        title: 'Gamelan Jegog',
        tagline: 'Melodi Bambu dari Jembrana',
        facts: ['Bambu berdiameter hingga 12 cm', 'Nada terdengar hingga 5 km', 'Calon Warisan UNESCO'],
        desc: 'Jegog adalah ansambel gamelan bambu berukuran besar yang berasal dari Kabupaten Jembrana, Bali. Bambu raksasa berdiameter hingga 12 cm menghasilkan nada-nada rendah yang khas dan terasa hingga ke tulang. Diwariskan turun-temurun, Jegog sering dimainkan dalam upacara adat dan festival budaya.',
        note: '📍 Calon Warisan Budaya Tak Benda UNESCO',
      },
      mekepung: {
        cat: 'TRADISI BUDAYA',
        title: 'Mekepung',
        tagline: 'Derap Kerbau di Sawah Jembrana',
        facts: ['Lahir dari rutinitas membajak sawah', 'Digelar Juli–November', 'Festival budaya tahunan'],
        desc: 'Mekepung adalah tradisi balapan kerbau yang unik dari Kabupaten Jembrana. Sepasang kerbau menarik bajak kayu sederhana dengan joki yang berdiri di atasnya, memacu kerbau secepat mungkin melintasi sawah. Tradisi ini lahir dari rutinitas membajak sawah dan kini menjadi festival budaya yang dinantikan setiap tahun.',
        note: '📅 Digelar setiap Juli–November',
      },
      kakao: {
        cat: 'AGROWISATA',
        title: 'Kakao Jembrana',
        tagline: 'Dari Kebun Bali ke Cokelat Dunia',
        facts: ['Tumbuh subur di pegunungan Bali', 'Buah merah-kuning unik (kauliflori)', 'Bean-to-bar berkualitas tinggi'],
        desc: 'Kakao (Theobroma cacao) tumbuh subur di lahan-lahan Bali, terutama di daerah pegunungan. Buahnya yang berwarna merah-kuning menyimpan biji yang menjadi bahan baku cokelat premium. Petani kakao Bali semakin diakui dunia berkat produksi bean-to-bar berkualitas tinggi.',
        note: '🏆 Komoditas Unggulan Jembrana',
      },
    },
    trivia: {
      jegog: [
        { icon: '🎋', text: 'Bambu Jegog terbesar bisa setinggi 3 meter dan berbobot 8 kg per batang' },
        { icon: '👥', text: 'Satu ensambel Jegog terdiri dari 8–10 musisi yang bermain serempak' },
        { icon: '🏆', text: 'Jegog menjadi ikon utama Festival Seni Budaya Jembrana setiap tahun' },
        { icon: '🌍', text: 'Jegog pernah tampil di World Music Festival di Eropa dan Asia' },
      ],
      mekepung: [
        { icon: '⚡', text: 'Kerbau Mekepung bisa berlari hingga kecepatan 40 km/jam di sawah berlumpur' },
        { icon: '🏅', text: 'Pemenang Mekepung mendapat piala Bupati dan hadiah ternak' },
        { icon: '👨‍🌾', text: 'Joki Mekepung harus berdiri di atas bajak sambil mengendalikan 2 kerbau sekaligus' },
        { icon: '📜', text: 'Tradisi ini sudah ada sejak abad ke-19, awalnya untuk menggemburkan tanah sawah' },
      ],
      kakao: [
        { icon: '🍫', text: 'Satu buah kakao mengandung 30–50 biji, cukup untuk membuat 2 batang cokelat' },
        { icon: '🌡️', text: 'Fermentasi kakao Jembrana berlangsung 5–7 hari dalam kotak kayu berlapis daun pisang' },
        { icon: '💰', text: 'Kakao Jembrana diekspor ke Belanda dengan harga premium 2x lipat harga pasar' },
        { icon: '🌿', text: 'Sistem Subak Abian mengatur pola tanam dan distribusi kakao secara komunal' },
      ],
    },
    triviaTitle: 'Tahukah Kamu?',
    triviaCtaLabel: 'Jelajahi Telusuri Produk →',
    triviaCtaHref: '/telusuri',
  },
  en: {
    badge: 'Jembrana Culture',
    title: 'Cultural Heritage',
    titleAccent: 'of Jembrana',
    subtitle: 'Touch. Listen. Feel. Explore the richness of Jembrana\'s art, tradition, and nature in one page.',
    hint: 'Drag to rotate · Scroll to zoom',
    clickHint: {
      jegog: 'Click the model to play Jegog sound',
      mekepung: 'Click to whip the buffalo!',
      kakao0: 'Click tree to focus on cacao pod',
      kakao1: 'Click pod to split it and reveal seeds',
      kakao2: 'Click to return to the tree',
    },
    btns: { jegog: 'Jegog Gamelan', mekepung: 'Mekepung', kakao: 'Cacao Tree' },
    sceneLabel: {
      jegog: 'Jegog Gamelan — Bamboo Melody from Jembrana',
      mekepung: 'Mekepung — Buffalo Racing in Jembrana',
      kakao: 'Cacao Tree — From Jembrana\'s Gardens to World Chocolate',
    },
    soundPlay: 'Play Jegog Sound',
    soundStop: 'Stop Sound',
    soundLabel: 'Click to hear Jegog gamelan tones',
    info: {
      jegog: {
        cat: 'TRADITIONAL INSTRUMENT',
        title: 'Jegog Gamelan',
        tagline: 'Bamboo Melody from Jembrana',
        facts: ['Bamboo up to 12 cm diameter', 'Sound carries up to 5 km', 'UNESCO Candidate'],
        desc: 'Jegog is a large bamboo gamelan ensemble from Jembrana, Bali. Giant bamboo tubes up to 12 cm in diameter produce deep, resonant tones felt to the bone. Passed down through generations, Jegog is often played at traditional ceremonies and cultural festivals.',
        note: '📍 UNESCO Intangible Cultural Heritage Candidate',
      },
      mekepung: {
        cat: 'CULTURAL TRADITION',
        title: 'Mekepung',
        tagline: 'Buffalo Racing in Jembrana',
        facts: ['Born from daily plowing routines', 'Held every July–November', 'Annual cultural festival'],
        desc: 'Mekepung is a unique buffalo racing tradition from Jembrana. Pairs of buffalo pull simple wooden plows with jockeys standing atop, racing across rice paddies. Born from daily plowing routines, it has become an eagerly anticipated annual cultural festival.',
        note: '📅 Held every July–November',
      },
      kakao: {
        cat: 'AGRO TOURISM',
        title: 'Jembrana Cacao',
        tagline: 'From Bali\'s Gardens to World Chocolate',
        facts: ['Thrives in Bali highlands', 'Unique red-yellow pods (cauliflory)', 'High-quality bean-to-bar'],
        desc: 'Cacao (Theobroma cacao) thrives in Bali, especially in highland areas. Its red-yellow pods contain seeds that become premium chocolate. Bali\'s cacao farmers are increasingly recognized worldwide for their high-quality bean-to-bar production.',
        note: '🏆 Jembrana\'s Premier Commodity',
      },
    },
    trivia: {
      jegog: [
        { icon: '🎋', text: 'The largest Jegog bamboo can be 3 meters tall and weigh 8 kg per tube' },
        { icon: '👥', text: 'A single Jegog ensemble consists of 8–10 musicians playing in unison' },
        { icon: '🏆', text: 'Jegog is the main icon of the annual Jembrana Arts & Culture Festival' },
        { icon: '🌍', text: 'Jegog has performed at World Music Festivals across Europe and Asia' },
      ],
      mekepung: [
        { icon: '⚡', text: 'Mekepung buffalo can run up to 40 km/h through muddy rice paddies' },
        { icon: '🏅', text: 'Winners receive the Regent\'s trophy and livestock prizes' },
        { icon: '👨‍🌾', text: 'Jockeys must stand on the plow while controlling 2 buffalo simultaneously' },
        { icon: '📜', text: 'This tradition dates back to the 19th century, originally for tilling farmland' },
      ],
      kakao: [
        { icon: '🍫', text: 'One cacao pod contains 30–50 beans, enough for 2 chocolate bars' },
        { icon: '🌡️', text: 'Jembrana cacao ferments for 5–7 days in banana-leaf-lined wooden boxes' },
        { icon: '💰', text: 'Jembrana cacao exports to the Netherlands at 2x premium market price' },
        { icon: '🌿', text: 'The Subak Abian system manages cacao planting and distribution communally' },
      ],
    },
    triviaTitle: 'Did You Know?',
    triviaCtaLabel: 'Explore Product Traceability →',
    triviaCtaHref: '/telusuri',
  },
} as const;

// ─── PALETTE ──────────────────────────────────────────────────────────────────
const P = {
  bamboo: '#c8a66a',
  red: '#a81a1a',
  gold: '#c69200',
  wood: '#5c3610',
  skin: '#c8956b',
  dark: '#1a0c04',
};

// ─── PROCEDURAL TEXTURES ─────────────────────────────────────────────────────
function mkBambooTex(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 512;
  const ctx = c.getContext('2d')!;
  const g = ctx.createLinearGradient(0, 0, 512, 512);
  g.addColorStop(0, '#d4b88a');
  g.addColorStop(0.5, '#c8a66a');
  g.addColorStop(1, '#b89456');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 512, 512);
  ctx.strokeStyle = '#9a7030'; ctx.lineWidth = 3;
  for (let y = 80; y < 512; y += 120) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(512, y); ctx.stroke(); }
  for (let i = 0; i < 2000; i++) { ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.03})`; ctx.fillRect(Math.random() * 512, Math.random() * 512, 1, 1); }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(1, 2);
  return t;
}

function mkGoldTex(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 256;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, '#f5d76e');
  g.addColorStop(0.4, '#c69200');
  g.addColorStop(1, '#8b6914');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 100; i++) {
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.4})`;
    ctx.beginPath(); ctx.arc(Math.random() * 256, Math.random() * 256, Math.random() * 2 + 0.5, 0, Math.PI * 2); ctx.fill();
  }
  return new THREE.CanvasTexture(c);
}

// ─── WEB AUDIO: GAMELAN JEGOG SYNTHESIZER ────────────────────────────────────
const JEGOG_NOTES = [130.81, 146.83, 164.81, 196.00, 220.00, 261.63, 293.66, 329.63];

class JegogSynth {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying = false;
  private schedulerTimer: ReturnType<typeof setTimeout> | null = null;
  private nextNoteTime = 0;
  private readonly pattern = [0, 2, 4, 2, 1, 3, 5, 3, 0, 4, 6, 4, 2, 5, 7, 5];
  private patternPos = 0;
  private readonly tempo = 1.15;

  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.0, this.ctx.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(0.72, this.ctx.currentTime + 1.2);
    this.masterGain.connect(this.ctx.destination);
  }

  private playNote(freq: number, when: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    const filt = this.ctx.createBiquadFilter();

    osc.frequency.value = freq;
    osc.detune.value = (Math.random() - 0.5) * 14;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0, when);
    gain.gain.linearRampToValueAtTime(0.9, when + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.001, when + 2.8);

    osc2.frequency.value = freq * 2.76;
    osc2.type = 'sine';
    gain2.gain.setValueAtTime(0, when);
    gain2.gain.linearRampToValueAtTime(0.18, when + 0.008);
    gain2.gain.exponentialRampToValueAtTime(0.001, when + 0.95);

    filt.type = 'lowpass';
    filt.frequency.value = 1200;
    filt.Q.value = 0.8;

    osc.connect(gain); gain.connect(filt);
    osc2.connect(gain2); gain2.connect(filt);
    filt.connect(this.masterGain!);

    osc.start(when); osc.stop(when + 3.0);
    osc2.start(when); osc2.stop(when + 1.2);
  }

  private schedule() {
    if (!this.ctx || !this.isPlaying) return;
    while (this.nextNoteTime < this.ctx.currentTime + 0.2) {
      const idx = this.pattern[this.patternPos % this.pattern.length];
      const freq = JEGOG_NOTES[idx];
      this.playNote(freq, this.nextNoteTime);
      if (this.patternPos % 4 === 0) this.playNote(freq / 2, this.nextNoteTime + 0.05);
      this.nextNoteTime += this.tempo;
      this.patternPos++;
    }
    this.schedulerTimer = setTimeout(() => this.schedule(), 100);
  }

  start() {
    if (this.isPlaying) return;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();
    this.isPlaying = true;
    this.nextNoteTime = this.ctx.currentTime + 0.1;
    this.schedule();
  }

  stop() {
    this.isPlaying = false;
    if (this.schedulerTimer) { clearTimeout(this.schedulerTimer); this.schedulerTimer = null; }
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.8);
    }
  }

  destroy() {
    this.stop();
    if (this.ctx) { this.ctx.close(); this.ctx = null; }
  }

  get playing() { return this.isPlaying; }
}

let synthInstance: JegogSynth | null = null;
function getSynth(): JegogSynth {
  if (!synthInstance) synthInstance = new JegogSynth();
  return synthInstance;
}

// ─── SOUND BUTTON ─────────────────────────────────────────────────────────────
function JegogSoundButton({ isDark, c }: { isDark: boolean; c: (typeof copy)[Lang] }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const pulseRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const toggle = useCallback(() => {
    const s = getSynth();
    if (s.playing) {
      s.stop(); setIsPlaying(false);
      if (pulseRef.current) clearInterval(pulseRef.current);
    } else {
      s.start(); setIsPlaying(true);
    }
  }, []);

  useEffect(() => () => { getSynth().stop(); if (pulseRef.current) clearInterval(pulseRef.current); }, []);

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.button
        onClick={toggle}
        whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
        animate={isPlaying ? { boxShadow: ['0 0 0px 0px rgba(52,211,153,0)', '0 0 20px 8px rgba(52,211,153,0.5)', '0 0 0px 0px rgba(52,211,153,0)'] } : {}}
        transition={{ duration: 1.1, repeat: isPlaying ? Infinity : 0 }}
        className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 border ${isPlaying
          ? 'bg-emerald-400 text-white border-emerald-500 shadow-lg shadow-emerald-400/40'
          : isDark
            ? 'bg-white/5 text-emerald-400 border-[rgba(52,211,153,0.3)] hover:bg-white/10 hover:border-emerald-400'
            : 'bg-emerald-50 text-zinc-900 border-[rgba(52,211,153,0.3)] hover:bg-emerald-100 hover:border-emerald-400 shadow-sm'
          }`}
        style={{ fontFamily: dmSans.style.fontFamily }}
      >
        <span className="w-5 h-5 flex items-center justify-center">
          {isPlaying
            ? (
              <span className="flex items-end gap-[2px] h-4">
                {[0.5, 1, 0.7, 1.3, 0.9].map((h, i) => (
                  <motion.span key={i} animate={{ scaleY: [h, h * 1.6, h * 0.5, h * 1.3, h] }}
                    transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.1 }}
                    className="w-[3px] bg-white rounded-full" style={{ height: `${h * 12}px` }} />
                ))}
              </span>
            )
            : <span className="text-base">🎵</span>
          }
        </span>
        {isPlaying ? c.soundStop : c.soundPlay}
      </motion.button>
      <p className={`text-[11px] ${isDark ? 'text-emerald-400/70' : 'text-zinc-900/70'}`}>{c.soundLabel}</p>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════
// ─── GAMELAN JEGOG 3D (Authentic Jembrana Design) ─────────────────
// ═════════════════════════════════════════════════════════════════════

/* Helper: Balinese ornamental carving (ukiran) — colorful & elaborate like real Jegog */
function UkiranPanel({ width, height, depth, position, rotation }: {
  width: number; height: number; depth: number;
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  const goldTex = useMemo(() => mkGoldTex(), []);
  const d = depth / 2; // front face offset

  // Colors inspired by real Jembrana Jegog panels
  const C = {
    panelRed: '#9b1a1a',
    deepRed: '#7a1010',
    gold: '#d4a017',
    green: '#1a6b3a',
    darkGreen: '#0e4d28',
    blue: '#1a4a8b',
    teal: '#1a7a6b',
    orange: '#d4681a',
    cream: '#ffffff',
    black: '#1a0c04',
  };

  return (
    <group position={position} rotation={rotation || [0, 0, 0]}>
      {/* Base panel — deep red */}
      <mesh>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={C.panelRed} roughness={0.50} metalness={0.06} />
      </mesh>

      {/* ── GOLD BORDER FRAME ── */}
      {/* Top & bottom */}
      <mesh position={[0, height / 2 - 0.025, d + 0.005]}>
        <boxGeometry args={[width + 0.02, 0.05, 0.012]} />
        <meshStandardMaterial map={goldTex} metalness={0.85} roughness={0.10} />
      </mesh>
      <mesh position={[0, -height / 2 + 0.025, d + 0.005]}>
        <boxGeometry args={[width + 0.02, 0.05, 0.012]} />
        <meshStandardMaterial map={goldTex} metalness={0.85} roughness={0.10} />
      </mesh>
      {/* Left & right */}
      <mesh position={[-width / 2 + 0.025, 0, d + 0.005]}>
        <boxGeometry args={[0.05, height, 0.012]} />
        <meshStandardMaterial map={goldTex} metalness={0.85} roughness={0.10} />
      </mesh>
      <mesh position={[width / 2 - 0.025, 0, d + 0.005]}>
        <boxGeometry args={[0.05, height, 0.012]} />
        <meshStandardMaterial map={goldTex} metalness={0.85} roughness={0.10} />
      </mesh>

      {/* ── CENTER MEDALLION (Barong-style face) ── */}
      {/* Outer ring — gold */}
      <mesh position={[0, 0, d + 0.012]}>
        <torusGeometry args={[height * 0.30, 0.04, 12, 30]} />
        <meshStandardMaterial map={goldTex} metalness={0.88} roughness={0.08} emissive="#f5d76e" emissiveIntensity={0.2} />
      </mesh>
      {/* Green ring */}
      <mesh position={[0, 0, d + 0.014]}>
        <torusGeometry args={[height * 0.24, 0.03, 10, 26]} />
        <meshStandardMaterial color={C.green} roughness={0.40} metalness={0.15} emissive={C.green} emissiveIntensity={0.1} />
      </mesh>
      {/* Inner gold ring */}
      <mesh position={[0, 0, d + 0.016]}>
        <torusGeometry args={[height * 0.17, 0.025, 10, 24]} />
        <meshStandardMaterial map={goldTex} metalness={0.85} roughness={0.10} />
      </mesh>
      {/* Face disc — orange/red */}
      <mesh position={[0, 0, d + 0.015]}>
        <circleGeometry args={[height * 0.16, 24]} />
        <meshStandardMaterial color={C.orange} roughness={0.35} metalness={0.1} />
      </mesh>
      {/* Eyes */}
      {([-1, 1] as number[]).map((sx, i) => (
        <group key={`eye-${i}`}>
          <mesh position={[sx * 0.06, 0.03, d + 0.018]}>
            <circleGeometry args={[0.028, 12]} />
            <meshStandardMaterial color="#ffffff" roughness={0.3} />
          </mesh>
          <mesh position={[sx * 0.06, 0.03, d + 0.020]}>
            <circleGeometry args={[0.015, 10]} />
            <meshStandardMaterial color={C.black} roughness={0.2} />
          </mesh>
        </group>
      ))}
      {/* Nose */}
      <mesh position={[0, -0.01, d + 0.019]}>
        <boxGeometry args={[0.03, 0.04, 0.005]} />
        <meshStandardMaterial map={goldTex} metalness={0.7} roughness={0.15} />
      </mesh>
      {/* Mouth/fangs */}
      <mesh position={[0, -0.05, d + 0.018]}>
        <boxGeometry args={[0.08, 0.02, 0.005]} />
        <meshStandardMaterial color={C.deepRed} roughness={0.3} metalness={0.1} />
      </mesh>

      {/* ── COLORFUL PETAL ROSETTES (12 petals) ── */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const r = height * 0.25;
        const colors = [C.green, C.gold, C.blue, C.orange, C.teal, C.green,
        C.gold, C.blue, C.orange, C.green, C.teal, C.gold];
        return (
          <mesh key={`petal-${i}`}
            position={[Math.cos(angle) * r, Math.sin(angle) * r, d + 0.013]}
            rotation={[0, 0, angle + Math.PI / 2]}
          >
            <boxGeometry args={[0.14, 0.06, 0.01]} />
            <meshStandardMaterial color={colors[i]} roughness={0.35} metalness={0.15}
              emissive={colors[i]} emissiveIntensity={0.08} />
          </mesh>
        );
      })}

      {/* ── VINE SCROLLWORK (curling motifs on left & right) ── */}
      {([-1, 1] as number[]).map((sx, si) => (
        <group key={`vine-${si}`}>
          {/* Large scroll circle */}
          <mesh position={[sx * width * 0.30, 0, d + 0.010]}>
            <torusGeometry args={[height * 0.18, 0.025, 8, 20]} />
            <meshStandardMaterial color={C.green} roughness={0.40} metalness={0.12}
              emissive={C.darkGreen} emissiveIntensity={0.1} />
          </mesh>
          {/* Inner scroll */}
          <mesh position={[sx * width * 0.30, 0, d + 0.013]}>
            <torusGeometry args={[height * 0.11, 0.018, 8, 18]} />
            <meshStandardMaterial map={goldTex} metalness={0.82} roughness={0.12} />
          </mesh>
          {/* Center of scroll */}
          <mesh position={[sx * width * 0.30, 0, d + 0.015]}>
            <circleGeometry args={[0.05, 12]} />
            <meshStandardMaterial color={C.orange} roughness={0.35} metalness={0.1} />
          </mesh>
          {/* Leaf sprays from scroll */}
          {Array.from({ length: 5 }).map((_, li) => {
            const la = (li / 4) * Math.PI - Math.PI / 2;
            const lr = height * 0.22;
            return (
              <mesh key={`leaf-${si}-${li}`}
                position={[sx * width * 0.30 + Math.cos(la) * lr * 0.6, Math.sin(la) * lr * 0.6, d + 0.011]}
                rotation={[0, 0, la + Math.PI / 2]}
              >
                <boxGeometry args={[0.10, 0.04, 0.008]} />
                <meshStandardMaterial color={li % 2 === 0 ? C.green : C.teal}
                  roughness={0.40} metalness={0.10} />
              </mesh>
            );
          })}
        </group>
      ))}

      {/* ── CORNER FLORAL ROSETTES ── */}
      {([[-1, -1], [-1, 1], [1, -1], [1, 1]] as [number, number][]).map(([sx, sy], ci) => (
        <group key={`corner-${ci}`} position={[sx * width * 0.38, sy * height * 0.35, d + 0.010]}>
          {/* Outer ring */}
          <mesh>
            <torusGeometry args={[0.08, 0.018, 8, 14]} />
            <meshStandardMaterial color={ci % 2 === 0 ? C.blue : C.teal}
              roughness={0.35} metalness={0.15} emissive={ci % 2 === 0 ? C.blue : C.teal} emissiveIntensity={0.1} />
          </mesh>
          {/* Center dot */}
          <mesh position={[0, 0, 0.005]}>
            <circleGeometry args={[0.035, 10]} />
            <meshStandardMaterial color={C.orange} roughness={0.30} metalness={0.1} />
          </mesh>
          {/* Mini petals */}
          {Array.from({ length: 6 }).map((_, pi) => {
            const pa = (pi / 6) * Math.PI * 2;
            return (
              <mesh key={`cp-${ci}-${pi}`}
                position={[Math.cos(pa) * 0.06, Math.sin(pa) * 0.06, 0.003]}
                rotation={[0, 0, pa]}
              >
                <boxGeometry args={[0.04, 0.02, 0.006]} />
                <meshStandardMaterial color={pi % 2 === 0 ? C.gold : C.green}
                  roughness={0.35} metalness={0.15} />
              </mesh>
            );
          })}
        </group>
      ))}

      {/* ── HORIZONTAL DECORATIVE BANDS ── */}
      {([-0.35, 0.35] as number[]).map((yFrac, bi) => (
        <group key={`band-${bi}`} position={[0, height * yFrac, d + 0.008]}>
          {/* Gold band */}
          <mesh>
            <boxGeometry args={[width - 0.12, 0.04, 0.008]} />
            <meshStandardMaterial map={goldTex} metalness={0.82} roughness={0.12} />
          </mesh>
          {/* Colored dots along the band */}
          {Array.from({ length: Math.floor(width / 0.30) }).map((_, di) => {
            const dotX = -width / 2 + 0.20 + di * 0.30;
            const dotColors = [C.green, C.blue, C.orange, C.teal, C.green, C.blue];
            return (
              <mesh key={`dot-${bi}-${di}`} position={[dotX, 0, 0.006]}>
                <circleGeometry args={[0.02, 8]} />
                <meshStandardMaterial color={dotColors[di % dotColors.length]}
                  roughness={0.30} metalness={0.15} />
              </mesh>
            );
          })}
        </group>
      ))}

      {/* ── VERTICAL DIVIDER STRIPS ── */}
      {([-0.22, 0.22] as number[]).map((xFrac, vi) => (
        <mesh key={`vstrip-${vi}`} position={[width * xFrac, 0, d + 0.007]}>
          <boxGeometry args={[0.03, height - 0.12, 0.008]} />
          <meshStandardMaterial color={C.green} roughness={0.40} metalness={0.12} />
        </mesh>
      ))}
    </group>
  );
}

function JegogInstrument({ onSoundToggle }: { onSoundToggle: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const shakeRef = useRef(0);
  const bambooTex = useMemo(() => mkBambooTex(), []);
  const goldTex = useMemo(() => mkGoldTex(), []);

  const tubes = [
    { r: 0.310, len: 5.40, x: -3.15 },
    { r: 0.278, len: 5.10, x: -2.40 },
    { r: 0.250, len: 4.80, x: -1.73 },
    { r: 0.224, len: 4.50, x: -1.12 },
    { r: 0.202, len: 4.25, x: -0.58 },
    { r: 0.184, len: 4.00, x: -0.08 },
    { r: 0.167, len: 3.75, x: 0.38 },
    { r: 0.152, len: 3.55, x: 0.80 },
    { r: 0.138, len: 3.35, x: 1.18 },
    { r: 0.126, len: 3.15, x: 1.52 },
  ];

  const xMin = -3.62, xMax = 1.80;
  const xLen = xMax - xMin, xCtr = (xMin + xMax) / 2;
  const PD = 1.70;

  // Leg dimensions
  const FRONT_LEG_H = 1.00;   // Front legs (+Z, visual back) are shorter
  const BACK_LEG_H = 1.60;    // Back legs (-Z, visual front) are taller
  const LEG_R_TOP = 0.14;     // Thick/voluminous legs
  const LEG_R_BOT = 0.18;     // Wider at the base for stability
  const LEG_FOOT_R = 0.22;    // Rubber foot pad radius
  const LEG_FOOT_H = 0.06;    // Foot pad height

  // Leg Z positions in local body space
  const frontZ_local = PD / 2 - 0.20;   // +0.65
  const backZ_local = -(PD / 2 - 0.20); // -0.65
  const legSpanZ = frontZ_local - backZ_local; // 1.30

  // Base bottom Y in local body space
  const baseBottomY_local = -0.54 - 0.26; // -0.80

  // Compute exact tilt angle so all 4 feet land on the same ground plane
  // sin(θ) = (BACK_LEG_H - FRONT_LEG_H) / legSpanZ
  const sinTilt = (BACK_LEG_H - FRONT_LEG_H) / legSpanZ;
  const tiltAngle = Math.asin(sinTilt);
  const cosTilt = Math.cos(tiltAngle);

  // Body group Y position (controls overall height)
  const BODY_Y = 0.55;

  // Compute world-space attachment points (bottom of tilted base at each leg Z)
  const frontAttachY = BODY_Y + baseBottomY_local * cosTilt - frontZ_local * sinTilt;
  const frontAttachZ = baseBottomY_local * sinTilt + frontZ_local * cosTilt;
  const backAttachY = BODY_Y + baseBottomY_local * cosTilt - backZ_local * sinTilt;
  const backAttachZ = baseBottomY_local * sinTilt + backZ_local * cosTilt;

  // Ground level (all feet touch this Y)
  const groundLevel = frontAttachY - FRONT_LEG_H - LEG_FOOT_H;

  // Gentle vibration on click
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime;
    if (shakeRef.current > 0) {
      const decay = Math.max(0, shakeRef.current);
      const vibeX = Math.sin(t * 18) * 0.015 * decay;
      const vibeZ = Math.cos(t * 14) * 0.010 * decay;
      groupRef.current.position.x = vibeX;
      groupRef.current.position.z = vibeZ;
      groupRef.current.rotation.z = vibeX * 0.08;
      shakeRef.current = Math.max(0, shakeRef.current - 0.025);
    } else {
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, 0, 0.1);
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, 0, 0.1);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0, 0.1);
      groupRef.current.position.y = Math.sin(t * 0.5) * 0.015;
    }
  });

  const handleClick = () => {
    shakeRef.current = 1.0;
    onSoundToggle();
  };

  // Gold emissive pulse on click
  const emissiveRef = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(() => {
    if (emissiveRef.current) {
      const decay = Math.max(0, shakeRef.current);
      emissiveRef.current.emissiveIntensity = 0.15 + decay * 0.6;
    }
  });

  // Ground level: bottom of shortest leg
  // (already computed as groundLevel above)

  return (
    <group ref={groupRef} onClick={handleClick}
      onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = 'auto'; }}
    >
      <Sparkles count={30} scale={[8, 10, 4]} size={0.04} speed={0.3} opacity={0.4} color="#fbbf24" />

      {/* ══════ TILTED MAIN BODY (back/-Z side is higher = visual front) ══════ */}
      <group rotation={[tiltAngle, 0, 0]} position={[0, BODY_Y, 0]}>

        {/* ── Base platform (red lacquered wood) ── */}
        <mesh position={[xCtr, -0.54, 0]}>
          <boxGeometry args={[xLen + 0.2, 0.52, PD]} />
          <meshStandardMaterial color={P.red} roughness={0.55} metalness={0.05} />
        </mesh>

        {/* Gold trim strips along front & back edges */}
        {([-PD / 2, PD / 2] as number[]).map((z, i) => (
          <group key={`trim-${i}`}>
            <mesh position={[xCtr, -0.28, z]}>
              <boxGeometry args={[xLen + 0.30, 0.06, 0.03]} />
              <meshStandardMaterial ref={i === 0 ? emissiveRef : undefined} map={goldTex} metalness={0.8} roughness={0.12} emissive="#f5d76e" emissiveIntensity={0.15} />
            </mesh>
            <mesh position={[xCtr, -0.78, z]}>
              <boxGeometry args={[xLen + 0.30, 0.05, 0.03]} />
              <meshStandardMaterial map={goldTex} metalness={0.8} roughness={0.12} />
            </mesh>
          </group>
        ))}

        {/* ── LEFT SIDE PANEL (tall, with rich ukiran) ── */}
        <group position={[xMin - 0.36, 0.24, 0]}>
          {/* Main body */}
          <mesh><boxGeometry args={[0.58, 3.0, PD + 0.20]} /><meshStandardMaterial color="#8b1a1a" roughness={0.55} metalness={0.05} /></mesh>
          {/* Inner face gold trim line */}
          <mesh position={[0.30, 0.40, 0]}><boxGeometry args={[0.025, 2.60, PD + 0.22]} /><meshStandardMaterial map={goldTex} metalness={0.75} roughness={0.14} /></mesh>
          {/* Large ornamental ring */}
          <mesh position={[0, 0.40, PD / 2 + 0.11]} rotation={[0, 0, 0]}>
            <torusGeometry args={[0.52, 0.06, 12, 28]} />
            <meshStandardMaterial map={goldTex} metalness={0.85} roughness={0.10} emissive="#f5d76e" emissiveIntensity={0.18} />
          </mesh>
          <mesh position={[0, 0.40, PD / 2 + 0.115]}>
            <torusGeometry args={[0.30, 0.04, 10, 22]} />
            <meshStandardMaterial map={goldTex} metalness={0.85} roughness={0.10} />
          </mesh>
          {/* Center jewel */}
          <mesh position={[0, 0.40, PD / 2 + 0.12]}>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshStandardMaterial color="#cc1111" roughness={0.25} metalness={0.5} emissive="#ff3333" emissiveIntensity={0.4} />
          </mesh>
          {/* Floral petals radiating from center */}
          {Array.from({ length: 8 }).map((_, k) => {
            const a = (k / 8) * Math.PI * 2;
            return (
              <mesh key={`lpetal-${k}`}
                position={[Math.cos(a) * 0.42, 0.40 + Math.sin(a) * 0.42, PD / 2 + 0.112]}
                rotation={[0, 0, a + Math.PI / 2]}
              >
                <boxGeometry args={[0.12, 0.05, 0.008]} />
                <meshStandardMaterial map={goldTex} metalness={0.82} roughness={0.12} />
              </mesh>
            );
          })}
          {/* Back face ornamental ring */}
          <mesh position={[0, 0.40, -(PD / 2 + 0.11)]}>
            <torusGeometry args={[0.52, 0.06, 12, 28]} />
            <meshStandardMaterial map={goldTex} metalness={0.85} roughness={0.10} emissive="#f5d76e" emissiveIntensity={0.18} />
          </mesh>
          <mesh position={[0, 0.40, -(PD / 2 + 0.115)]}>
            <torusGeometry args={[0.30, 0.04, 10, 22]} />
            <meshStandardMaterial map={goldTex} metalness={0.85} roughness={0.10} />
          </mesh>
          <mesh position={[0, 0.40, -(PD / 2 + 0.12)]}>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshStandardMaterial color="#cc1111" roughness={0.25} metalness={0.5} emissive="#ff3333" emissiveIntensity={0.4} />
          </mesh>
          {/* Top crown molding */}
          <mesh position={[0, 1.52, 0]}><boxGeometry args={[0.62, 0.07, PD + 0.26]} /><meshStandardMaterial map={goldTex} metalness={0.75} roughness={0.13} /></mesh>
          {/* Diamond corner motifs on front face */}
          {([[-1, -1], [-1, 1], [1, -1], [1, 1]] as [number, number][]).map(([sx, sy], di) => (
            <mesh key={`ldiam-${di}`}
              position={[0, 0.40 + sy * 0.68, (PD / 2 + 0.11) * sx > 0 ? PD / 2 + 0.112 : -(PD / 2 + 0.112)]}
              rotation={[0, 0, Math.PI / 4]}
            >
              <boxGeometry args={[0.08, 0.08, 0.008]} />
              <meshStandardMaterial map={goldTex} metalness={0.80} roughness={0.14} emissive="#f5d76e" emissiveIntensity={0.08} />
            </mesh>
          ))}
        </group>

        {/* ── RIGHT SIDE PANEL (shorter, with ukiran) ── */}
        <group position={[xMax + 0.26, -0.04, 0]}>
          <mesh><boxGeometry args={[0.50, 2.10, PD + 0.18]} /><meshStandardMaterial color="#8b1a1a" roughness={0.55} metalness={0.05} /></mesh>
          <mesh position={[0.26, 0, 0]}><boxGeometry args={[0.025, 2.06, PD + 0.20]} /><meshStandardMaterial map={goldTex} metalness={0.75} roughness={0.14} /></mesh>
          {/* Ornamental rings on front face */}
          <mesh position={[0, 0.15, PD / 2 + 0.10]}>
            <torusGeometry args={[0.38, 0.05, 10, 24]} />
            <meshStandardMaterial map={goldTex} metalness={0.82} roughness={0.10} emissive="#f5d76e" emissiveIntensity={0.15} />
          </mesh>
          <mesh position={[0, 0.15, PD / 2 + 0.105]}>
            <torusGeometry args={[0.22, 0.035, 10, 20]} />
            <meshStandardMaterial map={goldTex} metalness={0.82} roughness={0.10} />
          </mesh>
          <mesh position={[0, 0.15, PD / 2 + 0.11]}>
            <sphereGeometry args={[0.06, 10, 10]} />
            <meshStandardMaterial color="#cc1111" roughness={0.25} metalness={0.5} emissive="#ff2222" emissiveIntensity={0.3} />
          </mesh>
          {/* Back face ornamental rings */}
          <mesh position={[0, 0.15, -(PD / 2 + 0.10)]}>
            <torusGeometry args={[0.38, 0.05, 10, 24]} />
            <meshStandardMaterial map={goldTex} metalness={0.82} roughness={0.10} emissive="#f5d76e" emissiveIntensity={0.15} />
          </mesh>
          <mesh position={[0, 0.15, -(PD / 2 + 0.105)]}>
            <torusGeometry args={[0.22, 0.035, 10, 20]} />
            <meshStandardMaterial map={goldTex} metalness={0.82} roughness={0.10} />
          </mesh>
          <mesh position={[0, 0.15, -(PD / 2 + 0.11)]}>
            <sphereGeometry args={[0.06, 10, 10]} />
            <meshStandardMaterial color="#cc1111" roughness={0.25} metalness={0.5} />
          </mesh>
          {/* Top crown molding */}
          <mesh position={[0, 1.06, 0]}><boxGeometry args={[0.52, 0.065, PD + 0.24]} /><meshStandardMaterial map={goldTex} metalness={0.75} roughness={0.13} /></mesh>
          {/* Petals on front face */}
          {Array.from({ length: 6 }).map((_, k) => {
            const a = (k / 6) * Math.PI * 2;
            return (
              <mesh key={`rpetal-${k}`}
                position={[Math.cos(a) * 0.30, 0.15 + Math.sin(a) * 0.30, PD / 2 + 0.103]}
                rotation={[0, 0, a + Math.PI / 2]}
              >
                <boxGeometry args={[0.09, 0.04, 0.007]} />
                <meshStandardMaterial map={goldTex} metalness={0.82} roughness={0.12} />
              </mesh>
            );
          })}
        </group>

        {/* ── FRONT PANEL (decorative ukiran — on -Z side, facing camera) ── */}
        <UkiranPanel
          width={xLen - 0.20}
          height={1.10}
          depth={0.10}
          position={[xCtr, 0.0, -(PD / 2 + 0.15)]}
          rotation={[0, Math.PI, 0]}
        />

        {/* ── BACK PANEL (simpler — on +Z side, away from camera) ── */}
        <mesh position={[xCtr, -0.10, PD / 2 + 0.10]}>
          <boxGeometry args={[xLen - 0.20, 0.90, 0.08]} />
          <meshStandardMaterial color="#8b1a1a" roughness={0.55} metalness={0.05} />
        </mesh>
        {/* Back panel gold trim */}
        <mesh position={[xCtr, 0.32, PD / 2 + 0.10]}>
          <boxGeometry args={[xLen - 0.18, 0.05, 0.09]} />
          <meshStandardMaterial map={goldTex} metalness={0.78} roughness={0.13} />
        </mesh>
        <mesh position={[xCtr, -0.52, PD / 2 + 0.10]}>
          <boxGeometry args={[xLen - 0.18, 0.05, 0.09]} />
          <meshStandardMaterial map={goldTex} metalness={0.78} roughness={0.13} />
        </mesh>

        {/* ── Bamboo tubes (back ends flush with back panel) ── */}
        {tubes.map((t, i) => {
          // All tubes extend the same amount (0.40) past the front panel (-Z side)
          const frontOverhang = 0.80;
          const tubeZOffset = -(PD / 2 + frontOverhang) + t.len / 2;
          return (
            <group key={`tube-${i}`} position={[0, 0, tubeZOffset]}>
              <mesh position={[t.x, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[t.r, t.r * 1.022, t.len, 24]} />
                <meshStandardMaterial map={bambooTex} roughness={0.65} metalness={0.02} />
              </mesh>
              {/* Bamboo node rings */}
              {[0.20, 0.45, 0.70].map((frac, k) => (
                <mesh key={k} position={[t.x, 0, (frac - 0.5) * t.len]} rotation={[Math.PI / 2, 0, 0]}>
                  <torusGeometry args={[t.r * 1.08, 0.022, 10, 20]} />
                  <meshStandardMaterial color="#9a7030" roughness={0.95} />
                </mesh>
              ))}
              {/* Red end cap (front, -Z, visible) */}
              <mesh position={[t.x, 0, -(t.len / 2) + 0.10]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[t.r + 0.020, t.r + 0.020, 0.30, 18]} />
                <meshStandardMaterial color="#c0292b" roughness={0.45} metalness={0.1} />
              </mesh>
              {/* Red end cap (back, +Z) */}
              <mesh position={[t.x, 0, (t.len / 2) - 0.10]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[t.r + 0.020, t.r + 0.020, 0.24, 18]} />
                <meshStandardMaterial color="#c0292b" roughness={0.45} metalness={0.1} />
              </mesh>
              {/* Gold accent ring (front end) */}
              <mesh position={[t.x, 0, -(t.len / 2) + 0.10]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[t.r + 0.022, 0.014, 8, 18]} />
                <meshStandardMaterial map={goldTex} metalness={0.7} roughness={0.16} />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* ══════ 4 LEGS (computed positions so nothing floats) ══════ */}
      {([
        { x: xMin + 0.20, attachY: frontAttachY, attachZ: frontAttachZ, h: FRONT_LEG_H },
        { x: xMax - 0.10, attachY: frontAttachY, attachZ: frontAttachZ, h: FRONT_LEG_H },
        { x: xMin + 0.20, attachY: backAttachY, attachZ: backAttachZ, h: BACK_LEG_H },
        { x: xMax - 0.10, attachY: backAttachY, attachZ: backAttachZ, h: BACK_LEG_H },
      ]).map((leg, i) => {
        const legCenterY = leg.attachY - leg.h / 2;
        const legBottomY = leg.attachY - leg.h;
        return (
          <group key={`leg-${i}`}>
            {/* Main leg column — tapered, thick */}
            <mesh position={[leg.x, legCenterY, leg.attachZ]}>
              <cylinderGeometry args={[LEG_R_TOP, LEG_R_BOT, leg.h, 14]} />
              <meshStandardMaterial color={P.wood} roughness={0.88} metalness={0.03} />
            </mesh>
            {/* Carved ring at top of leg */}
            <mesh position={[leg.x, leg.attachY - 0.06, leg.attachZ]}>
              <torusGeometry args={[LEG_R_TOP + 0.02, 0.025, 8, 18]} />
              <meshStandardMaterial map={goldTex} metalness={0.75} roughness={0.14} emissive="#f5d76e" emissiveIntensity={0.1} />
            </mesh>
            {/* Carved ring at middle of leg */}
            <mesh position={[leg.x, legCenterY, leg.attachZ]}>
              <torusGeometry args={[(LEG_R_TOP + LEG_R_BOT) / 2 + 0.02, 0.022, 8, 18]} />
              <meshStandardMaterial map={goldTex} metalness={0.72} roughness={0.16} />
            </mesh>
            {/* Carved ring near bottom */}
            <mesh position={[leg.x, legBottomY + 0.10, leg.attachZ]}>
              <torusGeometry args={[LEG_R_BOT + 0.01, 0.020, 8, 18]} />
              <meshStandardMaterial map={goldTex} metalness={0.72} roughness={0.16} />
            </mesh>
            {/* Rubber foot pad */}
            <mesh position={[leg.x, legBottomY - LEG_FOOT_H / 2, leg.attachZ]}>
              <cylinderGeometry args={[LEG_FOOT_R, LEG_FOOT_R + 0.02, LEG_FOOT_H, 14]} />
              <meshStandardMaterial color="#1a1a1a" roughness={0.95} metalness={0.0} />
            </mesh>
          </group>
        );
      })}

      {/* ── Side crossbars connecting front & back legs on each side ── */}
      {([xMin + 0.20, xMax - 0.10] as number[]).map((x, i) => (
        <group key={`crossbar-${i}`}>
          <mesh position={[x, groundLevel + LEG_FOOT_H + 0.16, (frontAttachZ + backAttachZ) / 2]}>
            <boxGeometry args={[0.14, 0.12, Math.abs(frontAttachZ - backAttachZ) - 0.10]} />
            <meshStandardMaterial color={P.wood} roughness={0.90} metalness={0.02} />
          </mesh>
          <mesh position={[x, groundLevel + LEG_FOOT_H + 0.22, (frontAttachZ + backAttachZ) / 2]}>
            <boxGeometry args={[0.16, 0.02, Math.abs(frontAttachZ - backAttachZ) - 0.08]} />
            <meshStandardMaterial map={goldTex} metalness={0.7} roughness={0.15} />
          </mesh>
        </group>
      ))}

      {/* ── Front crossbar (visual back, +Z) ── */}
      <mesh position={[xCtr, groundLevel + LEG_FOOT_H + 0.12, frontAttachZ]}>
        <boxGeometry args={[xLen - 0.60, 0.12, 0.12]} />
        <meshStandardMaterial color={P.wood} roughness={0.90} metalness={0.02} />
      </mesh>

      {/* ── Back crossbar (visual front, -Z) ── */}
      <mesh position={[xCtr, groundLevel + LEG_FOOT_H + 0.12, backAttachZ]}>
        <boxGeometry args={[xLen - 0.60, 0.12, 0.12]} />
        <meshStandardMaterial color={P.wood} roughness={0.90} metalness={0.02} />
      </mesh>

      {/* ── Mallets (panggul) — leaning against the body ── */}
      <mesh position={[0.4, backAttachY + 0.15, backAttachZ - 0.30]} rotation={[-0.30, 0, -0.14]}>
        <cylinderGeometry args={[0.028, 0.028, 1.65, 10]} />
        <meshStandardMaterial color={P.wood} roughness={0.82} />
      </mesh>
      <mesh position={[0.28, backAttachY + 0.60, backAttachZ - 0.58]}>
        <sphereGeometry args={[0.10, 14, 14]} />
        <meshStandardMaterial color="#dfc08a" roughness={0.45} metalness={0.05} />
      </mesh>
      <mesh position={[-1.2, backAttachY + 0.10, backAttachZ - 0.28]} rotation={[-0.28, -0.12, 0.10]}>
        <cylinderGeometry args={[0.028, 0.028, 1.65, 10]} />
        <meshStandardMaterial color={P.wood} roughness={0.82} />
      </mesh>
      <mesh position={[-1.30, backAttachY + 0.52, backAttachZ - 0.55]}>
        <sphereGeometry args={[0.10, 14, 14]} />
        <meshStandardMaterial color="#dfc08a" roughness={0.45} metalness={0.05} />
      </mesh>

      <pointLight position={[0, 3, 3]} intensity={0.35} color="#fbbf24" distance={10} />
      <pointLight position={[-2, 1, -2]} intensity={0.15} color="#f5d76e" distance={8} />
    </group>
  );
}

// ═════════════════════════════════════════════════════════════════════
// ─── MEKEPUNG SCENE ──────────────────────────────────────────────
// ═════════════════════════════════════════════════════════════════════

// Leg references exposed so we can animate them during the race
function Buffalo({
  position = [0, 0, 0] as [number, number, number],
  flip = false,
  legRefs,
}: {
  position?: [number, number, number];
  flip?: boolean;
  legRefs?: React.MutableRefObject<THREE.Mesh | null>[];
}) {
  const LEG_PAIRS: [number, number][] = [[-0.62, -0.46], [-0.62, 0.46], [0.62, -0.46], [0.62, 0.46]];

  return (
    <group position={position} scale={flip ? [-1, 1, 1] : [1, 1, 1]}>
      {/* Body */}
      <mesh position={[0, 0, 0]}><boxGeometry args={[2.30, 1.02, 0.96]} /><meshStandardMaterial color={P.dark} roughness={0.94} /></mesh>
      <mesh position={[-0.55, 0.52, 0]}><sphereGeometry args={[0.42, 12, 10]} /><meshStandardMaterial color={P.dark} roughness={0.94} /></mesh>
      {/* Neck */}
      <mesh position={[1.02, 0.32, 0]} rotation={[0, 0, -0.28]}>
        <cylinderGeometry args={[0.29, 0.36, 0.92, 12]} /><meshStandardMaterial color={P.dark} roughness={0.94} />
      </mesh>
      {/* Head */}
      <mesh position={[1.58, 0.55, 0]}><boxGeometry args={[0.70, 0.56, 0.52]} /><meshStandardMaterial color={P.dark} roughness={0.94} /></mesh>
      <mesh position={[2.00, 0.38, 0]}><boxGeometry args={[0.30, 0.28, 0.42]} /><meshStandardMaterial color="#2a1610" roughness={0.92} /></mesh>
      {/* Nostrils */}
      {[-0.10, 0.10].map((z, i) => (
        <mesh key={i} position={[2.16, 0.38, z]}><sphereGeometry args={[0.05, 10, 10]} /><meshStandardMaterial color="#180c04" roughness={0.96} emissive="#3a1a10" emissiveIntensity={0.2} /></mesh>
      ))}
      {/* Eyes */}
      {[-0.18, 0.18].map((z, i) => (
        <mesh key={i} position={[1.88, 0.62, z]}><sphereGeometry args={[0.045, 10, 10]} /><meshStandardMaterial color="#0a0a0a" roughness={0.2} metalness={0.3} /></mesh>
      ))}
      {/* Horns */}
      <mesh position={[1.52, 0.92, 0]}><boxGeometry args={[0.24, 0.14, 0.52]} /><meshStandardMaterial color={P.red} roughness={0.52} /></mesh>
      <mesh position={[1.48, 1.10, 0.22]} rotation={[0.55, 0.28, 0.82]}><coneGeometry args={[0.065, 0.90, 10]} /><meshStandardMaterial color="#d4c48a" roughness={0.45} metalness={0.15} /></mesh>
      <mesh position={[1.48, 1.10, -0.22]} rotation={[-0.55, -0.28, 0.82]}><coneGeometry args={[0.065, 0.90, 10]} /><meshStandardMaterial color="#d4c48a" roughness={0.45} metalness={0.15} /></mesh>
      {/* Harness */}
      <mesh position={[0, 0.56, 0]}><boxGeometry args={[1.85, 0.075, 1.00]} /><meshStandardMaterial color={P.red} roughness={0.64} /></mesh>
      {/* Legs — exposed via refs so parent can animate */}
      {LEG_PAIRS.map(([lx, lz], i) => (
        <mesh
          key={i}
          ref={legRefs ? legRefs[i] : undefined}
          position={[lx, -0.74, lz]}
        >
          <cylinderGeometry args={[0.125, 0.108, 0.90, 10]} />
          <meshStandardMaterial color={P.dark} roughness={0.94} />
        </mesh>
      ))}
      {/* Hooves */}
      {LEG_PAIRS.map(([lx, lz], i) => (
        <mesh key={`hoof-${i}`} position={[lx, -1.22, lz]}>
          <boxGeometry args={[0.22, 0.10, 0.26]} />
          <meshStandardMaterial color="#0d0806" roughness={0.74} />
        </mesh>
      ))}
      {/* Tail */}
      <mesh position={[-1.20, 0.32, 0]} rotation={[0, 0, 0.88]}>
        <cylinderGeometry args={[0.038, 0.010, 0.72, 8]} /><meshStandardMaterial color={P.dark} roughness={1} />
      </mesh>
    </group>
  );
}

function Jockey({ armRef }: { armRef: React.RefObject<THREE.Group | null> }) {
  return (
    <group position={[-1.55, 0.72, 0]}>
      <mesh position={[0, 0, 0]}><cylinderGeometry args={[0.21, 0.26, 0.65, 12]} /><meshStandardMaterial color={P.skin} roughness={0.82} /></mesh>
      <mesh position={[0, 0.58, 0]}><sphereGeometry args={[0.21, 14, 14]} /><meshStandardMaterial color={P.skin} roughness={0.82} /></mesh>
      <mesh position={[0, 0.64, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.22, 0.042, 10, 26]} /><meshStandardMaterial color={P.red} roughness={0.68} /></mesh>
      {/* Left arm */}
      <group position={[0, 0.10, 0.26]} rotation={[0.55, 0, 0.18]}>
        <mesh position={[0, -0.24, 0]}><cylinderGeometry args={[0.070, 0.060, 0.48, 10]} /><meshStandardMaterial color={P.skin} roughness={0.82} /></mesh>
        <mesh position={[0, -0.52, 0]}><cylinderGeometry args={[0.058, 0.050, 0.38, 10]} /><meshStandardMaterial color={P.skin} roughness={0.82} /></mesh>
      </group>
      {/* Right arm — whip arm */}
      <group ref={armRef} position={[0, 0.12, -0.26]}>
        <mesh position={[0, -0.22, 0]}><cylinderGeometry args={[0.072, 0.062, 0.45, 10]} /><meshStandardMaterial color={P.skin} roughness={0.82} /></mesh>
        <mesh position={[0, -0.52, 0]}><cylinderGeometry args={[0.060, 0.050, 0.42, 10]} /><meshStandardMaterial color={P.skin} roughness={0.82} /></mesh>
        <mesh position={[0, -0.76, 0]}><sphereGeometry args={[0.065, 10, 10]} /><meshStandardMaterial color={P.skin} roughness={0.82} /></mesh>
        {/* Whip handle */}
        <mesh position={[0, -0.88, 0]}><cylinderGeometry args={[0.025, 0.018, 0.24, 8]} /><meshStandardMaterial color={P.wood} roughness={0.88} /></mesh>
        {/* Whip cord */}
        <mesh position={[0.04, -1.32, 0.08]} rotation={[0.30, 0.15, 0.08]}>
          <cylinderGeometry args={[0.015, 0.004, 0.90, 8]} /><meshStandardMaterial color="#2a1608" roughness={0.90} />
        </mesh>
        <mesh position={[0.10, -1.78, 0.16]} rotation={[0.45, 0.20, 0.12]}>
          <cylinderGeometry args={[0.004, 0.001, 0.30, 4]} /><meshStandardMaterial color="#3a1e08" roughness={0.92} emissive="#5a3e28" emissiveIntensity={0.3} />
        </mesh>
      </group>
    </group>
  );
}

function MekepungScene({ isDark }: { isDark: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const armRef = useRef<THREE.Group>(null);

  // FIX: expose leg refs for running animation
  const legRefsA = useRef<(THREE.Mesh | null)[]>([null, null, null, null]);
  const legRefsB = useRef<(THREE.Mesh | null)[]>([null, null, null, null]);
  const legMeshRefsA = [
    useRef<THREE.Mesh>(null), useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null), useRef<THREE.Mesh>(null),
  ];
  const legMeshRefsB = [
    useRef<THREE.Mesh>(null), useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null), useRef<THREE.Mesh>(null),
  ];

  const [isWhipping, setIsWhipping] = useState(false);
  const whipT = useRef(0);
  const running = useRef(false);  // true during whip sequence

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;

    // Whole-cart idle bounce
    if (groupRef.current) {
      const speed = running.current ? 6.5 : 4.8;
      const amp = running.current ? 0.09 : 0.055;
      groupRef.current.position.y = Math.sin(t * speed) * amp;
      groupRef.current.rotation.z = Math.sin(t * speed + 0.5) * 0.018;
    }

    // Whip arm animation
    if (armRef.current) {
      if (isWhipping) {
        whipT.current = Math.min(whipT.current + 0.035, 1.0);
        const p = whipT.current;
        let angle: number;
        if (p < 0.40) angle = THREE.MathUtils.lerp(0, -2.0, p / 0.40);
        else if (p < 0.75) angle = THREE.MathUtils.lerp(-2.0, 1.6, (p - 0.40) / 0.35);
        else angle = THREE.MathUtils.lerp(1.6, -0.3, (p - 0.75) / 0.25);
        armRef.current.rotation.x = angle;
        if (whipT.current >= 1.0) { setIsWhipping(false); whipT.current = 0; running.current = false; }
      } else {
        armRef.current.rotation.x = THREE.MathUtils.lerp(
          armRef.current.rotation.x,
          -0.28 + Math.sin(t * 3) * 0.08,
          0.08,
        );
      }
    }

    // FIX: leg running animation — front/back pairs alternate
    const legSpeed = running.current ? 8.0 : 2.5;
    const legAmp = running.current ? 0.45 : 0.08;
    legMeshRefsA.forEach((r, i) => {
      if (r.current) {
        r.current.rotation.x = Math.sin(t * legSpeed + i * Math.PI * 0.5) * legAmp;
      }
    });
    legMeshRefsB.forEach((r, i) => {
      if (r.current) {
        r.current.rotation.x = Math.sin(t * legSpeed + i * Math.PI * 0.5 + Math.PI) * legAmp;
      }
    });
  });

  const handleClick = () => {
    if (!isWhipping) {
      setIsWhipping(true);
      whipT.current = 0;
      running.current = true;
    }
  };

  return (
    <group ref={groupRef} onClick={handleClick}
      onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = 'auto'; }}
    >
      <Sparkles count={50} scale={[6, 4, 4]} size={0.08} speed={1.2} opacity={0.25} color={isDark ? '#d4c4a8' : '#a89878'} />

      <Buffalo position={[0.35, 0, 0.80]} flip={false} legRefs={legMeshRefsA as any} />
      <Buffalo position={[0.35, 0, -0.80]} flip={false} legRefs={legMeshRefsB as any} />

      {/* Yoke */}
      <mesh position={[0.30, 0.62, 0]}><boxGeometry args={[0.14, 0.12, 1.68]} /><meshStandardMaterial color="#5c3a10" roughness={0.92} /></mesh>
      {[-0.72, 0, 0.72].map((z, i) => (
        <mesh key={i} position={[0.30, 0.70, z]}><boxGeometry args={[0.16, 0.06, 0.06]} /><meshStandardMaterial color={P.gold} metalness={0.68} roughness={0.18} emissive="#f5d76e" emissiveIntensity={0.1} /></mesh>
      ))}
      {[-0.84, 0.84].map((z, i) => (
        <mesh key={i} position={[0.30, 0.62, z]}><boxGeometry args={[0.20, 0.18, 0.10]} /><meshStandardMaterial color={P.red} roughness={0.54} /></mesh>
      ))}

      {/* Cart */}
      <mesh position={[-0.55, -0.08, 0]}><boxGeometry args={[0.16, 0.13, 1.55]} /><meshStandardMaterial color="#5c3a10" roughness={0.92} /></mesh>
      <mesh position={[-1.58, -0.04, 0]}><boxGeometry args={[1.08, 0.16, 1.42]} /><meshStandardMaterial color="#5c3a10" roughness={0.92} /></mesh>
      <mesh position={[-1.58, 0.12, 0]}><boxGeometry args={[1.06, 0.10, 1.40]} /><meshStandardMaterial color={P.red} roughness={0.62} /></mesh>
      {[-0.68, 0.68].map((z, i) => (
        <mesh key={i} position={[-1.58, 0.19, z]}><boxGeometry args={[1.04, 0.045, 0.025]} /><meshStandardMaterial color={P.gold} metalness={0.70} roughness={0.16} emissive="#f5d76e" emissiveIntensity={0.08} /></mesh>
      ))}

      {/* Cart fence / railing — pagar kayu di sekeliling gerobak */}
      {/* Vertical posts — 4 corners + 2 mid-side */}
      {[
        [-1.06, 0.68], [-1.06, -0.68],   // front corners
        [-2.10, 0.68], [-2.10, -0.68],   // back corners
        [-1.58, 0.68], [-1.58, -0.68],   // mid side posts
      ].map(([x, z], i) => (
        <mesh key={`post-${i}`} position={[x, 0.46, z]}>
          <cylinderGeometry args={[0.035, 0.04, 0.60, 8]} />
          <meshStandardMaterial color="#4a2c10" roughness={0.92} />
        </mesh>
      ))}
      {/* Post caps — gold knobs on top */}
      {[
        [-1.06, 0.68], [-1.06, -0.68],
        [-2.10, 0.68], [-2.10, -0.68],
      ].map(([x, z], i) => (
        <mesh key={`cap-${i}`} position={[x, 0.78, z]}>
          <sphereGeometry args={[0.045, 8, 8]} />
          <meshStandardMaterial color={P.gold} metalness={0.70} roughness={0.18} emissive="#f5d76e" emissiveIntensity={0.10} />
        </mesh>
      ))}

      {/* Horizontal rails — left & right sides */}
      {[-0.68, 0.68].map((z, i) => (
        <group key={`rail-${i}`}>
          {/* Upper rail */}
          <mesh position={[-1.58, 0.68, z]}>
            <boxGeometry args={[1.06, 0.05, 0.04]} />
            <meshStandardMaterial color="#5c3a10" roughness={0.90} />
          </mesh>
          {/* Lower rail */}
          <mesh position={[-1.58, 0.42, z]}>
            <boxGeometry args={[1.06, 0.04, 0.035]} />
            <meshStandardMaterial color="#5c3a10" roughness={0.92} />
          </mesh>
        </group>
      ))}

      {/* Back rail — belakang gerobak */}
      <mesh position={[-2.10, 0.68, 0]}>
        <boxGeometry args={[0.04, 0.05, 1.34]} />
        <meshStandardMaterial color="#5c3a10" roughness={0.90} />
      </mesh>
      <mesh position={[-2.10, 0.42, 0]}>
        <boxGeometry args={[0.035, 0.04, 1.34]} />
        <meshStandardMaterial color="#5c3a10" roughness={0.92} />
      </mesh>

      {/* Wheels — large traditional wooden cart wheels */}
      {[-0.82, 0.82].map((z, i) => (
        <group key={i} position={[-1.62, -0.58, z]}>
          {/* Outer rim — thick wooden ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.62, 0.08, 14, 36]} />
            <meshStandardMaterial color="#2e1808" roughness={0.88} />
          </mesh>
          {/* Solid disc face */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.62, 0.62, 0.06, 36]} />
            <meshStandardMaterial color="#4a2c12" roughness={0.92} />
          </mesh>
          {/* Hub — central metal cap */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.12, 16]} />
            <meshStandardMaterial color={P.gold} metalness={0.72} roughness={0.16} emissive="#f5d76e" emissiveIntensity={0.12} />
          </mesh>
          {/* Hub decorative ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.15, 0.018, 10, 24]} />
            <meshStandardMaterial color={P.gold} metalness={0.70} roughness={0.18} />
          </mesh>
          {/* Spokes — 8 wooden spokes */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, j) => (
            <mesh key={j} rotation={[Math.PI / 2, 0, (deg * Math.PI) / 180]}>
              <cylinderGeometry args={[0.028, 0.028, 1.18, 6]} />
              <meshStandardMaterial color="#3a2008" roughness={0.92} />
            </mesh>
          ))}
          {/* Axle stub */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.22, 10]} />
            <meshStandardMaterial color="#1a0e04" roughness={0.95} />
          </mesh>
        </group>
      ))}

      {/* Ogar — traditional plow on top of the cart */}
      <group position={[-1.58, 0.20, 0]}>
        {/* Main beam — pole angled forward toward yoke */}
        <mesh position={[0.80, 0.22, 0]} rotation={[0, 0, -0.12]}>
          <cylinderGeometry args={[0.04, 0.05, 1.80, 8]} />
          <meshStandardMaterial color="#5c3a10" roughness={0.92} />
        </mesh>

        {/* Handle poles — two angled uprights behind jockey */}
        <mesh position={[-0.30, 0.55, 0.16]} rotation={[0.10, 0, -0.45]}>
          <cylinderGeometry args={[0.03, 0.035, 0.95, 8]} />
          <meshStandardMaterial color="#5c3a10" roughness={0.92} />
        </mesh>
        <mesh position={[-0.30, 0.55, -0.16]} rotation={[-0.10, 0, -0.45]}>
          <cylinderGeometry args={[0.03, 0.035, 0.95, 8]} />
          <meshStandardMaterial color="#5c3a10" roughness={0.92} />
        </mesh>
        {/* Handle crossbar */}
        <mesh position={[-0.55, 0.90, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.38, 8]} />
          <meshStandardMaterial color="#4a2c10" roughness={0.90} />
        </mesh>

        {/* Blade holder — angled down from main beam */}
        <mesh position={[0.20, -0.10, 0]} rotation={[0, 0, 0.35]}>
          <cylinderGeometry args={[0.035, 0.045, 0.65, 8]} />
          <meshStandardMaterial color="#4a2c10" roughness={0.94} />
        </mesh>
        {/* Metal plow blade */}
        <mesh position={[0.38, -0.35, 0]} rotation={[0, 0, 0.20]}>
          <boxGeometry args={[0.26, 0.035, 0.26]} />
          <meshStandardMaterial color="#555555" metalness={0.65} roughness={0.35} />
        </mesh>
      </group>

      <Jockey armRef={armRef} />

      {/* Ground shadow */}
      <mesh position={[0, -1.45, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[3.5, 32]} /><meshStandardMaterial color="#000000" transparent opacity={0.15} roughness={1} />
      </mesh>
    </group>
  );
}

// ═════════════════════════════════════════════════════════════════════
// ─── KAKAO TREE SCENE ────────────────────────────────────────────
// ═════════════════════════════════════════════════════════════════════
function KakaoTreeFull({ isDark, onFruitClick }: { isDark: boolean; onFruitClick: () => void }) {
  const TRUNK = '#4a2c10'; const BRANCH = '#5c3818';
  const LEAF1 = '#1e6b1e'; const LEAF2 = '#2a8a2a'; const LEAF3 = '#164a16';

  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Gentle sway
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.8) * 0.02;
    }
  });

  // Pivot-based branches (joint at the trunk)
  const branches = [
    { joint: [0.0, 1.4, 0.0] as [number, number, number], rot: [0, 0.4, 0.8] as [number, number, number], len: 1.6, thickness: 0.12 },
    { joint: [0.0, 1.7, 0.0] as [number, number, number], rot: [0, -1.2, -0.7] as [number, number, number], len: 1.5, thickness: 0.10 },
    { joint: [0.0, 2.0, 0.0] as [number, number, number], rot: [-0.8, 0.2, 0.6] as [number, number, number], len: 1.3, thickness: 0.09 },
    { joint: [0.0, 2.2, 0.0] as [number, number, number], rot: [0.6, 1.5, 0.5] as [number, number, number], len: 1.2, thickness: 0.08 },
    { joint: [0.0, 2.5, 0.0] as [number, number, number], rot: [-0.4, -0.8, -0.6] as [number, number, number], len: 1.1, thickness: 0.07 },
    { joint: [0.0, 2.7, 0.0] as [number, number, number], rot: [0.3, 2.2, 0.4] as [number, number, number], len: 1.0, thickness: 0.06 },
  ];

  // Dense canopy leaf clusters
  const leafClusters = [
    { pos: [0, 3.8, 0] as [number, number, number], scale: [2.2, 1.6, 2.2] as [number, number, number], color: LEAF2 },
    { pos: [1.2, 3.1, 0.0] as [number, number, number], scale: [1.5, 1.2, 1.5] as [number, number, number], color: LEAF1 },
    { pos: [-1.0, 3.2, 0.8] as [number, number, number], scale: [1.4, 1.1, 1.4] as [number, number, number], color: LEAF3 },
    { pos: [-0.8, 3.3, -1.0] as [number, number, number], scale: [1.3, 1.0, 1.3] as [number, number, number], color: LEAF2 },
    { pos: [0.8, 3.5, -0.9] as [number, number, number], scale: [1.4, 1.1, 1.4] as [number, number, number], color: LEAF1 },
    { pos: [0.0, 4.2, 0.4] as [number, number, number], scale: [1.8, 1.3, 1.8] as [number, number, number], color: LEAF3 },
    { pos: [-0.5, 4.0, -0.5] as [number, number, number], scale: [1.2, 0.9, 1.2] as [number, number, number], color: LEAF2 },
    { pos: [0.6, 3.7, 0.8] as [number, number, number], scale: [1.1, 0.8, 1.1] as [number, number, number], color: LEAF1 },
  ];

  // Cacao pods — cauliflory: grow directly on trunk
  // Positioned using height (y) and angle around the trunk to ensure perfect attachment
  const pods = [
    { y: 1.0, angle: 0.5, color: '#f0a020' },
    { y: 1.3, angle: 2.0, color: '#e07018' },
    { y: 1.7, angle: -1.0, color: '#c83020' },
    { y: 0.8, angle: -2.2, color: '#6aaa18' },
    { y: 2.1, angle: 0.8, color: '#f0a020' },
    { y: 1.9, angle: -0.5, color: '#e07018' },
  ];

  return (
    <group
      ref={groupRef}
      onClick={onFruitClick}
      onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
    >
      <Sparkles count={40} scale={[4, 6, 4]} size={0.03} speed={0.4} opacity={0.5} color="#f5d76e" />

      {/* Ground — earth patch */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[4, 32]} /><meshStandardMaterial color={isDark ? '#1a2e1a' : '#2d5a2d'} roughness={0.95} />
      </mesh>

      {/* Root flare — wider base */}
      <mesh position={[0, 0.08, 0]}><cylinderGeometry args={[0.55, 0.92, 0.18, 16]} /><meshStandardMaterial color="#3a2810" roughness={0.96} /></mesh>

      {/* Surface roots */}
      {[0, 1.2, 2.4, 3.6, 4.8].map((a, i) => (
        <mesh key={`root-${i}`} position={[Math.cos(a) * 0.60, 0.06, Math.sin(a) * 0.60]} rotation={[0, -a, Math.PI / 2 + 0.15]}>
          <cylinderGeometry args={[0.05, 0.08, 0.70, 8]} /><meshStandardMaterial color="#3a2810" roughness={0.96} />
        </mesh>
      ))}

      {/* Trunk — tapered, slightly curved */}
      <mesh position={[0, 0.90, 0]}><cylinderGeometry args={[0.24, 0.38, 1.70, 14]} /><meshStandardMaterial color={TRUNK} roughness={0.92} /></mesh>
      <mesh position={[0.02, 2.05, 0.01]}><cylinderGeometry args={[0.18, 0.24, 1.60, 14]} /><meshStandardMaterial color={TRUNK} roughness={0.92} /></mesh>

      {/* Bark texture rings */}
      {[0.50, 0.90, 1.30, 1.70, 2.10, 2.50].map((y, i) => (
        <mesh key={`bark-${i}`} position={[0, y, 0]} rotation={[0, i * 0.8, 0]}>
          <torusGeometry args={[0.28 - y * 0.03, 0.015, 8, 18]} /><meshStandardMaterial color="#3a2008" roughness={0.98} />
        </mesh>
      ))}

      {/* Pivot-based Branches (Growing out of the trunk) */}
      {branches.map((b, i) => (
        <group key={`branch-${i}`} position={b.joint} rotation={b.rot}>
          <mesh position={[0, b.len / 2, 0]}>
            <cylinderGeometry args={[b.thickness * 0.5, b.thickness, b.len, 10]} />
            <meshStandardMaterial color={BRANCH} roughness={0.92} />
          </mesh>
        </group>
      ))}

      {/* Canopy — dense overlapping leaf clusters */}
      {leafClusters.map((l, i) => (
        <mesh key={`leaf-${i}`} position={l.pos} scale={l.scale}>
          <sphereGeometry args={[0.8, 12, 10]} /><meshStandardMaterial color={l.color} roughness={0.8} />
        </mesh>
      ))}

      {/* Cacao pods — smooth elongated rugby ball shape perfectly attached horizontally */}
      {pods.map((p, i) => {
        // Calculate exact trunk radius at height y (tapered from 0.38 at base)
        const radius = 0.38 - (p.y / 1.7) * 0.14;
        const x = Math.cos(p.angle) * radius;
        const z = Math.sin(p.angle) * radius;

        return (
          <group key={`pod-${i}`} position={[x, p.y, z]} rotation={[0, -p.angle, 0]}>
            {/* Stem connecting horizontally to trunk (+Z points exactly away from trunk) */}
            <mesh position={[0, 0, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.012, 0.015, 0.12, 6]} />
              <meshStandardMaterial color={BRANCH} roughness={0.94} />
            </mesh>
            {/* Main Fruit Body - Horizontal */}
            <mesh position={[0, 0, 0.18]} scale={[0.10, 0.10, 0.18]}>
              <sphereGeometry args={[1, 16, 16]} />
              <meshStandardMaterial
                color={p.color}
                roughness={0.4}
                metalness={0.1}
                emissive={p.color}
                emissiveIntensity={hovered ? 0.3 : 0.0}
              />
            </mesh>
          </group>
        );
      })}

      <pointLight position={[3, 8, 2]} intensity={0.4} color="#fef3c7" distance={12} />
    </group>
  );
}

// Generate a realistic, dense cluster of fresh cacao beans covered in white pulp
// They form a central core, thick in the middle and tapering at the ends.
const CACAO_BEANS_DATA = (() => {
  const data = [];
  const rows = 9;
  const beanSpacingX = 0.20;
  const beanSpacingZ = 0.22;

  for (let r = 0; r < rows; r++) {
    const distanceFromCenter = Math.abs(r - (rows - 1) / 2);
    const x = (r - (rows - 1) / 2) * beanSpacingX;
    const taper = Math.max(0.5, 1 - (distanceFromCenter * 0.15));

    // Middle rows have 3 columns, outer rows have 2, ends have 1
    const currentCols = distanceFromCenter > 2.5 ? 1 : (distanceFromCenter > 1.2 ? 2 : 3);

    for (let c = 0; c < currentCols; c++) {
      const z = (c - (currentCols - 1) / 2) * beanSpacingZ * taper;

      // Stagger rows slightly for an organic interlocking look
      let staggerX = 0;
      if (currentCols === 3 && c === 1) staggerX = 0.08 * taper;
      else if (currentCols === 2) staggerX = (c === 0 ? -0.05 : 0.05) * taper;

      // Y position (height/depth in the bottom shell)
      // Middle columns sit slightly higher to form a mound
      const y = 0.05 - Math.abs(c - (currentCols - 1) / 2) * 0.04;

      // Slight deterministic rotations for natural irregularities
      const rotX = (r * 0.1 + c * 0.05);
      const rotY = (c * 0.2 - r * 0.1);
      const rotZ = (r * 0.15 - c * 0.1);

      data.push({
        pos: [x + staggerX, y, z] as [number, number, number],
        rot: [rotX, rotY, rotZ] as [number, number, number],
        scale: [0.16 * taper, 0.16 * taper, 0.15 * taper] as [number, number, number]
      });
    }
  }
  return data;
})();

function CacaoPodCloseup({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  const topRef = useRef<THREE.Group>(null);
  const topMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const pulpMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const animState = useRef({ fade: 0 }); // 0 = closed, 1 = open

  useFrame(() => {
    // Smoothly animate between 0 and 1
    const target = isOpen ? 1 : 0;
    animState.current.fade = THREE.MathUtils.lerp(animState.current.fade, target, 0.055);

    // Lift and tilt top half slightly before fading
    if (topRef.current) {
      topRef.current.rotation.x = -animState.current.fade * 0.3; // tilt back
      topRef.current.position.y = 0.01 + animState.current.fade * 0.2; // lift up
    }

    // Fade out top half
    if (topMatRef.current) {
      topMatRef.current.transparent = true;
      topMatRef.current.opacity = 1 - animState.current.fade;
      topMatRef.current.depthWrite = animState.current.fade < 0.99; // Prevent z-sorting issues when invisible
    }

    // Fade in pulp
    if (pulpMatRef.current) {
      pulpMatRef.current.opacity = animState.current.fade * 0.96;
    }
  });

  return (
    <group onClick={onToggle}
      onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = 'auto'; }}
    >
      {isOpen && <Sparkles count={30} scale={[2.5, 1, 1.2]} size={0.08} speed={0.6} opacity={0.8} color="#f5e6d3" />}

      {/* Stem connected to the left end (-X) */}
      <mesh position={[-1.25, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.07, 0.25, 10]} />
        <meshStandardMaterial color="#5c3818" roughness={0.94} />
      </mesh>

      {/* Bottom half (Stays visible, holds the beans) */}
      <group position={[0, -0.01, 0]}>
        {/* Outer shell (bottom slice: theta from PI/2 to PI/2) */}
        <mesh scale={[1.30, 0.58, 0.58]}>
          <sphereGeometry args={[0.90, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
          <meshStandardMaterial color="#e07018" roughness={0.58} metalness={0.04} side={THREE.DoubleSide} />
        </mesh>

        {/* Interior pulp embedded in bottom half */}
        <mesh scale={[1.25, 0.52, 0.52]} position={[0, 0.04, 0]}>
          <sphereGeometry args={[0.88, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
          <meshStandardMaterial ref={pulpMatRef} color="#f5f0e0" roughness={0.82} transparent opacity={0} emissive="#fff8e7" emissiveIntensity={0.15} />
        </mesh>

        {/* Cacao beans resting in the pulp (Fresh beans are white/mucilaginous) */}
        {CACAO_BEANS_DATA.map((b, i) => (
          <mesh key={i} position={b.pos} scale={b.scale} rotation={b.rot}>
            <sphereGeometry args={[0.8, 16, 16]} />
            <meshStandardMaterial color="#fdfcf0" roughness={0.25} metalness={0.05} />
          </mesh>
        ))}
      </group>

      {/* Top half (Fades away) */}
      <group ref={topRef} position={[0, 0.01, 0]}>
        {/* Outer shell (top slice: theta from 0 to PI/2) */}
        <mesh scale={[1.30, 0.58, 0.58]}>
          <sphereGeometry args={[0.90, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial ref={topMatRef} color="#d06010" roughness={0.58} metalness={0.04} side={THREE.DoubleSide} />
        </mesh>
      </group>

    </group>
  );
}

function KakaoScene({ state, onStateChange, isDark }: { state: number; onStateChange: () => void; isDark: boolean }) {
  return (
    <group>
      {state === 0 && <KakaoTreeFull isDark={isDark} onFruitClick={onStateChange} />}
      {state >= 1 && <CacaoPodCloseup isOpen={state === 2} onToggle={onStateChange} />}
    </group>
  );
}

// ─── INFO PANEL — enhanced with facts chips ────────────────────────────────────
function InfoPanel({ scene, lang, isDark }: { scene: SceneKey; lang: Lang; isDark: boolean }) {
  const panel = copy[lang].info[scene];

  // FIX: positions adjusted to be responsive & not clip
  const positions: Record<SceneKey, [number, number, number]> = {
    jegog: [4.2, 1.2, 0],
    mekepung: [4.5, 1.4, 0],
    kakao: [2.8, 1.8, 0],
  };

  return (
    <Html
      position={positions[scene]}
      style={{ width: '240px', pointerEvents: 'none' }}
      distanceFactor={8}
      occlude={false}
    >
      {/* hidden on mobile (below md), visible on md+ only */}
      <div className="hidden md:block" style={{
        background: isDark ? 'rgba(17,17,17,0.95)' : 'rgba(255,255,255,0.95)',
        border: `1px solid ${isDark ? 'rgba(52,211,153,0.25)' : 'rgba(5,150,105,0.3)'}`,
        borderRadius: '20px',
        padding: '18px 20px',
        color: isDark ? '#a1a1aa' : '#18181b',
        boxShadow: isDark ? '0 16px 48px rgba(0,0,0,0.70)' : '0 16px 48px rgba(0,0,0,0.10)',
        fontFamily: dmSans.style.fontFamily,
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        transform: 'translateZ(0)',
      }}>
        <p style={{ fontSize: '9px', color: isDark ? '#34d399' : '#059669', fontWeight: 800, letterSpacing: '2px', marginBottom: '8px', textTransform: 'uppercase' }}>
          {panel.cat}
        </p>
        <h4 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '4px', color: isDark ? '#ffffff' : '#18181b', lineHeight: 1.2, fontFamily: playfair.style.fontFamily }}>
          {panel.title}
        </h4>
        <p style={{ fontSize: '11px', fontStyle: 'italic', color: isDark ? '#34d399' : '#059669', marginBottom: '10px' }}>
          {(panel as any).tagline}
        </p>
        <p style={{ fontSize: '12px', color: isDark ? '#a1a1aa' : '#18181b', lineHeight: 1.75, marginBottom: '14px' }}>
          {panel.desc}
        </p>
        {/* Facts chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
          {(panel as any).facts?.map((f: string, i: number) => (
            <span key={i} style={{
              fontSize: '10px', fontWeight: 600,
              padding: '3px 8px', borderRadius: '99px',
              background: isDark ? 'rgba(52,211,153,0.12)' : 'rgba(5,150,105,0.08)',
              color: isDark ? '#34d399' : '#059669',
              border: `1px solid ${isDark ? 'rgba(52,211,153,0.25)' : 'rgba(5,150,105,0.20)'}`,
            }}>{f}</span>
          ))}
        </div>
        <div style={{
          padding: '10px 12px',
          background: isDark ? 'rgba(52,211,153,0.08)' : 'rgba(5,150,105,0.06)',
          borderRadius: '10px',
          fontSize: '11px',
          color: isDark ? '#34d399' : '#059669',
          fontWeight: 600,
          border: `1px solid ${isDark ? 'rgba(52,211,153,0.20)' : 'rgba(5,150,105,0.15)'}`,
        }}>
          {panel.note}
        </div>
      </div>
    </Html>
  );
}

// ─── FIX: UNIFIED CAMERA UPDATER — handles ALL scene transitions ──────────────
function CameraController({ activeScene, kakaoState }: { activeScene: SceneKey; kakaoState: number }) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(...CAMERA_CONFIG[activeScene]));

  // Update target whenever scene or kakao state changes
  useEffect(() => {
    if (activeScene === 'kakao' && kakaoState >= 1) {
      target.current.set(...KAKAO_POD_CAM);
    } else {
      target.current.set(...CAMERA_CONFIG[activeScene]);
    }
  }, [activeScene, kakaoState]);

  useFrame(() => {
    camera.position.lerp(target.current, 0.06);
    camera.updateProjectionMatrix();
  });

  return null;
}

// ─── SCENE WRAPPER ─────────────────────────────────────────────────────────────
function Scene({
  activeScene, isDark, lang,
  kakaoState, onKakaoStateChange, onJegogClick,
}: {
  activeScene: SceneKey;
  isDark: boolean;
  lang: Lang;
  kakaoState: number;
  onKakaoStateChange: () => void;
  onJegogClick: () => void;
}) {
  return (
    <>
      <ambientLight intensity={isDark ? 0.42 : 0.75} />
      <pointLight position={[6, 9, 5]} intensity={isDark ? 1.45 : 2.30} color={isDark ? '#fbbf24' : '#fff8ea'} />
      <pointLight position={[-5, 4, -4]} intensity={0.65} color="#93c5fd" />
      <spotLight position={[0, 12, 0]} angle={0.26} penumbra={0.55} intensity={0.90} color="#fde68a" />
      <pointLight position={[0, -2, -6]} intensity={0.25} color={isDark ? '#34d399' : '#18181b'} />

      {/* FIX: camera controller always mounted, handles all scenes */}
      <CameraController activeScene={activeScene} kakaoState={kakaoState} />

      <Float speed={1.4} rotationIntensity={0.06} floatIntensity={0.14}>
        {activeScene === 'jegog' && <JegogInstrument onSoundToggle={onJegogClick} />}
        {activeScene === 'mekepung' && <MekepungScene isDark={isDark} />}
        {activeScene === 'kakao' && <KakaoScene state={kakaoState} onStateChange={onKakaoStateChange} isDark={isDark} />}
      </Float>

      {/* InfoPanel outside Float to prevent text vibration */}
      <InfoPanel scene={activeScene} lang={lang} isDark={isDark} />
      <Environment preset={isDark ? 'night' : 'sunset'} />

      {/* FIX: removed DepthOfField (causes perf issues on mobile) — keep Bloom + Vignette */}
      <EffectComposer enableNormalPass={false}>
        <Bloom luminanceThreshold={0.85} mipmapBlur intensity={isDark ? 0.6 : 0.35} radius={0.4} />
        <Vignette eskil={false} offset={0.15} darkness={isDark ? 0.40 : 0.25} />
      </EffectComposer>

      <OrbitControls
        autoRotate
        autoRotateSpeed={0.38}
        enableZoom
        enableDamping
        dampingFactor={0.05}
        minDistance={3}
        maxDistance={25}
      />
    </>
  );
}

// ─── WEBGL FALLBACK ───────────────────────────────────────────────────────────
function NoWebGL({ isDark }: { isDark: boolean }) {
  return (
    <div className={`h-full flex flex-col items-center justify-center gap-3`}
      style={{ color: isDark ? '#34d399' : '#059669' }}>
      <span className="text-5xl">🎋</span>
      <p className="font-bold text-lg" style={{ fontFamily: playfair.style.fontFamily }}>WebGL tidak tersedia</p>
      <p className="text-sm opacity-70" style={{ fontFamily: dmSans.style.fontFamily }}>Coba buka di browser yang lebih baru atau aktifkan hardware acceleration.</p>
    </div>
  );
}

// ─── SLIDE-UP INFO PANEL (PRD §6.3) ──────────────────────────────────────────
function CulturalTrivia({ scene, lang, isDark }: { scene: SceneKey; lang: Lang; isDark: boolean }) {
  const c = copy[lang];
  const trivia = c.trivia[scene];
  return (
    <motion.div
      key={scene}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="space-y-4"
    >
      {/* Section title */}
      <h3
        className="text-lg font-bold tracking-tight"
        style={{ fontFamily: playfair.style.fontFamily, color: isDark ? '#ffffff' : '#18181b' }}
      >
        {c.triviaTitle}
      </h3>

      {/* Trivia grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {trivia.map((item: { icon: string; text: string }, i: number) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`flex items-start gap-3 p-4 rounded-xl border transition-colors ${
              isDark
                ? 'bg-[#111111] border-[#1f1f1f] hover:border-emerald-800/60'
                : 'bg-white border-gray-200 hover:border-emerald-300'
            }`}
          >
            <span className="text-xl flex-shrink-0 mt-0.5">{item.icon}</span>
            <p className={`text-sm leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}
              style={{ fontFamily: dmSans.style.fontFamily }}>
              {item.text}
            </p>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.a
        href={c.triviaCtaHref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
          isDark
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
            : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
        }`}
        style={{ fontFamily: dmSans.style.fontFamily }}
      >
        {c.triviaCtaLabel}
      </motion.a>
    </motion.div>
  );
}

// ─── MAIN PAGE (PRD §4, §6, §11) ─────────────────────────────────────────────
export default function BudayaPage() {
  const { theme, lang } = useUIStore();
  const [mounted, setMounted] = useState(false);
  const [activeScene, setActiveScene] = useState<SceneKey>('jegog');
  const [kakaoState, setKakaoState] = useState(0);
  const [webglOk, setWebglOk] = useState(true);
  const [transitioning, setTransitioning] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    setMounted(true);
    // WebGL check (PRD §13 risk mitigation)
    try {
      const cv = document.createElement('canvas');
      if (!cv.getContext('webgl') && !cv.getContext('webgl2')) setWebglOk(false);
    } catch { setWebglOk(false); }
    // Reduced motion check (PRD §11)
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Stop synth + reset kakao when leaving scenes
  useEffect(() => {
    if (activeScene !== 'jegog') getSynth().stop();
    if (activeScene !== 'kakao') setKakaoState(0);
  }, [activeScene]);

  // Cleanup on unmount
  useEffect(() => () => { synthInstance?.destroy(); synthInstance = null; }, []);

  if (!mounted) return null;

  const isDark = theme === 'dark';
  const currentLang = (lang as Lang) || 'id';
  const c = copy[currentLang];
  const sceneBtnList: SceneKey[] = ['jegog', 'mekepung', 'kakao'];

  const handleSceneChange = (key: SceneKey) => {
    if (key === activeScene) return;
    setTransitioning(true);
    setTimeout(() => { setActiveScene(key); setTransitioning(false); }, 220);
  };

  const handleKakaoStateChange = () => setKakaoState(s => (s + 1) % 3);
  const handleJegogClick = () => {
    const s = getSynth();
    s.playing ? s.stop() : s.start();
  };

  const clickHint = activeScene === 'jegog'
    ? c.clickHint.jegog
    : activeScene === 'mekepung'
      ? c.clickHint.mekepung
      : kakaoState === 0 ? c.clickHint.kakao0
        : kakaoState === 1 ? c.clickHint.kakao1
          : c.clickHint.kakao2;

  return (
    <>
      <div
        className={`min-h-screen pt-24 transition-colors duration-500 ${playfair.variable} ${dmSans.variable}`}
        style={{
          position: 'relative',
          zIndex: 1,
          background: isDark ? '#0a0a0a' : '#ffffff',
          color: isDark ? '#a1a1aa' : '#18181b',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        }}
      >

        {/* ── HERO (PRD §10) ── */}
        <div className="max-w-5xl mx-auto px-6 text-center mb-12">
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold tracking-[2px] uppercase mb-7 border backdrop-blur-sm ${isDark
              ? 'bg-[rgba(52,211,153,0.1)] border-[rgba(52,211,153,0.3)] text-emerald-400'
              : 'bg-[rgba(52,211,153,0.08)] border-[rgba(52,211,153,0.25)] text-zinc-900'
              }`}
            style={{ fontFamily: dmSans.style.fontFamily }}
          >
            {c.badge}
          </motion.div>

          <motion.h1
            initial={prefersReducedMotion ? {} : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.10 }}
            className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.1]"
            style={{ fontFamily: playfair.style.fontFamily, color: isDark ? '#ffffff' : '#18181b' }}
          >
            {c.title}{' '}
            <span style={{ color: isDark ? '#34d399' : '#059669' }}>
              {c.titleAccent}
            </span>
          </motion.h1>

          <motion.p
            initial={prefersReducedMotion ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.20 }}
            className="text-lg md:text-xl max-w-2xl mx-auto"
            style={{
              fontFamily: dmSans.style.fontFamily,
              color: isDark ? 'rgba(255,255,255,0.85)' : '#18181b',
            }}
          >
            {c.subtitle}
          </motion.p>
        </div>

        {/* ── SCENE SELECTOR — Glassmorphism (PRD §6.1) ── */}
        <div className="flex flex-wrap justify-center gap-3 mb-5 px-4" role="tablist">
          {sceneBtnList.map((key) => (
            <motion.button
              key={key}
              whileHover={prefersReducedMotion ? {} : { scale: 1.04, y: -2 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
              onClick={() => handleSceneChange(key)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSceneChange(key); }}
              tabIndex={0}
              role="tab"
              aria-selected={activeScene === key}
              aria-label={`${c.btns[key]} scene`}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 backdrop-blur-md border ${activeScene === key
                ? isDark
                  ? 'bg-[rgba(52,211,153,0.2)] text-emerald-400 border-emerald-400 shadow-lg shadow-[rgba(52,211,153,0.15)]'
                  : 'bg-[rgba(52,211,153,0.12)] text-zinc-900 border-emerald-400 shadow-lg shadow-[rgba(52,211,153,0.1)]'
                : isDark
                  ? 'bg-[rgba(255,255,255,0.05)] text-[#e5e5e5] border-[rgba(255,255,255,0.1)] hover:border-[rgba(52,211,153,0.4)] hover:bg-[rgba(255,255,255,0.08)]'
                  : 'bg-[rgba(255,255,255,0.6)] text-zinc-900 border-[rgba(52,211,153,0.2)] hover:border-[rgba(52,211,153,0.5)] hover:bg-[rgba(255,255,255,0.8)] shadow-sm'
                }`}
              style={{ fontFamily: dmSans.style.fontFamily }}
            >
              {c.btns[key]}
            </motion.button>
          ))}
        </div>

        {/* ── JEGOG SOUND BUTTON ── */}
        <AnimatePresence>
          {activeScene === 'jegog' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
              className="flex justify-center mb-4 px-4"
            >
              <JegogSoundButton isDark={isDark} c={c} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── KAKAO STATE DOTS ── */}
        <AnimatePresence>
          {activeScene === 'kakao' && (
            <motion.div
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex justify-center gap-2 mb-4"
            >
              {[0, 1, 2].map(s => (
                <motion.button
                  key={s}
                  onClick={() => setKakaoState(s)}
                  whileHover={prefersReducedMotion ? {} : { scale: 1.2 }}
                  aria-label={`Kakao state ${s + 1}`}
                  tabIndex={0}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${kakaoState === s
                    ? 'bg-emerald-400 scale-125'
                    : isDark ? 'bg-white/20' : 'bg-zinc-900/20'
                    }`}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── 3D CANVAS (PRD §5) ── */}
        <div
          className={`h-[560px] md:h-[620px] relative overflow-hidden rounded-2xl mx-4 border ${isDark ? 'border-[rgba(52,211,153,0.15)]' : 'border-[rgba(52,211,153,0.2)]'
            }`}
          role="img"
          aria-label={`3D interactive model: ${c.sceneLabel[activeScene]}`}
        >

          {/* Smooth fade overlay between scenes */}
          <AnimatePresence>
            {transitioning && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="absolute inset-0 z-20 backdrop-blur-sm flex items-center justify-center"
                style={{ background: isDark ? 'rgba(10,10,10,0.6)' : 'rgba(255,255,255,0.6)' }}
              >
                <div className="w-8 h-8 border-2 border-emerald-400/40 border-t-emerald-400 rounded-full animate-spin" />
              </motion.div>
            )}
          </AnimatePresence>

          {webglOk ? (
            <Canvas
              camera={{ position: CAMERA_CONFIG['jegog'], fov: 50 }}
              gl={{ antialias: true, alpha: true }}
              dpr={[1, Math.min(window.devicePixelRatio, 2)]}
              onCreated={({ gl }) => {
                if (!gl.getContext()) setWebglOk(false);
              }}
            >
              <color attach="background" args={[isDark ? '#000000' : '#ffffff']} />
              <fog attach="fog" args={[isDark ? '#000000' : '#ffffff', 15, 35]} />
              <Scene
                activeScene={activeScene}
                isDark={isDark}
                lang={currentLang}
                kakaoState={kakaoState}
                onKakaoStateChange={handleKakaoStateChange}
                onJegogClick={handleJegogClick}
              />
            </Canvas>
          ) : (
            <NoWebGL isDark={isDark} />
          )}

          {/* Active scene label */}
          <div
            className={`absolute top-4 left-4 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border ${isDark
              ? 'bg-[rgba(10,10,10,0.85)] text-emerald-400 border-[rgba(52,211,153,0.25)]'
              : 'bg-[rgba(255,255,255,0.85)] text-zinc-900 border-[rgba(52,211,153,0.3)] shadow-sm'
              }`}
            style={{ fontFamily: dmSans.style.fontFamily }}
          >
            {c.sceneLabel[activeScene]}
          </div>

          {/* Interaction hint */}
          <AnimatePresence mode="wait">
            <motion.div
              key={clickHint}
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`absolute bottom-14 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold select-none border whitespace-nowrap ${isDark
                ? 'bg-[rgba(52,211,153,0.12)] text-emerald-400 border-[rgba(52,211,153,0.25)]'
                : 'bg-[rgba(255,255,255,0.85)] text-zinc-900 border-[rgba(52,211,153,0.3)] shadow-sm'
                }`}
              style={{ fontFamily: dmSans.style.fontFamily }}
            >
              {clickHint}
            </motion.div>
          </AnimatePresence>

          {/* Drag hint */}
          <div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full bg-black/50 backdrop-blur-md text-white text-xs font-medium select-none"
            style={{ fontFamily: dmSans.style.fontFamily }}
          >
            🖱️ {c.hint}
          </div>
        </div>

        {/* ── MOBILE INFO CARD — visible only on mobile (hidden md+) ── */}
        <div className="md:hidden mx-4 mt-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeScene}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={`rounded-2xl border p-5 ${isDark
                ? 'bg-[rgba(17,17,17,0.98)] border-[rgba(52,211,153,0.25)]'
                : 'bg-white border-[rgba(5,150,105,0.25)] shadow-md'}`}
              style={{ fontFamily: dmSans.style.fontFamily }}
            >
              {/* Category */}
              <p style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px', color: isDark ? '#34d399' : '#059669' }}>
                {c.info[activeScene].cat}
              </p>
              {/* Title */}
              <h3 style={{ fontSize: '20px', fontWeight: 800, lineHeight: 1.2, marginBottom: '3px', color: isDark ? '#ffffff' : '#18181b', fontFamily: playfair.style.fontFamily }}>
                {c.info[activeScene].title}
              </h3>
              {/* Tagline */}
              <p style={{ fontSize: '12px', fontStyle: 'italic', color: isDark ? '#34d399' : '#059669', marginBottom: '12px' }}>
                {(c.info[activeScene] as any).tagline}
              </p>
              {/* Description */}
              <p style={{ fontSize: '13px', lineHeight: 1.75, color: isDark ? '#a1a1aa' : '#3f3f46', marginBottom: '14px' }}>
                {c.info[activeScene].desc}
              </p>
              {/* Facts chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                {(c.info[activeScene] as any).facts?.map((f: string, i: number) => (
                  <span key={i} style={{
                    fontSize: '11px', fontWeight: 600,
                    padding: '4px 10px', borderRadius: '99px',
                    background: isDark ? 'rgba(52,211,153,0.12)' : 'rgba(5,150,105,0.08)',
                    color: isDark ? '#34d399' : '#059669',
                    border: `1px solid ${isDark ? 'rgba(52,211,153,0.25)' : 'rgba(5,150,105,0.20)'}`,
                  }}>{f}</span>
                ))}
              </div>
              {/* Note */}
              <div style={{
                padding: '10px 14px',
                background: isDark ? 'rgba(52,211,153,0.08)' : 'rgba(5,150,105,0.06)',
                borderRadius: '12px',
                fontSize: '12px', fontWeight: 600,
                color: isDark ? '#34d399' : '#059669',
                border: `1px solid ${isDark ? 'rgba(52,211,153,0.20)' : 'rgba(5,150,105,0.15)'}`,
              }}>
                {c.info[activeScene].note}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── CULTURAL TRIVIA (replaces redundant slide-up info) ── */}
        <div className="max-w-3xl mx-auto px-6 py-8 pb-20">
          <AnimatePresence mode="wait">
            <CulturalTrivia scene={activeScene} lang={currentLang} isDark={isDark} />
          </AnimatePresence>
        </div>


      </div>
    </>
  );
}