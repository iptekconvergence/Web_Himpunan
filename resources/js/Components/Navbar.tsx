import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { useState, useEffect, useRef } from 'react';

interface NavbarProps {
    /** When true, the navbar starts transparent (for pages with dark hero backgrounds).
     *  When false, the navbar always shows the solid/scrolled style. */
    transparent?: boolean;
    /** Optional class names applied to the outermost fixed wrapper */
    wrapperClassName?: string;
}

export default function Navbar({ transparent = false, wrapperClassName = '' }: NavbarProps) {
    const { auth, global_divisions, global_settings } = usePage<{ auth: { user: any }, global_divisions?: any[], global_settings?: Record<string, string> }>().props;
    const [isScrolled, setIsScrolled] = useState(!transparent);
    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(typeof window !== 'undefined' ? window.scrollY : 0);

    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const currentScrollY = window.scrollY;
                    
                    if (transparent) {
                        setIsScrolled(currentScrollY > 50);
                    }

                    if (currentScrollY <= 50) {
                        setIsVisible(true);
                        lastScrollY.current = currentScrollY;
                    } else {
                        const delta = currentScrollY - lastScrollY.current;
                        if (delta > 15) {
                            setIsVisible(false);
                            lastScrollY.current = currentScrollY;
                        } else if (delta < -15) {
                            setIsVisible(true);
                            lastScrollY.current = currentScrollY;
                        }
                    }
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [transparent]);

    return (
        <div className={`fixed top-0 inset-x-0 z-50 pt-4 sm:pt-6 px-4 sm:px-6 lg:px-8 pointer-events-none ${wrapperClassName}`}>
            <nav 
                className={`pointer-events-auto relative mx-auto flex max-w-6xl items-center justify-between rounded-full px-6 py-3 transition-all duration-500 ease-in-out ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-[150%] opacity-0'} ${isScrolled ? 'bg-[#0f172a]/80 backdrop-blur-lg shadow-lg ring-1 ring-white/10 text-white' : 'bg-transparent ring-1 ring-white/20 backdrop-blur-md text-white'}`}
            >
                {/* Logo on the left */}
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center gap-2 group">
                        <ApplicationLogo className="h-10 w-auto fill-current transition-transform duration-300 group-hover:scale-105 text-cyan-400" />
                        <div className="flex flex-col justify-center">
                            <span className="font-extrabold text-lg leading-tight tracking-wide transition-colors text-white group-hover:text-cyan-300">
                                {global_settings?.site_name || 'HMPS MI'}
                            </span>
                            <span className="text-xs font-semibold leading-tight tracking-wider uppercase text-cyan-50/70">
                                {global_settings?.campus_name || 'Politeknik Negeri Medan'}
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Navigation links & Auth buttons on the right */}
                <div className="flex items-center gap-6 text-sm font-semibold tracking-wide">
                    <div className="hidden md:flex gap-6 mr-2 items-center h-full text-white/90">
                        <Link href="/" className="transition-colors hover:text-cyan-300">Home</Link>
                        
                        <Link href="/periode" className="transition-colors hover:text-cyan-300">
                            Periode
                        </Link>

                        <Link href="/#Berita" className="transition-colors hover:text-cyan-300">Berita</Link>
                        <Link href="/#contact" className="transition-colors hover:text-cyan-300">Contact</Link>
                    </div>

                    {auth.user ? (
                        <Link
                            href={route('dashboard')}
                            className="rounded-full px-6 py-2.5 transition-all hover:shadow-lg focus:outline-none ring-1 bg-cyan-500/20 text-cyan-50 hover:bg-cyan-500/40 hover:shadow-cyan-500/20 ring-cyan-400/50"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={route('login')}
                                className="transition-colors text-white/90 hover:text-cyan-300"
                            >
                                Log in
                            </Link>
                            <Link
                                href={route('register')}
                                className="rounded-full px-6 py-2.5 transition-all hover:shadow-lg focus:outline-none ring-1 bg-white/10 text-white hover:bg-white/20 hover:shadow-lg ring-white/30 backdrop-blur-md"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </div>
    );
}
