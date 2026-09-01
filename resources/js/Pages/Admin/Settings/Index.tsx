import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

interface Props {
    settings: Record<string, string>;
    flash?: {
        message?: string;
    };
}

export default function SettingsIndex({ settings, flash }: Props) {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        logo: null as File | null,
        site_name: settings.site_name || '',
        campus_name: settings.campus_name || '',
        footer_text: settings.footer_text || '',
        copyright_text: settings.copyright_text || '',
        email: settings.email || '',
        whatsapp: settings.whatsapp || '',
        instagram: settings.instagram || '',
        youtube: settings.youtube || '',
        tiktok: settings.tiktok || '',
    });

    const [logoPreview, setLogoPreview] = useState<string | null>(settings.logo || null);
    const logoInputRef = useRef<HTMLInputElement>(null);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('logo', file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.settings.update'), {
            forceFormData: true, // Need this for file upload
        });
    };

    return (
        <AuthenticatedLayout header="Pengaturan Website">
            <Head title="Pengaturan Website" />

            {flash?.message && (
                <div className="mb-4 bg-emerald-50 text-emerald-600 p-4 rounded-xl border border-emerald-100 flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-semibold">{flash.message}</span>
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                
                {/* Identitas Website Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                        <h3 className="text-lg font-bold text-slate-900">Identitas Website</h3>
                        <p className="text-sm text-slate-500">Logo dan penamaan dasar website.</p>
                    </div>
                    
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Logo Upload */}
                        <div className="col-span-1 md:col-span-2">
                            <InputLabel value="Logo Website" />
                            <div className="mt-2 flex items-center gap-6">
                                <div className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden">
                                    {logoPreview ? (
                                        <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-contain p-2" />
                                    ) : (
                                        <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    )}
                                </div>
                                <div>
                                    <input 
                                        type="file" 
                                        ref={logoInputRef}
                                        onChange={handleLogoChange} 
                                        className="hidden" 
                                        accept="image/*"
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => logoInputRef.current?.click()}
                                        className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                                    >
                                        Pilih Logo Baru
                                    </button>
                                    <InputError message={errors.logo} className="mt-2" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <InputLabel htmlFor="site_name" value="Nama Himpunan" />
                            <TextInput
                                id="site_name"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.site_name}
                                onChange={(e) => setData('site_name', e.target.value)}
                            />
                            <InputError message={errors.site_name} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="campus_name" value="Nama Kampus" />
                            <TextInput
                                id="campus_name"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.campus_name}
                                onChange={(e) => setData('campus_name', e.target.value)}
                            />
                            <InputError message={errors.campus_name} className="mt-2" />
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            <InputLabel htmlFor="footer_text" value="Deskripsi Singkat (Footer)" />
                            <textarea
                                id="footer_text"
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                rows={3}
                                value={data.footer_text}
                                onChange={(e) => setData('footer_text', e.target.value)}
                            />
                            <InputError message={errors.footer_text} className="mt-2" />
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            <InputLabel htmlFor="copyright_text" value="Copyright Footer" />
                            <TextInput
                                id="copyright_text"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.copyright_text}
                                onChange={(e) => setData('copyright_text', e.target.value)}
                                placeholder="&copy; 2026 HMPS MI..."
                            />
                            <InputError message={errors.copyright_text} className="mt-2" />
                        </div>
                    </div>
                </div>

                {/* Kontak Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                        <h3 className="text-lg font-bold text-slate-900">Kontak & Media Sosial</h3>
                        <p className="text-sm text-slate-500">Tautan sosial media yang akan muncul di footer dan contact section.</p>
                    </div>
                    
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        <div>
                            <InputLabel htmlFor="email" value="Email Support" />
                            <TextInput
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="whatsapp" value="WhatsApp (Tautan/Nomor)" />
                            <TextInput
                                id="whatsapp"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.whatsapp}
                                onChange={(e) => setData('whatsapp', e.target.value)}
                            />
                            <InputError message={errors.whatsapp} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="instagram" value="Link Instagram" />
                            <TextInput
                                id="instagram"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.instagram}
                                onChange={(e) => setData('instagram', e.target.value)}
                            />
                            <InputError message={errors.instagram} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="youtube" value="Link YouTube" />
                            <TextInput
                                id="youtube"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.youtube}
                                onChange={(e) => setData('youtube', e.target.value)}
                            />
                            <InputError message={errors.youtube} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="tiktok" value="Link TikTok" />
                            <TextInput
                                id="tiktok"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.tiktok}
                                onChange={(e) => setData('tiktok', e.target.value)}
                            />
                            <InputError message={errors.tiktok} className="mt-2" />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <PrimaryButton disabled={processing}>
                        {processing ? 'Menyimpan...' : 'Simpan Pengaturan'}
                    </PrimaryButton>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
