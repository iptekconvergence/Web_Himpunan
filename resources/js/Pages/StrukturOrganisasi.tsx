import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Navbar from '@/Components/Navbar';
import { FlipCard } from '@/Components/FlipCard';

interface Period { id: number; name: string; }
interface Division { id: number; name: string; }
interface Member {
    id: number;
    name: string;
    role_name: string;
    photo_path: string | null;
    instagram_url: string | null;
    bio: string | null;
}

export default function StrukturOrganisasi({
    divisi,
    divisiName,
    division,
    members,
    activePeriod,
    auth,
    laravelVersion,
    phpVersion,
}: PageProps<{ divisi: string; divisiName: string; division: Division; members: Member[]; activePeriod: Period | null; laravelVersion: string; phpVersion: string }>) {
    
    return (
        <>
            <Head title={`Struktur Organisasi - ${divisiName}`} />
            
            <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-indigo-500 selection:text-white pb-24">
                
                {/* Same Navbar as Landing Page - solid style for white bg pages */}
                <Navbar transparent={false} />

                <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-28 pt-4">
                    {/* Section Title */}
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                            {divisiName}
                        </h2>
                        <p className="mt-2 text-base font-semibold leading-7 text-[#5B3E93] uppercase tracking-wide">
                            Periode {activePeriod ? activePeriod.name : '-'}
                        </p>
                    </div>

                    {/* 4-Column Grid for Members */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                        {members.length > 0 ? members.map((member) => (
                            <div key={member.id} className="w-full flex justify-center">
                                <FlipCard
                                    data={{
                                        name: member.name,
                                        username: member.role_name,
                                        image: member.photo_path || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=e2e8f0&color=475569&size=256`,
                                        bio: member.bio || `Bertugas sebagai ${member.role_name} HMPS MI untuk masa jabatan ${activePeriod ? activePeriod.name : ''}.`,
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
                        )) : (
                            <div className="col-span-1 sm:col-span-2 lg:col-span-4 text-center text-slate-500 py-12">Belum ada pengurus di divisi ini.</div>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}
