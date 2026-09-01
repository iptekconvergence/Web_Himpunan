import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';

interface Period {
    id: number;
    name: string;
    is_active: boolean;
}

interface Division {
    id: number;
    name: string;
    slug: string;
    icon: string | null;
    description: string | null;
    members_count?: number;
}

export default function PeriodDivisions({
    period,
    divisions,
}: PageProps<{ period: Period; divisions: Division[] }>) {
    return (
        <>
            <Head title={`Divisi Periode ${period.name} - HMPS MI`} />

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
                        <div className="particle particle-2" /><div className="particle particle-4" />
                        <div className="particle particle-6" /><div className="particle particle-9" />
                        <div className="bokeh bokeh-2" /><div className="bokeh bokeh-4" />
                    </div>
                </div>

                <Navbar transparent={false} />

                <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-28 pt-4">
                    {/* Breadcrumb Navigation */}
                    <nav className="flex items-center gap-2 text-sm text-slate-400 mb-8">
                        <Link href="/periode" className="hover:text-cyan-400 font-medium transition-colors">
                            Periode Kepengurusan
                        </Link>
                        <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="font-semibold text-white">Periode {period.name}</span>
                    </nav>

                    {/* Header Section */}
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-900/60 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-500/30">
                            Struktur Organsiasi
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                            Daftar Divisi
                        </h1>
                        <p className="mt-4 text-lg text-slate-300">
                            Divisi dan BPH HMPS Manajemen Informatika Periode <span className="font-bold text-cyan-400">{period.name}</span>. Pilih divisi untuk melihat profil pengurus.
                        </p>
                    </div>

                    {/* Divisions Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {divisions && divisions.length > 0 ? (
                            divisions.map((division) => (
                                <Link
                                    key={division.id}
                                    href={`/periode/${period.id}/divisi/${division.id}`}
                                    className="group relative bg-white/5 backdrop-blur-md rounded-3xl p-8 shadow-lg border border-white/10 hover:shadow-2xl hover:shadow-cyan-500/20 hover:border-white/20 transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between"
                                >
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 text-cyan-400 flex items-center justify-center p-3 group-hover:bg-cyan-400 group-hover:text-slate-900 transition-all duration-300 shadow-sm">
                                            {division.icon ? (
                                                <img src={division.icon} alt={division.name} className="w-full h-full object-contain drop-shadow-md" />
                                            ) : (
                                                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                            )}
                                        </div>

                                        <span className="text-xs font-semibold text-slate-300 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                                            {division.members_count ?? 0} Anggota
                                        </span>
                                    </div>

                                    <div>
                                        <h2 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors mb-3">
                                            {division.name}
                                        </h2>
                                        <p className="text-slate-300 text-sm line-clamp-3 mb-6">
                                            {division.description || `Divisi ${division.name} HMPS Manajemen Informatika Periode ${period.name}.`}
                                        </p>
                                    </div>

                                    <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                                        <span className="text-sm font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform">
                                            Lihat Profil Anggota &rarr;
                                        </span>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-16 bg-white/5 rounded-3xl border border-white/10">
                                <p className="text-slate-400 text-lg">Belum ada divisi yang didaftarkan untuk periode ini.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}
