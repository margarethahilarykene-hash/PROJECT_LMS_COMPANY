'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface QuizQuestion {
  id: number;
  question: string;
  options: [string, string, string, string];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Manakah praktik terbaik saat menggunakan layanan AI publik untuk memastikan informasi sensitif tidak bocor?',
    options: [
      'Gunakan data asli yang lengkap agar AI lebih memahami konteks.',
      'Hapus data sensitif dan gunakan data dummy jika perlu.',
      'Bagikan kredensial sementara kepada AI untuk akses otomatis.',
      'Simpan dokumen internal dalam prompt tanpa filter.',
    ],
    correctAnswer: 'B',
  },
  {
    id: 2,
    question: 'Prompt engineering terbaik seharusnya mencakup elemen apa saja?',
    options: [
      'Peran, tugas, detail data, dan format output.',
      'Hanya memberi satu kata kunci agar AI bebas menjawab.',
      'Menggunakan jargon teknis agar terlihat profesional.',
      'Menyalin pertanyaan dari internet tanpa konteks.',
    ],
    correctAnswer: 'A',
  },
  {
    id: 3,
    question: 'Apa tanda utama email phishing yang harus diwaspadai?',
    options: [
      'Alamat pengirim dari domain resmi perusahaan.',
      'Permintaan data pribadi atau kredensial secara mendesak.',
      'Pesan dengan tata bahasa sempurna dan sopan.',
      'Link internal ke portal TI perusahaan.',
    ],
    correctAnswer: 'B',
  },
  {
    id: 4,
    question: 'Mengapa Multi-Factor Authentication (MFA) penting dalam keamanan kata sandi?',
    options: [
      'Karena menggantikan kebutuhan kata sandi kuat sepenuhnya.',
      'Karena memperlambat proses login secara signifikan.',
      'Karena menambahkan lapisan verifikasi kedua di luar kata sandi.',
      'Karena hanya berguna untuk aplikasi non-produktif.',
    ],
    correctAnswer: 'C',
  },
  {
    id: 5,
    question: 'Dalam active listening, apa yang paling penting dilakukan saat rekan berbicara?',
    options: [
      'Memikirkan jawaban selanjutnya sambil berbicara.',
      'Mendengarkan, merangkum, dan memberikan respons yang jelas.',
      'Menginterupsi jika sudah tahu solusinya.',
      'Mengabaikan bahasa tubuh karena hanya kata-kata yang penting.',
    ],
    correctAnswer: 'B',
  },
  {
    id: 6,
    question: 'Metode 5-Whys membantu tim menemukan apa?',
    options: [
      'Solusi jangka panjang tanpa memeriksa akar masalah.',
      'Akar penyebab masalah melalui lima pertanyaan mendalam.',
      'Jumlah biaya yang dibutuhkan untuk proyek baru.',
      'Langkah-langkah arbitrer tanpa analisis data.',
    ],
    correctAnswer: 'B',
  },
  {
    id: 7,
    question: 'Model SBI dalam umpan balik terdiri dari situasi, perilaku, dan apa?',
    options: [
      'Imbalan yang akan diterima setelah umpan balik.',
      'Impact atau dampak yang ditimbulkan dari perilaku.',
      'Ide-ide tambahan untuk mengenali karyawan.',
      'Batasan waktu untuk perubahan perilaku.',
    ],
    correctAnswer: 'B',
  },
  {
    id: 8,
    question: 'Saat konflik tim muncul, strategi terbaik adalah?',
    options: [
      'Memihak satu pihak tanpa mendengar semua sisi.',
      'Fokus pada isu, dengarkan dua pihak, dan cari solusi bersama.',
      'Menghindari pembicaraan agar konflik hilang sendiri.',
      'Menggunakan ancaman agar masalah cepat selesai.',
    ],
    correctAnswer: 'B',
  },
  {
    id: 9,
    question: 'Papan Kanban membantu tim dalam hal apa?',
    options: [
      'Menyembunyikan tugas yang belum selesai.',
      'Membagi pekerjaan dalam kolom visual untuk peningkatan alur kerja.',
      'Menggantikan rapat harian secara total.',
      'Mengacak prioritas sesuai mood tim.',
    ],
    correctAnswer: 'B',
  },
  {
    id: 10,
    question: 'Social engineering cenderung memanfaatkan apa dari target?',
    options: [
      'Ketidakpedulian terhadap keamanan TI.',
      'Kepercayaan dan respons emosional target.',
      'Kemampuan teknis yang kuat.',
      'Koneksi jaringan yang terbatas.',
    ],
    correctAnswer: 'B',
  },
];

