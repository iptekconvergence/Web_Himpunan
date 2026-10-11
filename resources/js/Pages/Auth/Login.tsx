import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import ApplicationLogo from '@/Components/ApplicationLogo';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    return (
        <GuestLayout>
            <Head title="Masuk" />

            <style>{`
                .login-input {
                    width: 100%;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.12);
                    border-radius: 12px;
                    padding: 12px 16px;
                    color: #f1f5f9;
                    font-size: 0.9rem;
                    outline: none;
                    transition: all 0.3s ease;
                }
                .login-input::placeholder { color: rgba(148,163,184,0.6); }
                .login-input:focus {
                    background: rgba(255,255,255,0.10);
                    border-color: rgba(6,182,212,0.6);
                    box-shadow: 0 0 0 3px rgba(6,182,212,0.15);
                }
                .login-btn {
                    width: 100%;
                    padding: 13px;
                    border-radius: 12px;
                    border: none;
                    cursor: pointer;
                    font-weight: 700;
                    font-size: 0.95rem;
                    letter-spacing: 0.04em;
                    color: #fff;
                    background: linear-gradient(135deg, #06b6d4, #5b3e93);
                    box-shadow: 0 0 18px rgba(6,182,212,0.35), 0 0 40px rgba(91,62,147,0.2);
                    transition: box-shadow 0.3s ease, transform 0.2s ease;
                }
                .login-btn:hover:not(:disabled) {
                    box-shadow: 0 0 28px rgba(6,182,212,0.65), 0 0 60px rgba(91,62,147,0.4);
                    transform: translateY(-1px);
                }
                .login-btn:disabled { opacity: 0.6; cursor: not-allowed; }
            `}</style>

            {/* Logo + branding */}
            <div className="flex flex-col items-center mb-8">
                <Link href="/">
                    <ApplicationLogo className="h-20 w-auto logo-pulse" />
                </Link>
                <h1 className="mt-5 text-3xl font-extrabold text-white tracking-tight">Masuk</h1>
                <p className="mt-1.5 text-sm text-slate-400 text-center max-w-xs">
                    Selamat datang kembali, silakan masuk ke akun Anda.
                </p>
            </div>

            {/* Card */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-7 py-8 shadow-2xl">
                {status && (
                    <div className="mb-5 text-sm font-medium text-cyan-300 bg-cyan-500/10 p-3 rounded-lg border border-cyan-500/20">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-5">
                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            autoComplete="username"
                            autoFocus
                            placeholder="nama@example.com"
                            className="login-input"
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <InputError message={errors.email} className="mt-1.5 text-red-400 text-xs" />
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            autoComplete="current-password"
                            placeholder="••••••••"
                            className="login-input"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <InputError message={errors.password} className="mt-1.5 text-red-400 text-xs" />
                    </div>

                    {/* Remember + Forgot */}
                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', (e.target.checked || false) as false)}
                            />
                            <span className="text-sm text-slate-400">Ingat saya</span>
                        </label>
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                            >
                                Lupa password?
                            </Link>
                        )}
                    </div>

                    {/* Submit */}
                    <button type="submit" disabled={processing} className="login-btn mt-1">
                        {processing ? 'Memproses…' : 'Masuk'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-500">
                    Belum punya akun?{' '}
                    <Link href={route('register')} className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                        Daftar
                    </Link>
                </p>
            </div>
        </GuestLayout>
    );
}
