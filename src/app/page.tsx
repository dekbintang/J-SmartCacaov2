'use client';

import { useState, useEffect, useRef, createContext, useContext } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useUIStore } from '@/store/useUIStore';
import {
  Search, MapPin, ArrowRight, QrCode, Thermometer,
  BookOpen, Leaf, ChevronRight, Globe, Shield,
  BarChart3, Wifi, Users, CheckCircle2, Zap,
  Sprout, PackageCheck, ScanLine, ExternalLink,
  ChevronLeft, ImageIcon, Info, X, TrendingUp,
} from 'lucide-react';

// ════════════════════════════════════════════════════════════════════════════
// BILINGUAL COPY
// ════════════════════════════════════════════════════════════════════════════
const COPY = {
  id: {
    headline: 'Dari Kebun Jembrana,',
    headline2: 'Menuju Dunia.',
    iotLabel: 'IoT Smart Dryer',
    traceLabel: 'Keterlacakan Rantai Pasok',
    pkgLabel: 'Smart Packaging',
    subtitle: 'Ekosistem digital pertama di Bali yang menyatukan',
    subtitleConj: '— mengubah kakao premium Jembrana menjadi magnet agrowisata kelas dunia.',
    subtitleAnd: 'dan',
    cta1: 'Pelajari Ekosistem',
    cta2: 'Lacak Kakao Anda →',
    qrHint: 'Baru scan QR dari kemasan cokelat?',
    qrPlaceholder: 'Kode batch (cth: JSC-2025-001)...',
    scrollLabel: 'Gulir',
    statsSource: 'Data Resmi · BPS Bali 2025 · Disparda 2025',
    problemBadge: '⚠️ Paradoks Bali',
    problemTitle: 'Kaya Potensi,',
    problemTitle2: 'Tertinggal Wisatawan',
    p1a: 'Bali dikenal dunia, tapi tidak dikenal merata. Di balik pesonanya, Badung mencatat',
    p1b: '4,2 juta',
    p1c: 'perjalanan wisatawan, sementara Jembrana — penghasil',
    p1d: '67% kakao Bali',
    p1e: '— hanya mencatatkan',
    p1f: '273 ribu',
    p1g: 'perjalanan wisata. Ketimpangan ini bukan soal daya tarik, melainkan promosi yang belum menyentuh era digital.',
    p2a: 'Metode pengeringan konvensional menyebabkan durasi membengkak dari',
    p2b: '5–7 hari',
    p2c: 'menjadi',
    p2d: '15–22 hari',
    p2e: 'saat musim hujan, menurunkan kualitas dan mengancam ekspor premium.',
    solutionBadge: '✅ Solusi J-SMART CACAO',
    solutionTitle: 'Ekosistem Terintegrasi Hulu–Hilir',
    solItems: [
      'Smart Dryer IoT mengeliminasi ketergantungan cuaca, menjamin kadar air 7% sesuai SNI 2323:2008',
      'Cloud Ledger menyimpan data tamper-proof untuk sertifikasi Fair Trade & kepercayaan ekspor',
      'Smart Packaging mengubah cokelat artisan menjadi agen promosi destinasi wisata Jembrana',
      'Platform web mengarahkan konsumen Bali Selatan menjadi wisatawan Agrowisata Jembrana',
    ],
    ecosysBadge: 'Cara Kerja',
    ecosysTitle: 'Orkestrasi Hulu ke Hilir',
    ecosysSub: 'Enam tahap ekosistem terintegrasi yang menghubungkan petani kakao Jembrana dengan wisatawan di seluruh Bali',
    ecosysNote: 'Seluruh data terkoneksi secara real-time melalui infrastruktur Cloud Ledger yang tamper-proof',
    featBadge: 'Platform',
    featTitle: 'Empat Pilar J-SMART CACAO',
    featSub: 'Teknologi cerdas yang mengintegrasikan pertanian presisi, transparansi data, edukasi interaktif, dan pariwisata berkelanjutan',
    traceTitle: 'Lacak Kakao Anda',
    traceSub: 'Setiap kemasan cokelat J-SMART CACAO memiliki kode batch unik. Masukkan kode atau scan QR untuk mengetahui perjalanan lengkap dari kebun ke kemasan.',
    traceExamples: 'Coba contoh kode:',
    traceMore: 'Data bersumber dari sensor IoT & KUD Jembrana (Tamper-proof).',
    traceLacak: 'Lacak',
    eduBadge: '📖 Digital Storytelling',
    eduTitle: 'Cokelat Sebagai Portal Edukasi Interaktif',
    eduSub: 'Setiap scan QR membuka pintu ke cerita mendalam tentang sejarah kebun, profil petani, sistem Subak Abian, dan proses fermentasi.',
    eduChapLabel: 'Bab Cerita',
    eduFactLabel: 'Fakta Kunci',
    eduCtaTitle: 'Telusuri Lebih Dalam Kisah Kakao Jembrana',
    eduCtaDesc: 'Saksikan langsung bagaimana petani merawat kebun mereka, sistem Subak Abian yang unik, hingga keajaiban proses fermentasi kakao.',
    eduCtaBtn: 'Jelajahi Cerita Kebun',
    partnersLabel: 'Ekosistem Kolaboratif · Pentahelix',
    ctaTitle: 'Sudah Punya Kemasan J-SMART CACAO?',
    ctaDesc: 'Scan QR Code di kemasan Anda dan temukan kisah lengkap di balik cokelat premium yang Anda pegang — mulai dari nama petani, hingga undangan berkunjung ke kebunnya di Jembrana.',
    ctaBtn1: 'Lacak Produk Saya',
    ctaBtn2: 'Rencanakan Wisata',
    ctaFooter: 'J-SMART CACAO · Universitas Udayana · Jembrana, Bali 2026',
    dragHint: 'Geser untuk menjelajahi',
    tooltipClose: 'Tutup',
    statDetail: 'Detail Statistik',
  },
  en: {
    headline: 'From the Farms of',
    headline2: 'To the World.',
    iotLabel: 'IoT Smart Dryer',
    traceLabel: 'Supply Chain Traceability',
    pkgLabel: 'Smart Packaging',
    subtitle: 'Bali\'s first integrated digital ecosystem uniting',
    subtitleConj: '— transforming Jembrana\'s premium cacao into a world-class agrotourism magnet.',
    subtitleAnd: 'and',
    cta1: 'Explore Ecosystem',
    cta2: 'Trace Your Cacao →',
    qrHint: 'Just scanned a QR from your chocolate package?',
    qrPlaceholder: 'Batch code (e.g., JSC-2025-001)...',
    scrollLabel: 'Scroll',
    statsSource: 'Official Data · BPS Bali 2025 · Disparda 2025',
    problemBadge: '⚠️ Bali Paradox',
    problemTitle: 'Rich in Potential,',
    problemTitle2: 'Yet Undervisited',
    p1a: 'Bali is globally renowned, but unequally explored. While Badung records', p1b: '4.2 million', p1c: 'tourist trips, while Jembrana — producing',
    p1d: "67% of Bali's cacao", p1e: '— only recorded', p1f: '273 thousand', p1g: 'tourist trips. This gap isn\'t about a lack of appeal, but rather outdated promotion.',
    p2a: 'Conventional drying methods cause drying duration to balloon from', p2b: '5–7 days',
    p2c: 'to', p2d: '15–22 days', p2e: 'during rainy season, degrading quality and threatening premium exports.',
    solutionBadge: '✅ J-SMART CACAO Solution',
    solutionTitle: 'Integrated Upstream–Downstream Ecosystem',
    solItems: [
      'IoT Smart Dryer eliminates weather dependency, ensuring 7% moisture per SNI 2323:2008 standard',
      'Cloud Ledger stores tamper-proof data for Fair Trade certification and export credibility',
      'Smart Packaging turns artisan chocolate into a smart destination promotion agent for Jembrana',
      'Web platform redirects South Bali consumers to become Jembrana agrotourism visitors',
    ],
    ecosysBadge: 'How It Works',
    ecosysTitle: 'From Farm to Tourist',
    ecosysSub: 'Six integrated ecosystem stages connecting Jembrana cacao farmers with tourists across Bali',
    ecosysNote: 'All data connected in real-time via tamper-proof Cloud Ledger infrastructure',
    featBadge: 'Platform',
    featTitle: 'Four Pillars of J-SMART CACAO',
    featSub: 'Smart technology integrating precision agriculture, data transparency, interactive education, and sustainable tourism',
    traceTitle: 'Trace Your Cacao',
    traceSub: 'Every J-SMART CACAO chocolate package has a unique batch code. Enter the code or scan QR to discover the complete journey from farm to wrapper.',
    traceExamples: 'Try example codes:',
    traceMore: 'Data securely sourced from IoT sensors & KUD Jembrana.',
    traceLacak: 'Trace',
    eduBadge: '📖 Digital Storytelling',
    eduTitle: 'Chocolate as an Interactive Education Portal',
    eduSub: 'Every QR scan opens a door to in-depth stories about farm history, farmer profiles, the Subak Abian system, and fermentation processes.',
    eduChapLabel: 'Story Chapters',
    eduFactLabel: 'Key Facts',
    eduCtaTitle: 'Dive Deeper into the Jembrana Cacao Story',
    eduCtaDesc: 'Witness firsthand how local farmers nurture their crops, explore the unique Subak Abian system, and discover the magic of cacao fermentation.',
    eduCtaBtn: 'Explore Farm Story',
    partnersLabel: 'Collaborative Ecosystem · Pentahelix',
    ctaTitle: 'Got a J-SMART CACAO Package?',
    ctaDesc: "Scan the QR Code on your package and discover the complete story behind the premium chocolate in your hands — from the farmer's name to an invitation to visit their farm in Jembrana.",
    ctaBtn1: 'Trace My Product',
    ctaBtn2: 'Plan a Visit',
    ctaFooter: 'J-SMART CACAO · Universitas Udayana · Jembrana, Bali 2026',
    dragHint: 'Drag to explore',
    tooltipClose: 'Close',
    statDetail: 'Stat Detail',
  },
} as const;

