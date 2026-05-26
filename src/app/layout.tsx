import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import PageTransition from "@/components/layout/PageTransition";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ClientWrapper } from "@/components/layout/ClientWrapper";

// 1. Inisialisasi Font Poppins
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins", // <-- Nama variabel ini terhubung dengan globals.css
  display: "swap",
});

export const metadata: Metadata = {
  title: "J-SMART CACAO | Smart Traceability Kakao Jembrana",
  description: "Platform Traceability, Edu-Tourism, dan Digital Culture Experience Kakao Jembrana",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 2. Tambahkan poppins.variable di tag html
    <html lang="id" className={`${poppins.variable} dark`}>
      {/* 3. Tambahkan class font-sans di tag body */}
      <body className="font-sans antialiased bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white overflow-x-hidden">
        <ClientWrapper>
          <PageTransition>
            <Navbar />
            <div className="pt-24">{children}</div>
            <Footer />
          </PageTransition>
        </ClientWrapper>
      </body>
    </html>
  );
}