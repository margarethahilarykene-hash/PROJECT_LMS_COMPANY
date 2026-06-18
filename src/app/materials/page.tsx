'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface Lesson {
  id: number;
  title: string;
  duration: string;
  content: string;
}

interface TrainingMaterial {
  id: string;
  title: string;
  category: string;
  fileSize: string;
  fileType: string;
  description: string;
  icon: string;
  lessons: Lesson[];
}

const MATERIALS_DATABASE: TrainingMaterial[] = [
  {
    id: 'digital-ai',
    title: 'Generative AI & Tech Productivity Handbook',
    category: 'Digital Literacy & Technology',
    fileSize: '2.4 MB',
    fileType: 'PDF',
    icon: '📘',
    description:
      'Panduan lengkap penggunaan Generative AI secara aman di lingkungan kerja, optimalisasi prompt engineering, dan kolaborasi digital via Slack & Jira.',
    lessons: [
      {
        id: 1,
        title: 'Keamanan AI & Kebijakan Data',
        duration: '5 Menit',
        content:
          'Kecerdasan Buatan (AI) memberikan peluang besar produktivitas. Namun, ketika menggunakan layanan AI publik, setiap input data harus dibersihkan dari informasi sensitif.\n\nJangan bagikan data klien, rahasia perusahaan, atau kode internal. Selalu gunakan data dummy ketika masih berada dalam periode review atau di lingkungan AI yang tidak terverifikasi. Pemahaman tentang kebijakan data internal dan GDPR akan menjauhkan tim Anda dari risiko kebocoran informasi.'
      },
      {
        id: 2,
        title: 'Prompt Engineering untuk Hasil Optimal',
        duration: '5 Menit',
        content:
          'Prompt engineering adalah teknik menulis perintah yang jelas dan kontekstual untuk AI.\n\nRumus sederhana: [Peran] + [Tugas] + [Detail Data] + [Format Output]. Misalnya, "Sebagai analis produk, ringkas poin penting laporan proyek ke dalam 5 bullet, sertakan rekomendasi tindak lanjut."\n\nPraktik ini membuat AI menghasilkan jawaban lebih relevan dan mengurangi risiko jawaban keliru atau halusinasi.'
      },
      {
        id: 3,
        title: 'Kolaborasi Digital: Slack & Jira',
        duration: '5 Menit',
        content:
          'Kolaborasi digital yang efektif membutuhkan disiplin komunikasi. Di Slack, gunakan thread untuk diskusi tugas dan hindari spam channel umum. Di Jira, buat tiket dengan judul jelas, deskripsi terstruktur, dan acceptance criteria spesifik.\n\nIntegrasikan notifikasi Jira ke Slack untuk update otomatis, sehingga tim dapat merespons issue lebih cepat tanpa kehilangan konteks.'
      }
    ]
  },
  {
    id: 'security-compliance',
    title: 'Corporate Cyber Security Policies Handout',
    category: 'Compliance & Security',
    fileSize: '1.8 MB',
    fileType: 'PDF',
    icon: '🔒',
    description:
      'Panduan wajib pencegahan kejahatan siber, manajemen kata sandi aman, dan kepatuhan terhadap regulasi perlindungan data pelanggan.',
    lessons: [
      {
        id: 1,
        title: 'Menghindari Phishing & Social Engineering',
        duration: '5 Menit',
        content:
          'Phishing adalah teknik penipuan yang memanipulasi emosi dan kepercayaan.\n\nSelalu verifikasi nama domain pengirim email, periksa tautan sebelum diklik, dan jangan unduh lampiran dari sumber tidak dikenal. Jika email meminta kredensial atau data pribadi secara mendesak, laporkan ke tim Security IT segera.'
      },
      {
        id: 2,
        title: 'Manajemen Kata Sandi & MFA',
        duration: '5 Menit',
        content:
          'Kata sandi kuat adalah pertahanan pertama melawan akses tidak sah. Gunakan panjang minimal 12 karakter, campur huruf besar kecil, angka, dan simbol.\n\nAktifkan Multi-Factor Authentication (MFA) pada semua sistem kerja. MFA menambah lapisan perlindungan ketika kata sandi bocor, sehingga akses tetap aman.'
      }
    ]
  },
  {
    id: 'soft-skills',
    title: 'Effective Communication & Business Negotiation Handout',
    category: 'Soft Skills & Human Skills',
    fileSize: '1.5 MB',
    fileType: 'PDF',
    icon: '📝',
    description:
      'Panduan praktis untuk komunikasi bisnis persuasif, presentasi efektif, dan teknik pemecahan masalah 5 Whys.',
    lessons: [
      {
        id: 1,
        title: 'Komunikasi Persuasif yang Efektif',
        duration: '5 Menit',
        content:
          'Komunikasi bisnis yang efektif dimulai dengan mendengarkan secara aktif. Gunakan bahasa yang jelas, hindari jargon berlebihan, dan fokus pada nilai bagi pendengar.\n\nDalam negosiasi, arahkan diskusi ke solusi win-win dan gunakan data untuk mendukung pendapat Anda, bukan sekedar opini.'
      },
      {
        id: 2,
        title: 'Teknik Problem Solving 5-Whys',
        duration: '5 Menit',
        content:
          'Metode 5-Whys membantu menemukan akar masalah. Mulai dari masalah utama, lalu tanyakan "kenapa" hingga lima kali untuk menggali penyebab terdalam.\n\nContoh: Kenapa laporan terlambat? Karena data tidak lengkap. Kenapa data tidak lengkap? Karena tidak ada standar input. Dan seterusnya hingga akar penyebab jelas.'
      }
    ]
  },
  {
    id: 'adaptive-leadership',
    title: 'Adaptive Leadership & Change Management Handout',
    category: 'Leadership & Management',
    fileSize: '2.1 MB',
    fileType: 'PDF',
    icon: '🏆',
    description:
      'Panduan untuk memimpin tim adaptif, memberikan umpan balik efektif, dan mengelola konflik dengan bijak.',
    lessons: [
      {
        id: 1,
        title: 'SBI Feedback Model',
        duration: '5 Menit',
        content:
          'Model SBI membantu menyampaikan umpan balik secara objektif. Jelaskan Situation, Behavior, dan Impact secara terpisah agar penerima memahami konteks dan dampak tanpa merasa disalahkan.'
      },
      {
        id: 2,
        title: 'Strategi Resolusi Konflik',
        duration: '5 Menit',
        content:
          'Konflik adalah bagian alami tim. Fokus pada isu, bukan personal. Dengar kedua belah pihak secara adil, gunakan komunikasi asertif, dan arahkan diskusi ke action plan yang menjaga hubungan kerja.'
      }
    ]
  }
];

