import { BookOpen, BarChart3, Award, FileText } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { label: 'Total Pelatihan', value: '6', color: 'bg-blue-500' },
    { label: 'Quiz Selesai', value: '3', color: 'bg-emerald-500' },
    { label: 'Credit Score', value: '85', color: 'bg-amber-500' },
    { label: 'Sertifikat', value: '2', color: 'bg-purple-500' },
  ];

  const menus = [
    {
      id: 1,
      title: 'Daftar Pelatihan',
      description: 'Lihat semua pelatihan yang tersedia dan daftar sekarang.',
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 2,
      title: 'Materi Pelatihan',
      description: 'Akses materi pembelajaran dan panduan kursus Anda.',
      icon: FileText,
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      id: 3,
      title: 'Quiz + Score',
      description: 'Ikuti quiz dan lihat perkembangan score Anda.',
      icon: BarChart3,
      color: 'from-amber-500 to-amber-600',
    },
    {
      id: 4,
      title: 'E-Sertifikat',
      description: 'Unduh dan bagikan sertifikat pelatihan Anda.',
      icon: Award,
      color: 'from-purple-500 to-purple-600',
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-6 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl space-y-12">
        {/* Header */}
        <section className="space-y-3">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            Dashboard LMS
          </h1>
          <p className="text-lg text-slate-400">
            Selamat Datang, Karyawan
          </p>
        </section>

        {/* Statistics Cards */}
        <section>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900/40 backdrop-blur-sm transition hover:border-slate-600 hover:bg-slate-900/60"
              >
                <div className="p-6">
                  <div className={`inline-block rounded-lg ${stat.color} p-3 text-white mb-4`}>
                    <div className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-medium text-slate-400">{stat.label}</p>
                  <p className="mt-2 text-3xl font-semibold text-white">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Main Menu Cards */}
        <section>
          <h2 className="mb-6 text-2xl font-semibold text-white">Menu Utama</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {menus.map((menu) => {
              const Icon = menu.icon;
              return (
                <button
                  key={menu.id}
                  className="group relative overflow-hidden rounded-2xl p-1 transition duration-300 hover:shadow-2xl"
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${menu.color} opacity-0 transition group-hover:opacity-100`} />

                  {/* Card Content */}
                  <div className="relative space-y-4 rounded-xl bg-slate-900/80 p-6 backdrop-blur-sm transition group-hover:bg-slate-900/40">
                    <div className={`inline-block rounded-lg bg-gradient-to-br ${menu.color} p-3 text-white group-hover:scale-110 transition transform`}>
                      <Icon className="h-6 w-6" />
                    </div>

                    <div className="space-y-2 text-left">
                      <h3 className="text-lg font-semibold text-white">
                        {menu.title}
                      </h3>
                      <p className="text-sm leading-6 text-slate-400 group-hover:text-slate-300 transition">
                        {menu.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <span className="text-sm font-medium text-slate-400 group-hover:text-white transition">
                        Buka
                      </span>
                      <svg
                        className="h-4 w-4 text-slate-400 group-hover:translate-x-1 group-hover:text-white transition transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Footer Info */}
        <section className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-6 text-center backdrop-blur-sm sm:p-8">
          <p className="text-sm text-slate-400">
            💡 Dashboard ini adalah tampilan awal tanpa database atau autentikasi.
          </p>
        </section>
      </div>
    </main>
  );
}