export default function QuizzesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Employee');
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D' | ''>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];

  const correctCount = useMemo(
    () => QUIZ_QUESTIONS.filter((question) => selectedAnswers[question.id] === question.correctAnswer).length,
    [selectedAnswers]
  );

  const wrongCount = useMemo(
    () => QUIZ_QUESTIONS.filter((question) => selectedAnswers[question.id] && selectedAnswers[question.id] !== question.correctAnswer).length,
    [selectedAnswers]
  );

  const score = correctCount * 10;

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;

      if (!user) {
        router.push('/login');
        return;
      }

      const fullName = user.user_metadata?.full_name;
      const fallbackName = user.email === 'margarethahilarykene@gmail.com' ? 'Margaretha Hilary Kene' : user.email?.split('@')[0] ?? 'Employee';
      setUserName(fullName || fallbackName);
      setLoading(false);
    };

    checkUser();
  }, [router]);

  const handleStartQuiz = () => {
    setCurrentStep(2);
  };

  const handleAnswerSelect = (answer: 'A' | 'B' | 'C' | 'D') => {
    setSelectedAnswers((prev) => ({ ...prev, [currentQuestion.id]: answer }));
  };

  const handleNextQuestion = () => {
    if (!selectedAnswers[currentQuestion.id]) return;

    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex((index) => index + 1);
    } else {
      setQuizSubmitted(true);
      setCurrentStep(3);
    }
  };

  const handleFinishQuiz = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('quizCompleted', 'true');

      // Populate completed_quizzes
      try {
        const completed = localStorage.getItem('completed_quizzes');
        const completedArr = completed ? JSON.parse(completed) : [];
        if (!completedArr.includes('quiz_01')) {
          completedArr.push('quiz_01');
        }
        localStorage.setItem('completed_quizzes', JSON.stringify(completedArr));
      } catch (e) {
        localStorage.setItem('completed_quizzes', JSON.stringify(['quiz_01']));
      }

      // Populate user_scores
      try {
        const scores = localStorage.getItem('user_scores');
        const scoresArr = scores ? JSON.parse(scores) : [];
        scoresArr.push(score);
        localStorage.setItem('user_scores', JSON.stringify(scoresArr));
      } catch (e) {
        localStorage.setItem('user_scores', JSON.stringify([score]));
      }

      // Populate unlocked_certificates
      try {
        const certs = localStorage.getItem('unlocked_certificates');
        const certsArr = certs ? JSON.parse(certs) : [];
        if (!certsArr.includes('cert_01')) {
          certsArr.push('cert_01');
        }
        localStorage.setItem('unlocked_certificates', JSON.stringify(certsArr));
      } catch (e) {
        localStorage.setItem('unlocked_certificates', JSON.stringify(['cert_01']));
      }
    }
    window.location.href = '/dashboard';
  };

  const progressPercent = Math.round(((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060913] text-slate-100 flex items-center justify-center px-6">
        <div className="rounded-3xl border border-slate-700 bg-slate-900/90 p-10 text-center shadow-2xl shadow-slate-950/40">
          <p className="text-lg font-semibold text-white">Memeriksa sesi Anda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 px-6 py-8 lg:px-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <nav className="rounded-3xl border border-slate-700 bg-slate-900/80 p-4 text-sm text-slate-400">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/dashboard" className="text-[#00a3ff] hover:text-blue-300">
                Dashboard
              </Link>
            </li>
            <li className="select-none">/</li>
            <li className="font-semibold text-white">Evaluation Quizzes</li>
          </ol>
        </nav>

        {currentStep === 1 && (
          <section className="rounded-3xl border border-slate-700 bg-slate-900/85 p-10 shadow-2xl shadow-slate-950/30">
            <h1 className="text-4xl font-semibold text-white">Evaluation Quizzes</h1>
            <p className="mt-4 text-slate-300 leading-8">
              Harap baca pertanyaan dengan seksama dan pilihlah satu jawaban yang paling tepat sebelum melanjutkan.
            </p>
            <div className="mt-6 space-y-3 rounded-3xl border border-slate-800 bg-[#07111f]/90 p-6 text-slate-300">
              <p>Ujian terdiri dari 10 soal pilihan ganda, masing-masing bernilai 10 poin.</p>
              <p className="font-semibold text-white">Maksimal Nilai: 100</p>
            </div>
            <p className="mt-6 text-slate-300">Semangat, {userName}! Siapkan fokus terbaikmu untuk menyelesaikan evaluasi ini.</p>
            <button
              type="button"
              onClick={handleStartQuiz}
              className="mt-8 inline-flex items-center justify-center rounded-3xl bg-[#00a3ff] px-7 py-4 text-sm font-semibold text-slate-950 transition hover:bg-[#0092e4]"
            >
              Mulai Mengerjakan Kuis
            </button>
          </section>
        )}

        {currentStep === 2 && (
          <section className="rounded-3xl border border-slate-700 bg-slate-900/85 p-8 shadow-2xl shadow-slate-950/30">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Pertanyaan Aktif</p>
                <h2 className="text-3xl font-semibold text-white">Pertanyaan {currentQuestionIndex + 1} dari 10</h2>
              </div>
              <div className="w-full max-w-sm">
                <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full rounded-full bg-[#00a3ff] transition-all" style={{ width: `${progressPercent}%` }} />
                </div>
                <p className="mt-2 text-sm text-slate-400">Progress: {progressPercent}%</p>
              </div>
            </div>

            <div className="mt-8 rounded-3xl border border-slate-800 bg-[#08111f]/90 p-8">
              <p className="text-lg font-semibold text-slate-100">{currentQuestion.question}</p>
              <div className="mt-6 grid gap-4">
                {currentQuestion.options.map((option, index) => {
                  const optionKey = ['A', 'B', 'C', 'D'][index] as 'A' | 'B' | 'C' | 'D';
                  const isSelected = selectedAnswers[currentQuestion.id] === optionKey;
                  return (
                    <button
                      key={optionKey}
                      type="button"
                      onClick={() => handleAnswerSelect(optionKey)}
                      className={`w-full rounded-3xl border px-5 py-4 text-left text-sm transition ${isSelected ? 'border-[#00a3ff] bg-[#00a3ff]/15 text-white' : 'border-slate-700 bg-slate-950/90 text-slate-300 hover:border-[#00a3ff]'}`}
                    >
                      <div className="flex items-start gap-4">
                        <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-sm font-semibold text-slate-300">{optionKey}</span>
                        <span className="leading-6">{option}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={handleNextQuestion}
                disabled={!selectedAnswers[currentQuestion.id]}
                className={`inline-flex items-center justify-center rounded-3xl px-6 py-4 text-sm font-semibold transition ${selectedAnswers[currentQuestion.id] ? 'bg-[#10b981] text-white hover:bg-emerald-500' : 'bg-slate-700 text-slate-400 opacity-50 cursor-not-allowed'}`}
              >
                {currentQuestionIndex < QUIZ_QUESTIONS.length - 1 ? 'Pertanyaan Berikutnya' : 'Selesaikan Kuis'}
              </button>
            </div>
          </section>
        )}

        {currentStep === 3 && (
          <section className="rounded-3xl border border-slate-700 bg-slate-900/85 p-10 shadow-2xl shadow-slate-950/30 text-center">
            <div className="mx-auto mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-[#10b981]/10 text-4xl text-[#10b981]">
              ✓
            </div>
            <h1 className="text-4xl font-semibold text-white">Selamat! Evaluasi Anda Selesai.</h1>
            <p className="mt-4 text-slate-300">Nilai Anda telah dihitung secara otomatis dan tercatat di sistem.</p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-slate-700 bg-slate-950/90 p-6">
                <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Jawaban Benar</p>
                <p className="mt-3 text-3xl font-semibold text-white">{correctCount}</p>
              </div>
              <div className="rounded-3xl border border-slate-700 bg-slate-950/90 p-6">
                <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Jawaban Salah</p>
                <p className="mt-3 text-3xl font-semibold text-white">{wrongCount}</p>
              </div>
              <div className="rounded-3xl border border-slate-700 bg-slate-950/90 p-6">
                <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Nilai Akhir</p>
                <p className="mt-3 text-3xl font-semibold text-[#10b981]">{score}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleFinishQuiz}
              className="mt-10 inline-flex items-center justify-center rounded-3xl bg-[#10b981] px-8 py-4 text-sm font-semibold text-white transition hover:bg-emerald-500"
            >
              OK
            </button>
          </section>
        )}
      </div>
    </div>
  );
}