type Lang = keyof typeof COPY;
type T = (typeof COPY)[Lang];

// ════════════════════════════════════════════════════════════════════════════
// THEME CONTEXT — sekarang ada isId untuk bahasa, terpisah dari isDark tema
// ════════════════════════════════════════════════════════════════════════════
interface ThemeCtxVal { isDark: boolean; isId: boolean; t: T; }
const ThemeCtx = createContext<ThemeCtxVal>({ isDark: true, isId: true, t: COPY.id });
const useTheme = () => useContext(ThemeCtx);

function mkSt(isDark: boolean) {
  return {
    page: isDark ? 'bg-[#0a0a0a] text-white' : 'bg-white text-zinc-900',
    card: isDark ? 'bg-[#111111] border-[#1f1f1f]' : 'bg-white border-gray-200',
    cardHov: isDark ? 'hover:border-green-800/60' : 'hover:border-green-300',
    altBg: isDark ? 'bg-[#0d0d0d]' : 'bg-gray-50',
    divider: isDark ? 'border-[#1a1a1a]' : 'border-gray-100',
    h: isDark ? 'text-white' : 'text-zinc-900',
    body: isDark ? 'text-zinc-400' : 'text-zinc-500',
    muted: isDark ? 'text-zinc-500' : 'text-zinc-400',
    dim: isDark ? 'text-zinc-600' : 'text-zinc-400',
    subCard: isDark ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'bg-gray-100 border-gray-200',
    input: isDark
      ? 'bg-[#111111] border-[#2a2a2a] text-white placeholder:text-zinc-600 focus:border-green-600/60'
      : 'bg-white border-gray-200 text-zinc-900 placeholder:text-zinc-400 focus:border-green-500',
    ghostBtn: isDark
      ? 'border-[#2a2a2a] bg-[#111111] hover:border-green-700/60 hover:bg-[#161616] text-white hover:text-green-400'
      : 'border-gray-200 bg-white hover:border-green-400/60 hover:bg-green-50/50 text-zinc-800 hover:text-green-700',
    dotOff: isDark ? 'bg-[#2a2a2a] hover:bg-[#3a3a3a]' : 'bg-gray-300 hover:bg-gray-400',
    codeChip: isDark
      ? 'bg-[#151515] border-[#252525] text-zinc-400 hover:border-green-700/50 hover:text-green-400'
      : 'bg-gray-50 border-gray-200 text-zinc-500 hover:border-green-400/60 hover:text-green-600',
    grid: isDark
      ? 'bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)]'
      : 'bg-[linear-gradient(rgba(0,0,0,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.035)_1px,transparent_1px)]',
  };
}

// ════════════════════════════════════════════════════════════════════════════
// COLOR MAP
// ════════════════════════════════════════════════════════════════════════════
const COLOR_MAP: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  cyan: { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/30', glow: 'shadow-teal-500/15' },
  amber: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30', glow: 'shadow-green-500/15' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', glow: 'shadow-emerald-500/15' },
  orange: { bg: 'bg-lime-500/10', text: 'text-lime-400', border: 'border-lime-500/30', glow: 'shadow-lime-500/15' },
  violet: { bg: 'bg-teal-600/10', text: 'text-teal-300', border: 'border-teal-600/30', glow: 'shadow-teal-600/15' },
  rose: { bg: 'bg-green-600/10', text: 'text-green-500', border: 'border-green-600/30', glow: 'shadow-green-600/15' },
  zinc: { bg: 'bg-green-900/20', text: 'text-green-600', border: 'border-green-800/30', glow: 'shadow-green-900/10' },
};

const ECOSYSTEM_COLORS: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', glow: 'shadow-emerald-500/15' },
  lime: { bg: 'bg-lime-500/10', text: 'text-lime-400', border: 'border-lime-500/30', glow: 'shadow-lime-500/15' },
  teal: { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/30', glow: 'shadow-teal-500/15' },
  green: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30', glow: 'shadow-green-500/15' },
  teal2: { bg: 'bg-teal-600/10', text: 'text-teal-300', border: 'border-teal-600/30', glow: 'shadow-teal-600/15' },
  emerald2: { bg: 'bg-emerald-600/10', text: 'text-emerald-300', border: 'border-emerald-600/30', glow: 'shadow-emerald-600/15' },
};

const ALL_COLORS: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  ...COLOR_MAP,
  ...ECOSYSTEM_COLORS,
};

// ════════════════════════════════════════════════════════════════════════════
// STATIC DATA
// ════════════════════════════════════════════════════════════════════════════
const STATS = [
  {
    value: 67, suffix: '%',
    labelId: 'Produksi Kakao Bali', labelEn: 'Bali Cacao Production',
    subId: 'berasal dari Jembrana', subEn: 'sourced from Jembrana',
    detailId: 'Jembrana adalah produsen kakao terbesar di Bali, menyumbang 67% total produksi dengan lahan seluas ribuan hektar.',
    detailEn: 'Jembrana is Bali\'s largest cacao producer, contributing 67% of total production across thousands of hectares of farmland.',
    icon: Leaf,
  },
  {
    value: 3259, suffix: ' ton',
    labelId: 'Produksi per Tahun', labelEn: 'Annual Production',
    subId: 'data BPS Bali 2025', subEn: 'BPS Bali 2025 data',
    detailId: 'Total produksi kakao Jembrana mencapai 3.259 ton per tahun — setara nilai ekspor lebih dari Rp 150 miliar.',
    detailEn: 'Total cacao production in Jembrana reaches 3,259 tons per year — equivalent to export value of over Rp 150 billion.',
    icon: BarChart3,
  },
  {
    value: 2, suffix: ' ton',
    labelId: 'Ekspor ke Belanda', labelEn: 'Exported to Netherlands',
    subId: 'Agustus 2025', subEn: 'August 2025',
    detailId: 'Pengiriman perdana kakao Single-Origin Jembrana ke Belanda pada Agustus 2025 membuka pintu pasar Eropa.',
    detailEn: 'First shipment of Jembrana Single-Origin cacao to the Netherlands in August 2025 opened the European market door.',
    icon: Globe,
  },
  {
    value: 273, suffix: 'K',
    labelId: 'Wisatawan Jembrana', labelEn: 'Jembrana Tourists',
    subId: 'vs 4,2 juta di Badung', subEn: 'vs 4.2M in Badung',
    detailId: 'Hanya 273.000 wisatawan per tahun dibanding 4,2 juta di Badung — kesenjangan 15x yang ingin dijembatani J-SMART CACAO.',
    detailEn: 'Only 273,000 tourists per year compared to 4.2M in Badung — a 15x gap that J-SMART CACAO aims to bridge.',
    icon: Users,
  },
];

