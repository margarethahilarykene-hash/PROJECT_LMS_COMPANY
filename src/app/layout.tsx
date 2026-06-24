import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Menghubungkan CSS utama Tailwind

const inter = Inter({ subsets: ["latin"] });

// 🛠️ KUSTOMISASI LINK PREVIEW (SEO & OPEN GRAPH) UNTUK SEMUA SOSIAL MEDIA
export const metadata: Metadata = {
  // 1. Tampilan Utama di Google Search & Tab Browser Karyawan
  title: "LMS Company - Professional Employee Training Hub",
  description: "Tingkatkan kompetensi profesional Anda. Akses modul pelatihan interaktif, pantau progress belajar secara real-time, dan raih sertifikat resmi kelulusan.",

  // 2. Tampilan Saat Link Dibagikan ke SELURUH SOSMED & CHAT APP (WhatsApp, Telegram, LinkedIn, FB, dll)
  openGraph: {
    title: "LMS Company - Professional Employee Training Hub",
    description: "Tingkatkan kompetensi profesional Anda. Akses modul pelatihan interaktif, pantau progress belajar secara real-time, dan raih sertifikat resmi kelulusan.",
    url: "https://project-lms-company.vercel.app",
    siteName: "LMS Company Platform",
    images: [
      {
        url: "https://project-lms-company.vercel.app/og-cover.png", // Gambar banner cover penunjang pratinjau link LMS
        width: 1200,
        height: 630,
        alt: "LMS Company Learning Hub",
      },
    ],
    locale: "id_ID",
    type: "website",
  },

  // 3. Tampilan khusus untuk Platform Twitter / X Card
  twitter: {
    card: "summary_large_image",
    title: "LMS Company - Professional Employee Training Hub",
    description: "Tingkatkan kompetensi profesional Anda. Akses modul pelatihan interaktif, pantau progress belajar secara real-time, dan raih sertifikat resmi kelulusan.",
    images: ["https://project-lms-company.vercel.app/og-cover.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className} suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}