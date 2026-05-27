'use client';

import { useState, useMemo, useEffect, useRef, memo, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { tourismSpots, type TourismSpot, type TourismCategory } from '@/data/dummy';
import { useUIStore } from '@/store/useUIStore';
import { Poppins } from 'next/font/google';
import {
  MapPin, Search, ChevronRight, X, Clock,
  Ticket, Waves, Mountain, Utensils, Landmark, TreePine,
  Filter, Map, Navigation, ChevronDown, Sparkles, ArrowUp
} from 'lucide-react';

const poppins = Poppins({
  weight: ['400', '500', '600', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
});

// ─── Copy / Teks (ID & EN Lengkap) ────────────────────────────────────────
const copy = {
  id: {
    title: 'Jelajahi Jembrana',
    subtitle: 'Temukan pengalaman tak terlupakan di Kabupaten Jembrana, Bali Barat',
    searchPlaceholder: 'Cari tempat wisata, desa, atau kategori...',
    filterAll: 'Semua',
    resultCount: (n: number) => `${n} destinasi ditemukan`,
    noResult: 'Tidak ada destinasi yang cocok',
    noResultSub: 'Coba ubah filter atau kata kunci pencarian Anda',
    price: 'Harga Tiket',
    free: 'Gratis',
    hours: 'Jam Buka',
    closed: 'Tutup',
    facilities: 'Fasilitas',
    tags: 'Tags',
    location: 'Lokasi',
    viewDetail: 'Detail',
    booking: 'Pesan Tiket',
    closeDetail: 'Tutup',
    featured: 'Unggulan',
    openMaps: 'Buka di Maps',
    directions: 'Petunjuk Arah',
    viewOnMap: 'Lihat di Google Maps',
    imagePlaceholder: 'Gambar Destinasi',
    heroTagline: 'Destinasi Wisata',
    scrollTop: 'Kembali ke atas',
  },
  en: {
    title: 'Explore Jembrana',
    subtitle: 'Discover unforgettable experiences in Jembrana Regency, West Bali',
    searchPlaceholder: 'Search tourist spots, villages, or categories...',
    filterAll: 'All',
    resultCount: (n: number) => `${n} destinations found`,
    noResult: 'No destinations match your search',
    noResultSub: 'Try changing the filter or search keywords',
    price: 'Ticket Price',
    free: 'Free',
    hours: 'Open Hours',
    closed: 'Closed',
    facilities: 'Facilities',
    tags: 'Tags',
    location: 'Location',
    viewDetail: 'Detail',
    booking: 'Book Now',
    closeDetail: 'Close',
    featured: 'Featured',
    openMaps: 'Open in Maps',
    directions: 'Get Directions',
    viewOnMap: 'View on Google Maps',
    imagePlaceholder: 'Destination Image',
    heroTagline: 'Tourism Destinations',
    scrollTop: 'Back to top',
  },
};

// ─── Categories ───────────────────────────────────────────────────────────
const NO_BOOKING_CATEGORIES: TourismCategory[] = ['beach', 'nature', 'religious', 'heritage'];

function shouldShowBooking(spot: TourismSpot): boolean {
  if (NO_BOOKING_CATEGORIES.includes(spot.category)) return false;
  if (spot.ticketPrice === 0) return false;
  return true;
}

// ─── Category Config ─────────────────────────────────────────────────────
const categoryCfg: Record<
  TourismCategory,
  { icon: typeof Landmark; color: string; bg: string; activeGlow: string; label: { id: string; en: string } }
> = {
  religious: { icon: Landmark, color: 'text-emerald-600', bg: 'bg-emerald-600/10', activeGlow: 'shadow-emerald-600/20', label: { id: 'Religi',     en: 'Religious'    } },
  agro:      { icon: TreePine, color: 'text-emerald-500', bg: 'bg-emerald-500/10', activeGlow: 'shadow-emerald-500/20', label: { id: 'Agrowisata', en: 'Agro Tourism' } },
  nature:    { icon: Mountain, color: 'text-green-500',   bg: 'bg-green-500/10',   activeGlow: 'shadow-green-500/20',   label: { id: 'Alam',       en: 'Nature'       } },
  beach:     { icon: Waves,    color: 'text-teal-500',    bg: 'bg-teal-500/10',    activeGlow: 'shadow-teal-500/20',    label: { id: 'Pantai',     en: 'Beach'        } },
  culinary:  { icon: Utensils, color: 'text-emerald-400', bg: 'bg-emerald-400/10', activeGlow: 'shadow-emerald-400/20', label: { id: 'Kuliner',    en: 'Culinary'     } },
  heritage:  { icon: Landmark, color: 'text-green-600',   bg: 'bg-green-600/10',   activeGlow: 'shadow-green-600/20',   label: { id: 'Warisan',    en: 'Heritage'     } },
};

// ─── Stagger animation variants ──────────────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

import { type Variants } from 'framer-motion';

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 260, damping: 24 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
};

// ─── Tourism Card (Optimized + React.memo) ────────────────────────────────
const TourismCard = memo(function TourismCard({ spot, isDark, c, onClick, currentLang }: {
  spot: TourismSpot;
  isDark: boolean;
  c: typeof copy['id'];
  onClick: () => void;
  currentLang: 'id' | 'en';
}) {
  const cat = categoryCfg[spot.category];
  const CatIcon = cat.icon;
  const catLabel = cat.label[currentLang];
  const showBooking = shouldShowBooking(spot);
  const shouldReduceMotion = useReducedMotion();

  const handleCardClick = useCallback(() => onClick(), [onClick]);
  const handleDetailClick = useCallback((e: React.MouseEvent) => { e.stopPropagation(); onClick(); }, [onClick]);
  const handleBookingClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`https://www.traveloka.com/id-id/activities/search?q=${encodeURIComponent(spot.name)}`, '_blank');
  }, [spot.name]);

  return (
    <motion.div
      variants={shouldReduceMotion ? undefined : cardVariants}
      whileHover={shouldReduceMotion ? undefined : { y: -6, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
      onClick={handleCardClick}
      className={`rounded-3xl overflow-hidden border cursor-pointer group transition-shadow duration-300 ${
        isDark
          ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-600 hover:shadow-xl hover:shadow-emerald-500/5'
          : 'bg-white border-gray-200 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-100/60'
      }`}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <img
          src={spot.imageUrl || `/api/placeholder/400/320?text=${encodeURIComponent(c.imagePlaceholder)}`}
          alt={spot.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => { e.currentTarget.src = `/api/placeholder/400/320?text=${encodeURIComponent('Image Not Found')}`; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {spot.isFeatured && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 bg-emerald-600/90 backdrop-blur text-white text-[10px] font-bold rounded-full"
          >
            <Sparkles size={10} /> {c.featured}
          </motion.div>
        )}

        <div className={`absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-[11px] font-medium ${isDark ? 'bg-black/50' : 'bg-black/40'}`}>
          <CatIcon size={11} className={cat.color} />
          <span>{catLabel}</span>
        </div>

        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1.5 bg-black/50 rounded-full text-white text-[11px] font-medium">
          <MapPin size={10} className="text-emerald-400 flex-shrink-0" />
          <span className="truncate max-w-[140px]">{spot.village}, Jembrana</span>
        </div>

      </div>

      {/* Content */}
      <div className="p-5">
        <div className="mb-2">
          <h3 className={`font-bold text-base leading-tight line-clamp-1 ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>
            {spot.name}
          </h3>
          <p className={`text-xs mt-1 truncate ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
            {spot.location}
          </p>
        </div>

        <div className={`grid grid-cols-2 gap-2 py-3 border-y mb-3 ${isDark ? 'border-zinc-800' : 'border-gray-100'}`}>
          <div className="text-center">
            <Clock size={12} className={`mx-auto mb-1 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`} />
            <p className={`font-bold text-xs ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>{spot.openHours}</p>
            <p className={`text-[10px] mt-0.5 ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>{c.hours}</p>
          </div>
          <div className="text-center">
            <Ticket size={12} className={`mx-auto mb-1 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`} />
            <p className={`font-bold text-xs ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>
              {spot.ticketPrice === 0 ? c.free : `Rp${spot.ticketPrice.toLocaleString('id-ID')}`}
            </p>
            <p className={`text-[10px] mt-0.5 ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>{c.price}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {spot.tags.slice(0, 3).map(tag => (
            <span key={tag} className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-colors ${isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-gray-100 text-zinc-600'}`}>
              {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-between gap-2 pt-3 border-t border-dashed ${isDark ? 'border-zinc-800' : 'border-gray-200'}`}>
          <motion.button
            type="button"
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDetailClick}
            className={`flex items-center gap-1 text-xs font-semibold transition-all cursor-pointer focus:outline-none rounded-lg px-1 py-0.5 ${isDark ? 'text-zinc-400 hover:text-emerald-400' : 'text-zinc-500 hover:text-emerald-600'}`}
          >
            {c.viewDetail} <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </motion.button>

          {showBooking ? (
            <div className="flex gap-2">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spot.name + ' Jembrana Bali')}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all active:scale-95 ${isDark ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700' : 'bg-gray-100 text-zinc-600 hover:bg-gray-200 border border-gray-200'}`}
              >
                <MapPin size={14} className="text-emerald-500" />
              </a>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleBookingClick}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-900/20 transition-all duration-200"
              >
                {c.booking}
              </motion.button>
            </div>
          ) : (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spot.name + ' Jembrana Bali')}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 ${isDark ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700' : 'bg-gray-100 text-zinc-600 hover:bg-gray-200 border border-gray-200'}`}
            >
              <MapPin size={12} className="text-emerald-500" /> Maps
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
});

// ─── Detail Modal ─────────────────────────────────────────────────────────
function DetailModal({ spot, isDark, c, onClose, currentLang }: {
  spot: TourismSpot;
  isDark: boolean;
  c: typeof copy['id'];
  onClose: () => void;
  currentLang: 'id' | 'en';
}) {
  const cat = categoryCfg[spot.category];
  const CatIcon = cat.icon;
  const catLabel = cat.label[currentLang];
  const showBooking = shouldShowBooking(spot);
  const shouldReduceMotion = useReducedMotion();

  const modalRef = useRef<HTMLDivElement>(null);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  const handleBooking = useCallback(() => {
    window.open(`https://www.traveloka.com/id-id/activities/search?q=${encodeURIComponent(spot.name)}`, '_blank');
  }, [spot.name]);

  const mapsQuery = encodeURIComponent(`${spot.name}, ${spot.location}, Jembrana, Bali`);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80"
      onClick={handleBackdropClick}
    >
      <motion.div
        ref={modalRef}
        initial={shouldReduceMotion ? { y: 0 } : { y: '100%' }}
        animate={{ y: 0 }}
        exit={shouldReduceMotion ? {} : { y: '100%' }}
        transition={{ type: 'tween', duration: 0.2, ease: 'easeOut' }}
        className={`w-full sm:max-w-lg max-h-[94vh] sm:max-h-[88vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl border shadow-2xl overscroll-contain ${isDark ? 'bg-zinc-900 border-zinc-800 shadow-black/50' : 'bg-white border-gray-200 shadow-xl'}`}
      >
        <div className="flex justify-center pt-3 pb-1 sm:hidden cursor-grab active:cursor-grabbing">
          <div className={`w-10 h-1 rounded-full ${isDark ? 'bg-zinc-700' : 'bg-gray-300'}`} />
        </div>

        {/* Image */}
        <div className="relative h-56 sm:h-60 flex-shrink-0 bg-zinc-100 dark:bg-zinc-800">
          <img
            src={spot.imageUrl || `/api/placeholder/800/400?text=${encodeURIComponent(c.imagePlaceholder)}`}
            alt={spot.name}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => { e.currentTarget.src = `/api/placeholder/800/400?text=${encodeURIComponent('Image Not Found')}`; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur flex items-center justify-center text-white hover:bg-black/60 transition-colors active:scale-95"
          >
            <X size={16} />
          </button>

          <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full text-white text-[11px] font-medium">
            <CatIcon size={11} className={cat.color} />
            <span>{catLabel}</span>
          </div>

          <div className="absolute bottom-5 left-5 right-5">
            <h2 className="font-black text-2xl sm:text-3xl text-white drop-shadow-md leading-tight">{spot.name}</h2>
          </div>
        </div>

        <div className="p-5 space-y-5">
          <div className="flex flex-wrap gap-2">
            {spot.isFeatured && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-700/50 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                <Sparkles size={10} /> {c.featured}
              </span>
            )}
            <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold ${isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-400' : 'bg-gray-100 border-gray-200 text-zinc-700'}`}>
              <CatIcon size={12} className={cat.color} />
              {catLabel}
            </span>

          </div>

          <p className={`text-sm leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            {spot.description}
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div className={`rounded-2xl p-4 border ${isDark ? 'bg-zinc-800/80 border-zinc-800' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center gap-1.5 mb-2">
                <Clock size={12} className={isDark ? 'text-zinc-500' : 'text-zinc-400'} />
                <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>{c.hours}</p>
              </div>
              <p className={`text-sm font-semibold ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>{spot.openHours}</p>
              {spot.closedDay !== '-' && (
                <p className="text-[11px] mt-1 text-rose-500">{c.closed}: {spot.closedDay}</p>
              )}
            </div>
            <div className={`rounded-2xl p-4 border ${isDark ? 'bg-zinc-800/80 border-zinc-800' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center gap-1.5 mb-2">
                <Ticket size={12} className={isDark ? 'text-zinc-500' : 'text-zinc-400'} />
                <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>{c.price}</p>
              </div>
              <p className={`text-sm font-semibold ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>
                {spot.ticketPrice === 0 ? (
                  <span className="text-emerald-500">{c.free}</span>
                ) : (
                  `Rp${spot.ticketPrice.toLocaleString('id-ID')}`
                )}
              </p>
            </div>
            <div className={`col-span-2 rounded-2xl p-4 border ${isDark ? 'bg-zinc-800/80 border-zinc-800' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center gap-1.5 mb-2">
                <MapPin size={12} className="text-emerald-500" />
                <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>{c.location}</p>
              </div>
              <p className={`text-sm font-semibold ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>{spot.location}</p>
            </div>
          </div>

          <div>
            <p className={`text-[11px] font-bold uppercase tracking-widest mb-3 ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>{c.facilities}</p>
            <div className="flex flex-wrap gap-2">
              {spot.facilities.map(facility => (
                <span key={facility} className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-medium ${isDark ? 'bg-zinc-800 text-zinc-100 border border-zinc-700' : 'bg-white border border-gray-200 text-zinc-700 shadow-sm'}`}>
                  {facility}
                </span>
              ))}
            </div>
          </div>

          {/* Maps Buttons */}
          <div className="space-y-2">
            <p className={`text-[11px] font-bold uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>{c.location}</p>
            <div className="grid grid-cols-2 gap-2">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-semibold transition-all active:scale-95 ${isDark ? 'bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white' : 'bg-gray-100 border border-gray-200 text-zinc-700 hover:bg-gray-200'}`}
              >
                <Map size={14} />
                <span>{c.openMaps}</span>
              </a>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${mapsQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all active:scale-95 shadow-md shadow-emerald-900/20"
              >
                <Navigation size={14} />
                <span>{c.directions}</span>
              </a>
            </div>
          </div>

          {showBooking && (
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBooking}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-900/30 transition-all text-sm"
            >
              {c.booking}
            </motion.button>
          )}

          <div className="h-2 sm:hidden" />
        </div>
      </motion.div>
    </div>
  );
}

// ─── Floating Stats ───────────────────────────────────────────────────────
function FloatingStats({ spots, isDark, currentLang }: { spots: TourismSpot[]; isDark: boolean; currentLang: 'id' | 'en' }) {
  const featured = spots.filter(s => s.isFeatured).length;
  const freeCount = spots.filter(s => s.ticketPrice === 0).length;
  const categories = new Set(spots.map(s => s.category)).size;

  const stats = [
    { value: spots.length, label: currentLang === 'id' ? 'Destinasi' : 'Destinations', icon: MapPin, color: 'text-emerald-500' },
    { value: featured, label: currentLang === 'id' ? 'Unggulan' : 'Featured', icon: Sparkles, color: 'text-emerald-400' },
    { value: freeCount, label: currentLang === 'id' ? 'Gratis' : 'Free Entry', icon: Ticket, color: 'text-teal-500' },
    { value: categories, label: currentLang === 'id' ? 'Kategori' : 'Categories', icon: TreePine, color: 'text-green-500' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + i * 0.08, type: 'spring', stiffness: 260, damping: 20 }}
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${
            isDark
              ? 'bg-zinc-900/80 border-zinc-800'
              : 'bg-white/80 border-gray-200 shadow-sm'
          }`}
        >
          <stat.icon size={18} className={stat.color} />
          <div>
            <p className={`font-black text-lg leading-none ${isDark ? 'text-white' : 'text-zinc-900'}`}>{stat.value}</p>
            <p className={`text-[10px] font-medium ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>{stat.label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────
export default function TelusurPage() {
  const { theme, lang } = useUIStore();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<TourismCategory | 'all'>('all');
  const [selectedSpot, setSelectedSpot] = useState<TourismSpot | null>(null);
  const [showFilterBar, setShowFilterBar] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.95]);
  const heroY = useTransform(scrollY, [0, 300], [0, 50]);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isDark = theme === 'dark';
  const currentLang = (lang as 'id' | 'en') || 'id';
  const c = copy[currentLang];

  const filteredSpots = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return tourismSpots.filter((spot) => {
      const matchesSearch =
        spot.name.toLowerCase().includes(q) ||
        spot.village.toLowerCase().includes(q) ||
        spot.tags.some(tag => tag.toLowerCase().includes(q));
      const matchesCategory = activeCategory === 'all' || spot.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: tourismSpots.length };
    tourismSpots.forEach(s => { counts[s.category] = (counts[s.category] || 0) + 1; });
    return counts;
  }, []);

  useEffect(() => {
    document.body.style.overflow = selectedSpot ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedSpot]);

  const handleCardClick = useCallback((spot: TourismSpot) => setSelectedSpot(spot), []);
  const handleCloseModal = useCallback(() => setSelectedSpot(null), []);

  if (!mounted) return null;

  return (
    <div className={`min-h-screen transition-colors duration-200 ${poppins.className} ${isDark ? 'bg-zinc-950' : 'bg-gray-50'}`}>

      <main className="pt-6 sm:pt-10 pb-20 px-4 w-full max-w-7xl mx-auto">
        {/* ─── Hero Section ─── */}
        <motion.div
          ref={heroRef}
          style={shouldReduceMotion ? {} : { opacity: heroOpacity, scale: heroScale, y: heroY }}
          className="mb-12 text-center relative"
        >
          {/* Decorative glow */}
          <div className="absolute inset-0 -z-10 pointer-events-none">
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full blur-[120px] ${isDark ? 'bg-emerald-500/8' : 'bg-emerald-400/10'}`} />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase mb-6 border ${
              isDark
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}
          >
            <Sparkles size={12} />
            {c.heroTagline}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
            className={`text-4xl md:text-6xl font-black mb-5 tracking-tight leading-tight ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}
          >
            {c.title.split(' ')[0]}{' '}
            <span className="text-emerald-500">{c.title.split(' ').slice(1).join(' ')}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className={`text-base md:text-lg max-w-2xl mx-auto mb-8 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}
          >
            {c.subtitle}
          </motion.p>

          <FloatingStats spots={tourismSpots} isDark={isDark} currentLang={currentLang} />
        </motion.div>

        {/* ─── Search & Filter ─── */}
        <div className="mb-10 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="relative max-w-2xl mx-auto"
          >
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`} />
            <input
              type="text"
              placeholder={c.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-12 py-4 rounded-2xl border outline-none transition-all shadow-sm text-sm sm:text-base ${isDark ? 'bg-zinc-900/80 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20' : 'bg-white border-gray-200 text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'}`}
            />
            {searchQuery && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={() => setSearchQuery('')}
                className={`absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full transition-colors ${isDark ? 'bg-zinc-700 text-zinc-400 hover:text-white' : 'bg-gray-200 text-zinc-500 hover:text-zinc-800'}`}
              >
                <X size={13} />
              </motion.button>
            )}
          </motion.div>

          {/* Mobile filter toggle */}
          <div className="flex sm:hidden justify-center">
            <button onClick={() => setShowFilterBar(v => !v)} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold border transition-all ${showFilterBar ? 'bg-emerald-600 text-white border-emerald-600' : isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-white border-gray-200 text-zinc-600 shadow-sm'}`}>
              <Filter size={13} />
              Filter
              <motion.span animate={{ rotate: showFilterBar ? 180 : 0 }}>
                <ChevronDown size={13} />
              </motion.span>
            </button>
          </div>

          {/* Category filters with count badges */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`flex-wrap items-center justify-center gap-2 ${showFilterBar ? 'flex' : 'hidden sm:flex'}`}
          >
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveCategory('all')}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${activeCategory === 'all' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30' : isDark ? 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700' : 'bg-white border border-gray-200 text-zinc-600 hover:text-zinc-900 hover:border-gray-300 shadow-sm'}`}
            >
              {c.filterAll}
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${activeCategory === 'all' ? 'bg-white/20' : isDark ? 'bg-zinc-800 text-zinc-500' : 'bg-gray-200 text-zinc-500'}`}>
                {categoryCounts.all}
              </span>
            </motion.button>

            {(Object.entries(categoryCfg) as [TourismCategory, typeof categoryCfg[TourismCategory]][]).map(([key, cfg]) => {
              const isActive = activeCategory === key;
              const count = categoryCounts[key] || 0;
              return (
                <motion.button
                  key={key}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setActiveCategory(key)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${isActive ? `bg-emerald-600 text-white shadow-lg ${cfg.activeGlow}` : isDark ? 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700' : 'bg-white border border-gray-200 text-zinc-600 hover:text-zinc-900 hover:border-gray-300 shadow-sm'}`}
                >
                  <cfg.icon size={14} className={isActive ? 'text-white' : cfg.color} />
                  {cfg.label[currentLang]}
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-white/20' : isDark ? 'bg-zinc-800 text-zinc-500' : 'bg-gray-200 text-zinc-500'}`}>
                    {count}
                  </span>
                </motion.button>
              );
            })}
          </motion.div>
        </div>

        {/* ─── Results Count ─── */}
        <motion.p
          key={filteredSpots.length}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          className={`mb-6 text-sm font-semibold text-center md:text-left ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}
        >
          {c.resultCount(filteredSpots.length)}
        </motion.p>

        {/* ─── Cards Grid ─── */}
        {filteredSpots.length > 0 ? (
          <motion.div
            variants={shouldReduceMotion ? undefined : containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredSpots.map((spot) => (
                <TourismCard
                  key={spot.id}
                  spot={spot}
                  isDark={isDark}
                  c={c}
                  currentLang={currentLang}
                  onClick={() => handleCardClick(spot)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-5 ${isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-gray-100'}`}
            >
              <Search size={32} className={isDark ? 'text-zinc-500' : 'text-zinc-400'} />
            </motion.div>
            <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>{c.noResult}</h3>
            <p className={`text-base ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>{c.noResultSub}</p>
          </motion.div>
        )}
      </main>

      {/* ─── Scroll to Top ─── */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`fixed bottom-8 right-8 z-40 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-colors ${
              isDark
                ? 'bg-zinc-800 border border-zinc-700 text-white hover:bg-zinc-700'
                : 'bg-white border border-gray-200 text-zinc-700 hover:bg-gray-50 shadow-xl'
            }`}
            title={c.scrollTop}
          >
            <ArrowUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ─── Detail Modal ─── */}
      <AnimatePresence>
        {selectedSpot && (
          <DetailModal
            spot={selectedSpot}
            isDark={isDark}
            c={c}
            currentLang={currentLang}
            onClose={handleCloseModal}
          />
        )}
      </AnimatePresence>
    </div>
  );
}