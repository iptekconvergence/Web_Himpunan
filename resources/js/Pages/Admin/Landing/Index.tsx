import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';

interface Mission {
    id: number;
    content: string;
    sort_order: number;
}

interface Props {
    settings: Record<string, string>;
    missions: Mission[];
    flash?: {
        message?: string;
    };
}

export default function LandingIndex({ settings, missions, flash }: Props) {
    // --- HERO FORM ---
    const { data: heroData, setData: setHeroData, post: postHero, processing: heroProcessing, errors: heroErrors } = useForm({
        hero_title: settings.hero_title || '',
        hero_subtitle: settings.hero_subtitle || '',
        hero_desc: settings.hero_desc || '',
        hero_decrypted_1: settings.hero_decrypted_1 || '',
        hero_decrypted_2: settings.hero_decrypted_2 || '',
        hero_circular_text: settings.hero_circular_text || '',
        hero_btn1_text: settings.hero_btn1_text || '',
        hero_btn1_link: settings.hero_btn1_link || '',
        hero_btn2_text: settings.hero_btn2_text || '',
        hero_btn2_link: settings.hero_btn2_link || '',
        hero_logo: null as File | null,
    });
    
    const [heroLogoPreview, setHeroLogoPreview] = useState<string | null>(settings.hero_logo || null);
    const heroLogoRef = useRef<HTMLInputElement>(null);

    const handleHeroLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setHeroData('hero_logo', file);
            setHeroLogoPreview(URL.createObjectURL(file));
        }
    };

    const submitHero: FormEventHandler = (e) => {
        e.preventDefault();
        postHero(route('admin.landing.hero'), { forceFormData: true });
    };

    // --- ABOUT FORM ---
    const { data: aboutData, setData: setAboutData, post: postAbout, processing: aboutProcessing, errors: aboutErrors } = useForm({
        about_title: settings.about_title || '',
        about_desc: settings.about_desc || '',
        about_vision: settings.about_vision || '',
        about_image: null as File | null,
    });
    
    const [aboutImgPreview, setAboutImgPreview] = useState<string | null>(settings.about_image || null);
    const aboutImgRef = useRef<HTMLInputElement>(null);

    const handleAboutImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAboutData('about_image', file);
            setAboutImgPreview(URL.createObjectURL(file));
        }
    };

    const submitAbout: FormEventHandler = (e) => {
        e.preventDefault();
        postAbout(route('admin.landing.about'), { forceFormData: true });
    };

    // --- MISSIONS CRUD ---
    const [isMissionModalOpen, setIsMissionModalOpen] = useState(false);
    const [editingMission, setEditingMission] = useState<Mission | null>(null);
    const { data: missionData, setData: setMissionData, post: postMission, put: putMission, processing: missionProcessing, errors: missionErrors, reset: resetMission } = useForm({
        content: '',
        sort_order: 0,
    });

    const openMissionModal = (mission?: Mission) => {
        if (mission) {
            setEditingMission(mission);
            setMissionData({
                content: mission.content,
                sort_order: mission.sort_order,
            });
        } else {
            setEditingMission(null);
            setMissionData({ content: '', sort_order: missions.length });
        }
        setIsMissionModalOpen(true);
    };

    const closeMissionModal = () => {
        setIsMissionModalOpen(false);
        resetMission();
        setEditingMission(null);
    };

    const submitMission: FormEventHandler = (e) => {
        e.preventDefault();
        if (editingMission) {
            putMission(route('admin.landing.mission.update', editingMission.id), {
                onSuccess: () => closeMissionModal()
            });
        } else {
            postMission(route('admin.landing.mission.store'), {
                onSuccess: () => closeMissionModal()
            });
        }
    };

    const deleteMission = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus misi ini?')) {
            router.delete(route('admin.landing.mission.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout header="Landing Page & Konten">
            <Head title="Landing Page" />

            {flash?.message && (
                <div className="mb-4 bg-emerald-50 text-emerald-600 p-4 rounded-xl border border-emerald-100 flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-semibold">{flash.message}</span>
                </div>
            )}

            {/* HERO SECTION */}
            <form onSubmit={submitHero} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-8">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Hero Section</h3>
                        <p className="text-sm text-slate-500">Konten utama di bagian paling atas halaman.</p>
                    </div>
                    <PrimaryButton disabled={heroProcessing}>Simpan Hero</PrimaryButton>
                </div>
                
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-1 md:col-span-2">
                        <InputLabel htmlFor="hero_title" value="Judul Utama" />
                        <TextInput id="hero_title" className="mt-1 block w-full" value={heroData.hero_title} onChange={e => setHeroData('hero_title', e.target.value)} />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                        <InputLabel htmlFor="hero_desc" value="Deskripsi" />
                        <textarea id="hero_desc" className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm" rows={2} value={heroData.hero_desc} onChange={e => setHeroData('hero_desc', e.target.value)} />
                    </div>
                    <div>
                        <InputLabel htmlFor="hero_decrypted_1" value="Decrypted Text 1" />
                        <TextInput id="hero_decrypted_1" className="mt-1 block w-full" value={heroData.hero_decrypted_1} onChange={e => setHeroData('hero_decrypted_1', e.target.value)} />
                    </div>
                    <div>
                        <InputLabel htmlFor="hero_decrypted_2" value="Decrypted Text 2" />
                        <TextInput id="hero_decrypted_2" className="mt-1 block w-full" value={heroData.hero_decrypted_2} onChange={e => setHeroData('hero_decrypted_2', e.target.value)} />
                    </div>

                    {/* Circular Text Setting */}
                    <div className="col-span-1 md:col-span-2 p-4 bg-indigo-50/60 border border-indigo-100 rounded-xl">
                        <div className="flex items-start gap-4">
                            <div className="flex-1">
                                <InputLabel htmlFor="hero_circular_text" value="Tulisan Berputar (Circular Text)" />
                                <p className="text-xs text-slate-500 mb-2 mt-0.5">Teks yang berputar mengelilingi logo di Hero. Pisahkan kata dengan tanda <code className="bg-slate-100 px-1 rounded">*</code> sebagai pemisah, contoh: <code className="bg-slate-100 px-1 rounded">HMPS MI*Politeknik Negeri Medan*</code></p>
                                <TextInput
                                    id="hero_circular_text"
                                    className="mt-1 block w-full"
                                    value={heroData.hero_circular_text}
                                    onChange={e => setHeroData('hero_circular_text', e.target.value)}
                                    placeholder="Contoh: HMPS MI*Politeknik Negeri Medan*"
                                />
                            </div>
                            {/* Live Preview Badge */}
                            <div className="flex-shrink-0 flex flex-col items-center justify-center bg-slate-800 rounded-xl px-4 py-3 min-w-[140px]">
                                <div className="text-xs text-slate-400 mb-2 font-semibold uppercase tracking-wider">Preview Teks</div>
                                <div className="text-center text-xs text-white/90 font-mono leading-relaxed break-all">
                                    {heroData.hero_circular_text || <span className="text-slate-500 italic">Kosong</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel value="Tombol 1 (Teks & Link)" />
                            <div className="flex gap-2 mt-1">
                                <TextInput className="w-1/2" placeholder="Teks" value={heroData.hero_btn1_text} onChange={e => setHeroData('hero_btn1_text', e.target.value)} />
                                <TextInput className="w-1/2" placeholder="Link (e.g. /register)" value={heroData.hero_btn1_link} onChange={e => setHeroData('hero_btn1_link', e.target.value)} />
                            </div>
                        </div>
                        <div>
                            <InputLabel value="Tombol 2 (Teks & Link)" />
                            <div className="flex gap-2 mt-1">
                                <TextInput className="w-1/2" placeholder="Teks" value={heroData.hero_btn2_text} onChange={e => setHeroData('hero_btn2_text', e.target.value)} />
                                <TextInput className="w-1/2" placeholder="Link (e.g. #about)" value={heroData.hero_btn2_link} onChange={e => setHeroData('hero_btn2_link', e.target.value)} />
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-span-1 md:col-span-2">
                        <InputLabel value="Logo di Hero" />
                        <div className="mt-2 flex items-center gap-6">
                            <div className="w-32 h-32 rounded-xl border border-slate-200 bg-slate-800 flex items-center justify-center overflow-hidden relative">
                                {heroLogoPreview ? (
                                    <img src={heroLogoPreview} alt="Preview" className="w-full h-full object-contain p-2" />
                                ) : (
                                    <span className="text-slate-400 text-xs">Tanpa Logo</span>
                                )}
                            </div>
                            <div>
                                <input type="file" ref={heroLogoRef} onChange={handleHeroLogoChange} className="hidden" accept="image/*" />
                                <button type="button" onClick={() => heroLogoRef.current?.click()} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                                    Pilih Gambar
                                </button>
                                <p className="text-xs text-slate-500 mt-2">Disarankan gambar transparan (PNG/SVG).</p>
                                <InputError message={heroErrors.hero_logo} className="mt-2" />
                            </div>
                        </div>
                    </div>
                </div>
            </form>

            {/* ABOUT & VISION SECTION */}
            <form onSubmit={submitAbout} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-8">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Tentang & Visi</h3>
                        <p className="text-sm text-slate-500">Konten profil HMPS dan penjelasan visi.</p>
                    </div>
                    <PrimaryButton disabled={aboutProcessing}>Simpan Tentang</PrimaryButton>
                </div>
                
                <div className="p-6 grid grid-cols-1 gap-6">
                    <div>
                        <InputLabel htmlFor="about_title" value="Judul Section Tentang" />
                        <TextInput id="about_title" className="mt-1 block w-full md:w-1/2" value={aboutData.about_title} onChange={e => setAboutData('about_title', e.target.value)} />
                    </div>
                    <div>
                        <InputLabel htmlFor="about_desc" value="Deskripsi Tentang Kami" />
                        <textarea id="about_desc" className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm" rows={4} value={aboutData.about_desc} onChange={e => setAboutData('about_desc', e.target.value)} />
                    </div>
                    
                    <div className="pt-4 border-t border-slate-100">
                        <InputLabel htmlFor="about_vision" value="Visi HMPS MI" />
                        <textarea id="about_vision" className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm" rows={3} value={aboutData.about_vision} onChange={e => setAboutData('about_vision', e.target.value)} />
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                        <InputLabel value="Logo Divisi" />
                        <div className="mt-2 flex items-start gap-6">
                            <div className="w-64 h-40 rounded-xl border border-slate-200 bg-slate-100 flex items-center justify-center overflow-hidden">
                                {aboutImgPreview ? (
                                    <img src={aboutImgPreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-slate-400 text-xs">Kosong</span>
                                )}
                            </div>
                            <div>
                                <input type="file" ref={aboutImgRef} onChange={handleAboutImgChange} className="hidden" accept="image/*" />
                                <button type="button" onClick={() => aboutImgRef.current?.click()} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                                    Upload Gambar
                                </button>
                                <InputError message={aboutErrors.about_image} className="mt-2" />
                            </div>
                        </div>
                    </div>
                </div>
            </form>

            {/* MISSIONS SECTION */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Misi (Missions)</h3>
                        <p className="text-sm text-slate-500">Poin-poin misi dari Himpunan.</p>
                    </div>
                    <PrimaryButton onClick={() => openMissionModal()}>Tambah Misi</PrimaryButton>
                </div>
                <div className="p-0">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 border-b border-slate-100 text-slate-500">
                            <tr>
                                <th className="px-6 py-3 font-semibold">No</th>
                                <th className="px-6 py-3 font-semibold">Isi Misi</th>
                                <th className="px-6 py-3 font-semibold w-24 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {missions.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-8 text-center text-slate-500 italic">Belum ada data misi.</td>
                                </tr>
                            ) : missions.map((mission, idx) => (
                                <tr key={mission.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">{idx + 1}</td>
                                    <td className="px-6 py-4 whitespace-normal">{mission.content}</td>
                                    <td className="px-6 py-4 text-right space-x-3">
                                        <button onClick={() => openMissionModal(mission)} className="text-indigo-600 hover:text-indigo-900 font-medium">Edit</button>
                                        <button onClick={() => deleteMission(mission.id)} className="text-rose-600 hover:text-rose-900 font-medium">Hapus</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Form Misi */}
            <Modal show={isMissionModalOpen} onClose={closeMissionModal} maxWidth="md">
                <form onSubmit={submitMission} className="p-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-6">
                        {editingMission ? 'Edit Misi' : 'Tambah Misi Baru'}
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="content" value="Isi Misi" />
                            <textarea
                                id="content"
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                rows={3}
                                value={missionData.content}
                                onChange={e => setMissionData('content', e.target.value)}
                                required
                            />
                            <InputError message={missionErrors.content} className="mt-2" />
                        </div>
                        
                        <div>
                            <InputLabel htmlFor="sort_order" value="Urutan Tampil (Opsional)" />
                            <TextInput
                                id="sort_order"
                                type="number"
                                className="mt-1 block w-full"
                                value={missionData.sort_order}
                                onChange={e => setMissionData('sort_order', parseInt(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button type="button" onClick={closeMissionModal} className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
                            Batal
                        </button>
                        <PrimaryButton disabled={missionProcessing}>
                            Simpan
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
