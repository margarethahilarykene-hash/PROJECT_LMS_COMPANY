'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

declare global {
  interface Window {
    html2pdf?: any;
    jspdf?: any;
    jsPDF?: any;
  }
}

export default function CertificatesPage() {
  const router = useRouter();
  const [userName, setUserName] = useState('Employee');
  const [courseTitle, setCourseTitle] = useState('Generative AI & Tech Productivity');
  const [isReady, setIsReady] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      const { data, error } = await supabase.auth.getUser();
      const user = data?.user;

      if (error || !user) {
        router.push('/login');
        return;
      }

      const fullName = user.user_metadata?.full_name?.toString().trim();
      const fallbackName =
        user.email === 'margarethahilarykene@gmail.com'
          ? 'Margaretha Hilary Kene'
          : user.email?.split('@')[0] || 'Employee';

      setUserName(fullName || fallbackName);

      if (typeof window !== 'undefined') {
        const storedTitle = localStorage.getItem('enrolledCourseTitle');
        setCourseTitle(storedTitle?.trim() || 'Generative AI & Tech Productivity');
      }

      setIsReady(true);
    };

    initialize();
  }, [router]);

  const loadScript = (url: string, id: string, checkGlobal: () => boolean): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('Window is not available'));
        return;
      }

      if (checkGlobal()) {
        resolve();
        return;
      }

      const existingScript = document.getElementById(id) as HTMLScriptElement;
      if (existingScript) {
        if (existingScript.dataset.loaded === 'true') {
          resolve();
        } else {
          existingScript.addEventListener('load', () => resolve());
          existingScript.addEventListener('error', () => reject(new Error(`Failed to load ${id}`)));
        }
        return;
      }

      const script = document.createElement('script');
      script.src = url;
      script.id = id;
      script.async = true;
      script.onload = () => {
        script.dataset.loaded = 'true';
        resolve();
      };
      script.onerror = () => reject(new Error(`Failed to load ${id}`));
      document.body.appendChild(script);
    });
  };

  const loadHtml2PdfScript = async (): Promise<void> => {
    if (typeof window === 'undefined') {
      throw new Error('Window is not available');
    }

    if (window.html2pdf) {
      return;
    }

    // 1. Muat jsPDF
    await loadScript(
      'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
      'jspdf-cdn',
      () => !!(window.jspdf || window.jsPDF)
    );

    // Daftarkan jsPDF ke window global
    if (window.jspdf && !window.jsPDF) {
      window.jsPDF = window.jspdf.jsPDF;
    }

    // 2. Muat html2canvas-pro (Mendukung format oklch/lab)
    await loadScript(
      'https://cdn.jsdelivr.net/npm/html2canvas-pro@1.5.8/dist/html2canvas-pro.min.js',
      'html2canvas-pro-cdn',
      () => !!(window as any).html2canvas
    );

    // 3. Muat unbundled html2pdf
    await loadScript(
      'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.min.js',
      'html2pdf-cdn',
      () => !!window.html2pdf
    );
  };

  const handleDownloadPDF = async () => {
    if (typeof window === 'undefined') {
      return;
    }

    localStorage.setItem('training_completed', 'true');
    setIsDownloading(true);

    try {
      await loadHtml2PdfScript();

      const element = document.getElementById('certificate-card');
      if (!element || !window.html2pdf) {
        throw new Error('Certificate element or html2pdf library is not available');
      }

      const fileName = `Sertifikat_${userName.replace(/[^a-zA-Z0-9-_\s]/g, '').replace(/\s+/g, '_')}.pdf`;

      await window.html2pdf()
        .set({
          margin: 0,
          filename: fileName,
          image: { type: 'jpeg', quality: 1 },
          html2canvas: {
            scale: 3,
            useCORS: true,
            letterRendering: true,
            ignoreElements: (el: any) => el.classList?.contains('no-print'),
          },
          jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'landscape',
          },
        })
        .from(element)
        .save();
    } catch (error) {
      console.error('Download PDF failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleGoBack = () => {
    router.push('/dashboard');
  };

  if (!isReady) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6 py-10 text-slate-100">
        <div className="rounded-3xl border border-slate-700 bg-slate-900/90 p-8 text-center shadow-2xl shadow-slate-950/40">
          <p className="text-lg font-medium text-slate-200">Loading certificate details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1220] px-6 py-10 text-slate-100">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,400;1,700&display=swap');

        .certificate-card {
          background: #ffffff;
          position: relative;
        }

        .certificate-card::before {
          content: '';
          position: absolute;
          inset: 16px;
          border: 1.5px solid #d4af37;
          border-radius: 4px;
          pointer-events: none;
          z-index: 1;
        }

        .certificate-card::after {
          content: '';
          position: absolute;
          inset: 21px;
          border: 0.75px solid #d4af37;
          border-radius: 2px;
          pointer-events: none;
          z-index: 1;
        }

        .watermark {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.05;
          pointer-events: none;
          z-index: 0;
        }

        .corner-deco {
          position: absolute;
          width: 32px;
          height: 32px;
          border: 3px solid #102a54;
          z-index: 2;
          pointer-events: none;
        }

        .corner-deco.top-left {
          top: 16px;
          left: 16px;
          border-right: none;
          border-bottom: none;
        }

        .corner-deco.top-right {
          top: 16px;
          right: 16px;
          border-left: none;
          border-bottom: none;
        }

        .corner-deco.bottom-left {
          bottom: 16px;
          left: 16px;
          border-right: none;
          border-top: none;
        }

        .corner-deco.bottom-right {
          bottom: 16px;
          right: 16px;
          border-left: none;
          border-top: none;
        }

        .certificate-content {
          position: relative;
          z-index: 3;
        }

        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: #ffffff !important;
          }
          .certificate-card {
            box-shadow: none !important;
            border: none !important;
          }
          @page {
            size: A4 landscape;
            margin: 0;
          }
        }
      `}</style>

      <div className="mx-auto max-w-6xl">
        {/* Top bar with back navigation and download button */}
        <div className="mb-6 flex flex-col gap-4 no-print sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 text-sm font-medium text-slate-300">
            <button onClick={handleGoBack} className="text-slate-100 transition hover:text-white">
              Dashboard
            </button>
            <span className="text-slate-500">&gt;</span>
            <span>My Certificate</span>
          </div>
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0f766e] px-5 py-3 text-sm font-semibold text-white shadow-xl shadow-slate-900/20 transition hover:bg-[#115e56] disabled:cursor-not-allowed disabled:opacity-70 animate-[pulse_3s_infinite]"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M12 3v10m0 0l-3-3m3 3l3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M5 17.5V19a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {isDownloading ? (
              <>
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Sedang Mengunduh...
              </>
            ) : (
              'Download Certificate'
            )}
          </button>
        </div>

        {/* Certificate Outer Container */}
        <div className="overflow-hidden rounded-2xl p-6 shadow-2xl">
          <div
            id="certificate-card"
            className="relative mx-auto aspect-[1.414/1] max-w-4xl certificate-card overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
          >
            {/* Vertikal merah tebal memotong dinamis */}
            <div className="absolute left-0 top-0 bottom-0 w-4 bg-[#dc2626] z-10" />

            {/* Watermark Tengah: Logo perisai/bintang emas transparan */}
            <div className="watermark">
              <svg viewBox="0 0 200 200" className="h-[450px] w-[450px] text-[#d4af37]" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 20 L160 45 V110 C160 160 100 190 100 190 C100 190 40 160 40 110 V45 Z" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
                <circle cx="100" cy="105" r="45" stroke="currentColor" strokeWidth="1" opacity="0.2" />
                <path d="M100 70 L111 92 H135 L116 106 L123 128 L100 115 L77 128 L84 106 L65 92 H89 Z" fill="currentColor" opacity="0.15" />
                <circle cx="100" cy="105" r="55" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.2" />
              </svg>
            </div>

            {/* Ornamen Sudut Biru Navy */}
            <div className="corner-deco top-left" />
            <div className="corner-deco top-right" />
            <div className="corner-deco bottom-left" />
            <div className="corner-deco bottom-right" />

            {/* Certificate Content */}
            <div className="certificate-content flex h-full flex-col justify-between px-16 py-14">

              {/* Header: Seal & Badge */}
              <div className="flex items-start justify-between w-full">
                {/* Left: Official Seal */}
                <div className="flex items-center gap-4">
                  <div className="relative flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-[#102a54] text-[#d4af37] shadow-md border-2 border-[#d4af37]">
                    <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full animate-[spin_60s_linear_infinite]" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="50" cy="50" r="45" stroke="#d4af37" strokeWidth="1" strokeDasharray="3 3" />
                      <circle cx="50" cy="50" r="41" stroke="#d4af37" strokeWidth="0.5" />
                    </svg>
                    <svg viewBox="0 0 24 24" className="h-8 w-8 relative z-10" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM12 7l1.5 3.5h3.5l-2.8 2.2 1.1 3.3-3.3-2.1-3.3 2.1 1.1-3.3-2.8-2.2h3.5L12 7z" />
                    </svg>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#102a54]">AUTHORIZED</p>
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#d4af37]">TRAINING SEAL</p>
                    <p className="text-xs font-extrabold text-[#102a54] leading-tight">LMS COMPANY</p>
                  </div>
                </div>

                {/* Right: Certified Badge */}
                <div className="relative w-64 flex-shrink-0 overflow-hidden border border-[#14b8a6]/30 bg-[#0f766e] p-4 text-white shadow-lg rounded-lg">
                  <div className="absolute inset-1 border border-white/10 pointer-events-none" />
                  <div className="relative space-y-1 text-center">
                    <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#2dd4bf]">
                      LMS CERTIFIED
                    </p>
                    <div className="h-px bg-white/20 my-0.5" />
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/95">
                      FUNDAMENTALS
                    </p>
                    <p
                      suppressHydrationWarning={true}
                      className="text-[10px] font-medium text-white/80 whitespace-nowrap overflow-hidden text-ellipsis"
                    >
                      {courseTitle}
                    </p>
                  </div>
                </div>
              </div>

              {/* Body Content */}
              <div className="space-y-4 my-auto">
                <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-slate-400">
                  THIS CERTIFICATE IS PROUDLY PRESENTED TO
                </p>
                <h1
                  suppressHydrationWarning={true}
                  className="text-4xl font-extrabold uppercase tracking-wide text-[#102a54] leading-none py-1"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {userName}
                </h1>
                <p className="w-full max-w-3xl text-xs sm:text-sm leading-relaxed text-slate-600 font-sans">
                  for outstanding performance, demonstration of technical proficiency, and successful completion of the specialized curriculum program in
                </p>
                <p
                  suppressHydrationWarning={true}
                  className="w-full text-xl font-extrabold text-[#102a54] tracking-wide whitespace-nowrap overflow-hidden mt-1 italic font-serif"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  &quot;{courseTitle}&quot;
                </p>
              </div>

              {/* Footer: Symmetrical Signatures */}
              <div className="grid grid-cols-2 w-full pt-4">
                {/* CEO Signature */}
                <div className="space-y-1 text-left">
                  <div className="h-12 flex items-end">
                    <svg viewBox="0 0 200 60" className="h-10 w-36 text-slate-800" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 35 C35 15, 55 50, 75 25 C85 10, 95 45, 110 30 C125 15, 140 20, 160 25 C175 30, 185 15, 190 20" stroke="#1c1917" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M25 25 C65 10, 105 40, 145 25" stroke="#1c1917" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
                    </svg>
                  </div>
                  <div className="h-px w-44 bg-slate-300 my-1" />
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#102a54]">
                    Irvan Christian
                  </p>
                  <p className="text-[9px] text-slate-500 font-medium">Chief Executive Officer, LMS Company</p>
                </div>

                {/* CTO Signature */}
                <div className="space-y-1 text-right">
                  <div className="h-12 flex items-end justify-end">
                    <svg viewBox="0 0 200 60" className="h-10 w-36 text-slate-800 ml-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 25 C45 5, 65 55, 90 30 C110 10, 130 45, 150 20 C170 5, 180 35, 190 15" stroke="#1c1917" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M25 35 C65 15, 105 45, 145 15" stroke="#1c1917" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
                    </svg>
                  </div>
                  <div className="h-px w-44 bg-slate-300 my-1 ml-auto" />
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#102a54]">
                    Sonia Wijaya
                  </p>
                  <p className="text-[9px] text-slate-500 font-medium">Chief Technology Officer, LMS Company</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Update build production final
