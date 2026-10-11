import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
    transparent?: boolean;
    wrapperClassName?: string;
}

const NAV_LINKS = [
    { label: 'Home',    href: '/' },
    { label: 'Periode', href: '/periode' },
    { label: 'Berita',  href: '/berita' },
    { label: 'Contact', href: '/#contact' },
];

export default function Navbar({ transparent = false, wrapperClassName = '' }: NavbarProps) {
    const { auth, global_settings } = usePage<{
        auth: { user: any };
        global_settings?: Record<string, string>;
    }>().props;

    const [scrolled, setScrolled] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Close drawer on route change (Inertia navigation)
    const closeDrawer = () => setDrawerOpen(false);

    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    const linkClass = (href: string) => {
        const active = href === '/' ? currentPath === '/' : currentPath.startsWith(href.split('#')[0]) && href !== '/';
        return [
            'text-sm font-medium transition-colors duration-200',
            active ? 'text-cyan-400' : 'text-slate-300 hover:text-white',
        ].join(' ');
    };

    // Flat (top) vs floating (scrolled) styles
    const navBase = 'transition-all duration-300 ease-in-out z-[100]';
    const navFlat = 'fixed top-0 inset-x-0 px-6 py-3 bg-slate-900/80 backdrop-blur-md border-b border-slate-800';
    const navFloat = 'fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-5xl px-5 py-2.5 rounded-full bg-slate-900/85 backdrop-blur-md border border-slate-800/80 shadow-lg shadow-black/30';

    return (
        <>
            <nav className={`${navBase} ${scrolled ? navFloat : navFlat} ${wrapperClassName}`}>
                <div className="flex items-center justify-between max-w-5xl mx-auto w-full">

                    {/* ── Left: Logo ── */}
                    <Link href="/" className="flex items-center gap-2.5 group shrink-0">
                        <ApplicationLogo
                            src={global_settings?.logo || global_settings?.logo_url}
                            className="h-9 w-auto transition-transform duration-300 group-hover:scale-105"
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

                    {/* ── Center: Desktop nav ── */}
                    <div className="hidden md:flex items-center gap-1">
                        {NAV_LINKS.map(({ label, href }) => (
                            <Link key={label} href={href} className={`${linkClass(href)} px-3 py-1.5 rounded-full hover:bg-slate-800/60`}>
                                {label}
                            </Link>
                        ))}
                    </div>

                    {/* ── Right: Auth + hamburger ── */}
                    <div className="flex items-center gap-2">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-full hover:bg-slate-800/60 transition-colors"
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

                        {/* Hamburger */}
                        <button
                            onClick={() => setDrawerOpen(true)}
                            className="md:hidden p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                            aria-label="Buka menu"
                        >
                            <Menu size={20} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* ── Mobile Drawer ── */}
            {drawerOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110]"
                        onClick={closeDrawer}
                    />
                    {/* Panel */}
                    <div className="fixed top-4 left-4 right-4 z-[120] p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
                        <div className="flex items-center justify-between mb-5">
                            <span className="font-semibold text-white text-sm">Menu</span>
                            <button
                                onClick={closeDrawer}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                                aria-label="Tutup menu"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="flex flex-col gap-1">
                            {NAV_LINKS.map(({ label, href }) => (
                                <Link
                                    key={label}
                                    href={href}
                                    onClick={closeDrawer}
                                    className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2.5 rounded-xl hover:bg-slate-800 transition-colors"
                                >
                                    {label}
                                </Link>
                            ))}

                            <div className="mt-3 pt-3 border-t border-slate-800 flex flex-col gap-2">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        onClick={closeDrawer}
                                        className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2.5 rounded-xl hover:bg-slate-800 transition-colors"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            onClick={closeDrawer}
                                            className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2.5 rounded-xl hover:bg-slate-800 transition-colors"
                                        >
                                            Masuk
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            onClick={closeDrawer}
                                            className="text-sm font-medium text-white text-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90 transition-opacity"
                                        >
                                            Daftar
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
