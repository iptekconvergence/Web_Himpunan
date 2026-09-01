import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden font-sans">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[10%] -right-[5%] w-[500px] h-[500px] rounded-full bg-[#06B6D4]/10 blur-3xl" />
                <div className="absolute top-[20%] -left-[10%] w-[600px] h-[600px] rounded-full bg-[#5B3E93]/10 blur-3xl" />
                <div className="absolute -bottom-[10%] left-[20%] w-[400px] h-[400px] rounded-full bg-indigo-500/10 blur-3xl" />
            </div>

            <div className="z-10 w-full max-w-md">
                <div className="flex justify-center mb-8">
                    <Link href="/">
                        <ApplicationLogo className="h-16 w-auto" />
                    </Link>
                </div>

                <div className="w-full bg-white/80 backdrop-blur-xl px-8 py-10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] ring-1 ring-slate-900/5 rounded-3xl">
                    {children}
                </div>
            </div>
        </div>
    );
}
