import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import { FlipCard } from '@/Components/FlipCard';

interface Period {
    id: number;
    name: string;
}

interface Division {
    id: number;
    name: string;
}

interface Member {
    id: number;
    name: string;
    nim: string | null;
    role_name: string;
    photo_path: string | null;
    bio: string | null;
    instagram_url: string | null;
}

export default function PeriodMembers({
    period,
    division,
    members,
}: PageProps<{ period: Period; division: Division; members: Member[] }>) {
    return (
        <>
            <Head title={`Anggota ${division.name} - Periode ${period.name}`} />

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
                        <div className="particle particle-1" /><div className="particle particle-4" />
                        <div className="particle particle-8" /><div className="particle particle-11" />
                        <div className="bokeh bokeh-1" /><div className="bokeh bokeh-4" />
                    </div>
                </div>

                <Navbar transparent={false} />

                <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-28 pt-4">
                    {/* Breadcrumb Navigation */}
                    <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-400 mb-8">
                        <Link href="/periode" className="hover:text-cyan-400 font-medium transition-colors">
                            Periode Kepengurusan
                        </Link>
                        <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                        <Link href={`/periode/${period.id}`} className="hover:text-cyan-400 font-medium transition-colors">
                            Periode {period.name}
                        </Link>
                        <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="font-semibold text-white">{division.name}</span>
                    </nav>

                    {/* Header Section */}
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-900/60 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-500/30">
                            Profil Anggota & Pengurus
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                            {division.name}
                        </h1>
                        <p className="mt-4 text-lg text-slate-300">
                            Pengurus dan Anggota Divisi {division.name} — Periode Kepengurusan <span className="font-bold text-cyan-400">{period.name}</span>.
                        </p>
                    </div>

                    {/* 4-Column Grid with Original FlipCard */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                        {members && members.length > 0 ? (
                            members.map((member) => (
                                <div key={member.id} className="w-full flex justify-center">
                                    <FlipCard
                                        data={{
                                            name: member.name,
                                            username: member.role_name,
                                            periodName: period.name,
                                            nim: member.nim || undefined,
                                            image: member.photo_path || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=e2e8f0&color=475569&size=256`,
                                            bio: member.bio || `Bertugas sebagai ${member.role_name} HMPS MI untuk masa jabatan Periode ${period.name}.`,
                                            stats: { 
                                                posts: 0, 
                                                followers: 0, 
                                                following: 0 
                                            },
                                            socialLinks: {
                                                github: '#',
                                                twitter: '#',
                                                instagram: member.instagram_url || '#'
                                            }
                                        }}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="col-span-1 sm:col-span-2 lg:col-span-4 text-center text-slate-400 py-12 bg-white/5 rounded-3xl border border-white/10">
                                Belum ada pengurus di divisi ini untuk periode {period.name}.
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}
