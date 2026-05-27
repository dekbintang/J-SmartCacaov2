'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Playfair_Display, DM_Sans } from 'next/font/google';
import { useUIStore } from '@/store/useUIStore';
import { t } from '@/lib/i18n';
import { Leaf, Map, Users, Quote, Info, PlayCircle, Image as ImageIcon, Video } from 'lucide-react';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700', '900'] });
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'] });

const YOUTUBE_FERMENTATION_ID = 'KdsIDWumrho';

const subakPhotos = [
  { src: '/images/sejarah-kebun.png', alt: 'Pemandangan Kebun Kakao' },
  { src: '/images/sistem-perairan.jpg', alt: 'Sistem Pengairan (Subak)' },
  { src: '/images/petani-merawat-pohon.jpg', alt: 'Aktivitas Merawat Pohon' },
  { src: '/images/panen-bersama.jpg', alt: 'Momen Panen Bersama' },
];

const galleryPhotos = [
  { src: '/images/biji-nibs.jpg', alt: 'Biji Kakao Fermentasi / Nibs' },
  { src: '/images/buah.jpg', alt: 'Buah Kakao Segar' },
  { src: '/images/kunjungan.jpg', alt: 'Aktivitas Kunjungan Turis' },
  { src: '/images/aktivitas-panen.jpg', alt: 'Proses Pemilahan / Panen' },
  { src: '/images/3-buah.jpg', alt: '3 Buah Kakao' },
  { src: '/images/petani.jpg', alt: 'Portrait Wajah Petani' }
];

