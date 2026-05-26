// src/data/dummy.ts

// ─── Farm Types ──────────────────────────────────────────────────────────────
export type Farm = {
  id: number;
  name: string;
  owner: string;
  location: string;
  village: string;
  lat: number;
  lng: number;
  qrCode: string;
  harvestDate: string;
  variety: string;
  areaHa: number;
  treeCount: number;
  qualityScore: number;
  isOrganic: boolean;
  isPremium: boolean;
  certifications: string[];
  status: 'verified' | 'pending' | 'unverified';
  batchCount: number;
  lastBatch: string;
  description: string;
  gradient: string;
};

// ─── Tourism Spot Types ───────────────────────────────────────────────
export type TourismCategory = 'religious' | 'agro' | 'nature' | 'culinary' | 'beach' | 'heritage';

export interface TourismSpot {
  id: string;
  name: string;
  category: TourismCategory;
  location: string;
  village: string;
  lat: number;
  lng: number;
  description: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  ticketPrice: number;
  openHours: string;
  closedDay: string;
  facilities: string[];
  tags: string[];
  isFeatured: boolean;
  gradient: string;
}

// ─── Farm Data ────────────────────────────────────────────────────────────
export const farms: Farm[] = [
  {
    id: 1,
    name: 'Kakao Organik Melaya',
    owner: 'I Wayan Sudarma',
    location: 'Desa Melaya, Jembrana, Bali',
    village: 'Melaya',
    lat: -8.2435, lng: 114.4756,
    qrCode: 'JEM-ORG-2026-B04',
    harvestDate: '8 Jan 2026',
    variety: 'Trinitario',
    areaHa: 3.5,
    treeCount: 980,
    qualityScore: 94,
    isOrganic: true,
    isPremium: true,
    certifications: ['Organic', 'Fairtrade', 'Rainforest Alliance'],
    status: 'verified',
    batchCount: 12,
    lastBatch: 'JEM-ORG-2026-B04',
    description: 'Kebun organik bersertifikat dengan pohon kakao Trinitario pilihan, dikelola turun-temurun selama 3 generasi.',
    gradient: 'from-emerald-800 to-teal-900',
  },
  {
    id: 2,
    name: 'Kebun Surya Semesta',
    owner: 'Ni Ketut Ariati',
    location: 'Desa Negara, Jembrana, Bali',
    village: 'Negara',
    lat: -8.3624, lng: 114.6507,
    qrCode: 'KSS-2026-02-041',
    harvestDate: '12 Feb 2026',
    variety: 'Forastero',
    areaHa: 6.2,
    treeCount: 1840,
    qualityScore: 91,
    isOrganic: false,
    isPremium: true,
    certifications: ['UTZ', 'Rainforest Alliance'],
    status: 'verified',
    batchCount: 24,
    lastBatch: 'KSS-2026-02-041',
    description: 'Salah satu kebun terbesar di Jembrana dengan manajemen modern dan sistem irigasi tetes.',
    gradient: 'from-amber-800 to-orange-900',
  },
  {
    id: 3,
    name: 'Kakao Nusantara',
    owner: 'Komang Wardana',
    location: 'Desa Gilimanuk, Jembrana, Bali',
    village: 'Gilimanuk',
    lat: -8.1750, lng: 114.4402,
    qrCode: 'KSS-2026-03-112',
    harvestDate: '5 Mar 2026',
    variety: 'Criollo',
    areaHa: 2.1,
    treeCount: 620,
    qualityScore: 88,
    isOrganic: false,
    isPremium: false,
    certifications: ['UTZ'],
    status: 'verified',
    batchCount: 8,
    lastBatch: 'KSS-2026-03-112',
    description: 'Kebun kakao Criollo langka dengan cita rasa cokelat premium yang banyak diminati pasar Eropa.',
    gradient: 'from-violet-800 to-purple-900',
  },
  {
    id: 4,
    name: 'Bali Cacao Estate',
    owner: 'I Made Suartana',
    location: 'Desa Mendoyo, Jembrana, Bali',
    village: 'Mendoyo',
    lat: -8.3750, lng: 114.7001,
    qrCode: 'BCE-2026-01-008',
    harvestDate: '20 Jan 2026',
    variety: 'Nacional',
    areaHa: 4.8,
    treeCount: 1350,
    qualityScore: 96,
    isOrganic: true,
    isPremium: true,
    certifications: ['Organic', 'UTZ', 'Fairtrade'],
    status: 'verified',
    batchCount: 18,
    lastBatch: 'BCE-2026-01-008',
    description: 'Kebun kakao Nasional terbesar di Bali dengan skor kualitas tertinggi dan ekspor rutin ke Jepang dan Swiss.',
    gradient: 'from-sky-800 to-blue-900',
  },
  {
    id: 5,
    name: 'Petani Maju Bersama',
    owner: 'Ketut Suarjana',
    location: 'Desa Pekutatan, Jembrana, Bali',
    village: 'Pekutatan',
    lat: -8.4140, lng: 114.8160,
    qrCode: 'PMB-2026-04-021',
    harvestDate: '14 Apr 2026',
    variety: 'Forastero',
    areaHa: 1.8,
    treeCount: 510,
    qualityScore: 82,
    isOrganic: false,
    isPremium: false,
    certifications: ['UTZ'],
    status: 'pending',
    batchCount: 4,
    lastBatch: 'PMB-2026-04-021',
    description: 'Kebun muda yang sedang berkembang dengan pendampingan intensif dari koperasi Jembrana.',
    gradient: 'from-rose-800 to-pink-900',
  },
  {
    id: 6,
    name: 'Agro Cacao Lestari',
    owner: 'Putu Darmawan',
    location: 'Desa Candikusuma, Jembrana, Bali',
    village: 'Candikusuma',
    lat: -8.3090, lng: 114.5200,
    qrCode: 'ACL-2026-02-015',
    harvestDate: '28 Feb 2026',
    variety: 'Trinitario',
    areaHa: 5.1,
    treeCount: 1420,
    qualityScore: 93,
    isOrganic: true,
    isPremium: true,
    certifications: ['Organic', 'Rainforest Alliance'],
    status: 'verified',
    batchCount: 20,
    lastBatch: 'ACL-2026-02-015',
    description: 'Kebun kakao agroforestri yang mengintegrasikan pohon kakao dengan pohon naungan pisang dan kelapa.',
    gradient: 'from-lime-800 to-green-900',
  },
];

