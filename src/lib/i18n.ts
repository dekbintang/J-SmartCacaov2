export const t = {
  about: {
    id: {
      badge: 'Tentang Platform',
      title1: 'Membangun Masa Depan',
      title2: 'Kakao Jembrana',
      desc: 'J-SMART CACAO adalah platform inovatif yang mengintegrasikan Smart Traceability, Edu-Tourism, dan Digital Culture Experience untuk memberdayakan petani dan menghubungkan konsumen dengan cerita asli kakao Bali.',
      stats: [
        { number: '248',   label: 'Petani Terdaftar', suffix: '' },
        { number: '1,284', label: 'Batch Terlacak',   suffix: '' },
        { number: '3,942', label: 'Wisatawan',        suffix: '' },
        { number: '98.7',  label: 'Rata-rata Grade',  suffix: '%' },
      ],
    },
    en: {
      badge: 'About Platform',
      title1: 'Building the Future of',
      title2: 'Jembrana Cacao',
      desc: 'J-SMART CACAO is an innovative platform integrating Smart Traceability, Edu-Tourism, and Digital Culture Experience to empower farmers and connect consumers with the authentic story of Bali cacao.',
      stats: [
        { number: '248',   label: 'Registered Farmers', suffix: '' },
        { number: '1,284', label: 'Tracked Batches',    suffix: '' },
        { number: '3,942', label: 'Tourists',           suffix: '' },
        { number: '98.7',  label: 'Average Grade',      suffix: '%' },
      ],
    },
  },

  // ─── TAMBAHAN BARU ───────────────────────────────────────────────
  home: {
    id: {
      // Hero
      hero_badge:    'IoT · Keterlacakan · Edu-Tourism · Agrowisata',
      hero_h1a:      'Dari Kebun',
      hero_h1b:      'Menuju Dunia',
      hero_subtitle: 'Ekosistem digital terintegrasi yang menyatukan',
      hero_sub_iot:  'IoT Smart Dryer',
      hero_sub_mid:  ',',
      hero_sub_trace:'Keterlacakan Rantai Pasok',
      hero_sub_end:  ', dan',
      hero_sub_pkg:  'Smart Packaging',
      hero_sub_tail: 'untuk mengubah kakao Jembrana menjadi destinasi agrowisata dunia.',
      cta_explore:   'Jelajahi Agrowisata',
      cta_trace:     'Lacak Produk Anda',
      placeholder:   'Kode batch (cth: JSC-2025-001)...',
      scan_hint:     'Baru scan QR dari kemasan cokelat?',
      scroll_label:  'Gulir',

      // Stats
      stats: [
        { value: 67,   suffix: '%',    label: 'Produksi Kakao Bali',  sublabel: 'berasal dari Jembrana'     },
        { value: 3259, suffix: ' ton', label: 'Produksi per Tahun',    sublabel: 'data BPS Bali 2025'        },
        { value: 2,    suffix: ' ton', label: 'Ekspor ke Belanda',     sublabel: 'Agustus 2025'              },
        { value: 273,  suffix: 'K',    label: 'Wisatawan Jembrana',    sublabel: 'vs 4,2 juta di Badung'     },
      ],
      stats_source: 'Data Resmi · BPS Bali 2025 · Disparda 2025',

      // Problem
      problem_badge:   '⚠️ Paradoks Bali',
      problem_title1:  'Kaya Potensi,',
      problem_title2:  'Tertinggal Wisatawan',
      problem_p1:      'Kabupaten Badung mencatat',
      problem_p1b:     '4,2 juta',
      problem_p1c:     'perjalanan wisatawan, sementara Jembrana — penghasil',
      problem_p1d:     '67% kakao Bali',
      problem_p1e:     '— hanya mencatatkan',
      problem_p1f:     '273 ribu',
      problem_p1g:     'perjalanan per tahun 2025.',
      problem_p2:      'Metode pengeringan konvensional menyebabkan durasi membengkak dari',
      problem_p2b:     '5–7 hari',
      problem_p2c:     'menjadi',
      problem_p2d:     '15–22 hari',
      problem_p2e:     'saat musim hujan.',
      solution_badge:  '✅ Solusi J-SMART CACAO',
      solution_title:  'Ekosistem Terintegrasi Hulu–Hilir',
      solution_items: [
        'Smart Dryer IoT mengeliminasi ketergantungan cuaca, menjamin kadar air 7% sesuai SNI 2323:2008',
        'Cloud Ledger menyimpan data tamper-proof untuk sertifikasi Fair Trade & kepercayaan ekspor',
        'Smart Packaging mengubah cokelat artisan menjadi agen promosi destinasi wisata Jembrana',
        'Platform web mengarahkan konsumen Bali Selatan menjadi wisatawan Agrowisata Jembrana',
      ],

      // Ecosystem
      eco_badge:    'Cara Kerja',
      eco_title:    'Orkestrasi Hulu ke Hilir',
      eco_subtitle: 'Enam tahap ekosistem terintegrasi yang menghubungkan petani kakao Jembrana dengan wisatawan di seluruh Bali',
      eco_note:     'Seluruh data terkoneksi secara real-time melalui infrastruktur Cloud Ledger yang tamper-proof',
      eco_steps: [
        { title: 'Petani Panen',    desc: 'Kelompok tani kakao Jembrana memanen biji kakao premium Single-Origin'   },
        { title: 'Smart Dryer IoT', desc: 'Sensor DHT22 menjaga suhu 45–55°C, data dikirim real-time ke Cloud Ledger' },
        { title: 'Cloud Ledger',    desc: 'Data tamper-proof: suhu, kelembapan, & sertifikasi tersimpan permanen'      },
        { title: 'Smart Packaging', desc: 'QR Code unik per batch dicetak di kemasan cokelat artisan premium'         },
        { title: 'Scan QR',         desc: 'Konsumen scan QR di Bandara/Hotel Bali Selatan, membuka platform ini'      },
        { title: 'Agrowisata',      desc: 'Wisatawan tertarik berkunjung langsung ke kebun kakao di Jembrana'         },
      ],

      // Features
      feat_badge:    'Platform',
      feat_title:    'Empat Pilar J-SMART CACAO',
      feat_subtitle: 'Teknologi cerdas yang mengintegrasikan pertanian presisi, transparansi data, edukasi interaktif, dan pariwisata berkelanjutan',
      features: [
        { title: 'Keterlacakan',   en: 'Farm-to-Bar Transparency',    desc: 'Lacak perjalanan kakao dari kebun petani hingga ke kemasan cokelat di tangan Anda. Ketahui nama petani, lokasi kebun, tanggal panen, dan data kualitas pengeringan.', cta: 'Lacak Produk',    href: '/trace'     },
        { title: 'Smart Dryer IoT',en: 'Precision Drying Technology', desc: 'Kabinet pengering hibrida 200 kg dengan sensor IoT DHT22, panel surya, dan kendali suhu otomatis. Eliminasi ketergantungan pada cuaca & risiko jamur.',            cta: 'Lihat Teknologi', href: '/teknologi' },
        { title: 'Edu-Tourism',    en: 'Interactive Education',       desc: 'Digital storytelling tentang sejarah kebun, profil petani, sistem Subak Abian, dan proses fermentasi. Mengubah cokelat menjadi portal edukasi interaktif.',           cta: 'Jelajahi Budaya', href: '/budaya'    },
        { title: 'Agrowisata',     en: 'Cacao Agrotourism',           desc: 'Paket wisata pemetikan kakao, edukasi fermentasi, dan kunjungan kebun langsung di Jembrana. Navigasi Google Maps terintegrasi menuju lokasi.',                        cta: 'Pesan Wisata',    href: '/wisata'    },
      ],

      // Trace teaser
      trace_title:    'Lacak Kakao Anda',
      trace_subtitle: 'Setiap kemasan cokelat J-SMART CACAO memiliki kode batch unik. Masukkan kode atau scan QR untuk mengetahui perjalanan lengkap dari kebun ke kemasan.',
      trace_btn:      'Lacak',
      trace_examples: 'Coba contoh kode:',
      trace_full:     'Buka halaman Keterlacakan lengkap',

      // Edu-Tourism
      edu_badge:      '📖 Digital Storytelling',
      edu_title1:     'Cokelat Sebagai Portal',
      edu_title2:     'Edukasi Interaktif',
      edu_subtitle:   'Setiap scan QR membuka pintu ke cerita mendalam tentang sejarah kebun, profil petani, sistem Subak Abian, dan proses fermentasi.',
      edu_chapters:   'Bab Cerita',
      edu_cta_title:  'Jelajahi Cerita Lengkap di Halaman Budaya',
      edu_cta_desc:   'Temukan galeri foto kebun, video proses fermentasi, peta Subak Abian interaktif, dan wawancara langsung dengan petani.',
      edu_cta_btn:    'Buka Halaman Budaya',
      chapters: [
        {
          id: 'sejarah', tag: 'Bab 1', title: 'Sejarah Kebun Kakao Jembrana', visual: '🌳',
          body: 'Kakao Jembrana telah dibudidayakan sejak era kolonial Belanda pada awal abad ke-20. Kebun-kebun tua di Pekutatan dan Medewi menyimpan pohon kakao berumur lebih dari 80 tahun.',
          facts: ['Pohon kakao berusia >80 tahun', 'Varietas Trinitario & Forastero', 'Ditanam sejak era kolonial 1920-an'],
        },
        {
          id: 'petani', tag: 'Bab 2', title: 'Profil Petani & Komunitas', visual: '👨‍🌾',
          body: 'Lebih dari 2.400 kepala keluarga di Jembrana menggantungkan hidup pada budidaya kakao. Rata-rata lahan per petani hanya 0,5–2 hektar, dikelola secara turun-temurun.',
          facts: ['2.400+ keluarga petani', 'Rata-rata 0,5–2 ha per petani', 'Dikelola turun-temurun'],
        },
        {
          id: 'subak', tag: 'Bab 3', title: 'Sistem Subak Abian', visual: '🌿',
          body: 'Subak Abian adalah sistem manajemen pertanian kolektif berbasis adat Bali yang mengatur pola tanam, distribusi air, dan ritual pertanian.',
          facts: ['Sistem adat Bali tertua', 'Mengatur pola tanam kolektif', 'UNESCO Warisan Budaya Dunia 2012'],
        },
        {
          id: 'fermentasi', tag: 'Bab 4', title: 'Proses Fermentasi & Pengeringan', visual: '🌡️',
          body: 'Fermentasi adalah kunci flavour kakao premium. Biji kakao difermentasi 5–7 hari dalam kotak kayu berlapis pisang untuk mengembangkan prekursor rasa cokelat.',
          facts: ['Fermentasi 5–7 hari alami', 'Smart Dryer: 3–5 hari', 'Kadar air akhir 7% (SNI 2323:2008)'],
        },
      ],

      // Trust
      trust_badge:   '🏆 Kepercayaan & Penghargaan',
      trust_title1:  'Diakui Dunia,',
      trust_title2:  'Milik Jembrana',
      trust_subtitle:'Kualitas kakao Jembrana telah diuji, diakui, dan dipercaya oleh pasar internasional',
      trust_verify_title: 'Verifikasi Data Transparan',
      trust_verify_desc:  'Setiap klaim di platform ini didukung oleh data Cloud Ledger yang tamper-proof — dari suhu pengeringan, tanggal panen, hingga sertifikat ekspor.',
      awards: [
        { icon: '🥈', label: 'Silver Award',    title: 'Cacao of Excellence 2023',   desc: 'Pengakuan internasional untuk profil rasa kakao Single-Origin Jembrana dari Academy of Chocolate, London.',            color: 'zinc'    },
        { icon: '🌍', label: 'Ekspor Premium',  title: '2 Ton ke Belanda · 2025',    desc: 'Kakao Jembrana menembus pasar cokelat artisan Eropa melalui kemitraan dagang langsung dengan produsen Belanda.',     color: 'emerald' },
        { icon: '🏆', label: 'Kakao Terbaik Bali',title: 'Pengakuan Internasional', desc: 'Dinilai sebagai kakao dengan profil kompleksitas rasa tertinggi di antara produksi kakao lokal Bali.',               color: 'amber'   },
        { icon: '📜', label: 'Sertifikasi',     title: 'SNI 2323:2008 · Fair Trade', desc: 'Memenuhi standar nasional Indonesia dan prinsip perdagangan yang adil, membuka akses ke pasar premium global.',     color: 'cyan'    },
      ],

      // Partners
      partners_label: 'Ekosistem Kolaboratif · Pentahelix',

      // CTA
      cta_title1:   'Sudah Punya Kemasan',
      cta_title2:   'J-SMART CACAO?',
      cta_desc:     'Scan QR Code di kemasan Anda dan temukan kisah lengkap di balik cokelat premium — mulai dari nama petani, hingga undangan berkunjung ke kebunnya di Jembrana.',
      cta_btn1:     'Lacak Produk Saya',
      cta_btn2:     'Rencanakan Wisata',
      cta_footer:   'J-SMART CACAO · Universitas Udayana · Jembrana, Bali 2026',
    },

    en: {
      // Hero
      hero_badge:    'IoT · Traceability · Edu-Tourism · Agrotourism',
      hero_h1a:      'From the Farms of',
      hero_h1b:      'To the World',
      hero_subtitle: 'An integrated digital ecosystem combining',
      hero_sub_iot:  'IoT Smart Dryer',
      hero_sub_mid:  ',',
      hero_sub_trace:'Supply Chain Traceability',
      hero_sub_end:  ', and',
      hero_sub_pkg:  'Smart Packaging',
      hero_sub_tail: 'to transform Jembrana cacao into a world-class agrotourism destination.',
      cta_explore:   'Explore Agrotourism',
      cta_trace:     'Trace Your Product',
      placeholder:   'Batch code (e.g. JSC-2025-001)...',
      scan_hint:     'Just scanned a QR from a chocolate package?',
      scroll_label:  'Scroll',

      // Stats
      stats: [
        { value: 67,   suffix: '%',    label: 'Bali Cacao Output',       sublabel: 'sourced from Jembrana'   },
        { value: 3259, suffix: ' ton', label: 'Annual Production',        sublabel: 'BPS Bali data 2025'      },
        { value: 2,    suffix: ' ton', label: 'Export to Netherlands',    sublabel: 'August 2025'             },
        { value: 273,  suffix: 'K',    label: 'Jembrana Visitors',        sublabel: 'vs 4.2M in Badung'       },
      ],
      stats_source: 'Official Data · BPS Bali 2025 · Disparda 2025',

      // Problem
      problem_badge:   '⚠️ The Bali Paradox',
      problem_title1:  'Rich in Potential,',
      problem_title2:  'Left Behind by Tourism',
      problem_p1:      'Badung Regency recorded',
      problem_p1b:     '4.2 million',
      problem_p1c:     'tourist trips, while Jembrana — producing',
      problem_p1d:     '67% of Bali\'s cacao',
      problem_p1e:     '— recorded only',
      problem_p1f:     '273 thousand',
      problem_p1g:     'trips in 2025.',
      problem_p2:      'Conventional drying methods cause duration to balloon from',
      problem_p2b:     '5–7 days',
      problem_p2c:     'to',
      problem_p2d:     '15–22 days',
      problem_p2e:     'during the rainy season.',
      solution_badge:  '✅ J-SMART CACAO Solution',
      solution_title:  'Integrated Upstream–Downstream Ecosystem',
      solution_items: [
        'IoT Smart Dryer eliminates weather dependency, guaranteeing 7% moisture per SNI 2323:2008',
        'Cloud Ledger stores tamper-proof data for Fair Trade certification and export credibility',
        'Smart Packaging turns artisan chocolate into a promotional agent for Jembrana tourism',
        'The web platform converts South Bali consumers into Jembrana Agrotourism visitors',
      ],

      // Ecosystem
      eco_badge:    'How It Works',
      eco_title:    'Upstream to Downstream Orchestration',
      eco_subtitle: 'Six integrated ecosystem stages connecting Jembrana cacao farmers with tourists across Bali',
      eco_note:     'All data is connected in real-time via tamper-proof Cloud Ledger infrastructure',
      eco_steps: [
        { title: 'Farmer Harvest',  desc: 'Jembrana cacao farmer groups harvest premium Single-Origin cacao beans'  },
        { title: 'IoT Smart Dryer', desc: 'DHT22 sensors maintain 45–55°C; data sent real-time to Cloud Ledger'     },
        { title: 'Cloud Ledger',    desc: 'Tamper-proof data: temperature, humidity & certification stored forever'  },
        { title: 'Smart Packaging', desc: 'Unique QR Code per batch printed on premium artisan chocolate packaging' },
        { title: 'Scan QR',         desc: 'Consumers scan QR at Bali airports/hotels, opening this platform'        },
        { title: 'Agrotourism',     desc: 'Tourists are inspired to visit cacao farms directly in Jembrana'         },
      ],

      // Features
      feat_badge:    'Platform',
      feat_title:    'Four Pillars of J-SMART CACAO',
      feat_subtitle: 'Smart technology integrating precision farming, data transparency, interactive education, and sustainable tourism',
      features: [
        { title: 'Traceability',   en: 'Farm-to-Bar Transparency',    desc: 'Track cacao\'s journey from the farmer\'s plot to the chocolate in your hands. Know the farmer\'s name, farm location, harvest date, and drying quality data.', cta: 'Trace Product',   href: '/trace'     },
        { title: 'IoT Smart Dryer',en: 'Precision Drying Technology', desc: '200 kg hybrid drying cabinet with IoT DHT22 sensor, solar panels, and automated temperature control. Eliminates weather dependency and mold risk.',          cta: 'View Technology', href: '/teknologi' },
        { title: 'Edu-Tourism',    en: 'Interactive Education',       desc: 'Digital storytelling on plantation history, farmer profiles, the Subak Abian system, and the fermentation process — turning chocolate into an interactive education portal.', cta: 'Explore Culture', href: '/budaya'    },
        { title: 'Agrotourism',    en: 'Cacao Agrotourism',           desc: 'Cacao picking packages, fermentation education, and direct farm visits in Jembrana. Integrated Google Maps navigation to the location.',                        cta: 'Book a Tour',     href: '/wisata'    },
      ],

      // Trace teaser
      trace_title:    'Trace Your Cacao',
      trace_subtitle: 'Every J-SMART CACAO chocolate package has a unique batch code. Enter the code or scan the QR to discover the full journey from farm to package.',
      trace_btn:      'Trace',
      trace_examples: 'Try example codes:',
      trace_full:     'Open full Traceability page',

      // Edu-Tourism
      edu_badge:      '📖 Digital Storytelling',
      edu_title1:     'Chocolate as an',
      edu_title2:     'Interactive Education Portal',
      edu_subtitle:   'Every QR scan opens a deep story about plantation history, farmer profiles, the Subak Abian system, and the fermentation process.',
      edu_chapters:   'Story Chapters',
      edu_cta_title:  'Explore the Full Story on the Culture Page',
      edu_cta_desc:   'Discover farm photo galleries, fermentation process videos, an interactive Subak Abian map, and direct farmer interviews.',
      edu_cta_btn:    'Open Culture Page',
      chapters: [
        {
          id: 'history', tag: 'Chapter 1', title: 'History of Jembrana Cacao Plantations', visual: '🌳',
          body: 'Jembrana cacao has been cultivated since the Dutch colonial era in the early 20th century. Old plantations in Pekutatan and Medewi hold cacao trees over 80 years old.',
          facts: ['Cacao trees over 80 years old', 'Trinitario & Forastero varieties', 'Planted since the 1920s colonial era'],
        },
        {
          id: 'farmers', tag: 'Chapter 2', title: 'Farmer & Community Profiles', visual: '👨‍🌾',
          body: 'More than 2,400 households in Jembrana depend on cacao farming. Average land per farmer is only 0.5–2 hectares, managed across generations.',
          facts: ['2,400+ farming families', 'Average 0.5–2 ha per farmer', 'Managed across generations'],
        },
        {
          id: 'subak', tag: 'Chapter 3', title: 'The Subak Abian System', visual: '🌿',
          body: 'Subak Abian is a collective farm management system rooted in Balinese custom, regulating planting patterns, water distribution, and farming rituals.',
          facts: ['Oldest Balinese customary system', 'Governs collective planting patterns', 'UNESCO World Cultural Heritage 2012'],
        },
        {
          id: 'fermentation', tag: 'Chapter 4', title: 'Fermentation & Drying Process', visual: '🌡️',
          body: 'Fermentation is the key to premium cacao flavour. Cacao beans ferment for 5–7 days in banana-lined wooden boxes to develop chocolate flavour precursors.',
          facts: ['5–7 days natural fermentation', 'Smart Dryer: 3–5 days', 'Final moisture 7% (SNI 2323:2008)'],
        },
      ],

      // Trust
      trust_badge:   '🏆 Trust & Awards',
      trust_title1:  'Recognized Globally,',
      trust_title2:  'Owned by Jembrana',
      trust_subtitle:'The quality of Jembrana cacao has been tested, recognized, and trusted by international markets',
      trust_verify_title: 'Transparent Data Verification',
      trust_verify_desc:  'Every claim on this platform is backed by tamper-proof Cloud Ledger data — from drying temperature and harvest date to export certificates.',
      awards: [
        { icon: '🥈', label: 'Silver Award',    title: 'Cacao of Excellence 2023',   desc: 'International recognition for the Single-Origin Jembrana cacao flavour profile from the Academy of Chocolate, London.', color: 'zinc'    },
        { icon: '🌍', label: 'Premium Export',  title: '2 Tons to Netherlands · 2025',desc: 'Jembrana cacao broke into the European artisan chocolate market through a direct trade partnership with Dutch producers.', color: 'emerald' },
        { icon: '🏆', label: 'Best Bali Cacao', title: 'International Recognition',  desc: 'Rated as the cacao with the highest flavour complexity profile among Bali\'s local cacao production by an international judging panel.', color: 'amber'   },
        { icon: '📜', label: 'Certification',   title: 'SNI 2323:2008 · Fair Trade', desc: 'Meets Indonesian national standards and fair trade principles, opening access to premium global markets.', color: 'cyan'    },
      ],

      // Partners
      partners_label: 'Collaborative Ecosystem · Pentahelix',

      // CTA
      cta_title1:   'Already Have a',
      cta_title2:   'J-SMART CACAO Package?',
      cta_desc:     'Scan the QR Code on your package and discover the full story behind the premium chocolate in your hand — from the farmer\'s name to an invitation to visit their farm in Jembrana.',
      cta_btn1:     'Trace My Product',
      cta_btn2:     'Plan a Visit',
      cta_footer:   'J-SMART CACAO · Universitas Udayana · Jembrana, Bali 2026',
    },
  },
} as const;