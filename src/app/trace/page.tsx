'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera, Search, CheckCircle, MapPin, Leaf, Package,
  Droplets, Award, Clock, QrCode, AlertCircle, X,
  FlipHorizontal, Thermometer, User, ExternalLink,
  Calendar, Ticket, ChevronRight, Wifi, ShieldCheck,
} from 'lucide-react';
import { useUIStore } from '@/store/useUIStore';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FarmerData {
  name: string;
  photo: string;
  experience: number;
  village: string;
  quote: string;
  treeCount: string;
}

interface IoTData {
  avgTemp: string | null;
  finalHumidity: string;
  duration: string;
  standard: string;
  ledgerHash: string;
  readings: number[];
}

interface StageData {
  done: boolean;
  date: string;
  note: string;
  detail: string;           // ← NEW: expanded explanation
  photo: string | null;
  photoAlt?: string;
  hasIoT?: boolean;
  pendingIcon?: string;
  isLive?: boolean;
  doneShip?: boolean;
}

interface BatchResult {
  farm: string;
  location: string;
  harvestDate: string;
  weight: string;
  quality: string;
  moisture: string;
  certifications: string[];
  mapsUrl: string;
  agrowisataUrl: string;
  farmer: FarmerData;
  iot: IoTData;
  stages: StageData[];
}

type CopyLang = (typeof copy)[keyof typeof copy];
type ScannerError = 'permission_denied' | 'no_camera' | 'generic';

// ─── Copy ────────────────────────────────────────────────────────────────────

const copy = {
  id: {
    badge: 'Traceability',
    title: 'Lacak Perjalanan',
    titleAccent: 'Kakao Anda',
    subtitle: 'Masukkan kode batch atau scan QR Code dari kemasan untuk melihat riwayat lengkap produk kakao Anda.',
    placeholder: 'Contoh: KSS-2026-02-041',
    btnCek: 'Lacak Sekarang',
    btnScan: 'Scan QR',
    loading: 'Melacak...',
    labelContoh: 'Coba kode demo',
    notFound: 'Kode batch tidak ditemukan',
    stages: ['Panen', 'Fermentasi', 'Pengeringan', 'Seleksi Kualitas'],
    resultLabel: 'Hasil Lacak',
    verified: 'Terverifikasi',
    farm: 'Kebun Asal',
    harvest: 'Tanggal Panen',
    weight: 'Berat Batch',
    moisture: 'Kadar Air',
    journey: 'Rekam Jejak Perjalanan',
    certLabel: 'Sertifikasi',
    farmerProfile: 'Profil Petani',
    farmerExp: 'Tahun Pengalaman',
    farmerVillage: 'Desa Asal',
    iotData: 'Data IoT Smart Dryer',
    iotTemp: 'Suhu Rata-rata',
    iotHumidity: 'Kelembapan Akhir',
    iotDuration: 'Durasi Pengeringan',
    iotStandard: 'Standar SNI',
    iotLive: 'Live Cloud Ledger',
    ctaTitle: 'Kunjungi Kebun Asalnya Langsung',
    ctaSubtitle: 'Cokelat yang Anda nikmati lahir dari kebun ini. Rasakan pengalaman petik kakao, fermentasi, dan pengolahan cokelat artisan secara langsung di Jembrana.',
    ctaBtn: 'Pesan Agrowisata',
    ctaMap: 'Lihat di Maps',
    ctaFact1: 'Paket Edukasi',
    ctaFact2: 'Pemandu Lokal',
    ctaFact3: 'Reservasi Online',
    scanTitle: 'Scan QR Code',
    scanHint: 'Arahkan kamera ke QR Code pada kemasan',
    scanPermissionDenied: 'Akses kamera ditolak. Izinkan kamera di pengaturan browser Anda.',
    scanNoCamera: 'Kamera tidak ditemukan di perangkat ini.',
    scanError: 'Tidak dapat mengakses kamera.',
    flipCamera: 'Balik',
    photoUnavailable: 'Foto tidak tersedia',
    qrDetected: '✓ QR terdeteksi',
    shipped: 'Sudah dikirim',
    inProgress: 'Proses berlangsung...',
    scheduled: 'Dijadwalkan',
    notScheduled: 'Belum ditentukan',
    readMore: 'Selengkapnya',
    readLess: 'Tutup',
  },
  en: {
    badge: 'Traceability',
    title: 'Track Your',
    titleAccent: 'Cacao Journey',
    subtitle: 'Enter a batch code or scan the QR Code from your packaging to view the complete history of your cacao product.',
    placeholder: 'e.g. KSS-2026-02-041',
    btnCek: 'Track Now',
    btnScan: 'Scan QR',
    loading: 'Tracking...',
    labelContoh: 'Try demo codes',
    notFound: 'Batch code not found',
    stages: ['Harvest', 'Fermentation', 'Drying', 'Quality Selection'],
    resultLabel: 'Track Result',
    verified: 'Verified',
    farm: 'Origin Farm',
    harvest: 'Harvest Date',
    weight: 'Batch Weight',
    moisture: 'Moisture',
    journey: 'Product Journey',
    certLabel: 'Certifications',
    farmerProfile: 'Farmer Profile',
    farmerExp: 'Years Experience',
    farmerVillage: 'Village',
    iotData: 'Smart Dryer IoT Data',
    iotTemp: 'Avg. Temperature',
    iotHumidity: 'Final Humidity',
    iotDuration: 'Drying Duration',
    iotStandard: 'SNI Standard',
    iotLive: 'Live Cloud Ledger',
    ctaTitle: 'Visit the Origin Farm',
    ctaSubtitle: 'The chocolate you enjoy was born from this farm. Experience cacao harvesting, fermentation, and artisan chocolate making in Jembrana.',
    ctaBtn: 'Book Agrotourism',
    ctaMap: 'View on Maps',
    ctaFact1: 'Education Packages',
    ctaFact2: 'Local Guides',
    ctaFact3: 'Online Reservation',
    scanTitle: 'Scan QR Code',
    scanHint: 'Point your camera at the QR Code on the packaging',
    scanPermissionDenied: 'Camera access denied. Please allow camera access in your browser settings.',
    scanNoCamera: 'No camera found on this device.',
    scanError: 'Unable to access camera.',
    flipCamera: 'Flip',
    photoUnavailable: 'Photo unavailable',
    qrDetected: '✓ QR detected',
    shipped: 'Shipped',
    inProgress: 'In progress...',
    scheduled: 'Scheduled',
    notScheduled: 'Not scheduled',
    readMore: 'Read more',
    readLess: 'Collapse',
  },
} as const;

