import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { FormEventHandler, useRef, useState, useEffect } from 'react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import Modal from '@/Components/Modal';
import { FooterLink, FooterLinkGroup } from '@/types';

interface Props {
    settings: Record<string, string>;
    footerGroups?: FooterLinkGroup[];
    footerLinks?: FooterLink[];
    flash?: {
        message?: string;
        error?: string;
    };
}

export default function SettingsIndex({ settings, footerGroups = [], footerLinks = [], flash }: Props) {
    const [activeTab, setActiveTab] = useState<'settings' | 'footer'>('settings');

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

    useEffect(() => {
        if (settings.logo) {
            setLogoPreview(settings.logo);
        }
    }, [settings.logo]);

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

    // --- FOOTER LINKS STATE & HANDLERS ---
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
    const [editingLink, setEditingLink] = useState<FooterLink | null>(null);

    const {
        data: linkData,
        setData: setLinkData,
        post: postLink,
        put: putLink,
        processing: linkProcessing,
        errors: linkErrors,
        reset: resetLink,
        clearErrors: clearLinkErrors,
    } = useForm({
        footer_link_group_id: footerGroups.length > 0 ? footerGroups[0].id : 0,
        label: '',
        url: '',
        order: 1,
        is_active: true,
    });

    const openCreateLinkModal = (defaultGroupId: number) => {
        setEditingLink(null);
        clearLinkErrors();
        const currentGroupLinks = footerLinks.filter((l) => l.footer_link_group_id === defaultGroupId);
        const nextOrder = currentGroupLinks.length > 0 ? Math.max(...currentGroupLinks.map((l) => l.order || 0)) + 1 : 1;
        setLinkData({
            footer_link_group_id: defaultGroupId,
            label: '',
            url: '',
            order: nextOrder,
            is_active: true,
        });
        setIsLinkModalOpen(true);
    };

    const openEditLinkModal = (link: FooterLink) => {
        setEditingLink(link);
        clearLinkErrors();
        setLinkData({
            footer_link_group_id: link.footer_link_group_id,
            label: link.label,
            url: link.url,
            order: link.order,
            is_active: link.is_active,
        });
        setIsLinkModalOpen(true);
    };

    const closeLinkModal = () => {
        setIsLinkModalOpen(false);
        resetLink();
        setEditingLink(null);
    };

    const submitLink: FormEventHandler = (e) => {
        e.preventDefault();
        if (editingLink) {
            putLink(route('admin.footer-links.update', editingLink.id), {
                onSuccess: () => closeLinkModal(),
            });
        } else {
            postLink(route('admin.footer-links.store'), {
                onSuccess: () => closeLinkModal(),
            });
        }
    };

    const deleteLink = (link: FooterLink) => {
        if (confirm(`Yakin ingin menghapus link "${link.label}"?`)) {
            router.delete(route('admin.footer-links.destroy', link.id));
        }
    };

    // --- FOOTER GROUPS STATE & HANDLERS ---
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [editingGroup, setEditingGroup] = useState<FooterLinkGroup | null>(null);

    const {
        data: groupData,
        setData: setGroupData,
        post: postGroup,
        put: putGroup,
        processing: groupProcessing,
        errors: groupErrors,
        reset: resetGroup,
        clearErrors: clearGroupErrors,
    } = useForm({
        label: '',
        description: '',
        order: 1,
    });

    const openCreateGroupModal = () => {
        setEditingGroup(null);
        clearGroupErrors();
        const nextOrder = footerGroups.length > 0 ? Math.max(...footerGroups.map((g) => g.order || 0)) + 1 : 1;
        setGroupData({
            label: '',
            description: '',
            order: nextOrder,
        });
        setIsGroupModalOpen(true);
    };

    const openEditGroupModal = (group: FooterLinkGroup) => {
        setEditingGroup(group);
        clearGroupErrors();
        setGroupData({
            label: group.label,
            description: group.description || '',
            order: group.order,
        });
        setIsGroupModalOpen(true);
    };

    const closeGroupModal = () => {
        setIsGroupModalOpen(false);
        resetGroup();
        setEditingGroup(null);
    };

    const submitGroup: FormEventHandler = (e) => {
        e.preventDefault();
        if (editingGroup) {
            putGroup(route('admin.footer-link-groups.update', editingGroup.id), {
                onSuccess: () => closeGroupModal(),
            });
        } else {
            postGroup(route('admin.footer-link-groups.store'), {
                onSuccess: () => closeGroupModal(),
            });
        }
    };

    const deleteGroup = (group: FooterLinkGroup) => {
        const linkCount = footerLinks.filter((l) => l.footer_link_group_id === group.id).length;
        if (linkCount > 0) {
            alert(`Grup "${group.label}" tidak bisa dihapus karena masih memiliki ${linkCount} link di dalamnya. Hapus atau pindahkan semua link terlebih dahulu.`);
            return;
        }
        if (confirm(`Yakin ingin menghapus grup "${group.label}"?`)) {
            router.delete(route('admin.footer-link-groups.destroy', group.id));
        }
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

            {flash?.error && (
                <div className="mb-4 bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span className="font-semibold">{flash.error}</span>
                </div>
            )}

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200 gap-8 mb-6">
                <button
                    type="button"
                    onClick={() => setActiveTab('settings')}
                    className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                        activeTab === 'settings'
                            ? 'border-[#5B3E93] text-[#5B3E93]'
                            : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Identitas & Kontak
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('footer')}
                    className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                        activeTab === 'footer'
                            ? 'border-[#5B3E93] text-[#5B3E93]'
                            : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    Menu Footer
                    <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-[#5B3E93]">
                        {footerLinks.length}
                    </span>
                </button>
            </div>

            {activeTab === 'settings' && (
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
            )}

            {/* Tab Menu Footer */}
            {activeTab === 'footer' && (
                <div className="space-y-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Kelola Menu Footer</h3>
                            <p className="text-sm text-slate-500 mt-1">
                                Atur grup kolom dan tautan di footer halaman publik.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 self-start sm:self-auto">
                            <button
                                type="button"
                                onClick={openCreateGroupModal}
                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-[#5B3E93]/30 text-[#5B3E93] rounded-xl text-sm font-semibold hover:bg-[#5B3E93]/5 transition-colors shadow-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                Tambah Grup
                            </button>
                            <button
                                type="button"
                                onClick={() => openCreateLinkModal(footerGroups.length > 0 ? footerGroups[0].id : 0)}
                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#5B3E93] text-white rounded-xl text-sm font-semibold hover:bg-[#4a3277] transition-colors shadow-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                Tambah Link
                            </button>
                        </div>
                    </div>

                    {footerGroups.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
                            <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <p className="text-slate-500 font-medium">Belum ada grup footer.</p>
                            <p className="text-sm text-slate-400 mt-1">Klik "Tambah Grup" untuk membuat kolom baru di footer.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {footerGroups.map((group) => {
                                const groupLinks = footerLinks.filter((l) => l.footer_link_group_id === group.id);
                                return (
                                    <div key={group.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="text-base font-bold text-slate-900 truncate">{group.label}</h4>
                                                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200/60 text-slate-700 shrink-0">
                                                        {groupLinks.length}
                                                    </span>
                                                </div>
                                                {group.description && (
                                                    <p className="text-xs text-slate-500 mt-0.5 truncate">{group.description}</p>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1 shrink-0 ml-3">
                                                <button
                                                    type="button"
                                                    onClick={() => openEditGroupModal(group)}
                                                    className="p-1.5 text-slate-500 hover:text-[#5B3E93] hover:bg-indigo-50 rounded-lg transition-colors"
                                                    title="Edit Grup"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => deleteGroup(group)}
                                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Hapus Grup"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => openCreateLinkModal(group.id)}
                                                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#5B3E93]/30 text-[#5B3E93] bg-[#5B3E93]/5 hover:bg-[#5B3E93] hover:text-white transition-colors flex items-center gap-1 ml-1"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                                    </svg>
                                                    Tambah
                                                </button>
                                            </div>
                                        </div>

                                        <div className="p-4 flex-1 divide-y divide-slate-100">
                                            {groupLinks.length === 0 ? (
                                                <div className="py-8 text-center text-sm text-slate-400">
                                                    Belum ada link di grup ini.
                                                </div>
                                            ) : (
                                                groupLinks.map((link) => (
                                                    <div key={link.id} className="py-3 px-2 flex items-center justify-between gap-3 hover:bg-slate-50/80 rounded-xl transition-colors">
                                                        <div className="flex items-center gap-3 min-w-0">
                                                            <span className="w-6 h-6 shrink-0 rounded-md bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center">
                                                                {link.order}
                                                            </span>
                                                            <div className="min-w-0">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-sm font-semibold text-slate-900 truncate">
                                                                        {link.label}
                                                                    </span>
                                                                    {!link.is_active && (
                                                                        <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-200 text-slate-600">
                                                                            Nonaktif
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <p className="text-xs text-slate-400 truncate max-w-xs font-mono">
                                                                    {link.url}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-1 shrink-0">
                                                            <button
                                                                type="button"
                                                                onClick={() => openEditLinkModal(link)}
                                                                className="p-1.5 text-slate-500 hover:text-[#5B3E93] hover:bg-indigo-50 rounded-lg transition-colors"
                                                                title="Edit Link"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                                </svg>
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => deleteLink(link)}
                                                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                title="Hapus Link"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* Modal Tambah / Edit Link Footer */}
            <Modal show={isLinkModalOpen} onClose={closeLinkModal} maxWidth="md">
                <form onSubmit={submitLink} className="p-6">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                        <h3 className="text-lg font-bold text-slate-900">
                            {editingLink ? 'Edit Link Footer' : 'Tambah Link Footer'}
                        </h3>
                        <button
                            type="button"
                            onClick={closeLinkModal}
                            className="text-slate-400 hover:text-slate-600 rounded-lg p-1"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="mt-6 space-y-4">
                        <div>
                            <InputLabel htmlFor="link_group" value="Grup Kolom" />
                            <select
                                id="link_group"
                                className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-[#5B3E93] focus:ring-[#5B3E93] text-sm"
                                value={linkData.footer_link_group_id}
                                onChange={(e) => setLinkData('footer_link_group_id', parseInt(e.target.value))}
                            >
                                {footerGroups.map((g) => (
                                    <option key={g.id} value={g.id}>{g.label}</option>
                                ))}
                            </select>
                            <InputError message={linkErrors.footer_link_group_id} className="mt-1" />
                        </div>

                        <div>
                            <InputLabel htmlFor="link_label" value="Label Teks" />
                            <TextInput
                                id="link_label"
                                type="text"
                                className="mt-1 block w-full"
                                value={linkData.label}
                                onChange={(e) => setLinkData('label', e.target.value)}
                                placeholder="Contoh: Tentang Kami"
                                required
                            />
                            <InputError message={linkErrors.label} className="mt-1" />
                        </div>

                        <div>
                            <InputLabel htmlFor="link_url" value="URL / Tautan Tujuan" />
                            <TextInput
                                id="link_url"
                                type="text"
                                className="mt-1 block w-full"
                                value={linkData.url}
                                onChange={(e) => setLinkData('url', e.target.value)}
                                placeholder="Contoh: /#about, /berita, atau https://..."
                                required
                            />
                            <InputError message={linkErrors.url} className="mt-1" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="link_order" value="Nomor Urutan" />
                                <TextInput
                                    id="link_order"
                                    type="number"
                                    className="mt-1 block w-full"
                                    value={linkData.order}
                                    onChange={(e) => setLinkData('order', parseInt(e.target.value) || 0)}
                                    min="0"
                                />
                                <InputError message={linkErrors.order} className="mt-1" />
                            </div>

                            <div className="flex flex-col justify-center pt-5">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={linkData.is_active}
                                        onChange={(e) => setLinkData('is_active', e.target.checked)}
                                        className="rounded border-gray-300 text-[#5B3E93] shadow-sm focus:ring-[#5B3E93]"
                                    />
                                    <span className="text-sm font-medium text-slate-700">Status Aktif</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={closeLinkModal}
                            className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
                        >
                            Batal
                        </button>
                        <PrimaryButton disabled={linkProcessing}>
                            {linkProcessing ? 'Menyimpan...' : editingLink ? 'Simpan Perubahan' : 'Tambah Link'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Modal Tambah / Edit Grup Footer */}
            <Modal show={isGroupModalOpen} onClose={closeGroupModal} maxWidth="md">
                <form onSubmit={submitGroup} className="p-6">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                        <h3 className="text-lg font-bold text-slate-900">
                            {editingGroup ? 'Edit Grup Footer' : 'Tambah Grup Footer'}
                        </h3>
                        <button
                            type="button"
                            onClick={closeGroupModal}
                            className="text-slate-400 hover:text-slate-600 rounded-lg p-1"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="mt-6 space-y-4">
                        <div>
                            <InputLabel htmlFor="group_label" value="Judul Grup" />
                            <TextInput
                                id="group_label"
                                type="text"
                                className="mt-1 block w-full"
                                value={groupData.label}
                                onChange={(e) => setGroupData('label', e.target.value)}
                                placeholder="Contoh: Organisasi, Mahasiswa, dll."
                                required
                            />
                            <InputError message={groupErrors.label} className="mt-1" />
                        </div>

                        <div>
                            <InputLabel htmlFor="group_description" value="Deskripsi (Opsional)" />
                            <TextInput
                                id="group_description"
                                type="text"
                                className="mt-1 block w-full"
                                value={groupData.description}
                                onChange={(e) => setGroupData('description', e.target.value)}
                                placeholder="Contoh: Menu profil organisasi & kepengurusan"
                            />
                            <InputError message={groupErrors.description} className="mt-1" />
                        </div>

                        <div>
                            <InputLabel htmlFor="group_order" value="Nomor Urutan" />
                            <TextInput
                                id="group_order"
                                type="number"
                                className="mt-1 block w-full"
                                value={groupData.order}
                                onChange={(e) => setGroupData('order', parseInt(e.target.value) || 0)}
                                min="0"
                            />
                            <InputError message={groupErrors.order} className="mt-1" />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={closeGroupModal}
                            className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
                        >
                            Batal
                        </button>
                        <PrimaryButton disabled={groupProcessing}>
                            {groupProcessing ? 'Menyimpan...' : editingGroup ? 'Simpan Perubahan' : 'Tambah Grup'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