const ECOSYSTEM_STEPS = [
  {
    icon: Sprout, color: 'emerald',
    titleId: 'Panen & Input Data', titleEn: 'Harvest & Data Input',
    descId: 'Petani memanen biji kakao premium. KUD mencatat data panen (nama, lokasi, varietas) ke sistem.',
    descEn: 'Farmers harvest premium cacao. KUD records harvest data (name, location, variety) into the system.',
    imgSrc: '/images/panen.jpg',
    imgAlt: 'Petani memanen kakao Jembrana',
  },
  {
    icon: Thermometer, color: 'lime',
    titleId: 'Smart Dryer IoT', titleEn: 'IoT Smart Dryer',
    descId: 'Sensor presisi menjaga suhu 45–55°C, memastikan kadar air stabil di 7% sesuai standar ekspor SNI.',
    descEn: 'Precision sensors maintain 45-55°C, ensuring a stable 7% moisture content per SNI export standards.',
    imgSrc: '/images/smart-dryer.jpeg',
    imgAlt: 'Smart Dryer IoT unit',
  },
  {
    icon: Shield, color: 'teal',
    titleId: 'Cloud Ledger', titleEn: 'Cloud Ledger',
    descId: 'Seluruh riwayat pengeringan disimpan permanen (tamper-proof) sebagai dasar sertifikasi Fair Trade.',
    descEn: 'All drying history is permanently stored (tamper-proof) as the foundation for Fair Trade certification.',
    imgSrc: '/images/ecosystem/03-ledger.jpg',
    imgAlt: 'Cloud Ledger data dashboard',
  },
  {
    icon: PackageCheck, color: 'green',
    titleId: 'Produksi & Kemasan', titleEn: 'Production & Packaging',
    descId: 'Biji kakao diolah menjadi cokelat artisan premium. Tiap kemasan dicetak dengan QR Code unik.',
    descEn: 'Cacao beans are processed into premium artisan chocolate. Each package is printed with a unique QR Code.',
    imgSrc: '/images/solusi-jsmartcacao.png',
    imgAlt: 'Smart packaging dengan QR code',
    objectFit: 'contain',
  },
  {
    icon: ScanLine, color: 'teal2',
    titleId: 'Distribusi & Scan QR', titleEn: 'Distribution & QR Scan',
    descId: 'Didistribusikan ke bandara & hotel di Bali Selatan. Konsumen memindai QR Code untuk melacak data.',
    descEn: 'Distributed to airports & hotels in South Bali. Consumers scan the QR Code to trace the data.',
    imgSrc: '/images/ecosystem/05-scan.jpg',
    imgAlt: 'Scan QR code di hotel Bali',
  },
  {
    icon: MapPin, color: 'emerald2',
    titleId: 'Agrowisata Jembrana', titleEn: 'Jembrana Agrotourism',
    descId: 'Lewat edukasi dari QR, konsumen terdorong untuk berkunjung langsung ke kebun kakao di Jembrana.',
    descEn: 'Through QR education, consumers are encouraged to visit the cacao farms directly in Jembrana.',
    imgSrc: '/images/agrowisata.jpg',
    imgAlt: 'Wisatawan mengunjungi kebun kakao',
  },
];

const FEATURES = [
  { icon: QrCode, color: 'teal', titleId: 'Keterlacakan', titleEn: 'Traceability', en: 'Farm-to-Bar Transparency', descId: 'Lacak perjalanan kakao dari kebun petani hingga ke kemasan cokelat di tangan Anda. Ketahui nama petani, lokasi kebun, tanggal panen, dan data kualitas pengeringan.', descEn: "Track cacao from the farmer's field to the chocolate wrapper in your hands. Know the farmer's name, farm location, harvest date, and drying quality data.", href: '/trace', ctaId: 'Lacak Produk', ctaEn: 'Trace Product' },
  { icon: Thermometer, color: 'lime', titleId: 'Smart Dryer IoT', titleEn: 'Smart Dryer IoT', en: 'Precision Drying Technology', descId: 'Kabinet pengering hibrida 200 kg dengan sensor IoT DHT22, panel surya, dan kendali suhu otomatis. Eliminasi ketergantungan pada cuaca & risiko jamur.', descEn: '200 kg hybrid drying cabinet with IoT DHT22 sensors, solar panels, and automatic temperature control. Eliminates weather dependency and mold risk.', href: '/teknologi', ctaId: 'Lihat Teknologi', ctaEn: 'View Technology' },
  { icon: BookOpen, color: 'emerald', titleId: 'Edu-Tourism', titleEn: 'Edu-Tourism', en: 'Interactive Education', descId: 'Digital storytelling tentang sejarah kebun, profil petani, sistem Subak Abian, dan proses fermentasi. Mengubah cokelat menjadi portal edukasi interaktif.', descEn: 'Digital storytelling about farm history, farmer profiles, the Subak Abian system, and fermentation. Turns chocolate into an interactive education portal.', href: '/budaya', ctaId: 'Jelajahi Budaya', ctaEn: 'Explore Culture' },
  { icon: MapPin, color: 'green', titleId: 'Agrowisata', titleEn: 'Agrotourism', en: 'Cacao Agrotourism', descId: 'Paket wisata pemetikan kakao, edukasi fermentasi, dan kunjungan kebun langsung di Jembrana. Navigasi Google Maps terintegrasi menuju lokasi.', descEn: 'Cacao harvesting, fermentation education, and farm visit packages in Jembrana. Integrated Google Maps navigation to the location.', href: '/telusuri', ctaId: 'Pesan Wisata', ctaEn: 'Book a Tour' },
];