// ─── Data ────────────────────────────────────────────────────────────────────

const DEMO_CODES = ['KSS-2026-02-041', 'JEM-ORG-2026-B04', 'KSS-2026-03-112'] as const;

const MOCK_DATA: Record<string, BatchResult> = {
  'KSS-2026-02-041': {
    farm: 'Kebun KTT Merta Abadi',
    location: 'Jembrana, Bali',
    harvestDate: '12 Feb 2026',
    weight: '2.340 kg',
    quality: 'AA',
    moisture: '7.2%',
    certifications: ['Rainforest Alliance', 'UTZ', 'Organic'],
    mapsUrl: 'https://maps.google.com/?q=Jembrana+Bali+Agrowisata+Kakao',
    agrowisataUrl: '/telusuri',
    farmer: {
      name: 'I Wayan Suparta',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&q=80&auto=format&fit=crop&crop=face',
      experience: 18,
      village: 'Desa Penyaringan, Mendoyo',
      quote: 'Setiap biji kakao membawa cerita tanah dan kerja keras kami.',
      treeCount: '± 420 pohon',
    },
    iot: {
      avgTemp: '48.3°C',
      finalHumidity: '7.2%',
      duration: '6 Hari',
      standard: 'SNI 2323:2008 ✓',
      ledgerHash: '0x4f2a...c91e',
      readings: [55, 51, 49, 48, 47, 48],
    },
    stages: [
      {
        done: true, date: '12 Feb',
        note: 'Panen selektif biji matang di pagi hari.',
        detail: 'Pemanenan dilakukan secara selektif pada pagi hari pukul 06.00–10.00 WITA ketika suhu masih sejuk. Buah kakao yang dipilih adalah yang telah matang sempurna berusia 5–6 bulan sejak pembungaan, ditandai warna kuning kemerahan merata. Kondisi cuaca cerah, suhu lingkungan 28°C dengan kelembapan 72%. Pohon kakao berumur 7 tahun ini menghasilkan rata-rata 1,2 kg buah segar per pohon. Total 420 pohon dipanen dalam satu sesi, menghasilkan 2.520 kg buah segar yang kemudian dikupas dan diambil bijinya menjadi 2.340 kg biji segar siap fermentasi.',
        photo: '/images/panen-selektif.jpg',
        photoAlt: 'Panen biji kakao segar',
      },
      {
        done: true, date: '13 Feb',
        note: 'Fermentasi 6 hari dalam kotak kayu berlapis.',
        detail: 'Proses fermentasi berlangsung selama 6 hari penuh menggunakan kotak kayu jati berlapis tiga susun berukuran 60×60×80 cm. Biji kakao segar ditumpuk setinggi 70 cm lalu ditutup rapat dengan karung goni untuk menjaga panas. Pembalikan dilakukan setiap 48 jam (hari ke-2 dan ke-4) untuk memastikan aerasi merata. Suhu fermentasi terjaga antara 45–50°C—zona ideal yang memicu aktivitas ragi dan bakteri asam asetat untuk memecah pulp dan mengembangkan prekursor cita rasa cokelat. Proses ini berlangsung di bawah pengawasan mandor fermentasi berpengalaman 12 tahun, I Nyoman Raka.',
        photo: '/images/fermentasi.png',
        photoAlt: 'Fermentasi biji kakao dalam kotak kayu',
      },
      {
        done: true, date: '19 Feb',
        note: 'Pengeringan via Smart Dryer hibrida 6 hari.',
        detail: 'Pengeringan menggunakan Smart Dryer Hibrida generasi ke-2 yang dikembangkan bersama Universitas Udayana. Sistem ini menggabungkan panel surya 2 kWp dengan pemanas LPG cadangan, mempertahankan suhu optimal 45–55°C sepanjang proses. Sensor IoT DHT22 tertanam di 4 titik ruang pengering memantau suhu dan kelembapan setiap 15 menit secara real-time. Data dikirim ke cloud ledger terenkripsi (hash: 0x4f2a...c91e) yang tidak dapat dimanipulasi. Kadar air berhasil diturunkan dari 55% → 7.2% dalam 6 hari—memenuhi standar SNI 2323:2008 untuk ekspor. Konsumsi energi 40% lebih hemat dibanding dryer konvensional.',
        photo: '/images/pengeringan.jpg',
        photoAlt: 'Pengeringan biji kakao dengan Smart Dryer',
        hasIoT: true,
      },
      {
        done: true, date: '25 Feb',
        note: 'Sortir manual & mekanik. Grade AA terkonfirmasi.',
        detail: 'Seleksi kualitas dilakukan dua tahap: pertama melalui mesin sortir getar yang memisahkan biji berdasarkan ukuran dan bobot, lalu dilanjutkan pemeriksaan manual oleh tim QC PT. Kakao Mulia. Cut test dilakukan pada sampel 100 biji acak: 96 biji terklasifikasi "fully fermented" (berwarna cokelat merata dengan aroma cokelat kuat), 3 biji "partially fermented", dan 1 biji "slaty". Hasil ini melampaui ambang batas Grade AA (minimal 90% fully fermented). Biji kemudian diklasifikasikan, ditimbang ulang, dan dikemas dalam karung goni berlabel yang disegel dan diberi nomor seri untuk keperluan ekspor.',
        photo: '/images/biji-cacao.jpg',
        photoAlt: 'Proses seleksi dan grading kualitas kakao',
      },

    ],
  },

  'JEM-ORG-2026-B04': {
    farm: 'Perkebunan Organik Jembrana',
    location: 'Melaya, Jembrana',
    harvestDate: '8 Jan 2026',
    weight: '1.870 kg',
    quality: 'A',
    moisture: '7.8%',
    certifications: ['Organic', 'Fairtrade'],
    mapsUrl: 'https://maps.google.com/?q=Melaya+Jembrana+Bali+Agrowisata',
    agrowisataUrl: '#agrowisata',
    farmer: {
      name: 'Ni Ketut Ayu Sari',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&q=80&auto=format&fit=crop&crop=face',
      experience: 12,
      village: 'Desa Tukadaya, Melaya',
      quote: 'Kakao organik kami tumbuh selaras dengan alam Bali Barat.',
      treeCount: '± 310 pohon',
    },
    iot: {
      avgTemp: '46.1°C',
      finalHumidity: '7.8%',
      duration: '5 Hari',
      standard: 'SNI 2323:2008 ✓',
      ledgerHash: '0x8b3c...d72f',
      readings: [48, 46, 45, 46, 47],
    },
    stages: [
      {
        done: true, date: '8 Jan',
        note: 'Panen pagi hari dari pohon organik bersertifikat.',
        detail: 'Panen dilakukan pagi hari dari 310 pohon kakao organik bersertifikat yang telah bebas pestisida kimia selama lebih dari 5 tahun. Pemilihan buah dilakukan 100% manual tanpa alat mekanis untuk menghindari kontaminasi. Pohon-pohon ini mendapat pupuk organik berbasis kompos daun kakao dan kotoran sapi lokal yang difermentasi. Kebun terletak di ketinggian 180 mdpl dengan naungan pohon kelapa dan pisang yang menciptakan iklim mikro ideal. Hasil panen 1.870 kg biji segar telah memenuhi standar sertifikasi organik IFOAM dan siap memasuki rantai pasok premium.',
        photo: '/images/panen-selektif.jpg',
        photoAlt: 'Panen kakao organik Jembrana',
      },
      {
        done: true, date: '9 Jan',
        note: 'Fermentasi 5 hari dalam kotak kayu organik.',
        detail: 'Fermentasi berlangsung 5 hari menggunakan kotak kayu yang telah disanitasi dengan air panas dan cuka apel—tanpa bahan kimia sintetis. Seluruh proses memenuhi protokol organik ketat: tidak ada pupuk kimia, pestisida, atau bahan aditif dalam radius 50 meter area fermentasi. Pengawas fermentasi organik tersertifikasi, Wayan Darma, memonitor pH dan aroma setiap 12 jam. Temperatur fermentasi mencapai puncak 47°C pada hari ke-3, menghasilkan biji dengan tingkat fermentasi sempurna 94%—melampaui standar Grade A.',
        photo: '/images/fermentasi.png',
        photoAlt: 'Fermentasi organik',
      },
      {
        done: true, date: '15 Jan',
        note: 'Pengeringan Smart Dryer 5 hari. Kadar air akhir 7.8%.',
        detail: 'Pengeringan menggunakan Smart Dryer bertenaga surya penuh (100% energi terbarukan) selama 5 hari. Karena batch ini berlabel organik, tidak ada bahan bakar fosil yang digunakan dalam seluruh proses pengeringan—hanya tenaga matahari. Data IoT DHT22 mencatat 480 titik data selama proses, seluruhnya tersimpan di cloud ledger immutable (hash: 0x8b3c...d72f). Penurunan kadar air dari 54% → 7.8% berjalan mulus tanpa interupsi, membuktikan keandalan sistem bahkan di musim hujan berkat atap kaca yang dapat disesuaikan sudutnya.',
        photo: '/images/pengeringan.jpg',
        photoAlt: 'Pengeringan kakao organik',
        hasIoT: true,
      },
      {
        done: true, date: '18 Jan',
        note: 'Grade A terkonfirmasi. Lolos uji Fairtrade & Organic.',
        detail: 'Inspeksi kualitas dilakukan tim independen dari CV. Kakao Prima bersama auditor Fairtrade Indonesia. Cut test pada 100 biji sampel: 93 fully fermented, 5 partially fermented, 2 slaty—memenuhi Grade A. Selain itu, dilakukan pengujian residu pestisida menggunakan metode GCMS di laboratorium terakreditasi; hasilnya bersih dari 87 senyawa pestisida yang diuji. Sertifikat Fairtrade diterbitkan dengan nomor FLO-ID-2026-JEM-004, menjamin petani menerima Fairtrade Premium sebesar USD 200/ton di atas harga pasar.',
        photo: '/images/biji-cacao.jpg',
        photoAlt: 'Seleksi kualitas organik',
      },

    ],
  },

  'KSS-2026-03-112': {
    farm: 'Kebun Kakao Nusantara',
    location: 'Negara, Jembrana',
    harvestDate: '5 Mar 2026',
    weight: '980 kg',
    quality: 'B',
    moisture: '8.1%',
    certifications: ['UTZ'],
    mapsUrl: 'https://maps.google.com/?q=Negara+Jembrana+Bali+Kakao',
    agrowisataUrl: '#agrowisata',
    farmer: {
      name: 'I Made Suardana',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&q=80&auto=format&fit=crop&crop=face',
      experience: 9,
      village: 'Desa Banyubiru, Negara',
      quote: 'Musim ini adalah panen perdana kami dengan teknologi Smart Dryer.',
      treeCount: '± 180 pohon',
    },
    iot: {
      avgTemp: null,
      finalHumidity: '8.1%',
      duration: 'Sedang berjalan...',
      standard: 'Dalam proses',
      ledgerHash: '0x1d9f...a44b',
      readings: [50, 49],
    },
    stages: [
      {
        done: true, date: '5 Mar',
        note: 'Panen perdana musim gugur dari kebun 1.2 hektar.',
        detail: 'Panen perdana musim gugur 2026 dari kebun seluas 1,2 hektar yang mulai produktif setelah 4 tahun penanaman. Sebanyak 180 pohon kakao varietas Trinitario menghasilkan 980 kg biji segar—hasil yang menjanjikan untuk kebun yang baru masuk masa puncak produksi. I Made Suardana, petani muda berusia 31 tahun dengan 9 tahun pengalaman, memanen sendiri dibantu 3 anggota keluarga. Kebun ini menerapkan sistem agroforestri dengan penanaman pohon nangka dan kelapa sebagai tanaman naungan, sekaligus sumber pendapatan tambahan.',
        photo: '/images/panen-selektif.jpg',
        photoAlt: 'Panen perdana kebun Nusantara',
      },
      {
        done: true, date: '6 Mar',
        note: 'Fermentasi 5 hari berjalan normal.',
        detail: 'Fermentasi 5 hari berjalan sesuai protokol standar dengan pembalikan pada hari ke-2 dan ke-4. Ini adalah batch perdana I Made menggunakan kotak fermentasi kayu baru yang difasilitasi program kemitraan UD. Bali Cacao. Suhu fermentasi memuncak di 44°C—sedikit lebih rendah dari ideal karena cuaca berawan selama 2 hari, namun masih dalam rentang yang dapat menghasilkan fermentasi baik. Tim lapangan UD. Bali Cacao melakukan pendampingan langsung untuk memastikan proses berjalan optimal sesuai SOP.',
        photo: '/images/fermentasi.png',
        photoAlt: 'Fermentasi batch perdana',
      },
      {
        done: false, date: '—',
        note: 'Pengeringan Smart Dryer sedang berlangsung real-time.',
        detail: 'Proses pengeringan Smart Dryer sedang berjalan. Data IoT terus diperbarui setiap 15 menit. Kadar air saat ini dalam proses penurunan dari 52%. Target kadar air akhir 7.5–8.5% sesuai standar SNI. Estimasi selesai dalam 3–4 hari ke depan tergantung kondisi cuaca.',
        photo: '/images/pengeringan.jpg',
        pendingIcon: 'dryer',
        hasIoT: true,
        isLive: true,
      },
      {
        done: false, date: '—',
        note: 'Menunggu pengeringan selesai sebelum seleksi.',
        detail: 'Tahap seleksi kualitas akan dilakukan segera setelah proses pengeringan mencapai kadar air target. Tim QC UD. Bali Cacao sudah terjadwal untuk melakukan cut test dan grading.',
        photo: '/images/biji-cacao.jpg',
        pendingIcon: 'selection',
      },

    ],
  },
};

