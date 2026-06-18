'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type Course = {
  id: string;
  category: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
};

const COURSE_CATALOG: Course[] = [
  {
    id: 'digital-ai',
    category: 'Digital & Technology',
    title: 'Generative AI & Tech Productivity',
    description:
      'Kuasai cara menggunakan AI generatif untuk meningkatkan efisiensi, kolaborasi, dan automasi dalam lingkungan kerja modern.',
    instructor: 'Dr. Budi Santoso',
    duration: '8 jam',
  },
  {
    id: 'security-compliance',
    category: 'Compliance & Security',
    title: 'Cyber Security Awareness & Data Privacy',
    description:
      'Pelajari praktik terbaik keamanan siber dan proteksi data yang penting untuk menjaga integritas organisasi dan privasi pengguna.',
    instructor: 'Pak Rendra Wijaksono',
    duration: '7 jam',
  },
  {
    id: 'soft-skills',
    category: 'Soft Skills',
    title: 'Effective Communication & Problem Solving',
    description:
      'Tingkatkan kemampuan komunikasi, empati, dan strategi penyelesaian masalah untuk kerja tim yang lebih produktif.',
    instructor: 'Ibu Siti Nurhaliza',
    duration: '6 jam',
  },
  {
    id: 'adaptive-leadership',
    category: 'Leadership',
    title: 'Adaptive Leadership & Change Management',
    description:
      'Kembangkan kepemimpinan adaptif dan kemampuan memimpin tim saat menghadapi perubahan bisnis yang cepat.',
    instructor: 'Pak Agus Wijaya',
    duration: '10 jam',
  },
];

const FILTER_ITEMS = [
  'All',
  'Digital',
  'Compliance',
  'Soft Skills',
  'Leadership',
] as const;

type FilterOption = (typeof FILTER_ITEMS)[number];

export default function CoursesPage() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>('Guest');
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<FilterOption>('All');
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();

        if (!data.user) {
          router.push('/login');
          return;
        }

        const fullName = data.user.user_metadata?.full_name;
        const email = data.user.email ?? '';
        const displayName =
          fullName ||
          (email === 'margarethahilarykene@gmail.com'
            ? 'Margaretha Hilary Kene'
            : email.split('@')[0] || 'Guest');

        setUserName(displayName);
      } catch (error) {
        console.error('Failed to verify user session:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const filteredCourses = COURSE_CATALOG.filter((course) => {
    const matchesFilter =
      activeFilter === 'All' ||
      course.category.toLowerCase().includes(activeFilter.toLowerCase());

    const lowerSearch = searchQuery.toLowerCase();
    const matchesSearch =
      course.title.toLowerCase().includes(lowerSearch) ||
      course.description.toLowerCase().includes(lowerSearch) ||
      course.instructor.toLowerCase().includes(lowerSearch);

    return matchesFilter && matchesSearch;
  });

  const handleEnroll = (course: Course) => {
    setSelectedCourse(course);
    setShowSuccessModal(true);
  };

  const handleConfirmEnroll = () => {
    if (!selectedCourse) {
      return;
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('enrolledCourseId', selectedCourse.id);
      localStorage.setItem('enrolledCourseTitle', selectedCourse.title);
      // initialize materialsCompleted to false for a new enrollment
      localStorage.setItem('materialsCompleted', 'false');
    }

    setShowSuccessModal(false);
    window.location.href = '/dashboard';
  };

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

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100">
      {showSuccessModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-4 py-8">
          <div className="w-full max-w-lg rounded-3xl border border-slate-700 bg-slate-900/95 p-8 text-center shadow-2xl shadow-slate-950/50 backdrop-blur-xl">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#10b981]/10 text-5xl text-[#10b981]">
              ?
            </div>
            <h2 className="text-3xl font-semibold text-white">Pendaftaran Berhasil!</h2>
            <p className="mt-4 text-slate-300 text-base leading-7">
              Hai <span className="font-semibold text-[#00a3ff]">{userName}</span>, Anda sudah terdaftar di kelas berikut:
            </p>
            <p className="mt-2 text-lg font-semibold text-white">{selectedCourse?.title}</p>
            <button
              onClick={handleConfirmEnroll}
              className="mt-8 inline-flex items-center justify-center rounded-2xl bg-[#10b981] px-8 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
        <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-8 shadow-xl shadow-slate-950/20">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <button
                  onClick={() => window.location.href = '/dashboard'}
                  className="font-medium text-[#00a3ff] transition hover:text-blue-300"
                >
                  Dashboard
                </button>
                <span>/</span>
                <span className="text-slate-300">Training List</span>
              </div>
              <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Training List</h1>
              <p className="mt-3 max-w-2xl text-slate-400 sm:text-lg">
                Selamat datang, <span className="font-semibold text-[#00a3ff]">{userName}</span>. Pilih pelatihan yang ingin Anda ambil dan lanjutkan ke materi belajar.
              </p>
            </div>
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Cari kelas..."
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-[#00a3ff] focus:ring-2 focus:ring-[#00a3ff]/20"
              />
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {FILTER_ITEMS.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  activeFilter === filter
                    ? 'border-[#00a3ff] bg-[#00a3ff]/10 text-[#00a3ff]'
                    : 'border-slate-700 bg-slate-950/90 text-slate-300 hover:border-[#00a3ff] hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-2">
          {filteredCourses.length === 0 ? (
            <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-10 text-center text-slate-400">
              Tidak ada kelas yang sesuai. Coba kata kunci lain atau pilih kategori berbeda.
            </div>
          ) : (
            filteredCourses.map((course) => (
              <article
                key={course.id}
                className="group overflow-hidden rounded-3xl border border-slate-700 bg-slate-950/90 p-6 shadow-md shadow-slate-950/20 transition hover:-translate-y-1 hover:border-[#00a3ff]"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="rounded-full bg-[#00a3ff]/10 px-4 py-2 text-sm font-semibold text-[#00a3ff]">
                    {course.category}
                  </span>
                  <span className="text-sm text-slate-500">{course.duration}</span>
                </div>
                <h2 className="mt-6 text-2xl font-semibold text-white">{course.title}</h2>
                <p className="mt-4 text-slate-300 leading-7">{course.description}</p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Instruktur</p>
                    <p className="mt-1 text-base font-medium text-white">{course.instructor}</p>
                  </div>
                  <button
                    onClick={() => handleEnroll(course)}
                    className="inline-flex items-center justify-center rounded-2xl bg-[#00a3ff] px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-blue-500"
                  >
                    ambil pelatihan ini
                  </button>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
