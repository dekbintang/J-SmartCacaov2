import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Aktifkan kompresi gzip
  compress: true,

  // Hapus header X-Powered-By
  poweredByHeader: false,

  // Optimasi gambar — unoptimized jika deploy static
  images: {
    unoptimized: true,
  },

  // Minimalkan output build
  reactStrictMode: true,
};

export default nextConfig;