// ─── Utils ────────────────────────────────────────────────────────────────────

const QUALITY_COLOR: Record<string, string> = {
  AA: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800',
  A: 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800',
  B: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800',
  C: 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800',
};

const PENDING_ICONS: Record<string, React.ReactElement> = {
  ship: <Package size={24} className="text-zinc-400" />,
  dryer: <Thermometer size={24} className="text-emerald-500" />,
  selection: <Award size={24} className="text-zinc-400" />,
};

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

// ─── IoT Sparkline ────────────────────────────────────────────────────────────

function IoTSparkline({ readings, isLive }: { readings: number[]; isLive?: boolean }) {
  const MAX = 60, MIN = 40;
  const W = 120, H = 32;

  const points = readings
    .map((v, i) => {
      const x = (i / Math.max(readings.length - 1, 1)) * W;
      const y = H - ((v - MIN) / (MAX - MIN)) * H;
      return `${x},${y}`;
    })
    .join(' ');

  const lastX = readings.length > 1 ? W : 0;
  const lastY = H - ((readings[readings.length - 1] - MIN) / (MAX - MIN)) * H;

  return (
    <div className="flex items-center gap-2">
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="overflow-visible">
        <polyline
          points={points}
          fill="none"
          stroke="#059669"
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {isLive && (
          <circle cx={lastX} cy={lastY} r="3" fill="#059669">
            <animate attributeName="opacity" values="1;0;1" dur="1.5s" repeatCount="indefinite" />
          </circle>
        )}
      </svg>
      {isLive && (
        <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
          Live
        </span>
      )}
    </div>
  );
}

