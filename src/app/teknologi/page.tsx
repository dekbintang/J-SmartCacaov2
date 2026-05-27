'use client';

import { motion } from 'framer-motion';
import { useUIStore } from '@/store/useUIStore';
import { ArrowLeft, Thermometer, Wifi, Sun, ShieldCheck, Droplets, Clock, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

export default function TeknologiPage() {
  const { theme, lang } = useUIStore();
  const isDark = theme === 'dark';
  const isId = lang === 'id';

  const t = {
    title: isId ? 'Smart Dryer IoT' : 'IoT Smart Dryer',
    subtitle: isId 
      ? 'Teknologi pengeringan kakao hibrida berbasis sensor cerdas dan energi surya.'
      : 'Hybrid cacao drying technology powered by smart sensors and solar energy.',
    desc1: isId
      ? 'J-SMART CACAO menghadirkan revolusi dalam pengolahan pascapanen kakao. Smart Dryer kami menggunakan kombinasi energi surya dan pemanas cadangan presisi yang dikendalikan oleh sensor IoT (Internet of Things).'
      : 'J-SMART CACAO brings a revolution to post-harvest cacao processing. Our Smart Dryer uses a combination of solar energy and precision backup heating controlled by IoT sensors.',
    desc2: isId
      ? 'Hasilnya? Waktu pengeringan terpangkas dari 15 hari menjadi hanya 3-5 hari. Kualitas biji lebih konsisten, terbebas dari jamur, dan mencapai standar kadar air 6-7.5% sesuai SNI 2323:2008 tanpa bergantung pada cuaca.'
      : 'The result? Drying time is slashed from 15 days to just 3-5 days. Bean quality is highly consistent, mold-free, and reaches the 6-7.5% moisture standard (SNI 2323:2008) regardless of weather conditions.',
    features: [
      { icon: Thermometer, title: isId ? 'Kontrol Suhu Presisi' : 'Precision Temp Control', desc: isId ? 'Menjaga suhu stabil 45-55°C untuk profil rasa maksimal.' : 'Maintains a stable 45-55°C for maximum flavor profile.' },
      { icon: Sun, title: isId ? 'Energi Hibrida' : 'Hybrid Energy', desc: isId ? 'Panel surya 2kWp dipadu dengan pemanas biomassa/gas.' : '2kWp solar panels combined with biomass/gas heating.' },
      { icon: Wifi, title: isId ? 'Pemantauan Real-time' : 'Real-time Monitoring', desc: isId ? 'Sensor DHT22 mengirim data suhu & kelembapan ke dashboard.' : 'DHT22 sensors send temp & humidity data to the dashboard.' },
      { icon: ShieldCheck, title: isId ? 'Cloud Ledger' : 'Cloud Ledger', desc: isId ? 'Data pengeringan disimpan permanen di blockchain (tamper-proof).' : 'Drying data is permanently stored on the blockchain (tamper-proof).' },
    ],
    back: isId ? 'Kembali ke Beranda' : 'Back to Home',
    compare: isId ? 'Perbandingan Performa' : 'Performance Comparison',
    conv: isId ? 'Konvensional' : 'Conventional',
    smart: 'Smart Dryer',
    time: isId ? 'Waktu Pengeringan' : 'Drying Time',
    moisture: isId ? 'Kadar Air' : 'Moisture Content',
    weather: isId ? 'Ketergantungan Cuaca' : 'Weather Dependency',
    high: isId ? 'Tinggi' : 'High',
    zero: 'Nol (0%)',
    days15: '15-22 Hari',
    days3: '3-5 Hari',
    varies: 'Bervariasi (9-12%)',
    exact: 'Presisi (6-7.5%)',
  };

  const st = {
    bg: isDark ? 'bg-[#0a0a0a]' : 'bg-gray-50',
    card: isDark ? 'bg-[#111] border-[#222]' : 'bg-white border-gray-200',
    text: isDark ? 'text-zinc-400' : 'text-zinc-600',
    head: isDark ? 'text-white' : 'text-zinc-900',
  };

  return (
    <div className={`min-h-screen pb-24 transition-colors duration-300 ${st.bg}`}>
      {/* Hero */}
      <div className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] bg-emerald-500/10" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full blur-[100px] bg-lime-500/10" />
          <div className={`absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] ${isDark ? 'opacity-30' : 'opacity-[0.03] invert'}`} />
        </div>

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <Link href="/">
            <button className={`mb-8 flex items-center gap-2 text-sm font-medium transition-colors ${isDark ? 'text-zinc-400 hover:text-emerald-400' : 'text-zinc-500 hover:text-emerald-600'}`}>
              <ArrowLeft size={16} /> {t.back}
            </button>
          </Link>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <LayoutDashboard className="text-emerald-500" size={24} />
            </div>
            <span className="text-emerald-500 font-bold tracking-widest uppercase text-sm">Teknologi Pascapanen</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className={`text-4xl sm:text-6xl font-black tracking-tight mb-6 ${st.head}`}>
            {t.title}
          </motion.h1>
          
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className={`text-lg sm:text-2xl max-w-2xl leading-relaxed mb-8 ${st.text}`}>
            {t.subtitle}
          </motion.p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-12 relative z-10">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="space-y-6">
          <p className={`text-base leading-relaxed ${st.text}`}>{t.desc1}</p>
          <p className={`text-base leading-relaxed ${st.text}`}>{t.desc2}</p>
          
          <div className="pt-6 grid grid-cols-2 gap-4">
            {t.features.map((f, i) => (
              <div key={i} className={`p-5 rounded-2xl border ${st.card}`}>
                <f.icon className="text-emerald-500 mb-3" size={24} />
                <h3 className={`font-bold mb-2 ${st.head}`}>{f.title}</h3>
                <p className={`text-xs leading-relaxed ${st.text}`}>{f.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <div className={`p-6 rounded-3xl border overflow-hidden relative ${st.card} shadow-xl`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl" />
            
            <h3 className={`text-xl font-black mb-6 flex items-center gap-2 ${st.head}`}>
              <Clock className="text-emerald-500" /> {t.compare}
            </h3>

            <div className="space-y-4">
              {/* Row 1 */}
              <div>
                <p className={`text-xs uppercase tracking-widest font-bold mb-2 ${st.text}`}>{t.time}</p>
                <div className="flex items-center gap-4">
                  <div className={`flex-1 p-3 rounded-xl border ${isDark ? 'bg-red-950/20 border-red-900/30 text-red-400' : 'bg-red-50 border-red-100 text-red-600'} text-sm font-semibold text-center`}>
                    {t.conv}: <br/>{t.days15}
                  </div>
                  <div className={`flex-1 p-3 rounded-xl border ${isDark ? 'bg-emerald-950/40 border-emerald-900/50 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700'} text-sm font-bold text-center`}>
                    {t.smart}: <br/>{t.days3}
                  </div>
                </div>
              </div>

              {/* Row 2 */}
              <div>
                <p className={`text-xs uppercase tracking-widest font-bold mb-2 mt-4 ${st.text}`}>{t.moisture}</p>
                <div className="flex items-center gap-4">
                  <div className={`flex-1 p-3 rounded-xl border ${isDark ? 'bg-red-950/20 border-red-900/30 text-red-400' : 'bg-red-50 border-red-100 text-red-600'} text-sm font-semibold text-center`}>
                    {t.varies}
                  </div>
                  <div className={`flex-1 p-3 rounded-xl border ${isDark ? 'bg-emerald-950/40 border-emerald-900/50 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700'} text-sm font-bold text-center flex flex-col items-center justify-center gap-1`}>
                    <ShieldCheck size={14} /> {t.exact}
                  </div>
                </div>
              </div>

              {/* Row 3 */}
              <div>
                <p className={`text-xs uppercase tracking-widest font-bold mb-2 mt-4 ${st.text}`}>{t.weather}</p>
                <div className="flex items-center gap-4">
                  <div className={`flex-1 p-3 rounded-xl border ${isDark ? 'bg-red-950/20 border-red-900/30 text-red-400' : 'bg-red-50 border-red-100 text-red-600'} text-sm font-semibold text-center`}>
                    {t.high}
                  </div>
                  <div className={`flex-1 p-3 rounded-xl border ${isDark ? 'bg-emerald-950/40 border-emerald-900/50 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700'} text-sm font-bold text-center`}>
                    {t.zero}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-dashed border-gray-500/20">
              <Link href="/trace">
                <button className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors shadow-lg shadow-emerald-600/20">
                  {isId ? 'Lihat Data IoT Real-time' : 'View Real-time IoT Data'}
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
