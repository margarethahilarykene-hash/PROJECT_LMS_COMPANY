'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function CertificatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Margaretha Hilary Kene');
  const [courseTitle, setCourseTitle] = useState('Generative AI & Tech Productivity');
  const [isDownloading, setIsDownloading] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSessionAndData = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
          router.push('/');
          return;
        }

        const fullName = user.user_metadata?.full_name;
        if (fullName) {
          setUserName(fullName);
        } else if (user.email === 'margarethahilarykene@gmail.com') {
          setUserName('Margaretha Hilary Kene');
        } else {
          const emailPrefix = user.email ? user.email.split('@')[0] : 'Employee';
          setUserName(emailPrefix);
        }

        const savedCourseTitle = localStorage.getItem('enrolledCourseTitle');
        if (savedCourseTitle) {
          setCourseTitle(savedCourseTitle);
        }
      } catch (err) {
        console.error('Failed to load user credentials:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionAndData();
  }, [router]);

  const handleDownloadPDF = async () => {
    if (!certificateRef.current) return;
    setIsDownloading(true);

    try {
      // Simpan status kelulusan kurikulum secara permanen harian
      localStorage.setItem('training_completed', 'true');

      // Mengatasi error parsing warna "lab/oklch" pada library Next.js
      if (!(window as any).html2pdf) {
        const loadScript = (src: string) => {
          return new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.onload = () => resolve();
            script.onerror = (e) => reject(e);
            document.head.appendChild(script);
          });
        };

        // Memuat jsPDF
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
        if ((window as any).jspdf && !(window as any).jsPDF) {
          (window as any).jsPDF = (window as any).jspdf.jsPDF;
        }

        // Memuat html2canvas-pro versi modern penyelesai crash oklch
        await loadScript('https://cdn.jsdelivr.net/npm/html2canvas-pro@1.5.8/dist/html2canvas-pro.min.js');

        // Memuat html2pdf inti
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.min.js');
      }

      const html2pdf = (window as any).html2pdf;
      const opt = {
        margin: 0,
        filename: `Sertifikat_${userName.replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 3,
          useCORS: true,
          letterRendering: true,
          ignoreElements: (element: Element) => element.classList.contains('no-print')
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
      };

      await html2pdf().from(certificateRef.current).set(opt).save();

      // Pemuatan ulang keras agar menu-menu dashboard langsung terbuka segar
      window.location.href = '/dashboard';
    } catch (err) {
      console.error('Download PDF error, triggering print fallback:', err);
      window.print();
      window.location.href = '/dashboard';
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060913] text-slate-100 flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#00a3ff] mx-auto mb-4"></div>
          <p className="text-slate-400 text-sm">Menyiapkan Sertifikat Anda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 p-4 md:p-8 lg:p-12 font-sans flex flex-col items-center justify-start">

      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          body { background-color: white !important; }
          .no-print { display: none !important; }
          .print-area { border: none !important; box-shadow: none !important; margin: 0 !important; width: 100% !important; max-width: 100% !important; }
        }
      `}} />

      {/* Navigasi Bilah Atas */}
      <div className="w-full max-w-4xl no-print flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 text-slate-500 text-xs md:text-sm">
          <span className="hover:text-[#00a3ff] cursor-pointer transition-colors" onClick={() => { window.location.href = '/dashboard'; }}>Dashboard</span>
          <span>&rarr;</span>
          <span className="text-slate-300 font-semibold">E-Certificate</span>
        </div>

        <button
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="bg-[#00a3ff] hover:bg-[#0092e4] disabled:bg-slate-800 text-white text-xs md:text-sm font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-500/10 flex items-center gap-2"
        >
          {isDownloading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Downloading PDF...
            </>
          ) : (
            <>
              <span>📥</span> Download Certificate
            </>
          )}
        </button>
      </div>

      {/* */}
      <div
        ref={certificateRef}
        className="print-area bg-white text-[#111827] rounded-2xl shadow-2xl relative overflow-hidden aspect-[1.414/1] w-full max-w-4xl flex flex-col justify-between p-[4%] border border-slate-200 select-none"
      >
        <div className="absolute top-0 left-0 w-3 h-full bg-[#dc2626] z-20"></div>

        {/* Ornamen Siku Pojok Geometris (Fortinet & Vibrant Style) */}
        <div className="absolute top-0 left-3 w-[15%] h-[15%] pointer-events-none z-10">
          <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
            <polygon points="0,0 100,0 0,100" fill="#102a54" />
            <polygon points="0,0 75,0 0,75" fill="#d4af37" />
          </svg>
        </div>
        <div className="absolute top-0 right-0 w-[15%] h-[15%] pointer-events-none z-10">
          <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
            <polygon points="100,0 0,0 100,100" fill="#102a54" />
            <polygon points="100,0 25,0 100,75" fill="#d4af37" />
          </svg>
        </div>
        <div className="absolute bottom-0 left-3 w-[15%] h-[15%] pointer-events-none z-10">
          <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
            <polygon points="0,100 100,100 0,0" fill="#102a54" />
            <polygon points="0,100 75,100 0,25" fill="#d4af37" />
          </svg>
        </div>
        <div className="absolute bottom-0 right-0 w-[15%] h-[15%] pointer-events-none z-10">
          <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
            <polygon points="100,100 0,100 100,0" fill="#102a54" />
            <polygon points="100,100 25,100 100,25" fill="#d4af37" />
          </svg>
        </div>

        <div className="absolute inset-[3%] border-2 border-double border-[#d4af37]/30 rounded-lg pointer-events-none z-10"></div>

        {/* Watermark Latar Belakang */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none z-0">
          <svg className="w-[45%] h-[45%] fill-current text-[#d4af37]" viewBox="0 0 24 24">
            <path d="M12 2L2 22h20L12 2zm0 3.99L18.53 18H5.47L12 5.99zM12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </div>

        {/* */}
        <div className="relative z-10 flex-grow flex flex-col justify-between py-[2%] px-[5%]">
          <div className="flex items-start justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border-2 border-[#102a54] bg-[#102a54]/5 flex items-center justify-center">
                <span className="text-xl font-bold text-[#102a54]">LMS</span>
              </div>
              <div className="text-left">
                <h4 className="text-xs font-extrabold tracking-wider text-[#102a54] uppercase">LMS COMPANY</h4>
                <p className="text-[9px] text-slate-500 font-bold tracking-widest uppercase">TRAINING INSTITUTE</p>
              </div>
            </div>

            <div className="bg-[#0f766e] text-white px-5 py-2.5 rounded-bl-2xl border-l border-b border-emerald-400/30 text-right">
              <div className="text-[9px] tracking-widest font-extrabold uppercase text-emerald-200">LMS CERTIFIED FUNDAMENTALS</div>
              <div className="text-xs font-bold mt-0.5 truncate max-w-[180px]" suppressHydrationWarning={true}>{courseTitle}</div>
            </div>
          </div>

          <div className="space-y-4 my-auto text-center w-full">
            <div className="space-y-1">
              <h1 className="text-xl md:text-2xl font-extrabold tracking-[0.25em] text-[#102a54] uppercase font-sans">
                CERTIFICATE OF APPRECIATION
              </h1>
              <p className="text-slate-500 text-[10px] uppercase tracking-widest italic font-bold">
                THIS CERTIFICATE IS PROUDLY PRESENTED TO
              </p>
            </div>

            <div className="py-2 inline-block">
              <h2
                suppressHydrationWarning={true}
                className="text-3xl md:text-4xl font-black text-slate-900 tracking-wide uppercase border-b-2 border-[#d4af37]/60 pb-1 px-8"
              >
                {userName}
              </h2>
            </div>

            <div className="w-full max-w-3xl mx-auto space-y-2">
              <p className="text-slate-700 text-[11px] md:text-xs leading-relaxed max-w-2xl mx-auto font-medium">
                for outstanding performance, demonstration of technical proficiency, and successful completion of the specialized curriculum program in
              </p>

              <h3
                suppressHydrationWarning={true}
                className="text-base md:text-xl font-extrabold text-[#102a54] tracking-wide block"
              >
                &ldquo;{courseTitle}&rdquo;
              </h3>
            </div>
          </div>

          {/* */}
          <div className="grid grid-cols-2 gap-12 w-full max-w-3xl mx-auto pt-6 text-center">
            <div className="flex flex-col items-center justify-end space-y-1.5">
              <div className="h-10 flex items-center justify-center select-none">
                <svg className="w-32 h-8 text-slate-900" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M10,15 Q30,5 50,15 T90,15 M30,10 C40,25 45,5 55,20" strokeLinecap="round" />
                </svg>
              </div>
              <div className="w-[85%] border-t border-slate-300"></div>
              <div className="text-center">
                <span className="font-extrabold text-[10px] text-slate-900 block tracking-wide">Irvan Christian</span>
                <span className="text-slate-500 text-[8px] uppercase tracking-widest block font-bold mt-0.5">Chief Executive Officer, LMS Company</span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-end space-y-1.5">
              <div className="h-10 flex items-center justify-center select-none">
                <svg className="w-32 h-8 text-slate-900" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M15,10 Q40,20 60,8 T85,22 M25,20 C35,5 50,25 65,12" strokeLinecap="round" />
                </svg>
              </div>
              <div className="w-[85%] border-t border-slate-300"></div>
              <div className="text-center">
                <span className="font-extrabold text-[10px] text-slate-900 block tracking-wide">Sonia Wijaya</span>
                <span className="text-slate-500 text-[8px] uppercase tracking-widest block font-bold mt-0.5">Chief Technology Officer, LMS Company</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="py-6 text-slate-600 text-xs text-center w-full mt-12 border-t border-slate-900 no-print">
        &copy; 2026 LMS Platform. Managed by Company Administration Team.
      </footer>
    </div>
  );
}