export default function EdukasiPage() {
  const { theme, lang } = useUIStore();
  const [activeVideoTime, setActiveVideoTime] = useState(205);
  
  const isDark = theme === 'dark';
  const currentLang = (lang as 'id' | 'en') || 'id';
  const copy = t.edukasi[currentLang];

  return (
    <div className={`min-h-screen pt-28 pb-20 ${dmSans.className} ${isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-gray-50 text-zinc-900'} overflow-x-hidden`}>
      
      {/* ─── Compact Hero ─── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 mb-8 sm:mb-16 text-center">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-5 sm:mb-6">
          <Leaf size={14} /> {copy.hero_badge}
        </motion.div>
        
        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 leading-tight ${playfair.className}`}>
          {copy.hero_title1} <span className="text-emerald-600 dark:text-emerald-400">{copy.hero_title2}</span>
        </motion.h1>
        
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className={`text-sm sm:text-base md:text-lg max-w-2xl mx-auto ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
          {copy.hero_desc}
        </motion.p>
      </section>

      {/* ─── Fermentation Section ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-20 sm:mb-24 mt-4 sm:mt-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="order-1 relative aspect-video w-full rounded-[2rem] overflow-hidden bg-black shadow-lg border border-zinc-200 dark:border-zinc-800">
            <iframe 
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${YOUTUBE_FERMENTATION_ID}?start=355&end=369&rel=0`} 
              title="Fermentation Video"
              allowFullScreen
            ></iframe>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="order-2 flex flex-col justify-center text-center lg:text-left items-center lg:items-start">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-5 sm:mb-6">
              <PlayCircle size={24} />
            </div>
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${playfair.className}`}>{copy.fermentation_title}</h2>
            <p className={`text-base sm:text-lg leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              {copy.fermentation_desc}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── Subak Abian Section (With Real Photos) ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-20 sm:mb-24">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="flex flex-col justify-center text-center lg:text-left items-center lg:items-start">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-5 sm:mb-6">
              <Map size={24} />
            </div>
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${playfair.className}`}>{copy.subak_title}</h2>
            <p className={`text-base sm:text-lg leading-relaxed mb-6 sm:mb-8 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              {copy.subak_desc}
            </p>
            
            {/* Embedded Map */}
            <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126307.72659020499!2d114.54226162383868!3d-8.312948970341355!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd17a56113b2de1%3A0x3030bfbcaf7cf20!2sKabupaten%20Jembrana%2C%20Bali!5e1!3m2!1sid!2sid!4v1716812838421!5m2!1sid!2sid"
                className="absolute inset-0 w-full h-full border-0 filter grayscale hover:grayscale-0 transition-all duration-500"
                allowFullScreen={true}
                loading="lazy"
              ></iframe>
            </div>
          </motion.div>

          {/* Dynamic Staggered Slots */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="grid grid-cols-2 gap-3 sm:gap-6">
            {/* Left Column (Staggered Down) */}
            <div className="flex flex-col gap-3 sm:gap-6 mt-6 sm:mt-12">
              {subakPhotos.slice(0, 2).map((photo, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ scale: 1.03, rotate: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full aspect-[4/5] rounded-[2rem] shadow-sm flex flex-col items-center justify-center gap-3 text-center cursor-pointer relative overflow-hidden group"
                >
                  <Image src={photo.src} alt={photo.alt} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="(max-width: 640px) 50vw, 25vw" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </motion.div>
              ))}
            </div>
            {/* Right Column (Staggered Up) */}
            <div className="flex flex-col gap-3 sm:gap-6 mb-6 sm:mb-12">
              {subakPhotos.slice(2, 4).map((photo, idx) => (
                <motion.div 
                  key={idx + 2}
                  whileHover={{ scale: 1.03, rotate: 2 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full aspect-[4/5] rounded-[2rem] shadow-sm flex flex-col items-center justify-center gap-3 text-center cursor-pointer relative overflow-hidden group"
                >
                  <Image src={photo.src} alt={photo.alt} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="(max-width: 640px) 50vw, 25vw" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </motion.div>
              ))}
            </div>
          </motion.div>
          
        </div>
      </section>

      {/* ─── Interviews Section (Spacious Redesign) ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-24 mt-16">
        <div className="flex flex-col items-center text-center mb-10 sm:mb-14">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-6">
            <Users size={24} />
          </div>
          <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${playfair.className}`}>{copy.farmers_title}</h2>
          <p className={`text-base sm:text-lg max-w-2xl ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            {copy.farmers_desc}
          </p>
        </div>

        {/* Large Cinematic Video Block */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="max-w-4xl mx-auto mb-16">
          <div className="relative aspect-video w-full rounded-3xl overflow-hidden bg-black shadow-2xl border border-zinc-200 dark:border-zinc-800">
            <iframe 
              key={activeVideoTime} // Force reload when time changes
              className="absolute inset-0 w-full h-full transition-opacity duration-500"
              src={`https://www.youtube.com/embed/l3dKczQUNUA?start=${activeVideoTime}&autoplay=${activeVideoTime !== 205 ? 1 : 0}&rel=0`} 
              title="Wawancara Petani"
              allowFullScreen
            ></iframe>
          </div>
        </motion.div>

        {/* Elegant Centered Grid for 5 Quotes */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} 
          className="flex overflow-x-auto sm:flex-wrap sm:justify-center gap-4 sm:gap-6 pb-6 sm:pb-0 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {copy.farmers_quotes.map((farmer: any, idx) => (
            <motion.div 
              key={idx} 
              onClick={() => {
                setActiveVideoTime(farmer.time || 205);
                // Smooth scroll up to video
                window.scrollTo({ top: window.scrollY - 300, behavior: 'smooth' });
              }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`cursor-pointer group relative w-[85vw] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] flex-shrink-0 snap-center flex flex-col p-6 sm:p-8 rounded-3xl border transition-all duration-300 shadow-sm ${
                activeVideoTime === farmer.time 
                  ? 'border-emerald-500 shadow-emerald-500/10 ring-2 ring-emerald-500/20 ' + (isDark ? 'bg-zinc-900' : 'bg-white')
                  : isDark ? 'bg-zinc-900 border-zinc-800 hover:border-emerald-500/50' : 'bg-white border-zinc-200 hover:border-emerald-500/50'
              }`}
            >
              {/* Play Overlay Icon on Hover */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-emerald-500 text-white rounded-full p-2 shadow-lg">
                  <PlayCircle size={20} />
                </div>
              </div>

              <Quote className={`w-8 h-8 mb-5 ${activeVideoTime === farmer.time ? 'text-emerald-500' : 'text-emerald-500/30'}`} />
              <p className={`text-sm sm:text-base italic mb-8 leading-relaxed flex-grow ${isDark ? 'text-zinc-300' : 'text-zinc-700'} ${activeVideoTime === farmer.time ? 'font-medium' : ''}`}>
                "{farmer.quote}"
              </p>
              <div className="flex items-center gap-4 mt-auto">
                {/* Empty Avatar Slot */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${activeVideoTime === farmer.time ? 'bg-emerald-500 text-white' : isDark ? 'bg-zinc-800 text-zinc-500' : 'bg-zinc-100 text-zinc-400'}`}>
                  <ImageIcon size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base">{farmer.name}</h4>
                  <p className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-medium">{farmer.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ─── Compact Gallery (With Placeholder Slots) ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className={`p-5 sm:p-8 rounded-3xl border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'} shadow-sm`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 sm:mb-6">
            <div>
              <h2 className={`text-xl sm:text-2xl font-bold ${playfair.className}`}>{copy.gallery_title}</h2>
              <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>{copy.gallery_desc}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {galleryPhotos.map((photo, idx) => {
              // Create dynamic bento pattern: 4 columns wide on desktop, 2 columns wide on mobile.
              let spanClass = "col-span-1 aspect-square sm:aspect-auto sm:min-h-[220px]";
              
              if (idx === 0) spanClass = "col-span-2 sm:col-span-2 aspect-[2/1] sm:aspect-auto sm:min-h-[220px]";
              else if (idx === 4) spanClass = "col-span-1 sm:col-span-2 aspect-square sm:aspect-auto sm:min-h-[220px]";
              else if (idx === 5) spanClass = "col-span-2 sm:col-span-1 aspect-[2/1] sm:aspect-auto sm:min-h-[220px]";
              
              return (
              <motion.div 
                key={idx} 
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className={`relative rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-colors shadow-sm overflow-hidden group ${spanClass} ${isDark ? 'bg-zinc-800/60' : 'bg-zinc-100'}`}
              >
                <Image src={photo.src} alt={photo.alt} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="(max-width: 640px) 100vw, 50vw" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </motion.div>
            )})}
          </div>
        </motion.div>
      </section>
      
    </div>
  );
}
