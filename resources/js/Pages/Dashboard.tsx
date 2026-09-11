import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

interface RecentMember {
    id: number;
    name: string;
    role_name: string;
    photo_path: string | null;
    division?: { id: number; name: string } | null;
    created_at: string;
}

interface RecentNews {
    id: number;
    title: string;
    slug: string;
    status: 'draft' | 'published';
    category?: { id: number; name: string } | null;
    created_at: string;
    published_at: string | null;
}

interface DashboardProps {
    stats: {
        total_anggota: number;
        total_divisi: number;
        total_periode: number;
        total_berita: number;
        total_admin: number;
    };
    recentMembers: RecentMember[];
    recentNews: RecentNews[];
}

export default function Dashboard({ stats, recentMembers, recentNews }: DashboardProps) {
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
                {/* Pengurus Terbaru */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-slate-900">Pengurus Terbaru</h3>
                        <Link href={route('admin.organization.index')} className="text-xs font-semibold text-[#5B3E93] hover:underline">
                            Lihat Semua →
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {recentMembers && recentMembers.length > 0 ? (
                            recentMembers.map((member) => (
                                <div key={member.id} className="px-6 py-3.5 flex items-center gap-3.5 hover:bg-slate-50/60 transition-colors">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0 overflow-hidden">
                                        {member.photo_path ? (
                                            <img src={member.photo_path} alt={member.name} className="w-full h-full object-cover" />
                                        ) : (
                                            member.name.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-slate-800 truncate">{member.name}</p>
                                        <p className="text-xs text-slate-500 truncate">
                                            {member.role_name}
                                            {member.division && <span className="text-slate-400"> · {member.division.name}</span>}
                                        </p>
                                    </div>
                                    <time className="text-[11px] text-slate-400 shrink-0">
                                        {new Date(member.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                    </time>
                                </div>
                            ))
                        ) : (
                            <div className="px-6 py-10 text-center">
                                <svg className="w-10 h-10 mx-auto text-slate-200 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <p className="text-sm text-slate-400">Belum ada pengurus ditambahkan.</p>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Berita Terbaru */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-slate-900">Berita Terbaru</h3>
                        <Link href={route('admin.news.index')} className="text-xs font-semibold text-[#5B3E93] hover:underline">
                            Lihat Semua →
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {recentNews && recentNews.length > 0 ? (
                            recentNews.map((article) => (
                                <div key={article.id} className="px-6 py-3.5 flex items-center gap-3.5 hover:bg-slate-50/60 transition-colors">
                                    <div className="w-9 h-9 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                                        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-slate-800 truncate">{article.title}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                                                article.status === 'published'
                                                    ? 'bg-emerald-50 text-emerald-600'
                                                    : 'bg-amber-50 text-amber-600'
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${article.status === 'published' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                                                {article.status === 'published' ? 'Published' : 'Draft'}
                                            </span>
                                            {article.category && (
                                                <span className="text-[11px] text-slate-400">{article.category.name}</span>
                                            )}
                                        </div>
                                    </div>
                                    <time className="text-[11px] text-slate-400 shrink-0">
                                        {new Date(article.published_at || article.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                    </time>
                                </div>
                            ))
                        ) : (
                            <div className="px-6 py-10 text-center">
                                <svg className="w-10 h-10 mx-auto text-slate-200 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                </svg>
                                <p className="text-sm text-slate-400">Belum ada berita dipublikasikan.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
        </AuthenticatedLayout>
    );
}

