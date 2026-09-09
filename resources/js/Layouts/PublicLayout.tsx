import { PropsWithChildren } from 'react';
import Navbar from '@/Components/Navbar';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { usePage } from '@inertiajs/react';

export default function PublicLayout({ children }: PropsWithChildren) {
    const { global_settings } = usePage().props as any;
    const settings = global_settings || {};

    return (
        <div className="futuristic-page min-h-screen font-sans text-slate-100 selection:bg-indigo-500 selection:text-white">
            {/* Fixed futuristic background canvas */}
            <div className="bg-canvas fixed inset-0 z-[-1]" aria-hidden="true">
                <div className="bg-radial-base" />
                <div className="bg-glow-tl" />
                <div className="bg-glow-br" />
                <div className="bg-glow-center" />
                <div className="bg-glow-mid-right" />
                <div className="bg-particles">
                    <div className="particle particle-1" />
                    <div className="particle particle-2" />
                    <div className="particle particle-3" />
                    <div className="particle particle-4" />
                    <div className="particle particle-5" />
                    <div className="particle particle-6" />
                    <div className="bokeh bokeh-1" />
                    <div className="bokeh bokeh-2" />
                </div>
            </div>

            <Navbar transparent={false} wrapperClassName="opacity-100 translate-y-0 relative z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10" />

            <main className="pt-32 pb-16 min-h-[calc(100vh-350px)]">
                {children}
            </main>

            {/* Footer */}
            <footer className="section-footer pb-8 pt-16 sm:pt-24 lg:pt-32 relative bg-slate-900/80 backdrop-blur-md border-t border-white/10 mt-auto">
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
                                        <li><a href="/#about" className="text-sm leading-6 text-slate-400 hover:text-cyan-400 transition-colors">Tentang Kami</a></li>
                                        <li><a href="/#Kepengurusan" className="text-sm leading-6 text-slate-400 hover:text-cyan-400 transition-colors">Kepengurusan</a></li>
                                        <li><a href="/#Divisi" className="text-sm leading-6 text-slate-400 hover:text-cyan-400 transition-colors">Divisi Utama</a></li>
                                        <li><a href="/berita" className="text-sm leading-6 text-slate-400 hover:text-cyan-400 transition-colors">Berita & Kegiatan</a></li>
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
    );
}