const EDU_CHAPTERS = [
  {
    id: 'sejarah', icon: BookOpen, color: 'green',
    tagId: 'Bab 1', tagEn: 'Chapter 1',
    titleId: 'Sejarah Kebun Kakao Jembrana', titleEn: 'History of Jembrana Cacao Farms',
    imgSrc: '/images/sejarah-kebun.png', imgAlt: 'Kebun kakao tua Jembrana era kolonial',
    bodyId: 'Kakao Jembrana telah dibudidayakan sejak era kolonial Belanda pada awal abad ke-20. Kebun-kebun tua di Pekutatan dan Medewi menyimpan pohon kakao berumur lebih dari 80 tahun — warisan langka yang menghasilkan biji Single-Origin dengan profil rasa unik: buah tropis, sedikit asam, dan aftertaste rempah khas Bali.',
    bodyEn: 'Jembrana cacao has been cultivated since the early 20th century Dutch colonial era. Old farms in Pekutatan and Medewi house cacao trees over 80 years old — a rare heritage producing Single-Origin beans with a unique flavor profile: tropical fruit, slight acidity, and a Balinese spice aftertaste.',
    factsId: ['Pohon kakao berusia >80 tahun', 'Varietas Trinitario & Forastero', 'Ditanam sejak era kolonial 1920-an'],
    factsEn: ['Cacao trees >80 years old', 'Trinitario & Forastero varieties', 'Planted since the 1920s colonial era'],
  },
  {
    id: 'petani', icon: Users, color: 'emerald',
    tagId: 'Bab 2', tagEn: 'Chapter 2',
    titleId: 'Profil Petani & Komunitas', titleEn: 'Farmer & Community Profiles',
    imgSrc: '/images/profil-petani.jpg', imgAlt: 'Petani kakao Jembrana di kebun',
    bodyId: 'Lebih dari 2.400 kepala keluarga di Jembrana menggantungkan hidup pada budidaya kakao. Rata-rata lahan per petani hanya 0,5–2 hektar, dikelola secara turun-temurun. Platform J-SMART CACAO mengangkat wajah mereka ke permukaan — dari nama petani hingga koordinat GPS kebun.',
    bodyEn: 'Over 2,400 households in Jembrana depend on cacao cultivation. The average farm per farmer is only 0.5–2 hectares, managed hereditarily. The J-SMART CACAO platform brings their faces to the surface — from farmer names to GPS farm coordinates.',
    factsId: ['2.400+ keluarga petani', 'Rata-rata 0,5–2 ha per petani', 'Dikelola turun-temurun'],
    factsEn: ['2,400+ farming families', 'Average 0.5–2 ha per farmer', 'Managed hereditarily'],
  },
  {
    id: 'subak', icon: Leaf, color: 'teal',
    tagId: 'Bab 3', tagEn: 'Chapter 3',
    titleId: 'Sistem Subak Abian', titleEn: 'The Subak Abian System',
    imgSrc: '/images/subak-abian.jpg', imgAlt: 'Sistem Subak Abian di Jembrana Bali',
    bodyId: 'Subak Abian adalah sistem manajemen pertanian kolektif berbasis adat Bali yang mengatur pola tanam, distribusi air, dan ritual pertanian. Di Jembrana, Subak Abian menjadi tulang punggung koperasi kakao — memastikan standar kualitas dan keadilan distribusi hasil panen secara komunal.',
    bodyEn: 'Subak Abian is a Balinese customary collective agricultural management system regulating planting patterns, water distribution, and agricultural rituals. In Jembrana, it is the backbone of the cacao cooperative — ensuring quality standards and fair harvest distribution communally.',
    factsId: ['Sistem adat Bali tertua', 'Mengatur pola tanam kolektif', 'UNESCO Warisan Budaya Dunia 2012'],
    factsEn: ['Oldest Balinese customary system', 'Regulates collective planting', 'UNESCO World Cultural Heritage 2012'],
  },
  {
    id: 'ferment', icon: Thermometer, color: 'lime',
    tagId: 'Bab 4', tagEn: 'Chapter 4',
    titleId: 'Proses Fermentasi & Pengeringan', titleEn: 'Fermentation & Drying Process',
    imgSrc: '/images/fermentasi.png', imgAlt: 'Proses fermentasi biji kakao Jembrana',
    bodyId: 'Fermentasi adalah kunci flavour kakao premium. Biji kakao difermentasi 5–7 hari dalam kotak kayu berlapis pisang. Setelahnya, Smart Dryer IoT mengambil alih — menjaga suhu 45–55°C secara presisi, memangkas waktu pengeringan dari 15–22 hari (cara konvensional) menjadi hanya 3–5 hari dengan kadar air akhir 7% sesuai SNI.',
    bodyEn: 'Fermentation is the key to premium cacao flavor. Cacao beans are fermented for 5–7 days in banana-lined wooden boxes. Afterward, the IoT Smart Dryer takes over — precisely maintaining 45–55°C, cutting drying time from 15–22 days (conventional) to just 3–5 days with a final moisture content of 7% per SNI standard.',
    factsId: ['Fermentasi 5–7 hari alami', 'Smart Dryer: 3–5 hari', 'Kadar air akhir 7% (SNI 2323:2008)'],
    factsEn: ['Natural 5–7 day fermentation', 'Smart Dryer: 3–5 days', 'Final moisture content 7% (SNI 2323:2008)'],
  },
];

const PARTNERS = [
  { name: 'KUD Jembrana', roleId: 'Operator SmartDryer & Kualitas', roleEn: 'SmartDryer Operator & Quality', emoji: '🏭' },
  { name: 'Dinas Pariwisata Bali', roleId: 'Dukungan Kebijakan & Promosi', roleEn: 'Policy Support & Promotion', emoji: '🏛️' },
  { name: 'Dinas Pertanian Bali', roleId: 'Sertifikasi & Standar Mutu', roleEn: 'Certification & Quality Standards', emoji: '🌾' },
  { name: 'Hotel & Bandara', roleId: 'Distribusi Smart Packaging', roleEn: 'Smart Packaging Distribution', emoji: '✈️' },
  { name: 'Universitas Udayana', roleId: 'Riset & Pengembangan Teknologi', roleEn: 'Research & Technology Development', emoji: '🎓' },
  { name: 'Pengrajin Artisan', roleId: 'Produksi Cokelat Premium', roleEn: 'Premium Chocolate Production', emoji: '🍫' },
];

