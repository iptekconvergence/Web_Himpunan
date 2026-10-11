import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
    transparent?: boolean;
    wrapperClassName?: string;
}

const NAV_LINKS = [
    { label: 'Home',    href: '/'         },
    { label: 'Periode', href: '/periode'  },
    { label: 'Berita',  href: '/berita'   },
    { label: 'Contact', href: '/#contact' },
] as const;

export default function Navbar({ transparent = false, wrapperClassName = '' }: NavbarProps) {
    const { auth, global_settings } = usePage<{
        auth: { user: any };
        global_settings?: Record<string, string>;
    }>().props;

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    const isActive = (href: string) => {
        if (href === '/') return currentPath === '/';
        if (href.includes('#')) return false;
        return currentPath === href || currentPath.startsWith(href + '/');
    };

    const linkCls = (href: string) => [
        'text-sm font-medium transition-colors duration-150',
        isActive(href) ? 'text-cyan-400' : 'text-slate-300 hover:text-white',
    ].join(' ');

    return (
        <div className={`fixed top-0 left-0 right-0 z-50 w-full bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 ${wrapperClassName}`}>
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

                {/* Left: Logo */}
                <Link href="/" className="flex items-center gap-2.5 group shrink-0">
                    <ApplicationLogo
                        src={global_settings?.logo || global_settings?.logo_url}
                        className="h-9 w-auto"
                    />
                    <div className="flex flex-col leading-tight">
                        <span className="font-semibold tracking-tight text-white text-sm group-hover:text-cyan-300 transition-colors">
                            {global_settings?.site_name || 'HMPS MI'}
                        </span>
                        <span className="text-[10px] text-slate-400 tracking-wide uppercase">
                            {global_settings?.campus_name || 'Politeknik Negeri Medan'}
                        </span>
                    </div>
                </Link>

                {/* Center: Desktop nav */}
                <div className="hidden md:flex items-center gap-1">
                    {NAV_LINKS.map(({ label, href }) => (
                        <Link
                            key={label}
                            href={href}
                            className={`${linkCls(href)} px-3 py-1.5 rounded-full hover:bg-slate-800/60`}
                        >
                            {label}
                        </Link>
                    ))}
                </div>

                {/* Right: Auth + hamburger */}
                <div className="flex items-center gap-2">
                    {auth.user ? (
                        <Link
                            href={route('dashboard')}
                            className="hidden md:inline-flex text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-full hover:bg-slate-800/60 transition-colors"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <div className="hidden md:flex items-center gap-2">
                            <Link
                                href={route('login')}
                                className="text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-full hover:bg-slate-800/60 transition-colors"
                            >
                                Masuk
                            </Link>
                            <Link
                                href={route('register')}
                                className="text-sm font-medium text-white px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90 transition-opacity"
                            >
                                Daftar
                            </Link>
                        </div>
                    )}

                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                        aria-label={isMenuOpen ? 'Tutup menu' : 'Buka menu'}
                    >
                        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile dropdown — no animation, instant show/hide */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-slate-800 bg-slate-900 px-6 py-4 flex flex-col gap-1">
                    {NAV_LINKS.map(({ label, href }) => (
                        <Link
                            key={label}
                            href={href}
                            onClick={() => setIsMenuOpen(false)}
                            className={`${linkCls(href)} px-3 py-2.5 rounded-xl hover:bg-slate-800`}
                        >
                            {label}
                        </Link>
                    ))}

                    <div className="mt-3 pt-3 border-t border-slate-800 flex flex-col gap-2">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                onClick={() => setIsMenuOpen(false)}
                                className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2.5 rounded-xl hover:bg-slate-800 transition-colors"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2.5 rounded-xl hover:bg-slate-800 transition-colors"
                                >
                                    Masuk
                                </Link>
                                <Link
                                    href={route('register')}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-sm font-medium text-white text-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90 transition-opacity"
                                >
                                    Daftar
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
