"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { LogOut, Loader2, BookOpen, CheckSquare, Award, Trophy, Lock, Book } from "lucide-react";
import type { User } from "@supabase/supabase-js";

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // Dynamic statistics states
  const [enrolledCourseId, setEnrolledCourseId] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [enrolledCourseTitle, setEnrolledCourseTitle] = useState<string | null>(null);
  const [materialsCompleted, setMaterialsCompleted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [completedQuizzes, setCompletedQuizzes] = useState(0);
  const [creditScore, setCreditScore] = useState(0);
  const [certificates, setCertificates] = useState(0);

  // Lock status state
  const [allMenusUnlocked, setAllMenusUnlocked] = useState(false);

  useEffect(() => {
    const checkUserAndStats = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        const currentUser = data.user;

        if (!currentUser) {
          router.push('/login');
          return;
        }

        setUser(currentUser);

        if (typeof window !== 'undefined') {
          // Sanitasi Keras LocalStorage
          const rawCourseId = localStorage.getItem('enrolledCourseId');
          const cleanCourseId = (rawCourseId && rawCourseId !== 'null' && rawCourseId !== 'undefined') ? rawCourseId : null;

          const rawCourseTitle = localStorage.getItem('enrolledCourseTitle');
          const cleanCourseTitle = (rawCourseTitle && rawCourseTitle !== 'null' && rawCourseTitle !== 'undefined') ? rawCourseTitle : null;

          const cleanMaterialsCompleted = localStorage.getItem('materialsCompleted') === 'true';
          const cleanQuizCompleted = localStorage.getItem('quizCompleted') === 'true';
          const cleanIsCompleted = localStorage.getItem('training_completed') === 'true';

          setEnrolledCourseId(cleanCourseId);
          setEnrolledCourseTitle(cleanCourseTitle);
          setMaterialsCompleted(cleanMaterialsCompleted);
          setQuizCompleted(cleanQuizCompleted);
          setAllMenusUnlocked(cleanIsCompleted);

          // 2. Completed Quizzes
          let quizzesCount = 0;
          const storedQuizzes = localStorage.getItem('completed_quizzes');
          if (storedQuizzes) {
            try {
              const parsed = JSON.parse(storedQuizzes);
              if (Array.isArray(parsed)) {
                quizzesCount = parsed.length;
              }
            } catch (e) {
              // fallback
            }
          }
          setCompletedQuizzes(quizzesCount);

          // 3. Credit Score (Average)
          let averageScore = 0;
          const storedScores = localStorage.getItem('user_scores');
          if (storedScores) {
            try {
              const parsed = JSON.parse(storedScores);
              if (Array.isArray(parsed) && parsed.length > 0) {
                const sum = parsed.reduce((acc: number, val: any) => acc + (Number(val) || 0), 0);
                averageScore = Math.round(sum / parsed.length);
              } else if (typeof parsed === 'object' && parsed !== null) {
                const values = Object.values(parsed);
                if (values.length > 0) {
                  const sum = values.reduce((acc: number, val: any) => acc + (Number(val) || 0), 0);
                  averageScore = Math.round(sum / values.length);
                }
              }
            } catch (e) {
              // fallback
            }
          }
          setCreditScore(averageScore);

          // 4. Certificates
          let certsCount = 0;
          const storedCerts = localStorage.getItem('unlocked_certificates');
          if (storedCerts) {
            try {
              const parsed = JSON.parse(storedCerts);
              if (Array.isArray(parsed)) {
                certsCount = parsed.length;
              }
            } catch (e) {
              // fallback
            }
          }
          setCertificates(certsCount);
        }
      } catch (error) {
        console.error('Error fetching session or stats:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkUserAndStats();
  }, [router]);

  const handleSignOut = async () => {
    // 1. Bersihkan seluruh penyimpanan lokal secara sinkron & instan
    localStorage.clear(); 

    // 2. Hapus key LMS satu per satu untuk memastikan pembersihan mutlak
    const lmsKeys = ['enrolledCourseId', 'enrolledCourseTitle', 'materialsCompleted', 'quizCompleted', 'training_completed'];
    lmsKeys.forEach(key => localStorage.removeItem(key));

    // 3. Jalankan Supabase SignOut
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("SignOut error:", err);
    }

    // 4. Lakukan pemuatan ulang keras (Hard-Redirect) agar seluruh memori React bersih total!
    window.location.href = '/';
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleResetDemo = () => {
    // Hapus hanya key progres LMS, jangan hapus key autentikasi Supabase!
    const lmsKeys = [
      'enrolledCourseId',
      'enrolledCourseTitle',
      'materialsCompleted',
      'quizCompleted',
      'training_completed'
    ];
    lmsKeys.forEach(key => localStorage.removeItem(key));
    window.location.reload(); // Muat ulang halaman secara instan agar UI segar kembali tanpa logout!
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center space-y-4">
          <Loader2 className="w-10 h-10 text-sky-500 animate-spin" />
          <p className="text-slate-400 text-sm font-medium animate-pulse">Verifying your session...</p>
        </div>
      </div>
    );
  }

  const displayName =
    user.user_metadata?.full_name ||
    (user.email === 'margarethahilarykene@gmail.com'
      ? 'Margaretha Hilary Kene'
      : user.email?.split('@')[0] || 'Margaretha Hilary Kene');

  const isEnrolled = enrolledCourseId !== null;

  // Atur empat kondisi penguncian menu utama secara presisi (Strict Sequential Locking):
  const isTrainingListLocked = isEnrolled;
  const isMaterialsLocked = !isEnrolled || materialsCompleted;
  const isQuizzesLocked = !isEnrolled || !materialsCompleted || quizCompleted;
  const isCertificatesLocked = !quizCompleted;

  const MENU_ITEMS = [
    {
      id: 1,
      title: 'Training List',
      activeDescription: 'Browse all available training courses and enroll now.',
      lockedDescription: 'Locked - Anda sedang mengikuti pelatihan aktif!',
      icon: <BookOpen className="w-5 h-5" />,
      href: '/courses',
      colorClass: 'from-blue-600 to-indigo-700 border-blue-500 shadow-blue-500/10',
    },
    {
      id: 2,
      title: 'Training Materials',
      activeDescription: 'Access learning resources and your course guides.',
      lockedDescription: 'Locked - Silakan daftar pelatihan terlebih dahulu!',
      icon: <Book className="w-5 h-5" />,
      href: '/materials',
      colorClass: 'from-emerald-600 to-teal-700 border-emerald-500 shadow-emerald-500/10',
    },
    {
      id: 3,
      title: 'Quizzes & Scores',
      activeDescription: 'Take quizzes and track your score progress.',
      lockedDescription: 'Locked - Silakan selesaikan materi pelatihan terlebih dahulu!',
      icon: <Award className="w-5 h-5" />,
      href: '/quizzes',
      colorClass: 'from-amber-600 to-orange-700 border-amber-500 shadow-amber-500/10',
    },
    {
      id: 4,
      title: 'E-Certificates',
      activeDescription: 'Download and share your training certificates.',
      lockedDescription: 'Locked - Silakan selesaikan kuis terlebih dahulu untuk mengklaim sertifikat!',
      icon: <Trophy className="w-5 h-5" />,
      href: '/certificates',
      colorClass: 'from-purple-700 to-indigo-800 border-purple-600 shadow-purple-500/10',
    },
  ];

  return (
    <main className="min-h-screen bg-[#070b13] text-slate-100 relative overflow-hidden px-6 py-10 sm:px-8 lg:px-12">
      {/* Decorative Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl space-y-10 relative z-10">
        {/* Header Section */}
        <section className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 border-b border-slate-800 pb-8">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-slate-400" suppressHydrationWarning={true}>
                Welcome, {displayName}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                Aktif: Generative AI & Tech Productivity
              </span>
            </div>
            <h1 className="text-white font-bold text-4xl tracking-tight">LMS Dashboard</h1>
            <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
              Anda sedang mengikuti pelatihan aktif. Training Materials tetap terbuka, sedangkan menu lainnya terkunci.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 pt-2 md:pt-0">
            <button
              onClick={handleSignOut}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-900/30 bg-red-950/40 text-red-200 text-sm font-semibold hover:bg-red-900/40 hover:border-red-900/50 hover:text-white transition duration-300 shadow-sm"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {/* Stat 1: Total Training */}
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 transition duration-300 hover:border-slate-700 hover:shadow-xl hover:translate-y-[-2px]">
              <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 w-11 h-11 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <p className="text-slate-400 text-sm font-medium">Total Training</p>
              <p className="text-white text-3xl font-bold mt-2" suppressHydrationWarning={true}>
                {(enrolledCourseId || allMenusUnlocked) ? "1" : "0"}
              </p>
            </div>

            {/* Stat 2: Completed Quizzes */}
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 transition duration-300 hover:border-slate-700 hover:shadow-xl hover:translate-y-[-2px]">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 w-11 h-11 flex items-center justify-center mb-4">
                <CheckSquare className="w-6 h-6" />
              </div>
              <p className="text-slate-400 text-sm font-medium">Completed Quizzes</p>
              <p className="text-white text-3xl font-bold mt-2" suppressHydrationWarning={true}>
                {completedQuizzes}
              </p>
            </div>

            {/* Stat 3: Credit Score */}
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 transition duration-300 hover:border-slate-700 hover:shadow-xl hover:translate-y-[-2px]">
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 w-11 h-11 flex items-center justify-center mb-4">
                <Award className="w-6 h-6" />
              </div>
              <p className="text-slate-400 text-sm font-medium">Credit Score</p>
              <p className="text-white text-3xl font-bold mt-2" suppressHydrationWarning={true}>
                {creditScore}
              </p>
            </div>

            {/* Stat 4: Certificates */}
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 transition duration-300 hover:border-slate-700 hover:shadow-xl hover:translate-y-[-2px]">
              <div className="p-2.5 rounded-lg bg-fuchsia-500/10 text-fuchsia-400 w-11 h-11 flex items-center justify-center mb-4">
                <Trophy className="w-6 h-6" />
              </div>
              <p className="text-slate-400 text-sm font-medium">Certificates</p>
              <p className="text-white text-3xl font-bold mt-2" suppressHydrationWarning={true}>
                {certificates}
              </p>
            </div>
          </div>
        </section>

        {/* Main Menu Section */}
        <section className="space-y-4">
          <h2 className="text-white text-xl font-semibold mb-4">Main Menu</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {MENU_ITEMS.map((menu) => {
              let isLocked = false;
              if (menu.id === 1) isLocked = isTrainingListLocked;
              else if (menu.id === 2) isLocked = isMaterialsLocked;
              else if (menu.id === 3) isLocked = isQuizzesLocked;
              else if (menu.id === 4) isLocked = isCertificatesLocked;

              if (isLocked) {
                return (
                  <div 
                    key={menu.id} 
                    className="bg-slate-900/30 border border-slate-800/60 rounded-2xl p-6 opacity-45 pointer-events-none flex flex-col justify-between h-56"
                  >
                    <div className="space-y-4">
                      <div className="p-2 rounded-lg bg-slate-800/50 text-slate-500 w-10 h-10 flex items-center justify-center">
                        <Lock className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-400">{menu.title}</h3>
                        <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                          {menu.lockedDescription}
                        </p>
                      </div>
                    </div>
                    <div className="text-slate-500 text-sm font-medium">Locked</div>
                  </div>
                );
              }

              return (
                <div 
                  key={menu.id}
                  onClick={() => router.push(menu.href)}
                  className={`cursor-pointer bg-gradient-to-br ${menu.colorClass} border rounded-2xl p-6 shadow-[0_0_20px_rgba(0,0,0,0.15)] flex flex-col justify-between h-56 transition duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(0,0,0,0.25)] group`}
                >
                  <div className="space-y-4">
                    <div className="p-2 rounded-lg bg-white/10 text-white w-10 h-10 flex items-center justify-center">
                      {menu.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{menu.title}</h3>
                      <p className="text-white/80 text-xs mt-1 leading-relaxed">
                        {menu.activeDescription}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(menu.href);
                    }}
                    className="inline-flex items-center justify-between w-full mt-2 bg-white/10 hover:bg-white/20 text-white rounded-xl px-4 py-2.5 text-sm font-semibold transition"
                  >
                    <span>Open &gt;</span>
                    <span className="text-white/80 group-hover:translate-x-1 transition duration-300">&rarr;</span>
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
