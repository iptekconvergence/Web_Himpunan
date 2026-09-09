import { useState, useEffect } from 'react';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import CircularText from '@/Components/CircularText';
import DecryptedText from '@/Components/DecryptedText';
import Navbar from '@/Components/Navbar';

interface Mission { id: number; content: string; sort_order: number; }
interface Division { id: number; name: string; slug: string; icon: string | null; description: string | null; sort_order: number; is_active: boolean; }
interface NewsArticle { id: number; title: string; slug: string; thumbnail_path: string | null; content: string; category?: { name: string; slug: string; }; created_at: string; published_at: string | null; }

function useInView(options: IntersectionObserverInit & { triggerOnce?: boolean } = { threshold: 0.15, triggerOnce: true }) {
    const [ref, setRef] = useState<HTMLElement | null>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        if (!ref) return;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setInView(true);
                if (options.triggerOnce) observer.disconnect();
            }
        }, options);
        observer.observe(ref);
        return () => observer.disconnect();
    }, [ref, options.threshold, options.triggerOnce]);

    return [setRef, inView] as const;
}

export default function Welcome({
    auth,
    laravelVersion,
    phpVersion,
    settings,
    missions,
    divisions,
    news,
    activePeriod,
}: PageProps<{ laravelVersion: string; phpVersion: string; settings: Record<string, string>; missions: Mission[]; divisions: Division[]; news: NewsArticle[]; activePeriod?: { id: number; name: string } | null; }>) {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const [aboutRef, aboutInView] = useInView();
    const [divisiRef, divisiInView] = useInView();
    const [beritaRef, beritaInView] = useInView();
    const [contactRef, contactInView] = useInView();

    return (
        <>
            <Head title="HMPS MI Politeknik Negeri Medan" />
            
            <div className="futuristic-page min-h-screen font-sans text-slate-100 selection:bg-indigo-500 selection:text-white">

                {/* Fixed futuristic background canvas */}
                <div className="bg-canvas" aria-hidden="true">
                    {/* Deep navy radial gradient base */}
                    <div className="bg-radial-base" />

                    {/* Corner glow accents */}
                    <div className="bg-glow-tl" />
                    <div className="bg-glow-br" />
                    <div className="bg-glow-center" />
                    <div className="bg-glow-mid-right" />

                    {/* Abstract curved lines */}
                    <svg className="bg-abstract-lines" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
                        <path d="M-100 600 Q300 200 700 500 T1540 300" stroke="rgba(0,140,255,0.7)" strokeWidth="1.5" fill="none"/>
                        <path d="M-100 750 Q400 350 900 650 T1540 450" stroke="rgba(0,200,255,0.5)" strokeWidth="1" fill="none"/>
                        <path d="M1540 100 Q1100 500 700 200 T-100 400" stroke="rgba(30,80,220,0.6)" strokeWidth="1.2" fill="none"/>
                        <path d="M0 900 Q360 500 720 700 Q1080 900 1440 400" stroke="rgba(0,160,255,0.4)" strokeWidth="0.8" fill="none"/>
                        <path d="M200 0 Q500 400 300 700 Q100 1000 600 900" stroke="rgba(0,100,200,0.5)" strokeWidth="1" fill="none"/>
                        <path d="M1000 0 Q800 300 1100 600 Q1400 900 1200 1000" stroke="rgba(0,180,255,0.35)" strokeWidth="0.8" fill="none"/>
                        <line x1="0" y1="300" x2="1440" y2="350" stroke="rgba(0,80,200,0.12)" strokeWidth="1"/>
                        <line x1="0" y1="600" x2="1440" y2="550" stroke="rgba(0,100,220,0.10)" strokeWidth="1"/>
                    </svg>

                    {/* Floating particles */}
                    <div className="bg-particles">
                        <div className="particle particle-1" />
                        <div className="particle particle-2" />
                        <div className="particle particle-3" />
                        <div className="particle particle-4" />
                        <div className="particle particle-5" />
                        <div className="particle particle-6" />
                        <div className="particle particle-7" />
                        <div className="particle particle-8" />
                        <div className="particle particle-9" />
                        <div className="particle particle-10" />
                        <div className="particle particle-11" />
                        <div className="particle particle-12" />
                        {/* Bokeh blobs */}
                        <div className="bokeh bokeh-1" />
                        <div className="bokeh bokeh-2" />
                        <div className="bokeh bokeh-3" />
                        <div className="bokeh bokeh-4" />
                    </div>
                </div>

                {/* Navigation */}
                <Navbar 
                    transparent={true} 
                    wrapperClassName={`transition-all duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
                />

                {/* Hero Section */}
                <section id="home" className="relative flex min-h-screen items-center justify-center overflow-hidden bg-transparent pt-24 pb-24">
                    {/* Background decorations (Removed white shadows for cleaner look) */}
                    <div className="mx-auto max-w-7xl px-6 lg:px-8 z-10 w-full">
                        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-center">
                            {/* Left Side: Text and CTAs */}
                            <div className="lg:pr-8 flex flex-col justify-center">
                                <div className="lg:max-w-lg">
                                    <h1 style={{ fontFamily: "'Inter', sans-serif" }} className={`text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white mb-6 leading-tight transition-all duration-700 delay-100 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                                        {settings.hero_title || 'Greetings, World!!'}
                                    </h1>

                                    <div className="mt-2 mb-10 space-y-1">
                                        <p style={{ fontFamily: "'Inter', sans-serif" }} className={`text-base sm:text-lg font-semibold text-white/90 leading-snug transition-all duration-700 delay-200 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                                            <DecryptedText
                                                text={settings.hero_decrypted_1 || 'Selamat Datang di Website'}
                                                animateOn="view"
                                                sequential={true}
                                                revealDirection="start"
                                                speed={40}
                                                className="text-white/90"
                                                encryptedClassName="text-cyan-300/70"
                                            />
                                        </p>
                                        <p style={{ fontFamily: "'Inter', sans-serif" }} className={`text-base sm:text-lg font-semibold text-white/90 leading-snug transition-all duration-700 delay-300 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                                            <DecryptedText
                                                text={settings.hero_decrypted_2 || 'HMPS Manajemen Informatika Politeknik Negeri Medan'}
                                                animateOn="view"
                                                sequential={true}
                                                revealDirection="start"
                                                speed={30}
                                                className="text-white/90"
                                                encryptedClassName="text-cyan-300/70"
                                            />
                                        </p>
                                        <p className={`mt-4 text-white/80 transition-all duration-700 delay-500 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>{settings.hero_desc}</p>
                                    </div>

                                    <div className={`flex items-center gap-x-6 transition-all duration-700 delay-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                                        {settings.hero_btn1_text && (
                                            <Link
                                                href={settings.hero_btn1_link || '#'}
                                                className="rounded-full bg-white px-8 py-3.5 text-sm font-bold text-[#4C1D95] shadow-lg hover:bg-slate-100 hover:shadow-xl transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                            >
                                                {settings.hero_btn1_text}
                                            </Link>
                                        )}
                                        {settings.hero_btn2_text && (
                                            <a href={settings.hero_btn2_link || '#'} className="text-sm font-semibold leading-6 text-white group flex items-center gap-1 hover:text-white/80 transition-colors">
                                                {settings.hero_btn2_text} <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Right Side: Logo Visual + CircularText */}
                            <div className={`relative mx-auto w-full max-w-sm lg:max-w-md flex justify-center lg:justify-end mt-12 lg:mt-0 transition-all duration-1000 delay-1000 ease-out ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                                <div className="relative flex items-center justify-center w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-cyan-300/20 rounded-full blur-2xl"></div>

                                    <img
                                        src={settings.hero_logo || "/img/logo_hmpsmi.png"}
                                        alt="Logo HMPS MI"
                                        className="relative z-10 w-2/3 h-2/3 object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500 ease-out"
                                    />

                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <CircularText
                                            text={settings.hero_circular_text || (settings.site_name ? `${settings.site_name}*${settings.campus_name}*` : "")}
                                            onHover="speedUp"
                                            spinDuration={19}
                                            className="!w-full !h-full text-white/90"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section id="about" ref={aboutRef as any} className="py-24 sm:py-32 section-about overflow-hidden">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            {/* Image Side */}
                            <div className={`relative flex items-center justify-center transition-all duration-1000 delay-100 ease-out ${aboutInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
                                <img 
                                    src={settings.about_image || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"}
                                    alt={settings.site_name || "HMPS"}
                                    className="relative z-10 max-h-[400px] w-auto object-contain filter drop-shadow-xl animate-float"
                                />
                            </div>

                            {/* Text Side */}
                            <div className="flex flex-col justify-center lg:pl-8">
                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-900/60 text-indigo-300 text-sm font-semibold mb-6 w-max border border-indigo-500/30 shadow-sm hover:scale-105 transition-all duration-700 delay-200 ease-out ${aboutInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                                    <span className="relative flex h-2.5 w-2.5">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-400"></span>
                                    </span>
                                    Tentang HMPS
                                </div>
                                <h2 className={`text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl mb-6 leading-tight whitespace-pre-wrap transition-all duration-700 delay-300 ease-out ${aboutInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                                    {settings.about_title || "Tentang & Visi Misi HMPS Manajemen Informatika"}
                                </h2>
                                <div className={`space-y-6 text-lg leading-relaxed text-slate-300 whitespace-pre-wrap transition-all duration-700 delay-500 ease-out ${aboutInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                                    <p>{settings.about_desc || 'Himpunan Mahasiswa Program Studi (HMPS) Manajemen Informatika adalah wadah organisasi bagi mahasiswa...'}</p>
                                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 mt-8 backdrop-blur-sm">
                                        <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                                            <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                            Visi
                                        </h3>
                                        <p className="text-sm text-slate-300 whitespace-pre-wrap">{settings.about_vision}</p>
                                        
                                        <h3 className="font-bold text-white mt-6 mb-2 flex items-center gap-2">
                                            <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Misi
                                        </h3>
                                        <ul className="text-sm text-slate-300 list-disc pl-5 space-y-2">
                                            {missions.length > 0 ? missions.map(mission => (
                                                <li key={mission.id}>{mission.content}</li>
                                            )) : (
                                                <li>Belum ada data misi.</li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                                
                                <div className={`mt-10 flex items-center gap-x-6 transition-all duration-700 delay-700 ease-out ${aboutInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                                    <a href="#learn-more" className="group inline-flex items-center gap-3 rounded-full bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-300 hover:shadow-indigo-500/40 hover:-translate-y-0.5">
                                        Learn More
                                        <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Divisi Section */}
                <section id="Divisi" ref={divisiRef as any} className="py-24 sm:py-32 section-divisi relative overflow-hidden">
                    {/* Background decorations */}
                    <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3">
                        <div className="w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
                    </div>
                    <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3">
                        <div className="w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
                    </div>

                    <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
                        <div className={`mx-auto max-w-2xl lg:text-center mb-16 transition-all duration-700 delay-100 ease-out ${divisiInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                            <h2 className="text-base font-semibold leading-7 text-cyan-400 uppercase tracking-wide">Struktur Organisasi</h2>
                            <p className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                                Divisi HMPS MI
                            </p>
                            <p className="mt-4 text-lg leading-8 text-slate-300">
                                Berkolaborasi dan bersinergi melalui divisi-divisi untuk mewujudkan visi dan misi organisasi.
                            </p>
                        </div>

                        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                            <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-8 lg:max-w-none lg:grid-cols-3">
                                {divisions.map((divisi, index) => (
                                    <div key={divisi.id} style={{ transitionDelay: `${200 + (index * 150)}ms` }} className={`transition-all duration-700 ease-out ${divisiInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                                        <Link href={activePeriod ? `/periode/${activePeriod.id}/divisi/${divisi.id}` : `/periode`} className="group relative bg-white/5 backdrop-blur-md p-8 rounded-3xl shadow-lg ring-1 ring-white/10 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-1 block h-full">
                                            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-3xl opacity-0 group-hover:opacity-20 transition duration-300"></div>
                                            <div className="relative">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-cyan-400 group-hover:bg-cyan-400 group-hover:text-slate-900 transition-colors duration-300 mb-6 overflow-hidden">
                                                    {divisi.icon ? <img src={divisi.icon} alt={divisi.name} className="w-8 h-8 object-contain drop-shadow-md" /> : (
                                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <h3 className="text-xl font-bold leading-7 text-white mb-3">{divisi.name}</h3>
                                                <p className="text-base leading-7 text-slate-300">{divisi.description}</p>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Berita Section */}
                <section id="Berita" ref={beritaRef as any} className="py-24 sm:py-32 section-berita relative">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className={`mx-auto max-w-2xl text-center mb-16 transition-all duration-700 delay-100 ease-out ${beritaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                            <h2 className="text-base font-semibold leading-7 text-cyan-400 uppercase tracking-wide">Update Terbaru</h2>
                            <p className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                                Berita & Kegiatan
                            </p>
                            <p className="mt-4 text-lg leading-8 text-slate-300">
                                Ikuti terus perkembangan dan kegiatan terbaru dari HMPS Manajemen Informatika.
                            </p>
                        </div>
                        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                            {news.length > 0 ? news.map((post, index) => (
                                <div key={post.id} style={{ transitionDelay: `${200 + (index * 150)}ms` }} className={`transition-all duration-700 ease-out h-full ${beritaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                                    <article className="flex flex-col items-start justify-between group h-full">
                                    <div className="relative w-full">
                                        <img
                                            src={post.thumbnail_path || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80'}
                                            alt={post.title}
                                            className="aspect-[16/9] w-full rounded-2xl bg-slate-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2] transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-slate-900/10 pointer-events-none" />
                                    </div>
                                    <div className="max-w-xl w-full mt-8">
                                        <div className="flex items-center gap-x-4 text-xs">
                                            <time dateTime={post.published_at || post.created_at} className="text-slate-400">
                                                {new Date(post.published_at || post.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </time>
                                            {post.category && (
                                                <span className="relative z-10 rounded-full bg-white/10 px-3 py-1.5 font-medium text-slate-300 hover:bg-white/20 transition-colors">
                                                    {post.category.name}
                                                </span>
                                            )}
                                        </div>
                                        <div className="group relative">
                                            <h3 className="mt-3 text-lg font-semibold leading-6 text-white group-hover:text-cyan-400 transition-colors">
                                                <a href={`/berita/${post.slug}`}>
                                                    <span className="absolute inset-0" />
                                                    {post.title}
                                                </a>
                                            </h3>
                                            <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-400">{post.content.replace(/<[^>]*>?/gm, '')}</p>
                                        </div>
                                    </div>
                                    </article>
                                </div>
                            )) : (
                                <div className="col-span-3 text-center text-slate-400 py-12 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">Belum ada berita yang dipublikasikan.</div>
                            )}
                        </div>
                        <div className={`mt-16 flex justify-center transition-all duration-700 delay-500 ease-out ${beritaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                            <Link href="/berita" className="text-sm font-semibold leading-6 text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-2 group">
                                Lihat semua berita <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">&rarr;</span>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Contact / Support Channels Section */}
                <section id="contact" ref={contactRef as any} className="py-24 sm:py-32 section-contact relative overflow-hidden">
                    {/* Background decorations */}
                    <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3">
                        <div className="w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
                    </div>
                    
                    <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
                        <div className={`mx-auto max-w-2xl text-center mb-16 transition-all duration-700 delay-100 ease-out ${contactInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                            <h2 className="text-base font-semibold leading-7 text-cyan-400 uppercase tracking-wide">Contact Us</h2>
                            <p className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                                We're here to help
                            </p>
                            <p className="mt-4 text-lg leading-8 text-slate-300">
                                Choose the best way to reach us. Our team is ready to assist you.
                            </p>
                        </div>
                        
                        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-4">
                            {[
                                ...(settings.email ? [{
                                    name: 'Email Support',
                                    description: 'Kirim email dan kami akan segera membalas.',
                                    icon: (
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                        </svg>
                                    ),
                                    cta: settings.email,
                                    href: `mailto:${settings.email}`,
                                }] : []),
                                ...(settings.whatsapp ? [{
                                    name: 'WhatsApp',
                                    description: 'Hubungi kami via WhatsApp.',
                                    icon: (
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    ),
                                    cta: 'Chat Sekarang',
                                    href: settings.whatsapp,
                                }] : []),
                            ].map((card, index) => (
                                <div key={index} style={{ transitionDelay: `${200 + (index * 150)}ms` }} className={`transition-all duration-700 ease-out h-full ${contactInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                                    <div className="group relative bg-white/5 backdrop-blur-md p-8 rounded-3xl shadow-lg ring-1 ring-white/10 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between h-full">
                                        <div>
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-cyan-400 group-hover:bg-cyan-400 group-hover:text-slate-900 transition-colors duration-300 mb-6">
                                                {card.icon}
                                            </div>
                                            <h3 className="text-xl font-bold leading-7 text-white mb-3">{card.name}</h3>
                                            <p className="text-sm leading-6 text-slate-300 mb-6">{card.description}</p>
                                        </div>
                                        <div className="mt-2">
                                            <a href={card.href} className="text-sm font-semibold leading-6 text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-2 group-hover:translate-x-1 duration-300">
                                                {card.cta} <span aria-hidden="true">&rarr;</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="section-footer pb-8 pt-16 sm:pt-24 lg:pt-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                            <div className="space-y-8 xl:col-span-1">
                                <div className="flex items-center gap-3">
                                    <ApplicationLogo className="h-10 w-auto text-indigo-400 fill-current" />
                                    <div className="flex flex-col">
                                        <span className="font-extrabold text-lg leading-tight tracking-wide text-white">{settings.site_name || "HMPS MI"}</span>
                                        <span className="text-xs font-semibold leading-tight text-slate-400 tracking-wider uppercase">{settings.campus_name || "Politeknik Negeri Medan"}</span>
                                    </div>
                                </div>
                                <p className="text-sm leading-6 text-slate-400 max-w-xs whitespace-pre-wrap">
                                    {settings.footer_text || "Wadah organisasi mahasiswa untuk mengembangkan potensi, kreativitas, dan kepemimpinan di bidang teknologi informasi."}
                                </p>
                                <div className="flex space-x-6">
                                    {settings.instagram && (
                                        <a href={settings.instagram} className="text-slate-400 hover:text-indigo-400 transition-colors">
                                            <span className="sr-only">Instagram</span>
                                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                                            </svg>
                                        </a>
                                    )}
                                    {settings.youtube && (
                                        <a href={settings.youtube} className="text-slate-400 hover:text-indigo-600 transition-colors">
                                            <span className="sr-only">YouTube</span>
                                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                                            </svg>
                                        </a>
                                    )}
                                    {settings.tiktok && (
                                        <a href={settings.tiktok} className="text-slate-400 hover:text-indigo-600 transition-colors">
                                            <span className="sr-only">TikTok</span>
                                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path fillRule="evenodd" d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v7.2c0 1.96-.5 3.96-1.82 5.36-1.12 1.22-2.73 1.94-4.4 2-1.74.07-3.52-.3-4.9-1.32-1.42-1.04-2.28-2.67-2.47-4.42-.2-1.82.35-3.69 1.5-5 1.13-1.3 2.79-2 4.54-2 .24 0 .49 0 .73.02v4.06c-.19-.01-.39-.01-.59-.01-1.01 0-2.02.48-2.61 1.25-.56.74-.75 1.74-.52 2.65.23.94.94 1.75 1.83 2.1 1 .4 2.14.36 3.12-.13.88-.45 1.49-1.28 1.65-2.24.16-.95.14-1.92.14-2.88V.02z" clipRule="evenodd" />
                                            </svg>
                                        </a>
                                    )}
                                </div>
                            </div>
                            <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
                                <div className="md:grid md:grid-cols-2 md:gap-8">
                                    <div>
                                        <h3 className="text-sm font-semibold leading-6 text-slate-200">Organisasi</h3>
                                        <ul role="list" className="mt-6 space-y-4">
                                            <li><a href="#about" className="text-sm leading-6 text-slate-400 hover:text-cyan-400 transition-colors">Tentang Kami</a></li>
                                            <li><a href="#Kepengurusan" className="text-sm leading-6 text-slate-400 hover:text-cyan-400 transition-colors">Kepengurusan</a></li>
                                            <li><a href="#Divisi" className="text-sm leading-6 text-slate-400 hover:text-cyan-400 transition-colors">Divisi Utama</a></li>
                                            <li><a href="#Berita" className="text-sm leading-6 text-slate-400 hover:text-cyan-400 transition-colors">Berita & Kegiatan</a></li>
                                        </ul>
                                    </div>
                                    <div className="mt-10 md:mt-0">
                                        <h3 className="text-sm font-semibold leading-6 text-slate-200">Mahasiswa</h3>
                                        <ul role="list" className="mt-6 space-y-4">
                                            <li><a href="#" className="text-sm leading-6 text-slate-400 hover:text-cyan-400 transition-colors">Panduan Akademik</a></li>
                                            <li><a href="#" className="text-sm leading-6 text-slate-400 hover:text-cyan-400 transition-colors">Jadwal Kuliah</a></li>
                                            <li><a href="#" className="text-sm leading-6 text-slate-400 hover:text-cyan-400 transition-colors">Lomba & Prestasi</a></li>
                                            <li><a href="#" className="text-sm leading-6 text-slate-400 hover:text-cyan-400 transition-colors">Alumni</a></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="md:grid md:grid-cols-2 md:gap-8">
                                    <div>
                                        <h3 className="text-sm font-semibold leading-6 text-slate-200">Resources</h3>
                                        <ul role="list" className="mt-6 space-y-4">
                                            <li><a href="#" className="text-sm leading-6 text-slate-400 hover:text-cyan-400 transition-colors">Help Center</a></li>
                                            <li><a href="#" className="text-sm leading-6 text-slate-400 hover:text-cyan-400 transition-colors">Docs & Tutorials</a></li>
                                            <li><a href="#" className="text-sm leading-6 text-slate-400 hover:text-cyan-400 transition-colors">Community</a></li>
                                            <li><a href="#" className="text-sm leading-6 text-slate-400 hover:text-cyan-400 transition-colors">Assets</a></li>
                                        </ul>
                                    </div>
                                    <div className="mt-10 md:mt-0">
                                        <h3 className="text-sm font-semibold leading-6 text-slate-200">Legal</h3>
                                        <ul role="list" className="mt-6 space-y-4">
                                            <li><a href="#" className="text-sm leading-6 text-slate-400 hover:text-cyan-400 transition-colors">Privacy Policy</a></li>
                                            <li><a href="#" className="text-sm leading-6 text-slate-400 hover:text-cyan-400 transition-colors">Terms of Service</a></li>
                                            <li><a href="#" className="text-sm leading-6 text-slate-400 hover:text-cyan-400 transition-colors">Cookie Policy</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24">
                            <p className="text-sm leading-5 text-slate-500">
                                {settings.copyright_text || `© ${new Date().getFullYear()} HMPS Manajemen Informatika Politeknik Negeri Medan. All rights reserved.`}
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
