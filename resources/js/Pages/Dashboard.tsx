import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

interface DashboardProps {
    stats: {
        total_anggota: number;
        total_divisi: number;
        total_periode: number;
        total_berita: number;
        total_admin: number;
    }
}

export default function Dashboard({ stats }: DashboardProps) {
    return (
        <AuthenticatedLayout header="Dashboard">
            <Head title="Dashboard" />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Total Anggota */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4 group hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Anggota</p>
                        <p className="text-3xl font-extrabold text-slate-900">{stats.total_anggota}</p>
                    </div>
                </div>

                {/* Total Divisi */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4 group hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Divisi</p>
                        <p className="text-3xl font-extrabold text-slate-900">{stats.total_divisi}</p>
                    </div>
                </div>

                {/* Total Periode */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4 group hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Periode</p>
                        <p className="text-3xl font-extrabold text-slate-900">{stats.total_periode}</p>
                    </div>
                </div>

                {/* Total Berita */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4 group hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-colors">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Berita</p>
                        <p className="text-3xl font-extrabold text-slate-900">{stats.total_berita}</p>
                    </div>
                </div>

                {/* Total Admin */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4 group hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Admin</p>
                        <p className="text-3xl font-extrabold text-slate-900">{stats.total_admin}</p>
                    </div>
                </div>
            </div>

            {/* Recent Activity Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Pengurus Terbaru</h3>
                    <div className="text-sm text-slate-500 italic">Belum ada pengurus ditambahkan.</div>
                </div>
                
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Berita Terbaru</h3>
                    <div className="text-sm text-slate-500 italic">Belum ada berita dipublikasikan.</div>
                </div>
            </div>
            
        </AuthenticatedLayout>
    );
}