// ─── Blockchain Modal ─────────────────────────────────────────────────────────

interface BlockchainModalProps {
  isDark: boolean;
  hash: string;
  onClose: () => void;
}

function BlockchainModal({ isDark, hash, onClose }: BlockchainModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className={cn(
          'relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl p-6 z-10',
          isDark ? 'bg-zinc-900 border border-emerald-900/50' : 'bg-white border border-emerald-100'
        )}
      >
        <button
          onClick={onClose}
          className={cn(
            'absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors',
            isDark ? 'bg-zinc-800 text-zinc-400 hover:text-white' : 'bg-gray-100 text-zinc-500 hover:text-zinc-900'
          )}
        >
          <X size={16} />
        </button>

        <div className="flex flex-col items-center text-center mt-2">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
            <ShieldCheck size={32} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className={cn('text-lg font-bold mb-2', isDark ? 'text-white' : 'text-zinc-900')}>
            Verifikasi Blockchain
          </h3>
          <p className={cn('text-xs leading-relaxed mb-6', isDark ? 'text-zinc-400' : 'text-zinc-500')}>
            Data sensor lingkungan ini telah dienkripsi dan disimpan dalam jaringan terdesentralisasi (blockchain). Data ini bersifat <strong>immutable</strong> (tidak dapat dimanipulasi).
          </p>
          
          <div className={cn(
            'w-full rounded-2xl p-4 border text-left mb-6',
            isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
          )}>
            <p className={cn('text-[10px] uppercase tracking-widest font-bold mb-1', isDark ? 'text-zinc-500' : 'text-zinc-400')}>
              Ledger Hash
            </p>
            <p className="font-mono text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 break-all">
              {hash}
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors text-sm"
          >
            Tutup Verifikasi
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── IoT Panel ────────────────────────────────────────────────────────────────

interface IoTPanelProps {
  iot: IoTData;
  c: CopyLang;
  isDark: boolean;
  isLive?: boolean;
}

function IoTPanel({ iot, c, isDark, isLive }: IoTPanelProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
    <div className={cn(
      'rounded-2xl border p-3 sm:p-4 space-y-3',
      isDark ? 'bg-zinc-900 border-zinc-700' : 'bg-emerald-50/60 border-emerald-200',
    )}>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Wifi size={13} className="text-emerald-500" />
          <span className={cn(
            'text-xs font-semibold uppercase tracking-widest',
            isDark ? 'text-zinc-400' : 'text-emerald-700',
          )}>
            {c.iotData}
          </span>
        </div>
        <span className={cn(
          'text-xs font-mono px-2 py-0.5 rounded-lg border',
          isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-400' : 'bg-white border-emerald-200 text-emerald-700',
        )}>
          {iot.ledgerHash}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {[
          { label: c.iotTemp, value: iot.avgTemp ?? '—', icon: <Thermometer size={12} /> },
          { label: c.iotHumidity, value: iot.finalHumidity, icon: <Droplets size={12} /> },
          { label: c.iotDuration, value: iot.duration, icon: <Clock size={12} /> },
          { label: c.iotStandard, value: iot.standard, icon: <ShieldCheck size={12} /> },
        ].map(({ label, value, icon }) => (
          <div key={label} className={cn('rounded-xl p-2.5', isDark ? 'bg-zinc-800' : 'bg-white/80')}>
            <div className={cn(
              'flex items-center gap-1 text-xs mb-1',
              isDark ? 'text-zinc-400' : 'text-emerald-700/70',
            )}>
              <span className="text-emerald-500">{icon}</span>
              {label}
            </div>
            <p className={cn('text-sm font-semibold', isDark ? 'text-white' : 'text-zinc-900')}>
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between flex-wrap gap-2">
        <IoTSparkline readings={iot.readings} isLive={isLive} />
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setShowModal(true);
          }}
          className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
        >
          <ExternalLink size={11} /> {c.iotLive}
        </a>
      </div>
    </div>

      <AnimatePresence>
        {showModal && (
          <BlockchainModal
            isDark={isDark}
            hash={iot.ledgerHash}
            onClose={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Stage Card ───────────────────────────────────────────────────────────────

interface StageCardProps {
  stage: StageData;
  index: number;
  stageLabel: string;
  iot: IoTData;
  c: CopyLang;
  isDark: boolean;
}

function StageCard({ stage, index, stageLabel, iot, c, isDark }: StageCardProps) {
  const [expanded, setExpanded] = useState(false);

  const getPendingLabel = () => {
    if (stage.doneShip) return c.shipped;
    if (stage.isLive) return c.inProgress;
    return stage.date !== '—' ? `${c.scheduled} ${stage.date}` : c.notScheduled;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className={cn(
        'rounded-2xl border overflow-hidden',
        stage.done
          ? isDark ? 'bg-zinc-800/40 border-zinc-700' : 'bg-gray-50 border-gray-100'
          : isDark ? 'bg-zinc-800/20 border-zinc-700/50' : 'bg-gray-50/50 border-gray-100',
      )}
    >
      {/* Header row */}
      <div className={cn(
        'flex items-center justify-between px-3 sm:px-4 py-3 border-b',
        isDark ? 'border-zinc-700' : 'border-gray-100',
      )}>
        <div className="flex items-center gap-2 min-w-0">
          <div className={cn(
            'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold',
            stage.done
              ? 'bg-emerald-600 text-white'
              : stage.isLive
                ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400'
                : isDark ? 'bg-zinc-700 text-zinc-500' : 'bg-gray-200 text-gray-400',
          )}>
            {stage.done
              ? <CheckCircle size={13} />
              : stage.isLive
                ? <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
                : <span className="w-1.5 h-1.5 rounded-full bg-current inline-block" />
            }
          </div>

          <span className={cn(
            'text-sm font-semibold truncate',
            stage.done
              ? isDark ? 'text-white' : 'text-zinc-900'
              : isDark ? 'text-zinc-400' : 'text-zinc-400',
          )}>
            {stageLabel}
          </span>

          {stage.isLive && (
            <span className="flex-shrink-0 flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
              Live
            </span>
          )}
        </div>

        <span className={cn('text-xs font-mono flex-shrink-0 ml-2', isDark ? 'text-zinc-500' : 'text-zinc-400')}>
          {stage.date}
        </span>
      </div>

      <div className="p-3 sm:p-4 space-y-3">
        {/* Photo or placeholder */}
        {stage.photo ? (
          <div className="relative rounded-xl overflow-hidden">
            <img
              src={stage.photo}
              alt={stage.photoAlt}
              className="w-full h-40 sm:h-44 object-cover"
              onError={(e) => {
                const img = e.currentTarget;
                img.style.display = 'none';
                const fallback = img.nextElementSibling as HTMLElement | null;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            <div
              style={{ display: 'none' }}
              className={cn(
                'w-full h-40 sm:h-44 flex flex-col items-center justify-center gap-2',
                isDark ? 'bg-zinc-800' : 'bg-gray-100',
              )}
            >
              <Package size={24} className={isDark ? 'text-zinc-600' : 'text-gray-400'} />
              <span className={cn('text-xs', isDark ? 'text-zinc-600' : 'text-gray-400')}>
                {c.photoUnavailable}
              </span>
            </div>
          </div>
        ) : (
          <div className={cn(
            'w-full h-28 sm:h-32 rounded-xl flex flex-col items-center justify-center gap-2 border border-dashed',
            isDark ? 'bg-zinc-800/50 border-zinc-700' : 'bg-gray-100 border-gray-200',
          )}>
            {PENDING_ICONS[stage.pendingIcon ?? ''] ?? <Package size={24} className="text-zinc-400" />}
            <span className={cn('text-xs', isDark ? 'text-zinc-500' : 'text-zinc-400')}>
              {getPendingLabel()}
            </span>
          </div>
        )}

        {/* Short note */}
        <p className={cn('text-xs leading-relaxed', isDark ? 'text-zinc-400' : 'text-zinc-500')}>
          {stage.note}
        </p>

        {/* Expanded detail */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <p className={cn(
                'text-xs leading-relaxed pt-1 border-t',
                isDark ? 'text-zinc-400 border-zinc-700' : 'text-zinc-500 border-gray-200',
              )}>
                {stage.detail}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Read more / less toggle */}
        <button
          onClick={() => setExpanded(v => !v)}
          className={cn(
            'flex items-center gap-1 text-xs font-medium transition-colors',
            isDark ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-700',
          )}
        >
          <ChevronRight
            size={13}
            className={cn('transition-transform', expanded ? 'rotate-90' : '')}
          />
          {expanded ? c.readLess : c.readMore}
        </button>

        {/* IoT panel — done drying stage */}
        {stage.hasIoT && stage.done && iot && (
          <IoTPanel iot={iot} c={c} isDark={isDark} />
        )}
        {/* IoT panel — live drying stage */}
        {stage.hasIoT && !stage.done && stage.isLive && iot && (
          <IoTPanel iot={iot} c={c} isDark={isDark} isLive />
        )}
      </div>
    </motion.div>
  );
}

// ─── Farmer Profile ───────────────────────────────────────────────────────────

interface FarmerProfileProps {
  farmer: FarmerData;
  c: CopyLang;
  isDark: boolean;
}

function FarmerProfile({ farmer, c, isDark }: FarmerProfileProps) {
  return (
    <div className={cn(
      'rounded-2xl border p-3 sm:p-4',
      isDark ? 'bg-zinc-800/50 border-zinc-700' : 'bg-amber-50/50 border-amber-100',
    )}>
      <p className={cn(
        'text-xs font-semibold uppercase tracking-widest mb-3 flex items-center gap-1.5',
        isDark ? 'text-zinc-500' : 'text-amber-700/80',
      )}>
        <User size={12} /> {c.farmerProfile}
      </p>

      <div className="flex items-start gap-3">
        <img
          src={farmer.photo}
          alt={farmer.name}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover flex-shrink-0"
          onError={(e) => {
            const img = e.currentTarget;
            img.style.display = 'none';
            const fallback = img.nextElementSibling as HTMLElement | null;
            if (fallback) fallback.style.display = 'flex';
          }}
        />
        <div
          style={{ display: 'none' }}
          className={cn(
            'w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex-shrink-0 items-center justify-center',
            isDark ? 'bg-zinc-700' : 'bg-amber-100',
          )}
        >
          <User size={22} className={isDark ? 'text-zinc-500' : 'text-amber-400'} />
        </div>

        <div className="flex-1 min-w-0">
          <p className={cn('font-semibold text-sm', isDark ? 'text-white' : 'text-zinc-900')}>
            {farmer.name}
          </p>
          <p className={cn('text-xs mt-0.5 truncate', isDark ? 'text-zinc-500' : 'text-zinc-500')}>
            {farmer.village} · {farmer.treeCount}
          </p>
          <div className="flex items-center gap-3 mt-2">
            <div className="text-center">
              <p className={cn('text-lg font-bold leading-none', isDark ? 'text-white' : 'text-zinc-900')}>
                {farmer.experience}
              </p>
              <p className={cn('text-xs mt-0.5', isDark ? 'text-zinc-500' : 'text-zinc-400')}>
                {c.farmerExp}
              </p>
            </div>
          </div>
        </div>
      </div>

      <p className={cn(
        'mt-3 text-xs italic leading-relaxed border-l-2 border-amber-400 pl-3',
        isDark ? 'text-zinc-400' : 'text-zinc-500',
      )}>
        "{farmer.quote}"
      </p>
    </div>
  );
}

// ─── Agrowisata CTA ───────────────────────────────────────────────────────────

interface AgrowisataCTAProps {
  result: BatchResult;
  c: CopyLang;
  isDark: boolean;
}

function AgrowisataCTA({ result, c, isDark }: AgrowisataCTAProps) {
  const ctaFacts = [
    { icon: <Calendar size={11} />, label: c.ctaFact1 },
    { icon: <User size={11} />, label: c.ctaFact2 },
    { icon: <Ticket size={11} />, label: c.ctaFact3 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-3xl overflow-hidden border border-emerald-200 dark:border-emerald-800"
    >
      {/* Hero image */}
      <div className="relative h-32 sm:h-36 overflow-hidden">
        <img
          src="/images/kebun-agrowisata.png"
          alt="Agrowisata kakao Jembrana"
          className="w-full h-full object-cover object-[center_35%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 via-emerald-900/30 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4">
          <p className="text-xs font-semibold text-emerald-200 uppercase tracking-widest mb-0.5">
            Agrowisata Kakao
          </p>
          <p className="text-white font-bold text-sm sm:text-base leading-tight">{result.farm}</p>
          <p className="text-emerald-200 text-xs mt-0.5 flex items-center gap-1">
            <MapPin size={10} /> {result.location}
          </p>
        </div>
      </div>

      <div className={cn('p-4 sm:p-5', isDark ? 'bg-zinc-900' : 'bg-emerald-50/40')}>
        <h3 className={cn('font-bold text-sm sm:text-base mb-1.5', isDark ? 'text-white' : 'text-zinc-900')}>
          {c.ctaTitle}
        </h3>
        <p className={cn('text-xs leading-relaxed mb-4', isDark ? 'text-zinc-400' : 'text-zinc-500')}>
          {c.ctaSubtitle}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {ctaFacts.map(({ icon, label }) => (
            <span
              key={label}
              className={cn(
                'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border',
                isDark
                  ? 'bg-zinc-800 border-zinc-700 text-zinc-300'
                  : 'bg-white border-emerald-200 text-emerald-700',
              )}
            >
              <span className="text-emerald-500">{icon}</span>
              {label}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <a
            href={`https://www.traveloka.com/id-id/activities/search?q=${encodeURIComponent(result.farm)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-2xl transition-colors text-xs"
          >
            <Ticket size={13} /> {c.ctaBtn}
          </a>
          <a
            href={result.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'flex items-center justify-center gap-1.5 py-3 font-semibold rounded-2xl border transition-colors text-xs',
              isDark
                ? 'bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-white'
                : 'bg-white border-emerald-200 hover:bg-emerald-50 text-zinc-800',
            )}
          >
            <MapPin size={13} className="text-emerald-500" /> {c.ctaMap}
          </a>
        </div>
      </div>
    </motion.div>
  );
}

// ─── QR Scanner Modal ─────────────────────────────────────────────────────────

interface QRScannerModalProps {
  isDark: boolean;
  c: CopyLang;
  onDetected: (code: string) => void;
  onClose: () => void;
}

function QRScannerModal({ isDark, c, onDetected, onClose }: QRScannerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);
  const jsQRRef = useRef<((data: Uint8ClampedArray, width: number, height: number, opts?: object) => { data: string } | null) | null>(null);
  const detectedRef = useRef(false);
  const loopStarted = useRef(false);

  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [scanError, setScanError] = useState<ScannerError | null>(null);
  const [detected, setDetected] = useState(false);

  // ── Stop camera stream ──────────────────────────────────────────────────────
  const stopStream = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    loopStarted.current = false;
  }, []);

  // ── Load jsQR lazily ────────────────────────────────────────────────────────
  const ensureJsQR = useCallback(async () => {
    if (jsQRRef.current) return jsQRRef.current;
    if ((window as any).jsQR) {
      jsQRRef.current = (window as any).jsQR;
      return jsQRRef.current!;
    }
    await new Promise<void>((resolve, reject) => {
      const existing = document.querySelector('script[src*="jsqr"]');
      if (existing) {
        existing.addEventListener('load', () => resolve());
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load jsQR'));
      document.head.appendChild(script);
    });
    jsQRRef.current = (window as any).jsQR;
    return jsQRRef.current!;
  }, []);

  // ── Decode loop ─────────────────────────────────────────────────────────────
  const startDecodeLoop = useCallback(async () => {
    if (loopStarted.current) return;
    loopStarted.current = true;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    // Try BarcodeDetector first (Chrome 83+), fall back to jsQR
    const hasBarcodeDetector = 'BarcodeDetector' in window;
    let detector: any = null;
    if (hasBarcodeDetector) {
      try {
        const supported = await (window as any).BarcodeDetector.getSupportedFormats?.() ?? ['qr_code'];
        if (supported.includes('qr_code')) {
          detector = new (window as any).BarcodeDetector({ formats: ['qr_code'] });
        }
      } catch { /* fall through to jsQR */ }
    }

    const jsQR = !detector ? await ensureJsQR().catch(() => null) : null;
    if (!detector && !jsQR) {
      setScanError('generic');
      return;
    }

    const tick = async () => {
      if (detectedRef.current) return;
      if (!video || video.readyState < 2) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) { rafRef.current = requestAnimationFrame(tick); return; }

      ctx.drawImage(video, 0, 0);

      try {
        let decoded: string | null = null;

        if (detector) {
          const codes = await detector.detect(canvas);
          if (codes?.length > 0) decoded = codes[0].rawValue;
        } else if (jsQR) {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const result = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert',
          });
          if (result) decoded = result.data;
        }

        if (decoded) {
          detectedRef.current = true;
          setDetected(true);
          stopStream();
          setTimeout(() => onDetected(decoded!.trim().toUpperCase()), 600);
          return;
        }
      } catch {
        // Continue scanning on decode errors
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [ensureJsQR, stopStream, onDetected]);

  // ── Start camera ────────────────────────────────────────────────────────────
  const startCamera = useCallback(async (facing: 'environment' | 'user') => {
    stopStream();
    detectedRef.current = false;
    setScanError(null);
    setDetected(false);

    if (!navigator.mediaDevices?.getUserMedia) {
      setScanError('no_camera');
      return;
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facing },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(() => setScanError('generic'));
        };
      }
    } catch (err: any) {
      const name = err?.name ?? '';
      if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
        setScanError('permission_denied');
      } else if (name === 'NotFoundError' || name === 'DevicesNotFoundError' || name === 'NotReadableError') {
        setScanError('no_camera');
      } else {
        setScanError('generic');
      }
    }
  }, [stopStream]);

  // ── Restart camera when facingMode changes ──────────────────────────────────
  useEffect(() => {
    startCamera(facingMode);
    return stopStream;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode]);

  const handleClose = useCallback(() => {
    stopStream();
    onClose();
  }, [stopStream, onClose]);

  const errorMessage =
    scanError === 'permission_denied' ? c.scanPermissionDenied :
      scanError === 'no_camera' ? c.scanNoCamera :
        scanError === 'generic' ? c.scanError : '';

  const CORNERS = ['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const;
  const cornerClass: Record<typeof CORNERS[number], string> = {
    'top-left': 'top-0 left-0 border-t-2 border-l-2 rounded-tl-lg',
    'top-right': 'top-0 right-0 border-t-2 border-r-2 rounded-tr-lg',
    'bottom-left': 'bottom-0 left-0 border-b-2 border-l-2 rounded-bl-lg',
    'bottom-right': 'bottom-0 right-0 border-b-2 border-r-2 rounded-br-lg',
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            'relative w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl overflow-hidden border-t sm:border',
            isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200',
          )}
        >
          {/* Drag handle — mobile only */}
          <div className="flex justify-center pt-3 pb-1 sm:hidden">
            <div className={cn('w-10 h-1 rounded-full', isDark ? 'bg-zinc-700' : 'bg-gray-300')} />
          </div>

          {/* Header */}
          <div className={cn(
            'flex items-center justify-between px-5 py-3 sm:py-4 border-b',
            isDark ? 'border-zinc-800' : 'border-gray-100',
          )}>
            <div className="flex items-center gap-2">
              <QrCode size={16} className="text-emerald-500" />
              <span className={cn('font-semibold text-sm', isDark ? 'text-white' : 'text-zinc-900')}>
                {c.scanTitle}
              </span>
            </div>
            <button
              onClick={handleClose}
              className={cn(
                'p-1.5 rounded-xl transition-colors',
                isDark ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-gray-100 text-zinc-500',
              )}
            >
              <X size={16} />
            </button>
          </div>

          {/* Camera viewport — square on desktop, taller on mobile */}
          <div className="relative bg-black w-full" style={{ aspectRatio: '1/1', maxHeight: '70vh' }}>
            <video
              ref={videoRef}
              onPlay={startDecodeLoop}
              playsInline
              muted
              autoPlay
              className="w-full h-full object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />

            {/* Scanning overlay */}
            {!scanError && !detected && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-52 h-52">
                  {CORNERS.map((pos) => (
                    <div key={pos} className={cn('absolute w-8 h-8 border-emerald-400', cornerClass[pos])} />
                  ))}
                  <motion.div
                    animate={{ top: ['10%', '90%', '10%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute left-2 right-2 h-0.5 bg-emerald-400/70"
                  />
                </div>
              </div>
            )}

            {/* Success overlay */}
            {detected && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center bg-emerald-600/40"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center"
                >
                  <CheckCircle size={32} className="text-white" />
                </motion.div>
              </motion.div>
            )}

            {/* Error overlay */}
            {scanError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 bg-black/70">
                <AlertCircle size={32} className="text-red-400" />
                <p className="text-white text-sm text-center leading-relaxed">{errorMessage}</p>
                <button
                  onClick={() => startCamera(facingMode)}
                  className="mt-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold"
                >
                  Coba Lagi
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className={cn(
            'px-5 py-4 flex items-center justify-between gap-3 border-t',
            isDark ? 'border-zinc-800' : 'border-gray-100',
          )}>
            <p className={cn('text-xs flex-1', isDark ? 'text-zinc-500' : 'text-zinc-400')}>
              {detected ? c.qrDetected : c.scanHint}
            </p>
            <button
              onClick={() => setFacingMode(f => f === 'environment' ? 'user' : 'environment')}
              disabled={!!scanError || detected}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-colors disabled:opacity-40',
                isDark
                  ? 'bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-zinc-300'
                  : 'bg-gray-100 border-gray-200 hover:bg-gray-200 text-zinc-700',
              )}
            >
              <FlipHorizontal size={13} /> {c.flipCamera}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export default function TraceabilitySection() {
  const { theme, lang } = useUIStore();
  const isDark = theme === 'dark';
  const c = copy[lang as keyof typeof copy] ?? copy.id;

  const [batchCode, setBatchCode] = useState('');
  const [result, setResult] = useState<BatchResult | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const handleSearch = useCallback((code: string) => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;

    setIsLoading(true);
    setResult(null);
    setNotFound(false);

    setTimeout(() => {
      const found = MOCK_DATA[trimmed] ?? null;
      if (found) setResult(found);
      else setNotFound(true);
      setIsLoading(false);
    }, 900);
  }, []);

  const handleQRDetected = useCallback((code: string) => {
    setShowScanner(false);
    setBatchCode(code);
    handleSearch(code);
  }, [handleSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBatchCode(e.target.value.toUpperCase());
    setNotFound(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch(batchCode);
  };

  const handleDemoClick = (code: string) => {
    setBatchCode(code);
    setNotFound(false);
  };

  // ── Style helpers ───────────────────────────────────────────────────────────
  const cardClass = isDark
    ? 'bg-zinc-900 border-zinc-800'
    : 'bg-white border-gray-200 shadow-sm';

  const inputClass = cn(
    'w-full rounded-2xl border px-4 sm:px-5 py-3.5 sm:py-4 text-sm sm:text-base text-center font-mono tracking-widest outline-none transition-colors',
    isDark
      ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-emerald-500'
      : 'bg-gray-50 border-gray-200 text-zinc-900 placeholder-zinc-400 focus:border-emerald-500',
  );

  const pillClass = cn(
    'px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-mono border transition-colors',
    isDark
      ? 'bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-zinc-300'
      : 'bg-gray-100 border-gray-200 hover:bg-gray-200 text-zinc-700',
  );

  return (
    <>
      {showScanner && (
        <QRScannerModal
          isDark={isDark}
          c={c}
          onDetected={handleQRDetected}
          onClose={() => setShowScanner(false)}
        />
      )}

      <section
        id="trace"
        className={cn(
          'py-16 sm:py-20 md:py-28 transition-colors duration-300',
          isDark ? 'bg-zinc-950' : 'bg-gray-50',
        )}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-12"
          >
            <span className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest mb-4 border',
              isDark
                ? 'bg-emerald-900/30 border-emerald-800 text-emerald-400'
                : 'bg-emerald-50 border-emerald-200 text-emerald-600',
            )}>
              <QrCode size={11} /> {c.badge}
            </span>
            <h2 className={cn(
              'text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight',
              isDark ? 'text-white' : 'text-zinc-900',
            )}>
              {c.title}{' '}
              <span className="text-emerald-500">{c.titleAccent}</span>
            </h2>
            <p className={cn(
              'mt-3 sm:mt-4 text-sm sm:text-base md:text-lg max-w-xl mx-auto',
              isDark ? 'text-zinc-400' : 'text-zinc-500',
            )}>
              {c.subtitle}
            </p>
          </motion.div>

          {/* Search Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className={cn('rounded-3xl border p-4 sm:p-6 md:p-8 mb-4 sm:mb-5', cardClass)}
          >
            <div className="relative mb-4">
              <input
                type="text"
                value={batchCode}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={c.placeholder}
                className={inputClass}
              />
              <Search
                size={16}
                className={cn(
                  'absolute right-4 top-1/2 -translate-y-1/2',
                  isDark ? 'text-zinc-600' : 'text-zinc-400',
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mb-5 sm:mb-6">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSearch(batchCode)}
                disabled={isLoading || !batchCode.trim()}
                className="flex items-center justify-center gap-1.5 sm:gap-2 py-3 sm:py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-2xl transition-colors text-xs sm:text-sm"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {c.loading}
                  </>
                ) : (
                  <><Search size={14} className="sm:w-4 sm:h-4" />{c.btnCek}</>
                )}
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowScanner(true)}
                className={cn(
                  'flex items-center justify-center gap-1.5 sm:gap-2 py-3 sm:py-3.5 font-semibold rounded-2xl border transition-colors text-xs sm:text-sm',
                  isDark
                    ? 'bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-white'
                    : 'bg-white border-gray-200 hover:bg-gray-50 text-zinc-800',
                )}
              >
                <Camera size={14} className="sm:w-4 sm:h-4" /> {c.btnScan}
              </motion.button>
            </div>

            <div>
              <p className={cn('text-xs text-center mb-3', isDark ? 'text-zinc-600' : 'text-zinc-400')}>
                {c.labelContoh}
              </p>
              <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
                {DEMO_CODES.map(code => (
                  <motion.button
                    key={code}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDemoClick(code)}
                    className={cn(pillClass, batchCode === code && 'border-emerald-500 text-emerald-500')}
                  >
                    {code}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Not found */}
          <AnimatePresence>
            {notFound && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={cn(
                  'flex items-center gap-3 px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl border mb-4 sm:mb-5',
                  isDark
                    ? 'bg-red-900/20 border-red-800 text-red-400'
                    : 'bg-red-50 border-red-200 text-red-600',
                )}
              >
                <AlertCircle size={16} className="flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium">
                  {c.notFound}: <span className="font-mono">{batchCode}</span>
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                {/* Summary card — Processor & Destination REMOVED */}
                <div className={cn('rounded-3xl border overflow-hidden', cardClass)}>
                  <div className="px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-3 bg-emerald-600">
                    <div>
                      <p className="text-xs font-semibold text-emerald-100 uppercase tracking-widest mb-0.5">
                        {c.resultLabel}
                      </p>
                      <p className="text-white font-bold text-base sm:text-lg font-mono">{batchCode}</p>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full">
                      <CheckCircle size={13} className="text-white" />
                      <span className="text-white text-xs font-semibold">{c.verified}</span>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
                    {/* 4 info tiles (processor & destination removed) */}
                    <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                      {[
                        { label: c.farm, value: result.farm, icon: <Leaf size={13} /> },
                        { label: c.harvest, value: result.harvestDate, icon: <Clock size={13} /> },
                        { label: c.weight, value: result.weight, icon: <Package size={13} /> },
                        { label: c.moisture, value: result.moisture, icon: <Droplets size={13} /> },
                      ].map(({ label, value, icon }) => (
                        <div
                          key={label}
                          className={cn(
                            'rounded-2xl p-3 sm:p-3.5 border',
                            isDark ? 'bg-zinc-800/50 border-zinc-700' : 'bg-gray-50 border-gray-100',
                          )}
                        >
                          <div className={cn(
                            'flex items-center gap-1 text-xs mb-1',
                            isDark ? 'text-zinc-500' : 'text-zinc-400',
                          )}>
                            <span className="text-emerald-500">{icon}</span>
                            {label}
                          </div>
                          <p className={cn('text-xs sm:text-sm font-semibold truncate', isDark ? 'text-white' : 'text-zinc-900')}>
                            {value}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Grade + certifications */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={cn(
                        'inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold',
                        QUALITY_COLOR[result.quality] ?? QUALITY_COLOR['B'],
                      )}>
                        <Award size={11} /> Grade {result.quality}
                      </span>
                      {result.certifications.map((cert) => (
                        <span
                          key={cert}
                          className={cn(
                            'px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-medium',
                            isDark
                              ? 'bg-zinc-800 border-zinc-700 text-zinc-300'
                              : 'bg-gray-100 border-gray-200 text-zinc-600',
                          )}
                        >
                          ✓ {cert}
                        </span>
                      ))}
                    </div>

                    <FarmerProfile farmer={result.farmer} c={c} isDark={isDark} />
                  </div>
                </div>

                {/* Journey */}
                <div>
                  <p className={cn(
                    'text-xs font-semibold uppercase tracking-widest mb-3 px-1',
                    isDark ? 'text-zinc-500' : 'text-zinc-400',
                  )}>
                    {c.journey}
                  </p>
                  <div className="space-y-3">
                    {result.stages.map((stage, i) => (
                      <StageCard
                        key={i}
                        stage={stage}
                        index={i}
                        stageLabel={c.stages[i] ?? `Stage ${i + 1}`}
                        iot={result.iot}
                        c={c}
                        isDark={isDark}
                      />
                    ))}
                  </div>
                </div>

                <AgrowisataCTA result={result} c={c} isDark={isDark} />
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </section>
    </>
  );
}