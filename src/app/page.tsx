import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-5xl flex-col justify-center">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <section className="space-y-6 text-center lg:text-left">
            <div className="inline-flex rounded-full bg-sky-500/15 px-4 py-2 text-sm font-medium text-sky-200 ring-1 ring-sky-500/20">
              LMS Company
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Learning Management System
              </h1>
              <p className="max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                Masuk untuk mulai mengeksplorasi modul pelatihan dan upgrade skill karyawan secara profesional.
              </p>
            </div>
          </section>

          <section className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.9)] backdrop-blur-sm sm:p-10">
            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Selamat Datang
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-white">Login ke akun Anda</h2>
              </div>

              <form className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-slate-300">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-slate-300">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Masukkan password Anda"
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>

                <Link
                  href="/dashboard"
                  className="flex w-full items-center justify-center rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                >
                  Login
                </Link>
              </form>

              <p className="text-center text-sm text-slate-500">
                Belum perlu database atau autentikasi nyata. Halaman ini hanya tampilan awal.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
