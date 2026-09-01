import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';

interface Period {
    id: number;
    name: string;
    is_active: boolean;
    notes?: string | null;
    divisions_count?: number;
}

export default function PeriodIndex({
    periods,
}: PageProps<{ periods: Period[] }>) {
    return (
        <>
            <Head title="Periode Kepengurusan - HMPS MI" />

        <div className="futuristic-page min-h-screen font-sans text-slate-100 selection:bg-indigo-500 selection:text-white pb-24">

                {/* Fixed futuristic background canvas */}
                <div className="bg-canvas" aria-hidden="true">
                    <div className="bg-radial-base" />
                    <div className="bg-glow-tl" />
                    <div className="bg-glow-br" />
                    <div className="bg-glow-center" />
                    <svg className="bg-abstract-lines" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
                        <path d="M-100 600 Q300 200 700 500 T1540 300" stroke="rgba(0,140,255,0.7)" strokeWidth="1.5" fill="none"/>
                        <path d="M1540 100 Q1100 500 700 200 T-100 400" stroke="rgba(30,80,220,0.6)" strokeWidth="1.2" fill="none"/>
                    </svg>
                    <div className="bg-particles">
                        <div className="particle particle-1" /><div className="particle particle-3" />
                        <div className="particle particle-5" /><div className="particle particle-7" />
                        <div className="bokeh bokeh-1" /><div className="bokeh bokeh-3" />
                    </div>
                </div>

                <Navbar transparent={false} />

                <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-28 pt-4">
                    {/* Header Section */}
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-900/60 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-500/30">
                            Pintu Masuk Kepengurusan
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                            Periode Kepengurusan
                        </h1>
                        <p className="mt-4 text-lg text-slate-300">
                            Pilih periode kepengurusan HMPS Manajemen Informatika Politeknik Negeri Medan untuk melihat struktur divisi dan profil anggota pengurus.
                        </p>
                    </div>

                    {/* Periods Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {periods && periods.length > 0 ? (
                            periods.map((period) => (
                                <Link
                                    key={period.id}
                                    href={`/periode/${period.id}`}
                                    className="group relative bg-white/5 backdrop-blur-md rounded-3xl p-8 shadow-lg border border-white/10 hover:shadow-2xl hover:shadow-cyan-500/20 hover:border-white/20 transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-bl-full -z-0 group-hover:scale-110 transition-transform duration-500"></div>

                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-6">
                                            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                                                HMPS MI
                                            </span>
                                            {period.is_active ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
                                                    <span className="relative flex h-2 w-2">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                                    </span>
                                                    Periode Aktif
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 rounded-full bg-white/10 text-slate-400 text-xs font-medium">
                                                    Alumni
                                                </span>
                                            )}
                                        </div>

                                        <h2 className="text-3xl font-black text-white group-hover:text-cyan-400 transition-colors mb-3">
                                            Periode {period.name}
                                        </h2>

                                        {period.notes && (
                                            <p className="text-slate-300 text-sm line-clamp-2 mb-4">
                                                {period.notes}
                                            </p>
                                        )}
                                    </div>

                                    <div className="relative z-10 pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
                                        <span className="text-sm font-medium text-slate-400">
                                            Lihat Struktur Divisi
                                        </span>
                                        <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
                                            <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                            </svg>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
            <div className="col-span-full text-center py-16 bg-white/5 rounded-3xl border border-white/10">
                                <p className="text-slate-400 text-lg">Belum ada periode kepengurusan yang terdaftar.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}
