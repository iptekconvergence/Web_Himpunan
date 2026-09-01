import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState } from 'react';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans relative">
            
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-30 w-72 bg-white border-r border-slate-200 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-transform duration-300 lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-20 flex items-center px-8 border-b border-slate-100 shrink-0">
                    <Link href="/">
                        <ApplicationLogo className="block h-10 w-auto" />
                    </Link>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-4">
                    <nav className="space-y-2">
                        <Link
                            href={route('dashboard')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                                route().current('dashboard')
                                    ? 'bg-[#5B3E93] text-white shadow-md shadow-indigo-500/20'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-[#5B3E93]'
                            }`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                            Dashboard
                        </Link>
                        <Link
                            href={route('admin.settings.index')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                                route().current('admin.settings.*')
                                    ? 'bg-[#5B3E93] text-white shadow-md shadow-indigo-500/20'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-[#5B3E93]'
                            }`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Pengaturan Website
                        </Link>
                        <Link
                            href={route('admin.landing.index')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                                route().current('admin.landing.*')
                                    ? 'bg-[#5B3E93] text-white shadow-md shadow-indigo-500/20'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-[#5B3E93]'
                            }`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Landing Page
                        </Link>
                        <Link
                            href={route('admin.organization.index')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                                route().current('admin.organization.*')
                                    ? 'bg-[#5B3E93] text-white shadow-md shadow-indigo-500/20'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-[#5B3E93]'
                            }`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Struktur Organisasi
                        </Link>
                        <Link
                            href={route('admin.news.index')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                                route().current('admin.news.*')
                                    ? 'bg-[#5B3E93] text-white shadow-md shadow-indigo-500/20'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-[#5B3E93]'
                            }`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                            Berita
                        </Link>
                        <Link
                            href={route('admin.users.index')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                                route().current('admin.users.*')
                                    ? 'bg-[#5B3E93] text-white shadow-md shadow-indigo-500/20'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-[#5B3E93]'
                            }`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            Pengguna
                        </Link>
                        <Link
                            href={route('profile.edit')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                                route().current('profile.edit')
                                    ? 'bg-[#5B3E93] text-white shadow-md shadow-indigo-500/20'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-[#5B3E93]'
                            }`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Profile Saya
                        </Link>
                    </nav>
                </div>

                <div className="p-4 border-t border-slate-100 shrink-0">
                    <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5B3E93] to-[#06B6D4] flex items-center justify-center text-white font-bold shrink-0 shadow-md">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                            <p className="text-xs font-medium text-slate-500 truncate">{user.email}</p>
                        </div>
                    </div>
                    
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Log Out
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Decorative Blob */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#06B6D4]/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3 z-0"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#5B3E93]/5 rounded-full blur-[100px] pointer-events-none translate-y-1/3 -translate-x-1/4 z-0"></div>
                
                {/* Header */}
                <header className="h-20 shrink-0 flex items-center px-4 lg:px-8 border-b border-slate-200/60 bg-white/60 backdrop-blur-md z-10 sticky top-0 justify-between">
                    <div className="flex items-center gap-4">
                        <button 
                            className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        {header && (
                            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight leading-none">
                                {header}
                            </h2>
                        )}
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 z-10 relative">
                    <div className="max-w-6xl mx-auto space-y-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