// ─── Tourism Spots Data ───────────────────────────────────────────────
export const tourismSpots: TourismSpot[] = [
  // = = = WISATA RELIGI & SEJARAH = = =
  {
    id: 'tour-1',
    name: 'Pura Rambut Siwi',
    category: 'religious',
    location: 'Desa Yeh Embang Kangin, Kecamatan Mendoyo',
    village: 'Yeh Embang Kangin',
    lat: -8.4112, lng: 114.7390,
    description: 'Salah satu Pura Dang Kahyangan terbesar di Bali yang didirikan oleh Dang Hyang Nirartha. Terletak di tepi tebing pantai dengan pemandangan Samudra Hindia yang menakjubkan.',
    imageUrl: '/images/pura-rambut-siwi.jpg',
    rating: 4.8,
    reviewCount: 450,
    ticketPrice: 20000,
    openHours: '08.00 - 18.00',
    closedDay: 'Hari Raya Nyepi',
    facilities: ['Parkir Luas', 'Toilet', 'Penyewaan Kamen', 'Guide Lokal'],
    tags: ['Hindu', 'Sejarah', 'Tepi Pantai', 'Iconic'],
    isFeatured: true,
    gradient: 'from-amber-700 to-yellow-600',
  },
  {
    id: 'tour-2',
    name: 'Masjid Agung Baitul Qadim',
    category: 'religious',
    location: 'Kampung Loloan Timur, Kecamatan Jembrana',
    village: 'Loloan Timur',
    lat: -8.3715, lng: 114.6312,
    description: 'Masjid bersejarah pusat perkembangan Islam di Bali Barat. Berada di Kampung Loloan yang mempertahankan budaya Melayu-Bugis yang kental sejak abad ke-17.',
    imageUrl: '/images/masjid-agung-baitul-qodim.jpeg',
    rating: 4.6,
    reviewCount: 215,
    ticketPrice: 0,
    openHours: '04.00 - 22.00',
    closedDay: '-',
    facilities: ['Area Parkir', 'Toilet', 'Tempat Wudhu', 'Perpustakaan Mini'],
    tags: ['Islam', 'Sejarah', 'Budaya Melayu'],
    isFeatured: false,
    gradient: 'from-emerald-700 to-teal-600',
  },
  {
    id: 'tour-3',
    name: 'Pura Jagatnatha Jembrana',
    category: 'religious',
    location: 'Jalan Sudirman, Desa Dauhwaru',
    village: 'Dauhwaru',
    lat: -8.3581, lng: 114.6298,
    description: 'Pura utama di pusat kota Negara. Dikenal dengan arsitekturnya yang megah dari material batu karang hitam dan sering menjadi pusat perayaan hari besar Hindu tingkat kabupaten.',
    imageUrl: '/images/pura-jagatnatha.jpg',
    rating: 4.7,
    reviewCount: 310,
    ticketPrice: 0,
    openHours: '00.00 - 24.00',
    closedDay: '-',
    facilities: ['Parkir', 'Toilet', 'Taman Bunga', 'Area Sembahyang'],
    tags: ['Hindu', 'Pusat Ibadah', 'Arsitektur'],
    isFeatured: true,
    gradient: 'from-orange-700 to-red-600',
  },

  // = = = AGROWISATA = = =
  {
    id: 'tour-4',
    name: 'Agrowisata Kakao KTT Merta Abadi',
    category: 'agro',
    location: 'Desa EKasari, Kecamatan Melaya',
    village: 'Ekasari',
    lat: -8.2801, lng: 114.5312,
    description: 'Pusat koperasi kakao unggulan di Jembrana. Pengunjung dapat melihat langsung proses fermentasi biji kakao premium yang diekspor hingga ke Eropa.',
    imageUrl: '/images/kttmertaabadi.jpeg',
    rating: 4.8,
    reviewCount: 340,
    ticketPrice: 25000,
    openHours: '08.00 - 16.00',
    closedDay: 'Minggu',
    facilities: ['Tour Guide', 'Cacao Tasting', 'Toko Oleh-oleh', 'Parkir'],
    tags: ['Kakao', 'Organik', 'Edukasi', 'Ekspor'],
    isFeatured: true,
    gradient: 'from-stone-700 to-stone-900',
  },
  {
    id: 'tour-5',
    name: 'Perkebunan Karet Pekutatan',
    category: 'agro',
    location: 'Desa Pekutatan, Kecamatan Pekutatan',
    village: 'Pekutatan',
    lat: -8.4100, lng: 114.8100,
    description: 'Menampilkan hamparan luas perkebunan karet yang rindang dan sejuk. Pengunjung bisa belajar cara menyadap getah karet langsung dari pohonnya.',
    imageUrl: '/images/kebun-karet.jpg',
    rating: 4.3,
    reviewCount: 95,
    ticketPrice: 15000,
    openHours: '06.00 - 15.00',
    closedDay: '-',
    facilities: ['Area Pemetikan', 'Jalur Trekking', 'Parkir Luas'],
    tags: ['Perkebunan', 'Karet', 'Sejuk', 'Alam'],
    isFeatured: false,
    gradient: 'from-zinc-600 to-zinc-800',
  },
  {
    id: 'tour-6',
    name: 'Bunut Bolong',
    category: 'heritage',
    location: 'Desa Manggissari, Kecamatan Pekutatan',
    village: 'Manggissari',
    lat: -8.3350, lng: 114.8250,
    description: 'Pohon beringin raksasa suci yang memiliki lubang besar di tengahnya, cukup besar untuk dilewati kendaraan. Landmark alam yang sangat ikonik di Jembrana.',
    imageUrl: '/images/bunut-bolong.webp',
    rating: 4.7,
    reviewCount: 512,
    ticketPrice: 0,
    openHours: '00.00 - 24.00',
    closedDay: '-',
    facilities: ['Spot Foto', 'Warung Lokal', 'Area Istirahat'],
    tags: ['Ikonik', 'Pohon Suci', 'Mitos', 'Alam'],
    isFeatured: true,
    gradient: 'from-green-700 to-emerald-900',
  },

  // = = = WISATA ALAM & PANTAI = = =
  {
    id: 'tour-7',
    name: 'Pantai Medewi',
    category: 'beach',
    location: 'Desa Medewi, Kecamatan Pekutatan',
    village: 'Medewi',
    lat: -8.4210, lng: 114.7950,
    description: 'Pantai berpasir hitam berbatu yang terkenal secara global sebagai salah satu spot surfing terbaik di Bali dengan ombak panjang (point break).',
    imageUrl: '/images/pantai-medewi.jpg',
    rating: 4.6,
    reviewCount: 820,
    ticketPrice: 0,
    openHours: '06.00 - 19.00',
    closedDay: '-',
    facilities: ['Rental Surfboard', 'Toilet', 'Kafe Pinggir Pantai', 'Parkir'],
    tags: ['Surfing', 'Sunset', 'Pasir Hitam', 'Chill'],
    isFeatured: true,
    gradient: 'from-cyan-700 to-blue-800',
  },
  {
    id: 'tour-8',
    name: 'Air Terjun Juwuk Manis',
    category: 'nature',
    location: 'Desa Manggissari, Kecamatan Pekutatan',
    village: 'Manggissari',
    lat: -8.3150, lng: 114.8300,
    description: 'Air terjun kembar tersembunyi dengan air pegunungan yang sangat jernih dan segar. Diperlukan trekking ringan menyusuri kebun cengkeh dan kopi.',
    imageUrl: '/images/air-terjun-juwuk-manis.webp',
    rating: 4.8,
    reviewCount: 125,
    ticketPrice: 10000,
    openHours: '07.00 - 17.00',
    closedDay: '-',
    facilities: ['Trekking Track', 'Ruang Ganti', 'Warung Kecil', 'Parkir'],
    tags: ['Air Terjun', 'Hidden Gem', 'Adventure', 'Segar'],
    isFeatured: false,
    gradient: 'from-teal-600 to-emerald-800',
  },
  {
    id: 'tour-9',
    name: 'Taman Nasional Bali Barat (TNBB)',
    category: 'nature',
    location: 'Desa Gilimanuk, Kecamatan Melaya',
    village: 'Gilimanuk',
    lat: -8.1400, lng: 114.4350,
    description: 'Kawasan konservasi alam yang membentang luas. Merupakan habitat asli burung eksotis Jalak Bali (Leucopsar rothschildi) yang terancam punah.',
    imageUrl: '/images/taman-nasional-bali-barat.jpg',
    rating: 4.9,
    reviewCount: 612,
    ticketPrice: 40000,
    openHours: '08.00 - 17.00',
    closedDay: '-',
    facilities: ['Guide Ranger', 'Bird Watching', 'Pusat Informasi', 'Trekking'],
    tags: ['Konservasi', 'Jalak Bali', 'Hutan', 'Ekowisata'],
    isFeatured: true,
    gradient: 'from-green-800 to-lime-900',
  },

  // = = = KULINER = = =
  {
    id: 'tour-10',
    name: 'Ayam Betutu Men Tempeh',
    category: 'culinary',
    location: 'Terminal Lama, Desa Gilimanuk',
    village: 'Gilimanuk',
    lat: -8.1630, lng: 114.4370,
    description: 'Kuliner legendaris Jembrana sejak 1978. Menyajikan Ayam Betutu khas Gilimanuk dengan bumbu rempah super pedas dan gurih yang meresap sempurna.',
    imageUrl: '/images/ayam-betutu-men-tempeh.jpg',
    rating: 4.8,
    reviewCount: 1540,
    ticketPrice: 0,
    openHours: '07.00 - 21.00',
    closedDay: '-',
    facilities: ['Area Makan Luas', 'Parkir Bus/Mobil', 'Toilet', 'Pusat Oleh-oleh'],
    tags: ['Legendaris', 'Ayam Betutu', 'Pedas', 'Wajib Coba'],
    isFeatured: true,
    gradient: 'from-red-700 to-orange-800',
  },
  {
    id: 'tour-11',
    name: 'Kedai Kopi Loloan 1990',
    category: 'culinary',
    location: 'Jalan Gunung Agung, Kampung Loloan',
    village: 'Loloan',
    lat: -8.3700, lng: 114.6320,
    description: 'Kedai kopi populer di kalangan anak muda Jembrana dengan konsep bangunan vintage ala Melayu-Bali. Kopi lokal Jembrana dan roti bakar srikaya menjadi menu andalan.',
    imageUrl: '/images/kedai-kopi-loloan.jpg',
    rating: 4.5,
    reviewCount: 325,
    ticketPrice: 0,
    openHours: '15.00 - 23.30',
    closedDay: '-',
    facilities: ['Smoking Area', 'Live Acoustic', 'Free Wi-Fi', 'Parkir Motor'],
    tags: ['Tempat Nongkrong', 'Kopi Lokal', 'Vintage', 'Santai'],
    isFeatured: false,
    gradient: 'from-amber-800 to-yellow-900',
  }
];