export default function MaterialsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Employee');
  const [enrolledCourseId, setEnrolledCourseId] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<TrainingMaterial | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (!user) {
        router.push('/login');
        return;
      }

      const fullName = user.user_metadata?.full_name;
      if (fullName) {
        setUserName(fullName);
      } else if (user.email === 'margarethahilarykene@gmail.com') {
        setUserName('Margaretha Hilary Kene');
      } else {
        setUserName(user.email ? user.email.split('@')[0] : 'Employee');
      }

      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('enrolledCourseId');
        setEnrolledCourseId(saved);
      }

      setLoading(false);
    };

    checkUser();
  }, [router]);

  const matchedMaterials = enrolledCourseId
    ? MATERIALS_DATABASE.filter((material) => material.id === enrolledCourseId)
    : [];

  const selectedCourseMaterial = matchedMaterials.length > 0 ? matchedMaterials[0] : null;

  const handleDownload = () => {
    if (typeof window !== 'undefined' && selectedCourseMaterial) {
      alert(`?? Simulasi unduhan berhasil untuk "${selectedCourseMaterial.title}" (${selectedCourseMaterial.fileType}).`);
    }
  };

  const handleStartStudy = () => {
    if (!selectedCourseMaterial) {
      return;
    }

    setSelectedMaterial(selectedCourseMaterial);
    setActiveLesson(selectedCourseMaterial.lessons[0] ?? null);
    // load per-course completed lessons from localStorage
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(`completedLessons:${selectedCourseMaterial.id}`);
        if (saved) {
          const parsed = JSON.parse(saved) as number[];
          setCompletedLessons(Array.isArray(parsed) ? parsed : []);
        } else {
          setCompletedLessons([]);
        }
      }
    } catch (err) {
      setCompletedLessons([]);
    }
  };

  const handleLessonSelect = (lesson: Lesson) => {
    setActiveLesson(lesson);
  };

  const handleMarkComplete = () => {
    if (!activeLesson || !selectedMaterial) return;
    setCompletedLessons((prev) => {
      if (prev.includes(activeLesson.id)) return prev;
      const next = [...prev, activeLesson.id];
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem(`completedLessons:${selectedMaterial.id}`, JSON.stringify(next));
        }
      } catch (err) {
        // ignore
      }
      return next;
    });
  };

  const allLessonsCompleted = selectedMaterial ? selectedMaterial.lessons.length === completedLessons.length : false;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060913] text-slate-100 flex items-center justify-center px-6">
        <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-10 text-center shadow-2xl shadow-slate-950/40">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#00a3ff] animate-spin text-[#00a3ff]">
            <span className="text-2xl">?</span>
          </div>
          <p className="mt-6 text-slate-300 text-lg font-medium">Memeriksa sesi Anda...</p>
        </div>
      </div>
    );
  }

  if (!enrolledCourseId || !selectedCourseMaterial) {
    return (
      <div className="min-h-screen bg-[#060913] text-slate-100 px-6 py-12">
        <div className="mx-auto max-w-4xl rounded-3xl border border-slate-700 bg-slate-900/80 p-10 text-center shadow-2xl shadow-slate-950/40">
          <p className="text-slate-400 text-lg">
            Belum ada kelas aktif yang dipilih. Silakan ambil pelatihan terlebih dahulu di menu Training List!
          </p>
          <button
            onClick={() => router.push('/courses')}
            className="mt-8 inline-flex items-center justify-center rounded-2xl bg-[#00a3ff] px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-blue-500"
          >
            Kembali ke Training List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
        <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-8 shadow-xl shadow-slate-950/20">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <button onClick={() => window.location.href = '/dashboard'} className="font-medium text-[#00a3ff] transition hover:text-blue-300">Dashboard</button>
                <span>/</span>
                <span className="text-slate-300">Training Materials</span>
              </div>
              <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Training Materials</h1>
              <p className="mt-3 max-w-2xl text-slate-400 sm:text-lg">
                Anda sedang mengakses materi untuk kelas aktif: <span className="font-semibold text-white">{selectedCourseMaterial.title}</span>.
              </p>
            </div>
            <div className="text-right text-slate-400 sm:text-sm">
              <p>ID kelas aktif: <span className="font-semibold text-[#00a3ff]">{enrolledCourseId}</span></p>
            </div>
          </div>

          {!selectedMaterial ? (
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <article className="rounded-3xl border border-slate-700 bg-slate-950/90 p-8 shadow-lg shadow-slate-950/20">
                <div className="flex items-center gap-3 text-lg">
                  <span>{selectedCourseMaterial.icon}</span>
                  <h2 className="text-2xl font-semibold text-white">{selectedCourseMaterial.title}</h2>
                </div>
                <p className="mt-4 text-slate-300 leading-7">{selectedCourseMaterial.description}</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <button
                    onClick={handleDownload}
                    className="rounded-2xl bg-[#0b1220] px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-[#172033]"
                  >
                    Unduh PDF
                  </button>
                  <button
                    onClick={handleStartStudy}
                    className="rounded-2xl bg-[#00a3ff] px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-[#0092e4]"
                  >
                    Pelajari Online
                  </button>
                </div>
              </article>
              <aside className="rounded-3xl border border-slate-700 bg-slate-950/90 p-8 shadow-lg shadow-slate-950/20">
                <h3 className="text-xl font-semibold text-white">Detail Materi</h3>
                <div className="mt-4 space-y-3 text-slate-300">
                  <p><span className="font-semibold text-white">Kategori:</span> {selectedCourseMaterial.category}</p>
                  <p><span className="font-semibold text-white">Ukuran File:</span> {selectedCourseMaterial.fileSize}</p>
                  <p><span className="font-semibold text-white">Format:</span> {selectedCourseMaterial.fileType}</p>
                  <p><span className="font-semibold text-white">Bab:</span> {selectedCourseMaterial.lessons.length} Modul Interaktif</p>
                </div>
              </aside>
            </div>
          ) : (
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 rounded-3xl border border-slate-700 bg-slate-950/90 p-8 shadow-lg shadow-slate-950/20">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-3xl font-semibold text-white">{activeLesson?.title}</h2>
                    <p className="mt-1 text-sm text-slate-400">Durasi: {activeLesson?.duration}</p>
                  </div>
                  <button
                    onClick={() => setSelectedMaterial(null)}
                    className="rounded-2xl border border-slate-700 bg-[#0b1220] px-4 py-2 text-xs font-semibold text-slate-300 hover:border-[#00a3ff] hover:text-white"
                  >
                    Kembali ke Materi
                  </button>
                </div>

                <div className="mt-6 max-h-[520px] overflow-y-auto rounded-3xl border border-slate-800 bg-slate-900/80 p-6 text-slate-300 leading-relaxed whitespace-pre-wrap custom-scrollbar">
                  {activeLesson?.content}
                </div>

                <div className="mt-6">
                  <button
                    onClick={handleMarkComplete}
                    disabled={completedLessons.includes(activeLesson?.id ?? -1)}
                    className={`w-full rounded-2xl px-5 py-3 text-sm font-semibold transition ${completedLessons.includes(activeLesson?.id ?? -1) ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 cursor-not-allowed' : 'bg-[#00a3ff] text-slate-950 hover:bg-[#0092e4]'}`}
                  >
                    {completedLessons.includes(activeLesson?.id ?? -1) ? '✓ Bab Ini Selesai' : 'Tandai Bab Ini Selesai'}
                  </button>
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => {
                      if (!allLessonsCompleted) return;
                      try {
                        if (typeof window !== 'undefined') {
                          localStorage.setItem('materialsCompleted', 'true');
                        }
                      } catch (err) {
                        // ignore
                      }
                      window.location.href = '/dashboard';
                    }}
                    disabled={!allLessonsCompleted}
                    className={`w-full rounded-2xl px-5 py-3 text-sm font-semibold transition ${allLessonsCompleted ? 'bg-[#10b981] text-white hover:bg-emerald-500' : 'bg-slate-700 text-slate-400 opacity-50 cursor-not-allowed'}`}
                  >
                    Selesai
                  </button>
                </div>
              </div>

              <aside className="rounded-3xl border border-slate-700 bg-slate-950/90 p-6 shadow-lg shadow-slate-950/20">
                <h3 className="text-lg font-semibold text-white">Daftar Bab</h3>
                <div className="mt-4 space-y-3">
                  {selectedMaterial.lessons.map((lesson) => {
                    const isActive = activeLesson?.id === lesson.id;
                    const done = completedLessons.includes(lesson.id);
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => handleLessonSelect(lesson)}
                        className={`w-full rounded-2xl border p-4 text-left transition ${isActive ? 'border-[#00a3ff] bg-[#00a3ff]/10 text-[#00a3ff]' : done ? 'border-emerald-600 bg-emerald-900/5 text-emerald-300' : 'border-slate-800 bg-[#0b1220] text-slate-300 hover:border-slate-600'}`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs text-slate-400">Bab {lesson.id}</span>
                          <span className="text-xs text-slate-400">{lesson.duration}</span>
                        </div>
                        <p className="mt-2 font-medium">{lesson.title} {done && <span className="text-emerald-400">(Selesai)</span>}</p>
                      </button>
                    );
                  })}
                </div>
              </aside>
            </div>
          )}
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(30,41,59,0.4); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,163,255,0.35); border-radius: 10px; }
      `}</style>
    </div>
  );
}
