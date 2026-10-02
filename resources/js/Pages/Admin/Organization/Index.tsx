import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { FormEventHandler, useState, useRef, useEffect, useMemo } from 'react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import Modal from '@/Components/Modal';
import { FlipCard } from '@/Components/FlipCard';

interface Period { id: number; name: string; is_active: boolean; notes: string | null; }
interface Division { id: number; period_id?: number | null; name: string; slug: string; icon: string | null; description: string | null; sort_order: number; is_active: boolean; period?: Period; }
interface Member { id: number; period_id: number; division_id: number; name: string; nim?: string | null; role_name: string; bio: string | null; photo_path: string | null; photo_position_x: number; photo_position_y: number; photo_zoom: number; instagram_url: string | null; sort_order: number; is_active: boolean; period?: Period; division?: Division; }

interface Props {
    periods: Period[];
    divisions: Division[];
    members: Member[];
    flash?: { message?: string; error?: string; };
}

export default function OrganizationIndex({ periods, divisions, members, flash }: Props) {
    // 1. Period Selection State (Mandatory before viewing/managing Divisions & Members)
    const [selectedPeriodId, setSelectedPeriodId] = useState<number | null>(() => {
        const active = periods.find(p => p.is_active);
        return active ? active.id : (periods[0]?.id || null);
    });

    const [activeTab, setActiveTab] = useState<'divisions' | 'members' | 'periods'>('divisions');

    const selectedPeriod = periods.find(p => String(p.id) === String(selectedPeriodId));

    // Filter Divisions and Members strictly for the selected period
    const filteredDivisions = divisions.filter(d => String(d.period_id) === String(selectedPeriodId));
    const filteredMembers = members.filter(m => String(m.period_id) === String(selectedPeriodId));

    // --- PERIOD STATE & FORM ---
    const [isPeriodModalOpen, setIsPeriodModalOpen] = useState(false);
    const [editingPeriod, setEditingPeriod] = useState<Period | null>(null);
    const { data: periodData, setData: setPeriodData, post: postPeriod, put: putPeriod, processing: periodProcessing, errors: periodErrors, reset: resetPeriod } = useForm({
        name: '', is_active: false, notes: ''
    });

    const openPeriodModal = (period?: Period) => {
        if (period) { setEditingPeriod(period); setPeriodData({ name: period.name, is_active: period.is_active, notes: period.notes || '' }); }
        else { setEditingPeriod(null); setPeriodData({ name: '', is_active: false, notes: '' }); }
        setIsPeriodModalOpen(true);
    };
    const closePeriodModal = () => { setIsPeriodModalOpen(false); resetPeriod(); setEditingPeriod(null); };

    const submitPeriod: FormEventHandler = (e) => {
        e.preventDefault();
        if (editingPeriod) putPeriod(route('admin.organization.periods.update', editingPeriod.id), { onSuccess: () => closePeriodModal() });
        else postPeriod(route('admin.organization.periods.store'), { onSuccess: () => closePeriodModal() });
    };

    const deletePeriod = (id: number) => { if (confirm('Yakin ingin menghapus periode ini?')) router.delete(route('admin.organization.periods.destroy', id)); };

    // --- DIVISION STATE & FORM ---
    const [isDivisionModalOpen, setIsDivisionModalOpen] = useState(false);
    const [editingDivision, setEditingDivision] = useState<Division | null>(null);
    const { data: divData, setData: setDivData, post: postDiv, processing: divProcessing, errors: divErrors, reset: resetDiv } = useForm({
        period_id: (selectedPeriodId || '') as string | number,
        name: '', description: '', sort_order: 0, is_active: true, icon: null as File | null, _method: 'post'
    });
    const [divIconPreview, setDivIconPreview] = useState<string | null>(null);
    const divIconRef = useRef<HTMLInputElement>(null);

    const openDivisionModal = (div?: Division) => {
        if (!selectedPeriodId) {
            alert('Silakan pilih Periode terlebih dahulu.');
            return;
        }
        if (div) { 
            setEditingDivision(div); 
            setDivData({ period_id: div.period_id || selectedPeriodId, name: div.name, description: div.description || '', sort_order: div.sort_order, is_active: div.is_active, icon: null, _method: 'post' }); 
            setDivIconPreview(div.icon);
        }
        else { 
            setEditingDivision(null); 
            setDivData({ period_id: selectedPeriodId, name: '', description: '', sort_order: filteredDivisions.length + 1, is_active: true, icon: null, _method: 'post' }); 
            setDivIconPreview(null);
        }
        setIsDivisionModalOpen(true);
    };
    const closeDivisionModal = () => { setIsDivisionModalOpen(false); resetDiv(); setEditingDivision(null); };

    const submitDivision: FormEventHandler = (e) => {
        e.preventDefault();
        if (editingDivision) postDiv(route('admin.organization.divisions.update', editingDivision.id), { onSuccess: () => closeDivisionModal(), forceFormData: true });
        else postDiv(route('admin.organization.divisions.store'), { onSuccess: () => closeDivisionModal(), forceFormData: true });
    };

    const deleteDivision = (id: number) => { if (confirm('Yakin ingin menghapus divisi ini? Semua anggota di divisi ini akan ikut terhapus.')) router.delete(route('admin.organization.divisions.destroy', id)); };

    // --- MEMBER STATE & FORM ---
    const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<Member | null>(null);
    const { data: memData, setData: setMemData, post: postMem, processing: memProcessing, errors: memErrors, reset: resetMem } = useForm({
        period_id: (selectedPeriodId || '') as string | number,
        division_id: filteredDivisions[0]?.id || '',
        name: '',
        nim: '',
        role_name: '',
        bio: '',
        instagram_url: '',
        sort_order: 0,
        is_active: true,
        photo: null as File | null,
        photo_position_x: 50,
        photo_position_y: 50,
        photo_zoom: 100,
        _method: 'post'
    });
    const [memPhotoPreview, setMemPhotoPreview] = useState<string | null>(null);
    const memPhotoRef = useRef<HTMLInputElement>(null);

    // Debounced Preview State to prevent typing lag
    const [previewData, setPreviewData] = useState({
        name: '',
        role_name: '',
        nim: '',
        bio: '',
        instagram_url: '',
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setPreviewData({
                name: memData.name,
                role_name: memData.role_name,
                nim: memData.nim || '',
                bio: memData.bio || '',
                instagram_url: memData.instagram_url || '',
            });
        }, 150);

        return () => clearTimeout(timer);
    }, [memData.name, memData.role_name, memData.nim, memData.bio, memData.instagram_url]);

    const liveCardData = useMemo(() => {
        const trimmedName = previewData.name.trim();
        const trimmedRole = previewData.role_name.trim();
        const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(trimmedName || 'Pengurus')}&background=e2e8f0&color=475569&size=256`;
        
        return {
            name: trimmedName || 'Nama Pengurus',
            username: trimmedRole || 'Jabatan / Role',
            periodName: selectedPeriod?.name || '2025–2026',
            nim: previewData.nim.trim() ? previewData.nim.trim() : undefined,
            image: memPhotoPreview || fallbackAvatar,
            photoPositionX: memData.photo_position_x,
            photoPositionY: memData.photo_position_y,
            photoZoom: memData.photo_zoom,
            bio: previewData.bio.trim() || `Bertugas sebagai ${trimmedRole || 'Pengurus'} HMPS MI untuk masa jabatan Periode ${selectedPeriod?.name || '-'}.`,
            stats: { posts: 0, followers: 0, following: 0 },
            socialLinks: {
                github: '#',
                twitter: '#',
                instagram: previewData.instagram_url.trim() || '#'
            }
        };
    }, [previewData, memPhotoPreview, memData.photo_position_x, memData.photo_position_y, memData.photo_zoom, selectedPeriod?.name]);

    const openMemberModal = (mem?: Member) => {
        if (!selectedPeriodId) {
            alert('Silakan pilih Periode terlebih dahulu.');
            return;
        }
        if (mem) { 
            setEditingMember(mem); 
            setMemData({ period_id: mem.period_id, division_id: mem.division_id, name: mem.name, nim: mem.nim || '', role_name: mem.role_name, bio: mem.bio || '', instagram_url: mem.instagram_url || '', sort_order: mem.sort_order, is_active: mem.is_active, photo: null, photo_position_x: mem.photo_position_x ?? 50, photo_position_y: mem.photo_position_y ?? 50, photo_zoom: mem.photo_zoom ?? 100, _method: 'post' }); 
            setMemPhotoPreview(mem.photo_path);
            setPreviewData({
                name: mem.name,
                role_name: mem.role_name,
                nim: mem.nim || '',
                bio: mem.bio || '',
                instagram_url: mem.instagram_url || '',
            });
        }
        else { 
            setEditingMember(null); 
            setMemData({ period_id: selectedPeriodId, division_id: filteredDivisions[0]?.id || '', name: '', nim: '', role_name: '', bio: '', instagram_url: '', sort_order: filteredMembers.length + 1, is_active: true, photo: null, photo_position_x: 50, photo_position_y: 50, photo_zoom: 100, _method: 'post' }); 
            setMemPhotoPreview(null);
            setPreviewData({
                name: '',
                role_name: '',
                nim: '',
                bio: '',
                instagram_url: '',
            });
        }
        setIsMemberModalOpen(true);
    };
    const closeMemberModal = () => { 
        setIsMemberModalOpen(false); 
        resetMem(); 
        setEditingMember(null); 
        setMemPhotoPreview(null);
    };

    const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setMemData('photo', file);
            setMemPhotoPreview(URL.createObjectURL(file));
        }
    };

    const submitMember: FormEventHandler = (e) => {
        e.preventDefault();
        if (editingMember) postMem(route('admin.organization.members.update', editingMember.id), { onSuccess: () => closeMemberModal(), forceFormData: true });
        else postMem(route('admin.organization.members.store'), { onSuccess: () => closeMemberModal(), forceFormData: true });
    };

    const deleteMember = (id: number) => { if (confirm('Yakin ingin menghapus anggota ini?')) router.delete(route('admin.organization.members.destroy', id)); };

    return (
        <AuthenticatedLayout header="Struktur Organisasi">
            <Head title="Struktur Organisasi" />

            {flash?.message && (
                <div className="mb-6 bg-emerald-50 text-emerald-700 p-4 rounded-2xl border border-emerald-200/80 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                            <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <span className="font-semibold text-sm">{flash.message}</span>
                    </div>
                </div>
            )}

            {/* STEP 1: PILIH PERIODE SELECTOR (Control Panel Header) */}
            <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-slate-200/80 border-l-4 border-l-[#5B3E93] mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                    <div className="flex items-start sm:items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-purple-50 text-[#5B3E93] border border-purple-100 flex items-center justify-center shrink-0 shadow-sm">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-bold text-slate-900">Pilih Periode Kepengurusan</h2>
                                {selectedPeriod && (
                                    <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-[#5B3E93] border border-purple-100">
                                        Aktif: Periode {selectedPeriod.name}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Pilih periode terlebih dahulu untuk mengelola data Divisi dan Pengurus pada periode tersebut.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                        {/* Quick Buttons for periods */}
                        {periods.map(p => {
                            const isSelected = selectedPeriodId === p.id && activeTab !== 'periods';
                            return (
                                <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => {
                                        setSelectedPeriodId(p.id);
                                        if (activeTab === 'periods') setActiveTab('divisions');
                                    }}
                                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                                        isSelected
                                            ? 'bg-[#5B3E93] text-white shadow-sm shadow-purple-500/20 ring-2 ring-[#5B3E93]/20'
                                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                                    }`}
                                >
                                    <span className={`w-2 h-2 rounded-full ${p.is_active ? (isSelected ? 'bg-emerald-300' : 'bg-emerald-500') : 'bg-slate-300'}`}></span>
                                    Periode {p.name} {p.is_active ? '(Aktif)' : ''}
                                </button>
                            );
                        })}

                        {/* Dropdown Periode (Dipertahankan sesuai aturan ketat) */}
                        <div className="relative">
                            <select
                                value={selectedPeriodId || ''}
                                onChange={e => {
                                    const val = e.target.value ? Number(e.target.value) : null;
                                    setSelectedPeriodId(val);
                                    if (val && activeTab === 'periods') setActiveTab('divisions');
                                }}
                                className="rounded-xl border-slate-200 text-xs font-semibold text-slate-700 shadow-sm focus:border-[#5B3E93] focus:ring-[#5B3E93] pl-3 pr-8 py-2 bg-slate-50 hover:bg-white transition-colors"
                            >
                                <option value="">-- Pilih Periode --</option>
                                {periods.map(p => (
                                    <option key={p.id} value={p.id}>
                                        Periode {p.name} {p.is_active ? '(Aktif)' : ''}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Tombol Master Data Periode */}
                        <button
                            type="button"
                            onClick={() => setActiveTab('periods')}
                            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl border transition-all ${
                                activeTab === 'periods'
                                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                            }`}
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Master Data Periode
                        </button>
                    </div>
                </div>
            </div>

            {/* IF NO PERIOD SELECTED */}
            {!selectedPeriodId && activeTab !== 'periods' ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm">
                    <div className="w-16 h-16 bg-purple-50 text-[#5B3E93] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-purple-100 shadow-sm">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Pilih Periode Kepengurusan</h3>
                    <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                        Silakan pilih salah satu periode kepengurusan untuk menampilkan, menambah, mengedit, atau menghapus Divisi dan Pengurus.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        {periods.map(p => (
                            <button
                                key={p.id}
                                onClick={() => { setSelectedPeriodId(p.id); setActiveTab('divisions'); }}
                                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                                    p.is_active
                                        ? 'bg-[#5B3E93] text-white border-[#5B3E93] shadow-md shadow-purple-500/20'
                                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                                }`}
                            >
                                <span className={`w-2 h-2 rounded-full ${p.is_active ? 'bg-emerald-300' : 'bg-slate-300'}`}></span>
                                Periode {p.name} {p.is_active ? '(Aktif)' : ''}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <>
                    {/* TABS (Divisi, Pengurus, Pengaturan Periode) */}
                    <div className="bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/70 flex flex-col sm:flex-row gap-1.5 mb-6">
                        <button
                            type="button"
                            onClick={() => setActiveTab('divisions')}
                            className={`flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 ${
                                activeTab === 'divisions'
                                    ? 'bg-[#5B3E93] text-white shadow-sm shadow-purple-500/20'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                            }`}
                        >
                            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <span>Divisi</span>
                            {selectedPeriod && (
                                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                                    activeTab === 'divisions' ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-700'
                                }`}>
                                    {filteredDivisions.length}
                                </span>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('members')}
                            className={`flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 ${
                                activeTab === 'members'
                                    ? 'bg-[#5B3E93] text-white shadow-sm shadow-purple-500/20'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                            }`}
                        >
                            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <span>Pengurus & Anggota</span>
                            {selectedPeriod && (
                                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                                    activeTab === 'members' ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-700'
                                }`}>
                                    {filteredMembers.length}
                                </span>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('periods')}
                            className={`inline-flex items-center justify-center gap-2 py-2.5 px-5 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 ${
                                activeTab === 'periods'
                                    ? 'bg-slate-900 text-white shadow-sm'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                            }`}
                        >
                            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>Pengaturan Periode</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                                activeTab === 'periods' ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-700'
                            }`}>
                                {periods.length}
                            </span>
                        </button>
                    </div>

                    {/* TAB CONTENT: DIVISIONS FOR SELECTED PERIOD */}
                    {activeTab === 'divisions' && selectedPeriodId && (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                        <span>Daftar Divisi</span>
                                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 text-[#5B3E93] border border-purple-100">
                                            Periode {selectedPeriod?.name}
                                        </span>
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-0.5">Menampilkan {filteredDivisions.length} divisi pada periode ini.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => openDivisionModal()}
                                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#5B3E93] hover:bg-[#4c337d] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm hover:shadow transition-all duration-200 shrink-0"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                    </svg>
                                    Tambah Divisi
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm whitespace-nowrap min-w-[650px]">
                                    <thead className="bg-slate-50/90 border-b border-slate-200/80 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                                        <tr>
                                            <th className="px-6 py-3.5 w-16">Icon</th>
                                            <th className="px-6 py-3.5">Nama Divisi</th>
                                            <th className="px-6 py-3.5">Periode</th>
                                            <th className="px-6 py-3.5">Urutan</th>
                                            <th className="px-6 py-3.5">Status</th>
                                            <th className="px-6 py-3.5 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredDivisions.length > 0 ? (
                                            filteredDivisions.map(div => (
                                                <tr key={div.id} className="hover:bg-slate-50/70 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/60 p-1 flex items-center justify-center overflow-hidden shrink-0">
                                                            {div.icon ? (
                                                                <img src={div.icon} alt={div.name} className="w-full h-full object-contain" />
                                                            ) : (
                                                                <div className="w-full h-full bg-purple-50 text-[#5B3E93] rounded-lg flex items-center justify-center font-bold text-xs">
                                                                    {div.name.charAt(0).toUpperCase()}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-slate-900">{div.name}</div>
                                                        {div.description && (
                                                            <p className="text-xs text-slate-400 line-clamp-1 max-w-xs mt-0.5">{div.description}</p>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-50 text-[#5B3E93] border border-purple-100/60">
                                                            Periode {selectedPeriod?.name}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                                                            {div.sort_order}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {div.is_active ? (
                                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-100">
                                                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                                                                Aktif
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full border border-slate-200">
                                                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
                                                                Nonaktif
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <button
                                                                type="button"
                                                                onClick={() => openDivisionModal(div)}
                                                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-[#5B3E93] hover:text-white hover:bg-[#5B3E93] rounded-lg transition-colors"
                                                                title="Edit Divisi"
                                                            >
                                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                </svg>
                                                                Edit
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => deleteDivision(div.id)}
                                                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:text-white hover:bg-rose-600 rounded-lg transition-colors"
                                                                title="Hapus Divisi"
                                                            >
                                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                                Hapus
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-14 text-center">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#5B3E93] border border-purple-100 flex items-center justify-center mb-1 shadow-sm">
                                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                            </svg>
                                                        </div>
                                                        <p className="font-bold text-slate-800 text-sm">Belum ada divisi pada Periode {selectedPeriod?.name}</p>
                                                        <p className="text-xs text-slate-400 max-w-sm">Tambahkan divisi baru untuk mengelompokkan struktur organisasi pada periode ini.</p>
                                                        <button
                                                            type="button"
                                                            onClick={() => openDivisionModal()}
                                                            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-[#5B3E93] text-white hover:bg-[#4c337d] text-xs font-semibold rounded-xl transition-all shadow-sm hover:shadow"
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                                            </svg>
                                                            Tambah Divisi Sekarang
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* TAB CONTENT: MEMBERS FOR SELECTED PERIOD */}
                    {activeTab === 'members' && selectedPeriodId && (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                        <span>Daftar Pengurus & Anggota</span>
                                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 text-[#5B3E93] border border-purple-100">
                                            Periode {selectedPeriod?.name}
                                        </span>
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-0.5">Menampilkan {filteredMembers.length} pengurus pada periode ini.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => openMemberModal()}
                                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#5B3E93] hover:bg-[#4c337d] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm hover:shadow transition-all duration-200 shrink-0"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                    </svg>
                                    Tambah Pengurus
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm whitespace-nowrap min-w-[750px]">
                                    <thead className="bg-slate-50/90 border-b border-slate-200/80 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                                        <tr>
                                            <th className="px-6 py-3.5">Foto</th>
                                            <th className="px-6 py-3.5">Nama & Jabatan</th>
                                            <th className="px-6 py-3.5">NIM</th>
                                            <th className="px-6 py-3.5">Divisi</th>
                                            <th className="px-6 py-3.5">Status</th>
                                            <th className="px-6 py-3.5 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredMembers.length > 0 ? (
                                            filteredMembers.map(mem => (
                                                <tr key={mem.id} className="hover:bg-slate-50/70 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200/60 overflow-hidden flex items-center justify-center shrink-0">
                                                            {mem.photo_path ? (
                                                                <img src={mem.photo_path} alt={mem.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full bg-gradient-to-br from-[#5B3E93] to-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                                                                    {mem.name.charAt(0).toUpperCase()}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-slate-900">{mem.name}</div>
                                                        <div className="text-slate-500 text-xs mt-0.5">{mem.role_name}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {mem.nim ? (
                                                            <span className="font-mono text-xs px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                                                                {mem.nim}
                                                            </span>
                                                        ) : (
                                                            <span className="text-slate-400 text-xs">-</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-50 text-[#5B3E93] border border-purple-100/60">
                                                            {mem.division?.name || 'Tanpa Divisi'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {mem.is_active ? (
                                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-100">
                                                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                                                                Aktif
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full border border-slate-200">
                                                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
                                                                Nonaktif
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <button
                                                                type="button"
                                                                onClick={() => openMemberModal(mem)}
                                                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-[#5B3E93] hover:text-white hover:bg-[#5B3E93] rounded-lg transition-colors"
                                                                title="Edit Pengurus"
                                                            >
                                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                </svg>
                                                                Edit
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => deleteMember(mem.id)}
                                                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:text-white hover:bg-rose-600 rounded-lg transition-colors"
                                                                title="Hapus Pengurus"
                                                            >
                                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                                Hapus
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-14 text-center">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#5B3E93] border border-purple-100 flex items-center justify-center mb-1 shadow-sm">
                                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                                            </svg>
                                                        </div>
                                                        <p className="font-bold text-slate-800 text-sm">Belum ada pengurus pada Periode {selectedPeriod?.name}</p>
                                                        <p className="text-xs text-slate-400 max-w-sm">Tambahkan pengurus atau anggota baru untuk periode kepengurusan ini.</p>
                                                        <button
                                                            type="button"
                                                            onClick={() => openMemberModal()}
                                                            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-[#5B3E93] text-white hover:bg-[#4c337d] text-xs font-semibold rounded-xl transition-all shadow-sm hover:shadow"
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                                            </svg>
                                                            Tambah Pengurus Sekarang
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* TAB CONTENT: PERIOD MASTER DATA */}
                    {activeTab === 'periods' && (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Master Data Periode Kepengurusan</h3>
                                    <p className="text-xs text-slate-500 mt-0.5">Kelola daftar seluruh periode organisasi.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => openPeriodModal()}
                                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm hover:shadow transition-all duration-200 shrink-0"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                    </svg>
                                    Tambah Periode
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm whitespace-nowrap min-w-[500px]">
                                    <thead className="bg-slate-50/90 border-b border-slate-200/80 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                                        <tr>
                                            <th className="px-6 py-3.5">Nama Periode</th>
                                            <th className="px-6 py-3.5">Status</th>
                                            <th className="px-6 py-3.5 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {periods.map(period => (
                                            <tr key={period.id} className="hover:bg-slate-50/70 transition-colors">
                                                <td className="px-6 py-4 font-bold text-slate-900">
                                                    Periode {period.name}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {period.is_active ? (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-100">
                                                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                                                            Aktif
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full border border-slate-200">
                                                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
                                                            Nonaktif
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => { setSelectedPeriodId(period.id); setActiveTab('divisions'); }}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-emerald-600 hover:text-white hover:bg-emerald-600 rounded-lg transition-colors border border-emerald-200 hover:border-emerald-600"
                                                        >
                                                            Kelola Data &rarr;
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => openPeriodModal(period)}
                                                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-[#5B3E93] hover:text-white hover:bg-[#5B3E93] rounded-lg transition-colors"
                                                            title="Edit Periode"
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                            Edit
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => deletePeriod(period.id)}
                                                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:text-white hover:bg-rose-600 rounded-lg transition-colors"
                                                            title="Hapus Periode"
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                            Hapus
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* MODALS */}
            
            {/* Period Modal */}
            <Modal show={isPeriodModalOpen} onClose={closePeriodModal} maxWidth="md">
                <form onSubmit={submitPeriod} className="p-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-6">{editingPeriod ? 'Edit Periode' : 'Tambah Periode'}</h2>
                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="p_name" value="Nama Periode (Contoh: 2025-2026)" />
                            <TextInput id="p_name" className="mt-1 block w-full rounded-xl" value={periodData.name} onChange={e => setPeriodData('name', e.target.value)} required />
                            <InputError message={periodErrors.name} className="mt-2" />
                        </div>
                        <div className="flex items-center gap-2.5 pt-2">
                            <input type="checkbox" id="p_active" checked={periodData.is_active} onChange={e => setPeriodData('is_active', e.target.checked)} className="rounded-lg border-slate-300 text-[#5B3E93] shadow-sm focus:border-[#5B3E93] focus:ring focus:ring-[#5B3E93]/20" />
                            <InputLabel htmlFor="p_active" value="Jadikan Periode Aktif" />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
                        <button type="button" onClick={closePeriodModal} className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">Batal</button>
                        <button type="submit" disabled={periodProcessing} className="px-4 py-2 text-sm font-semibold text-white bg-[#5B3E93] hover:bg-[#4c337d] rounded-xl transition-colors shadow-sm disabled:opacity-50">Simpan</button>
                    </div>
                </form>
            </Modal>

            {/* Division Modal (Locked to Selected Period) */}
            <Modal show={isDivisionModalOpen} onClose={closeDivisionModal} maxWidth="md">
                <form onSubmit={submitDivision} className="p-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-6">
                        {editingDivision ? 'Edit Divisi' : `Tambah Divisi (Periode ${selectedPeriod?.name})`}
                    </h2>
                    <div className="space-y-4">
                        <div className="bg-purple-50 p-3 rounded-xl border border-purple-100 text-xs font-semibold text-[#5B3E93]">
                            Terikat pada Periode: <span className="font-bold">{selectedPeriod?.name}</span>
                        </div>
                        <div>
                            <InputLabel htmlFor="d_name" value="Nama Divisi" />
                            <TextInput id="d_name" className="mt-1 block w-full rounded-xl" value={divData.name} onChange={e => setDivData('name', e.target.value)} required />
                            <InputError message={divErrors.name} className="mt-1" />
                        </div>
                        <div>
                            <InputLabel htmlFor="d_desc" value="Deskripsi" />
                            <textarea id="d_desc" className="mt-1 block w-full border-slate-200 rounded-xl shadow-sm focus:border-[#5B3E93] focus:ring-[#5B3E93]" rows={3} value={divData.description} onChange={e => setDivData('description', e.target.value)} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="d_sort" value="Urutan" />
                                <TextInput id="d_sort" type="number" className="mt-1 block w-full rounded-xl" value={divData.sort_order} onChange={e => setDivData('sort_order', parseInt(e.target.value))} />
                            </div>
                            <div className="flex items-center gap-2.5 mt-7">
                                <input type="checkbox" id="d_active" checked={divData.is_active} onChange={e => setDivData('is_active', e.target.checked)} className="rounded-lg border-slate-300 text-[#5B3E93] shadow-sm focus:border-[#5B3E93] focus:ring focus:ring-[#5B3E93]/20" />
                                <InputLabel htmlFor="d_active" value="Status Aktif" />
                            </div>
                        </div>
                        <div>
                            <InputLabel value="Icon Divisi (Gambar)" />
                            <div className="mt-2 flex items-center gap-4">
                                <div className="w-16 h-16 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center overflow-hidden">
                                    {divIconPreview ? <img src={divIconPreview} className="w-full h-full object-contain p-1" /> : <span className="text-xs text-slate-400">Kosong</span>}
                                </div>
                                <div>
                                    <input type="file" ref={divIconRef} onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) { setDivData('icon', file); setDivIconPreview(URL.createObjectURL(file)); }
                                    }} className="hidden" accept="image/*" />
                                    <button type="button" onClick={() => divIconRef.current?.click()} className="px-3.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">Upload Icon</button>
                                </div>
                            </div>
                            <InputError message={divErrors.icon} className="mt-1" />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
                        <button type="button" onClick={closeDivisionModal} className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">Batal</button>
                        <button type="submit" disabled={divProcessing} className="px-4 py-2 text-sm font-semibold text-white bg-[#5B3E93] hover:bg-[#4c337d] rounded-xl transition-colors shadow-sm disabled:opacity-50">Simpan Divisi</button>
                    </div>
                </form>
            </Modal>

            {/* Member Modal (Locked to Selected Period & Filtered Divisions) */}
            {/* Member Modal (Locked to Selected Period & Filtered Divisions) */}
            <Modal show={isMemberModalOpen} onClose={closeMemberModal} maxWidth="5xl">
                <form onSubmit={submitMember} className="p-6 sm:p-7">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">
                                {editingMember ? 'Edit Pengurus' : `Tambah Pengurus (Periode ${selectedPeriod?.name})`}
                            </h2>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Kelola profil dan foto anggota yang akan ditampilkan di card organisasi.
                            </p>
                        </div>
                        <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-[#5B3E93] border border-purple-100">
                            Periode {selectedPeriod?.name}
                        </span>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                        {/* Form Inputs (Left side on desktop) */}
                        <div className="flex-1 w-full">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="bg-purple-50 p-3 rounded-xl border border-purple-100 text-xs font-semibold text-[#5B3E93]">
                                        Terikat pada Periode: <span className="font-bold">{selectedPeriod?.name}</span>
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="m_name" value="Nama Lengkap" />
                                        <TextInput id="m_name" className="mt-1 block w-full rounded-xl" value={memData.name} onChange={e => setMemData('name', e.target.value)} required />
                                        <InputError message={memErrors.name} className="mt-1" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="m_nim" value="NIM (Nomor Induk Mahasiswa)" />
                                        <TextInput id="m_nim" className="mt-1 block w-full rounded-xl" value={memData.nim} onChange={e => setMemData('nim', e.target.value)} placeholder="Contoh: 2105111001" />
                                        <InputError message={memErrors.nim} className="mt-1" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="m_role" value="Jabatan" />
                                        <TextInput id="m_role" className="mt-1 block w-full rounded-xl" value={memData.role_name} onChange={e => setMemData('role_name', e.target.value)} required />
                                        <InputError message={memErrors.role_name} className="mt-1" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="m_div" value={`Divisi (${selectedPeriod?.name})`} />
                                        <select id="m_div" className="mt-1 block w-full border-slate-200 rounded-xl shadow-sm focus:border-[#5B3E93] focus:ring-[#5B3E93]" value={memData.division_id} onChange={e => setMemData('division_id', e.target.value)} required>
                                            <option value="">Pilih Divisi...</option>
                                            {filteredDivisions.map(d => (
                                                <option key={d.id} value={d.id}>{d.name}</option>
                                            ))}
                                        </select>
                                        <InputError message={memErrors.division_id} className="mt-1" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="m_bio" value="Bio Singkat" />
                                        <textarea id="m_bio" className="mt-1 block w-full border-slate-200 rounded-xl shadow-sm focus:border-[#5B3E93] focus:ring-[#5B3E93]" rows={2} value={memData.bio} onChange={e => setMemData('bio', e.target.value)} />
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <div>
                                        <InputLabel value="Foto Profil" />
                                        <p className="text-[11px] text-slate-500 mt-0.5">
                                            Foto profil anggota. Disarankan proporsi potret (3:4).
                                        </p>
                                        <div className="mt-2 flex items-center gap-4">
                                            <div 
                                                className="group relative w-24 h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center overflow-hidden shadow-sm shrink-0"
                                            >
                                                {memPhotoPreview ? (
                                                    <img src={memPhotoPreview} className="w-full h-full object-cover" alt="Preview foto" />
                                                ) : (
                                                    <div className="flex flex-col items-center text-slate-400 p-2 text-center">
                                                        <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        <span className="text-[11px] font-medium leading-tight">Belum ada foto</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <input 
                                                    type="file" 
                                                    ref={memPhotoRef} 
                                                    onChange={handlePhotoFileChange} 
                                                    className="hidden" 
                                                    accept="image/*" 
                                                />
                                                <button 
                                                    type="button" 
                                                    onClick={() => memPhotoRef.current?.click()} 
                                                    className="px-3.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm self-start"
                                                >
                                                    {memPhotoPreview ? 'Ganti Foto' : 'Upload Foto'}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Position Sliders — only visible when photo is selected */}
                                        {memPhotoPreview && (
                                            <div className="mt-3 space-y-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200">
                                                <p className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
                                                    <svg className="w-3.5 h-3.5 text-[#5B3E93]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                                    </svg>
                                                    Atur Posisi Foto
                                                </p>
                                                {/* Horizontal Slider */}
                                                <div>
                                                    <div className="flex items-center justify-between mb-1">
                                                        <label className="text-[11px] font-medium text-slate-500">← Horizontal →</label>
                                                        <span className="text-[11px] font-bold text-[#5B3E93] tabular-nums">{memData.photo_position_x}%</span>
                                                    </div>
                                                    <input
                                                        type="range"
                                                        min={0}
                                                        max={100}
                                                        step={1}
                                                        value={memData.photo_position_x}
                                                        onChange={e => setMemData('photo_position_x', parseInt(e.target.value))}
                                                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#5B3E93]"
                                                    />
                                                </div>
                                                {/* Vertical Slider */}
                                                <div>
                                                    <div className="flex items-center justify-between mb-1">
                                                        <label className="text-[11px] font-medium text-slate-500">↑ Vertikal ↓</label>
                                                        <span className="text-[11px] font-bold text-[#5B3E93] tabular-nums">{memData.photo_position_y}%</span>
                                                    </div>
                                                    <input
                                                        type="range"
                                                        min={0}
                                                        max={100}
                                                        step={1}
                                                        value={memData.photo_position_y}
                                                        onChange={e => setMemData('photo_position_y', parseInt(e.target.value))}
                                                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#5B3E93]"
                                                    />
                                                </div>
                                                {/* Zoom Slider */}
                                                <div>
                                                    <div className="flex items-center justify-between mb-1">
                                                        <label className="text-[11px] font-medium text-slate-500">🔍 Zoom Foto</label>
                                                        <span className="text-[11px] font-bold text-[#5B3E93] tabular-nums">{memData.photo_zoom}%</span>
                                                    </div>
                                                    <input
                                                        type="range"
                                                        min={100}
                                                        max={200}
                                                        step={1}
                                                        value={memData.photo_zoom}
                                                        onChange={e => setMemData('photo_zoom', parseInt(e.target.value))}
                                                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#5B3E93]"
                                                    />
                                                </div>
                                                <p className="text-[10px] text-slate-400 leading-tight">Gunakan Zoom untuk memperbesar foto, lalu geser Horizontal/Vertikal untuk menentukan area fokus wajah/badan.</p>
                                            </div>
                                        )}

                                        <InputError message={memErrors.photo} className="mt-1" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="m_ig" value="Instagram URL" />
                                        <TextInput id="m_ig" className="mt-1 block w-full rounded-xl" value={memData.instagram_url} onChange={e => setMemData('instagram_url', e.target.value)} placeholder="https://..." />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <InputLabel htmlFor="m_sort" value="Urutan" />
                                            <TextInput id="m_sort" type="number" className="mt-1 block w-full rounded-xl" value={memData.sort_order} onChange={e => setMemData('sort_order', parseInt(e.target.value))} />
                                        </div>
                                        <div className="flex items-center gap-2.5 mt-7">
                                            <input type="checkbox" id="m_active" checked={memData.is_active} onChange={e => setMemData('is_active', e.target.checked)} className="rounded-lg border-slate-300 text-[#5B3E93] shadow-sm focus:border-[#5B3E93] focus:ring focus:ring-[#5B3E93]/20" />
                                            <InputLabel htmlFor="m_active" value="Status Aktif" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Live Preview Section (Right side on desktop, bottom on mobile) */}
                        <div className="w-full lg:w-[310px] shrink-0 flex flex-col items-center border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-8">
                            <div className="flex items-center justify-between w-full mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Preview Tampilan Card</span>
                                </div>
                                <span className="text-[10px] font-semibold text-[#5B3E93] bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-full">
                                    Real-Time
                                </span>
                            </div>
                            <p className="text-[11px] text-slate-400 mb-4 w-full text-left">
                                Tampilan kartu di halaman publik (hover untuk efek 3D flip).
                            </p>
                            <div className="w-full flex justify-center py-2">
                                <FlipCard data={liveCardData} />
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3 border-t border-slate-100 pt-4">
                        <button type="button" onClick={closeMemberModal} className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">Batal</button>
                        <button type="submit" disabled={memProcessing} className="px-4 py-2 text-sm font-semibold text-white bg-[#5B3E93] hover:bg-[#4c337d] rounded-xl transition-colors shadow-sm disabled:opacity-50">Simpan Pengurus</button>
                    </div>
                </form>
            </Modal>

        </AuthenticatedLayout>
    );
}