// ════════════════════════════════════════════════════════════════════════════
// PHOTO PLACEHOLDER
// ════════════════════════════════════════════════════════════════════════════
function PhotoSlot({
  src, alt, className = '', aspectRatio = 'aspect-video', label, objectFit = 'cover'
}: {
  src?: string; alt?: string; className?: string; aspectRatio?: string; label?: string; objectFit?: 'cover' | 'contain' | 'fill'
}) {
  const [err, setErr] = useState(false);
  const showPlaceholder = !src || err;
  return (
    <div className={`relative overflow-hidden rounded-2xl ${aspectRatio} ${className}`}>
      {!showPlaceholder ? (
        <img src={src} alt={alt ?? ''} onError={() => setErr(true)}
          className={`absolute inset-0 w-full h-full object-${objectFit}`} />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3
          bg-gradient-to-br from-emerald-950/80 via-green-900/60 to-teal-900/50
          border-2 border-dashed border-emerald-700/40">
          <ImageIcon size={32} className="text-emerald-600/60" />
          {label && (
            <span className="text-emerald-500/70 text-xs font-mono text-center px-4 leading-relaxed">
              {label}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ════════════════════════════════════════════════════════════════════════════
function FadeIn({ children, delay = 0, className = '', direction = 'up' }: {
  children: React.ReactNode; delay?: number; className?: string;
  direction?: 'up' | 'left' | 'right' | 'none';
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const ini = direction === 'up' ? { opacity: 0, y: 28 }
    : direction === 'left' ? { opacity: 0, x: -28 }
      : direction === 'right' ? { opacity: 0, x: 28 }
        : { opacity: 0 };
  return (
    <motion.div ref={ref} initial={ini}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : ini}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}>
      {children}
    </motion.div>
  );
}

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const step = target / 60; let cur = 0;
    const timer = setInterval(() => {
      cur += step;
      if (cur >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(cur));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <span ref={ref}>{count.toLocaleString('id-ID')}{suffix}</span>;
}

// ════════════════════════════════════════════════════════════════════════════
// STAT TOOLTIP — tooltip interaktif per kartu statistik
// ════════════════════════════════════════════════════════════════════════════
function StatTooltip({ detail, onClose, isDark }: { detail: string; onClose: () => void; isDark: boolean }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className={`absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 p-3.5 rounded-2xl border shadow-xl text-left
          ${isDark ? 'bg-[#1a1a1a] border-[#2a2a2a] text-zinc-300' : 'bg-white border-gray-200 text-zinc-600'}`}
      >
        {/* Arrow */}
        <div className={`absolute top-full left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-r border-b
          ${isDark ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'bg-white border-gray-200'}`} />
        <div className="flex justify-between items-start gap-2 mb-1.5">
          <TrendingUp size={12} className="text-emerald-400 flex-shrink-0 mt-0.5" />
          <button onClick={onClose} className={`${isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-600'}`}>
            <X size={12} />
          </button>
        </div>
        <p className="text-[11px] leading-relaxed">{detail}</p>
      </motion.div>
    </AnimatePresence>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 3D CAROUSEL — dengan auto-play
// ════════════════════════════════════════════════════════════════════════════
function Carousel3D({ items, isDark, isId }: { items: typeof ECOSYSTEM_STEPS; isDark: boolean; isId: boolean }) {
  const [current, setCurrent] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const dragStart = useRef(0);
  const total = items.length;

  // Auto-play
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrent(p => (p + 1) % total);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused, total]);

  const prev = () => { setIsPaused(true); setCurrent(p => (p - 1 + total) % total); };
  const next = () => { setIsPaused(true); setCurrent(p => (p + 1) % total); };

  const getAngle = (idx: number) => ((idx - current + total) % total) * (360 / total);
  const getItemPos = (angle: number) => {
    const rad = (angle * Math.PI) / 180;
    const radius = 280;
    return { x: Math.sin(rad) * radius, z: -Math.cos(rad) * radius };
  };

  return (
    <div className="relative w-full select-none">
      {/* Auto-play indicator */}
      <div className="flex justify-end mb-2 pr-2">
        <button
          onClick={() => setIsPaused(p => !p)}
          className={`text-[10px] font-mono px-2.5 py-1 rounded-full border transition-all
            ${isPaused
              ? isDark ? 'border-emerald-700/40 text-emerald-500 bg-emerald-500/10' : 'border-emerald-400/40 text-emerald-600 bg-emerald-50'
              : isDark ? 'border-[#2a2a2a] text-zinc-500 bg-transparent' : 'border-gray-200 text-zinc-400 bg-transparent'}`}
        >
          {isPaused ? '▶ Play' : '⏸ Pause'}
        </button>
      </div>

      {/* 3D Stage */}
      <div
        className="relative mx-auto"
        style={{ height: 420, perspective: 1100, width: '100%', maxWidth: 720, overflow: 'hidden' }}
        onPointerDown={e => { setDragging(true); setIsPaused(true); dragStart.current = e.clientX; }}
        onPointerMove={e => {
          if (!dragging) return;
          const delta = e.clientX - dragStart.current;
          if (Math.abs(delta) > 55) { delta < 0 ? next() : prev(); dragStart.current = e.clientX; }
        }}
        onPointerUp={() => setDragging(false)}
        onPointerLeave={() => setDragging(false)}
      >
        <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d' }}>
          {items.map((step, idx) => {
            const angle = getAngle(idx);
            const { x } = getItemPos(angle);
            const isFront = idx === current;
            const dist = Math.min(Math.abs(idx - current), total - Math.abs(idx - current));
            const isAdj = dist === 1;
            const scale = isFront ? 1 : isAdj ? 0.8 : 0.65;
            const opacity = isFront ? 1 : isAdj ? 0.55 : 0.22;
            const overlayOpacity = isFront ? 0 : isAdj ? 0.72 : 0.88;
            const Icon = step.icon;
            const c = ALL_COLORS[step.color] ?? ALL_COLORS.emerald;

            return (
              <motion.div key={step.titleId}
                animate={{ x, scale, opacity }}
                transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                style={{
                  position: 'absolute', top: '50%', left: '50%',
                  width: 260, marginLeft: -130, marginTop: -175,
                  transformStyle: 'preserve-3d',
                  cursor: isFront ? 'default' : 'pointer',
                  zIndex: isFront ? 10 : isAdj ? 5 : 1,
                }}
                onClick={() => { if (!isFront) { setCurrent(idx); setIsPaused(true); } }}
                whileHover={!isFront ? { scale: scale * 1.04 } : {}}
              >
                <div className={`rounded-3xl border overflow-hidden h-[350px] flex flex-col
                  ${isFront ? `shadow-2xl ${c.border}` : isDark ? 'border-[#2a2a2a]' : 'border-gray-200'}
                  ${isDark ? 'bg-[#111111]' : 'bg-white'}`}>
                  {/* Photo */}
                  <div className="relative h-[175px] flex-shrink-0">
                    <PhotoSlot src={step.imgSrc} alt={step.imgAlt}
                      aspectRatio="" className="!rounded-none h-full"
                      label={`📸 ${step.imgAlt}`} objectFit={(step as any).objectFit} />
                    <div className="absolute top-3 left-3 w-7 h-7 rounded-full flex items-center justify-center
                      text-xs font-black text-white bg-gradient-to-br from-emerald-600 to-green-700 shadow-lg">
                      {idx + 1}
                    </div>
                    <div className={`absolute bottom-3 right-3 w-9 h-9 rounded-xl ${c.bg} border ${c.border}
                      backdrop-blur-sm flex items-center justify-center`}>
                      <Icon size={16} className={c.text} />
                    </div>
                  </div>
                  {/* Content — FIXED: pakai isId untuk bahasa */}
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                      <h3 className={`font-black text-sm mb-2 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                        {isId ? step.titleId : step.titleEn}
                      </h3>
                      <p className={`text-[11px] leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                        {isId ? step.descId : step.descEn}
                      </p>
                    </div>
                    {isFront && (
                      <div className={`mt-3 h-0.5 w-full rounded-full ${isDark ? 'bg-[#222]' : 'bg-gray-100'}`}>
                        <motion.div
                          className={`h-full rounded-full ${c.text.replace('text-', 'bg-')}`}
                          initial={{ width: 0 }} animate={{ width: '100%' }}
                          transition={{ duration: isPaused ? 0 : 4, ease: 'linear' }}
                          key={`${current}-${isPaused}`}
                        />
                      </div>
                    )}
                  </div>
                  {!isFront && (
                    <div className="absolute inset-0 rounded-3xl pointer-events-none"
                      style={{
                        background: isDark ? `rgba(10,10,10,${overlayOpacity})` : `rgba(255,255,255,${overlayOpacity})`,
                        backdropFilter: isAdj ? 'blur(1px)' : 'blur(2px)',
                      }} />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={prev}
          className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors
            ${isDark ? 'border-[#2a2a2a] hover:border-emerald-600 text-zinc-400 hover:text-emerald-400 bg-[#111]'
              : 'border-gray-200 hover:border-emerald-400 text-zinc-500 hover:text-emerald-600 bg-white'}`}
        ><ChevronLeft size={18} /></motion.button>
        <div className="flex gap-2">
          {items.map((_, i) => (
            <button key={i} onClick={() => { setCurrent(i); setIsPaused(true); }}
              className={`rounded-full transition-all duration-300
                ${i === current ? 'w-6 h-2 bg-emerald-500'
                  : `w-2 h-2 ${isDark ? 'bg-[#2a2a2a] hover:bg-[#3a3a3a]' : 'bg-gray-300 hover:bg-gray-400'}`}`}
            />
          ))}
        </div>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={next}
          className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors
            ${isDark ? 'border-[#2a2a2a] hover:border-emerald-600 text-zinc-400 hover:text-emerald-400 bg-[#111]'
              : 'border-gray-200 hover:border-emerald-400 text-zinc-500 hover:text-emerald-600 bg-white'}`}
        ><ChevronRight size={18} /></motion.button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SECTIONS
// ════════════════════════════════════════════════════════════════════════════

function HeroSection() {
  const { isDark, t } = useTheme();
  const st = mkSt(isDark);
  const [batch, setBatch] = useState('');

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <PhotoSlot src="/images/kttmertaabadi.jpeg" alt="Kebun kakao Jembrana Bali"
          aspectRatio="" className="!rounded-none absolute inset-0 w-full h-full"
          label="📸 Foto Kebun Kakao Jembrana · 1920×1080 px" />
        <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-b from-black/70 via-black/60 to-[#0a0a0a]'
          : 'bg-gradient-to-b from-black/50 via-black/30 to-white/90'
          }`} />
        <div className={`absolute inset-0 ${st.grid} bg-[size:64px_64px] opacity-30`} />
      </div>

      {/* Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full blur-[140px] bg-emerald-500/10" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full blur-[120px] bg-teal-500/8" />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <motion.h1 initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-none mb-4 text-white drop-shadow-2xl"
        >
          {t.headline}{' '}
          <span className="text-emerald-400">Jembrana</span>,
          <br /><span className="text-white">{t.headline2}</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
          className="mt-4 sm:mt-6 text-base sm:text-lg text-center max-w-2xl mx-auto leading-relaxed px-2 text-white/75 drop-shadow-lg"
        >
          {t.subtitle}{' '}
          <span className="text-teal-300 font-semibold">{t.iotLabel}</span>,{' '}
          <span className="text-green-300 font-semibold">{t.traceLabel}</span>,{' '}
          {t.subtitleAnd}{' '}
          <span className="text-emerald-300 font-semibold">{t.pkgLabel}</span>{' '}
          {t.subtitleConj}
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
        >
          <Link href="/telusuri" className="w-full sm:w-auto">
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              className="w-full sm:w-auto group flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-bold text-sm sm:text-base shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all"
            >
              <MapPin size={17} /> {t.cta1}
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>
          <Link href="/trace" className="w-full sm:w-auto">
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl border border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20 font-bold text-sm sm:text-base text-white transition-all"
            >
              <QrCode size={17} className="text-emerald-300" /> {t.cta2}
            </motion.button>
          </Link>
        </motion.div>


      </div>

      {/* Scroll indicator */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] tracking-widest uppercase text-white/40">{t.scrollLabel}</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-6 sm:h-8 bg-gradient-to-b from-emerald-400/60 to-transparent" />
      </motion.div>
    </section>
  );
}

function StatsSection() {
  const { isDark, isId, t } = useTheme();
  const st = mkSt(isDark);
  const [openTooltip, setOpenTooltip] = useState<number | null>(null);

  return (
    <section className={`py-12 sm:py-16 border-y ${st.divider}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <FadeIn className="text-center mb-8">
          <p className={`text-[10px] sm:text-xs font-bold tracking-widest uppercase ${st.muted}`}>{t.statsSource}</p>
        </FadeIn>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          {STATS.map((s, i) => {
            const Icon = s.icon;
            const isOpen = openTooltip === i;
            return (
              <FadeIn key={i} delay={i * 0.1} className="h-full">
                <div className={`h-full flex flex-col relative text-center p-4 sm:p-6 rounded-2xl border transition-all duration-300 group cursor-pointer
                  ${isOpen
                    ? isDark ? 'border-emerald-700/50 bg-emerald-500/5' : 'border-emerald-400/50 bg-emerald-50'
                    : `${st.card} hover:border-green-700/50`}`}
                  onClick={() => setOpenTooltip(isOpen ? null : i)}
                >
                  {/* Tooltip */}
                  {isOpen && (
                    <StatTooltip
                      detail={isId ? s.detailId : s.detailEn}
                      onClose={() => { setOpenTooltip(null); }}
                      isDark={isDark}
                    />
                  )}

                  <div className="flex-1">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-green-500/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-green-500/20 transition-colors">
                      <Icon size={18} className="text-green-400" />
                    </div>
                    <div className={`text-2xl sm:text-4xl font-black mb-1 ${st.h}`}>
                      <AnimatedCounter target={s.value} suffix={s.suffix} />
                    </div>
                    <p className={`text-xs sm:text-sm font-bold ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                      {/* FIXED: pakai isId, bukan isDark */}
                      {isId ? s.labelId : s.labelEn}
                    </p>
                    <p className={`text-[10px] sm:text-xs mt-0.5 ${st.muted}`}>
                      {isId ? s.subId : s.subEn}
                    </p>
                  </div>

                  {/* Info hint */}
                  <div className={`mt-3 flex items-center justify-center gap-1 text-[9px] transition-colors
                    ${isOpen ? 'text-emerald-400' : `${st.dim} group-hover:text-emerald-500/60`}`}>
                    <Info size={9} />
                    <span>{isId ? 'Klik untuk detail' : 'Click for detail'}</span>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ProblemSection() {
  const { isDark, isId, t } = useTheme();
  const st = mkSt(isDark);

  return (
    <section className="py-16 sm:py-24 max-w-6xl mx-auto px-4 sm:px-6">
      <FadeIn className="mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-900/30 border border-green-700/40 text-green-500 text-xs font-bold tracking-widest uppercase mb-4">
          {t.problemBadge}
        </div>
        <h2 className={`text-2xl sm:text-4xl font-black tracking-tight leading-tight max-w-2xl ${st.h}`}>
          {t.problemTitle}<br /><span className="text-green-500">{t.problemTitle2}</span>
        </h2>
      </FadeIn>

      <div className="grid md:grid-cols-2 gap-6 sm:gap-10 items-start mb-16 sm:mb-24">
        <FadeIn direction="left">
          <PhotoSlot src="/images/paradoks.png"
            alt="Paradoks pariwisata Bali — Badung vs Jembrana" aspectRatio="aspect-[4/3]"
            label="📸 Foto Paradoks Bali · kebun kakao sepi vs pantai Badung ramai" />
          <p className={`text-xs mt-3 text-center ${st.dim}`}>
            {isId ? 'Kebun kakao Jembrana — penghasil 67% kakao Bali — sepi wisatawan'
              : 'Jembrana cacao farms — producing 67% of Bali\'s cacao — undervisited'}
          </p>
        </FadeIn>

        <FadeIn direction="right" delay={0.15}>
          <div className="space-y-5">
            <p className={`text-sm sm:text-base leading-relaxed ${st.body}`}>
              {t.p1a} <strong className={st.h}>{t.p1b}</strong> {t.p1c}{' '}
              <strong className="text-emerald-400">{t.p1d}</strong> {t.p1e}{' '}
              <strong className="text-green-500">{t.p1f}</strong> {t.p1g}
            </p>
            <p className={`text-sm sm:text-base leading-relaxed ${st.body}`}>
              {t.p2a} <strong className={st.h}>{t.p2b}</strong> {t.p2c}{' '}
              <strong className="text-green-500">{t.p2d}</strong> {t.p2e}
            </p>
            <div className="space-y-3 pt-2">
              {[
                { label: 'Badung', val: '100%', count: '4.281.648', color: 'bg-gradient-to-r from-emerald-600 to-green-500' },
                { label: 'Jembrana', val: '6.4%', count: '273.142 (<7%)', color: 'bg-green-700' },
              ].map((b, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className={st.body}>{b.label}</span>
                    <span className={`font-bold ${i === 1 ? 'text-green-500' : st.h}`}>{b.count}</span>
                  </div>
                  <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-[#1a1a1a]' : 'bg-gray-100'}`}>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: b.val }}
                      transition={{ duration: 1, delay: i * 0.2, ease: 'easeOut' }}
                      className={`h-full rounded-full ${b.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>

      <FadeIn><div className={`border-t mb-16 sm:mb-24 ${st.divider}`} /></FadeIn>

      {/* Solution */}
      <div className="grid md:grid-cols-2 gap-6 sm:gap-10 items-start">
        <FadeIn direction="left">
          <div className="space-y-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-widest uppercase mb-4">
                {t.solutionBadge}
              </div>
              <h2 className={`text-2xl sm:text-4xl font-black tracking-tight leading-tight ${st.h}`}>
                {t.solutionTitle}
              </h2>
            </div>
            <div className="space-y-3 sm:space-y-4 pt-1">
              {[
                { icon: Thermometer, color: 'lime' },
                { icon: Shield, color: 'teal' },
                { icon: QrCode, color: 'green' },
                { icon: MapPin, color: 'emerald' },
              ].map((item, i) => {
                const Icon = item.icon;
                const c = ALL_COLORS[item.color];
                return (
                  <motion.div key={i} className="flex gap-3 group"
                    whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${c.bg} border ${c.border} group-hover:scale-110 transition-transform`}>
                      <Icon size={13} className={c.text} />
                    </div>
                    <p className={`text-xs sm:text-sm leading-relaxed ${st.body}`}>
                      {t.solItems[i]}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </FadeIn>

        <FadeIn direction="right" delay={0.15}>
          <img src="/images/solusi-jsmartcacao.png"
            alt="Solusi J-SMART CACAO — Kemasan Pintar berteknologi QR"
            className="w-full h-auto object-contain" />
          <p className={`text-xs mt-3 text-center ${st.dim}`}>
            {isId ? 'Kemasan Pintar — dilengkapi QR code unik untuk melacak perjalanan cokelat'
              : "Smart Packaging — equipped with a unique QR code to trace the chocolate's journey"}
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

function EcosystemSection() {
  const { isDark, isId, t } = useTheme();
  const st = mkSt(isDark);
  return (
    <section className={`py-16 sm:py-24 border-y ${st.divider} ${st.altBg}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <FadeIn className="text-center mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold tracking-widest uppercase mb-4">
            {t.ecosysBadge}
          </div>
          <h2 className={`text-2xl sm:text-4xl font-black tracking-tight ${st.h}`}>{t.ecosysTitle}</h2>
          <p className={`mt-3 text-sm sm:text-base max-w-xl mx-auto ${st.body}`}>{t.ecosysSub}</p>
          <p className={`mt-2 text-xs flex items-center justify-center gap-1.5 ${st.dim}`}>
            <span>↔</span> {t.dragHint}
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          {/* FIXED: pass isId ke Carousel3D */}
          <Carousel3D items={ECOSYSTEM_STEPS} isDark={isDark} isId={isId} />
        </FadeIn>

        <FadeIn className="mt-8 text-center" delay={0.4}>
          <p className={`text-[10px] sm:text-xs flex items-center justify-center gap-1.5 ${st.dim}`}>
            <Zap size={11} className="text-green-400" /> {t.ecosysNote}
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const { isDark, isId, t } = useTheme();
  const st = mkSt(isDark);
  return (
    <section className="py-16 sm:py-24 max-w-6xl mx-auto px-4 sm:px-6">
      <FadeIn className="text-center mb-10 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold tracking-widest uppercase mb-4">
          {t.featBadge}
        </div>
        <h2 className={`text-2xl sm:text-4xl font-black tracking-tight ${st.h}`}>{t.featTitle}</h2>
        <p className={`mt-3 text-sm sm:text-base max-w-xl mx-auto ${st.body}`}>{t.featSub}</p>
      </FadeIn>
      <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
        {FEATURES.map((f, i) => {
          const Icon = f.icon;
          const c = ALL_COLORS[f.color] ?? ALL_COLORS.emerald;
          return (
            <FadeIn key={i} delay={i * 0.1}>
              <div className={`group relative p-5 sm:p-7 rounded-3xl border ${c.glow} hover:shadow-xl transition-all duration-300 overflow-hidden h-full ${st.card} ${st.cardHov}`}>
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full ${c.bg} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />
                <div className="relative">
                  <div className="flex items-start justify-between mb-4 sm:mb-5">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl ${c.bg} border ${c.border} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon size={18} className={`${c.text} sm:hidden`} />
                      <Icon size={22} className={`${c.text} hidden sm:block`} />
                    </div>
                    <span className={`text-[9px] sm:text-[10px] font-bold tracking-widest uppercase ${c.text} opacity-60 text-right max-w-[110px]`}>{f.en}</span>
                  </div>
                  <h3 className={`text-lg sm:text-xl font-black mb-2 sm:mb-3 ${st.h}`}>
                    {/* FIXED: pakai isId */}
                    {isId ? f.titleId : f.titleEn}
                  </h3>
                  <p className={`text-xs sm:text-sm leading-relaxed mb-5 ${st.body}`}>
                    {isId ? f.descId : f.descEn}
                  </p>
                  <Link href={f.href}>
                    <button className={`flex items-center gap-1.5 text-xs sm:text-sm font-bold ${c.text} group-hover:gap-2.5 transition-all`}>
                      {isId ? f.ctaId : f.ctaEn} <ArrowRight size={14} />
                    </button>
                  </Link>
                </div>
              </div>
            </FadeIn>
          );
        })}
      </div>
    </section>
  );
}

function TraceTeaserSection() {
  const { isDark, t } = useTheme();
  const st = mkSt(isDark);
  const [input, setInput] = useState('');
  return (
    <section className={`py-16 sm:py-24 border-y ${st.divider} ${isDark ? 'bg-gradient-to-br from-teal-500/5 via-[#0a0a0a] to-green-500/5' : 'bg-gradient-to-br from-teal-50/60 via-white to-green-50/60'}`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <FadeIn>
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mx-auto mb-5 sm:mb-6">
            <QrCode size={28} className="text-teal-400" />
          </div>
          <h2 className={`text-2xl sm:text-4xl font-black tracking-tight mb-3 ${st.h}`}>{t.traceTitle}</h2>
          <p className={`text-sm sm:text-base mb-6 sm:mb-8 leading-relaxed max-w-lg mx-auto ${st.body}`}>{t.traceSub}</p>
          <div className="flex gap-2 sm:gap-3 max-w-md mx-auto mb-5">
            <input type="text" placeholder={t.qrPlaceholder} value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') window.location.href = `/trace?batch=${input.trim()}`; }}
              className={`flex-1 min-w-0 px-4 py-3 sm:py-4 rounded-xl sm:rounded-2xl border text-sm focus:outline-none transition-colors ${st.input}`}
            />
            <Link href={`/trace?batch=${input.trim()}`}>
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                className="flex-shrink-0 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold transition-colors flex items-center gap-2"
              >
                <Search size={18} /><span className="hidden sm:inline">{t.traceLacak}</span>
              </motion.button>
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mb-5">
            <p className={`text-xs w-full mb-1 ${st.dim}`}>{t.traceExamples}</p>
            {['JSC-2025-001', 'JSC-2025-042', 'JSC-2024-187'].map(code => (
              <motion.button key={code} onClick={() => setInput(code)}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${st.codeChip}
                  ${input === code ? (isDark ? 'border-teal-600/60 text-teal-400 bg-teal-500/10' : 'border-teal-400/60 text-teal-600 bg-teal-50') : ''}`}
              >{code}</motion.button>
            ))}
          </div>
          <Link href="/trace">
            <button className={`text-xs sm:text-sm flex items-center gap-1 mx-auto transition-colors ${st.muted} hover:text-teal-400`}>
              {t.traceMore} <ArrowRight size={13} />
            </button>
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}

function EduTourismSection() {
  const { isDark, isId, t } = useTheme();
  const st = mkSt(isDark);
  const [active, setActive] = useState(0);

  return (
    <section className="py-16 sm:py-24 max-w-6xl mx-auto px-4 sm:px-6">
      <FadeIn className="text-center mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-widest uppercase mb-4">
          {t.eduBadge}
        </div>
        <h2 className={`text-2xl sm:text-4xl font-black tracking-tight ${st.h}`}>{t.eduTitle}</h2>
        <p className={`mt-3 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed ${st.body}`}>{t.eduSub}</p>
      </FadeIn>

      {/* Chapter tab pills */}
      <FadeIn>
        <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 mb-6 sm:mb-8 no-scrollbar">
          {EDU_CHAPTERS.map((ch, i) => {
            const c = ALL_COLORS[ch.color] ?? ALL_COLORS.emerald;
            const isActive = active === i;
            const ChIcon = ch.icon;
            return (
              <motion.button key={ch.id} onClick={() => setActive(i)}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className={`flex-shrink-0 flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border text-xs font-bold transition-all
                  ${isActive
                    ? `${c.bg} ${c.border} ${c.text}`
                    : `${isDark ? 'border-[#1f1f1f] bg-[#111] text-zinc-500 hover:border-green-800/40' : 'border-gray-200 bg-white text-zinc-400 hover:border-green-300'}`}`}
              >
                <ChIcon size={13} />
                {/* FIXED: pakai isId */}
                <span className="hidden sm:inline">{isId ? ch.tagId : ch.tagEn}</span>
                <span className="sm:hidden">{i + 1}</span>
              </motion.button>
            );
          })}
        </div>
      </FadeIn>

      {/* Active chapter card */}
      <AnimatePresence mode="wait">
        {EDU_CHAPTERS.map((ch, i) => {
          if (i !== active) return null;
          const c = ALL_COLORS[ch.color] ?? ALL_COLORS.emerald;
          const Icon = ch.icon;
          return (
            <motion.div key={ch.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className={`rounded-3xl border overflow-hidden ${c.border} ${isDark ? 'bg-[#111111]' : 'bg-white shadow-sm'}`}>
                {/* Photo */}
                <div className="relative w-full aspect-video sm:aspect-[21/8]">
                  <PhotoSlot src={ch.imgSrc} alt={ch.imgAlt}
                    aspectRatio="" className="!rounded-none absolute inset-0 w-full h-full"
                    label={`📸 ${ch.imgAlt} · 1200×450 px`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className={`absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full ${c.bg} border ${c.border} backdrop-blur-sm`}>
                    <Icon size={12} className={c.text} />
                    {/* FIXED: pakai isId */}
                    <span className={`text-[10px] font-bold tracking-widest uppercase ${c.text}`}>
                      {isId ? ch.tagId : ch.tagEn}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-black text-lg sm:text-2xl drop-shadow-lg leading-tight">
                      {isId ? ch.titleId : ch.titleEn}
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-8">
                  <div className="grid sm:grid-cols-3 gap-6">
                    <div className="sm:col-span-2">
                      <p className={`text-sm sm:text-base leading-relaxed ${st.body}`}>
                        {isId ? ch.bodyId : ch.bodyEn}
                      </p>
                    </div>
                    <div>
                      <p className={`text-[10px] font-bold uppercase tracking-wider mb-3 ${st.dim}`}>{t.eduFactLabel}</p>
                      <div className="space-y-2.5">
                        {(isId ? ch.factsId : ch.factsEn).map((fact, j) => (
                          <motion.div key={j}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: j * 0.08 }}
                            className={`flex items-start gap-2.5 p-2.5 rounded-xl border ${isDark ? 'border-[#1a1a1a] bg-[#0d0d0d]' : 'border-gray-100 bg-gray-50'}`}
                          >
                            <CheckCircle2 size={13} className={`flex-shrink-0 mt-0.5 ${c.text}`} />
                            <p className={`text-xs ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>{fact}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className={`flex items-center justify-between mt-6 pt-5 border-t ${st.divider}`}>
                    <div className="flex gap-1.5">
                      {EDU_CHAPTERS.map((_, j) => (
                        <button key={j} onClick={() => setActive(j)}
                          className={`rounded-full transition-all ${j === active
                            ? `w-5 h-1.5 ${c.text.replace('text-', 'bg-')}`
                            : `w-1.5 h-1.5 ${isDark ? 'bg-[#2a2a2a] hover:bg-[#3a3a3a]' : 'bg-gray-300 hover:bg-gray-400'}`
                            }`}
                        />
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setActive(Math.max(0, active - 1))} disabled={active === 0}
                        className={`w-8 h-8 rounded-xl border flex items-center justify-center ${isDark ? 'border-[#2a2a2a] bg-[#1a1a1a] text-zinc-400' : 'border-gray-200 bg-gray-100 text-zinc-500'} disabled:opacity-30 transition-all`}
                      ><ChevronLeft size={14} /></button>
                      <button onClick={() => setActive(Math.min(EDU_CHAPTERS.length - 1, active + 1))} disabled={active === EDU_CHAPTERS.length - 1}
                        className={`w-8 h-8 rounded-xl flex items-center justify-center text-white border ${c.bg} ${c.border} disabled:opacity-30 transition-all`}
                      ><ChevronRight size={14} /></button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
      {/* CTA strip */}
      <FadeIn className="mt-8 sm:mt-10" delay={0.2}>
        <div className={`relative p-5 sm:p-6 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 ${st.card} ${st.cardHov}`}>
          <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <BookOpen size={20} className="text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`font-black text-sm sm:text-base mb-1 ${st.h}`}>{t.eduCtaTitle}</p>
            <p className={`text-xs sm:text-sm ${st.body}`}>{t.eduCtaDesc}</p>
          </div>
          <Link href="/edukasi" className="flex-shrink-0 w-full sm:w-auto">
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-bold hover:bg-emerald-500/20 transition-all"
            ><ExternalLink size={14} />{t.eduCtaBtn}</motion.button>
          </Link>
        </div>
      </FadeIn>
    </section>
  );
}

function PartnersSection() {
  const { isDark, isId, t } = useTheme();
  const st = mkSt(isDark);
  return (
    <section className={`py-14 sm:py-20 border-t ${st.divider}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <FadeIn className="text-center mb-8">
          <p className={`text-[10px] sm:text-xs font-bold tracking-widest uppercase ${st.dim}`}>{t.partnersLabel}</p>
        </FadeIn>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {PARTNERS.map((p, i) => (
            <FadeIn key={i} delay={i * 0.05} className="h-full">
              <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className={`h-full flex flex-col p-4 rounded-2xl border text-center group hover:border-green-700/50 transition-colors cursor-default ${st.card}`}>
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{p.emoji}</div>
                <div className="flex-1 flex flex-col justify-center">
                  <p className={`text-[11px] font-bold leading-tight ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>{p.name}</p>
                  <p className={`text-[9px] mt-0.5 leading-tight ${st.dim}`}>{isId ? p.roleId : p.roleEn}</p>
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const { isDark, t } = useTheme();
  const st = mkSt(isDark);
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6">
      <FadeIn>
        <div className={`max-w-4xl mx-auto relative p-6 sm:p-10 md:p-12 rounded-3xl border border-green-700/30 text-center overflow-hidden ${isDark ? 'bg-gradient-to-br from-green-500/8 via-[#0d0d0d] to-teal-500/6' : 'bg-gradient-to-br from-green-50 via-white to-teal-50/60'}`}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🍫</div>
            <h2 className={`text-xl sm:text-3xl md:text-4xl font-black tracking-tight mb-3 sm:mb-4 ${st.h}`}>{t.ctaTitle}</h2>
            <p className={`max-w-lg mx-auto mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base ${st.body}`}>{t.ctaDesc}</p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link href="/trace" className="w-full sm:w-auto">
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white font-bold text-sm sm:text-base shadow-xl shadow-green-500/25 transition-all"
                ><QrCode size={17} />{t.ctaBtn1}</motion.button>
              </Link>
              <Link href="/telusuri" className="w-full sm:w-auto">
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  className={`w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl border font-bold text-sm sm:text-base transition-all ${st.ghostBtn}`}
                ><MapPin size={17} className="text-emerald-400" />{t.ctaBtn2}</motion.button>
              </Link>
            </div>
            <p className={`mt-5 sm:mt-6 text-xs flex items-center justify-center gap-1.5 ${st.dim}`}>
              <Globe size={11} />{t.ctaFooter}
            </p>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ════════════════════════════════════════════════════════════════════════════
export default function HomePage() {
  const { theme, lang } = useUIStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = !mounted || theme === 'dark';
  // FIXED: isId sepenuhnya diatur oleh `lang`, bukan oleh `isDark`
  const isId = !mounted || (lang as Lang) === 'id';
  const t = mounted ? COPY[lang as Lang] ?? COPY.id : COPY.id;

  return (
    <ThemeCtx.Provider value={{ isDark, isId, t }}>
      <main className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
        <HeroSection />
        <StatsSection />
        <ProblemSection />
        <EcosystemSection />
        <FeaturesSection />
        <EduTourismSection />
        <PartnersSection />
        <CTASection />
      </main>
    </ThemeCtx.Provider>
  );
}