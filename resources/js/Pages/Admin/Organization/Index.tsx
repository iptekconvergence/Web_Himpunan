import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { FormEventHandler, useState, useRef, useEffect } from 'react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import Modal from '@/Components/Modal';

interface Period { id: number; name: string; is_active: boolean; notes: string | null; }
interface Division { id: number; period_id?: number | null; name: string; slug: string; icon: string | null; description: string | null; sort_order: number; is_active: boolean; period?: Period; }
interface Member { id: number; period_id: number; division_id: number; name: string; nim?: string | null; role_name: string; bio: string | null; photo_path: string | null; instagram_url: string | null; sort_order: number; is_active: boolean; period?: Period; division?: Division; }

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
        _method: 'post'
    });
    const [memPhotoPreview, setMemPhotoPreview] = useState<string | null>(null);
    const memPhotoRef = useRef<HTMLInputElement>(null);

    const openMemberModal = (mem?: Member) => {
        if (!selectedPeriodId) {
            alert('Silakan pilih Periode terlebih dahulu.');
            return;
        }
        if (mem) { 
            setEditingMember(mem); 
            setMemData({ period_id: mem.period_id, division_id: mem.division_id, name: mem.name, nim: mem.nim || '', role_name: mem.role_name, bio: mem.bio || '', instagram_url: mem.instagram_url || '', sort_order: mem.sort_order, is_active: mem.is_active, photo: null, _method: 'post' }); 
            setMemPhotoPreview(mem.photo_path);
        }
        else { 
            setEditingMember(null); 
            setMemData({ period_id: selectedPeriodId, division_id: filteredDivisions[0]?.id || '', name: '', nim: '', role_name: '', bio: '', instagram_url: '', sort_order: filteredMembers.length + 1, is_active: true, photo: null, _method: 'post' }); 
            setMemPhotoPreview(null);
        }
        setIsMemberModalOpen(true);
    };
    const closeMemberModal = () => { setIsMemberModalOpen(false); resetMem(); setEditingMember(null); };

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
                <div className="mb-4 bg-emerald-50 text-emerald-600 p-4 rounded-xl border border-emerald-100 flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    <span className="font-semibold">{flash.message}</span>
                </div>
            )}

            {/* STEP 1: PILIH PERIODE SELECTOR (Mandatory Gateway) */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <h2 className="text-lg font-bold text-slate-900">Pilih Periode Kepengurusan</h2>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            Pilih periode terlebih dahulu untuk mengelola data Divisi dan Pengurus pada periode tersebut.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <select
                            value={selectedPeriodId || ''}
                            onChange={e => {
                                const val = e.target.value ? Number(e.target.value) : null;
                                setSelectedPeriodId(val);
                                if (val && activeTab === 'periods') setActiveTab('divisions');
                            }}
                            className="rounded-xl border-slate-300 text-sm font-bold text-indigo-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2.5 bg-indigo-50/50"
                        >
                            <option value="">-- Pilih Periode --</option>
                            {periods.map(p => (
                                <option key={p.id} value={p.id}>
                                    Periode {p.name} {p.is_active ? '(Aktif)' : ''}
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={() => setActiveTab('periods')}
                            className={`text-xs font-semibold px-4 py-2.5 rounded-xl border transition-colors ${activeTab === 'periods' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}
                        >
                            Master Data Periode
                        </button>
                    </div>
                </div>
            </div>

            {/* IF NO PERIOD SELECTED */}
            {!selectedPeriodId && activeTab !== 'periods' ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
                    <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
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
                                className={`px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all ${p.is_active ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}
                            >
                                Periode {p.name} {p.is_active ? '(Aktif)' : ''}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <>
                    {/* TABS (Divisi & Pengurus for Selected Period) */}
                    <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm border border-slate-100 mb-6">
                        <button
                            onClick={() => setActiveTab('divisions')}
                            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'divisions' ? 'bg-[#5B3E93] text-white shadow' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                        >
                            Divisi ({selectedPeriod ? `Periode ${selectedPeriod.name}` : ''})
                        </button>

                        <button
                            onClick={() => setActiveTab('members')}
                            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'members' ? 'bg-[#5B3E93] text-white shadow' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                        >
                            Pengurus & Anggota ({selectedPeriod ? `Periode ${selectedPeriod.name}` : ''})
                        </button>

                        <button
                            onClick={() => setActiveTab('periods')}
                            className={`px-6 py-2.5 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'periods' ? 'bg-slate-900 text-white shadow' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                        >
                            Pengaturan Periode
                        </button>
                    </div>

                    {/* TAB CONTENT: DIVISIONS FOR SELECTED PERIOD */}
                    {activeTab === 'divisions' && selectedPeriodId && (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap justify-between items-center gap-4">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">
                                        Daftar Divisi — Periode <span className="text-indigo-600">{selectedPeriod?.name}</span>
                                    </h3>
                                    <p className="text-xs text-slate-500">Menampilkan {filteredDivisions.length} divisi pada periode ini.</p>
                                </div>
                                <PrimaryButton onClick={() => openDivisionModal()}>+ Tambah Divisi ({selectedPeriod?.name})</PrimaryButton>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="bg-slate-50 border-b border-slate-100 text-slate-500">
                                        <tr>
                                            <th className="px-6 py-3 font-semibold w-16">Icon</th>
                                            <th className="px-6 py-3 font-semibold">Nama Divisi</th>
                                            <th className="px-6 py-3 font-semibold">Periode</th>
                                            <th className="px-6 py-3 font-semibold">Urutan</th>
                                            <th className="px-6 py-3 font-semibold">Status</th>
                                            <th className="px-6 py-3 font-semibold text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredDivisions.length > 0 ? filteredDivisions.map(div => (
                                            <tr key={div.id} className="hover:bg-slate-50">
                                                <td className="px-6 py-4">
                                                    {div.icon ? <img src={div.icon} alt="" className="w-8 h-8 object-contain" /> : <div className="w-8 h-8 bg-slate-100 rounded"></div>}
                                                </td>
                                                <td className="px-6 py-4 font-medium text-slate-900">{div.name}</td>
                                                <td className="px-6 py-4 font-semibold text-indigo-700">{selectedPeriod?.name}</td>
                                                <td className="px-6 py-4">{div.sort_order}</td>
                                                <td className="px-6 py-4">
                                                    {div.is_active ? <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">Aktif</span> : <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full">Nonaktif</span>}
                                                </td>
                                                <td className="px-6 py-4 text-right space-x-3">
                                                    <button onClick={() => openDivisionModal(div)} className="text-indigo-600 font-medium hover:text-indigo-900">Edit</button>
                                                    <button onClick={() => deleteDivision(div.id)} className="text-rose-600 font-medium hover:text-rose-900">Hapus</button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                                    Belum ada divisi pada Periode {selectedPeriod?.name}. Silakan tambah divisi baru.
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
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap justify-between items-center gap-4">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">
                                        Daftar Pengurus — Periode <span className="text-indigo-600">{selectedPeriod?.name}</span>
                                    </h3>
                                    <p className="text-xs text-slate-500">Menampilkan {filteredMembers.length} pengurus pada periode ini.</p>
                                </div>
                                <PrimaryButton onClick={() => openMemberModal()}>+ Tambah Pengurus ({selectedPeriod?.name})</PrimaryButton>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="bg-slate-50 border-b border-slate-100 text-slate-500">
                                        <tr>
                                            <th className="px-6 py-3 font-semibold">Foto</th>
                                            <th className="px-6 py-3 font-semibold">Nama & Jabatan</th>
                                            <th className="px-6 py-3 font-semibold">NIM</th>
                                            <th className="px-6 py-3 font-semibold">Divisi</th>
                                            <th className="px-6 py-3 font-semibold">Periode</th>
                                            <th className="px-6 py-3 font-semibold text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredMembers.length > 0 ? filteredMembers.map(mem => (
                                            <tr key={mem.id} className="hover:bg-slate-50">
                                                <td className="px-6 py-4">
                                                    {mem.photo_path ? <img src={mem.photo_path} alt="" className="w-10 h-10 object-cover rounded-full" /> : <div className="w-10 h-10 bg-slate-200 rounded-full"></div>}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-slate-900">{mem.name}</div>
                                                    <div className="text-slate-500 text-xs">{mem.role_name}</div>
                                                </td>
                                                <td className="px-6 py-4 text-slate-700 font-mono text-xs">{mem.nim || '-'}</td>
                                                <td className="px-6 py-4 text-slate-700">{mem.division?.name}</td>
                                                <td className="px-6 py-4 font-semibold text-indigo-700">{selectedPeriod?.name}</td>
                                                <td className="px-6 py-4 text-right space-x-3">
                                                    <button onClick={() => openMemberModal(mem)} className="text-indigo-600 font-medium hover:text-indigo-900">Edit</button>
                                                    <button onClick={() => deleteMember(mem.id)} className="text-rose-600 font-medium hover:text-rose-900">Hapus</button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                                    Belum ada pengurus pada Periode {selectedPeriod?.name}. Silakan tambah pengurus baru.
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
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Master Data Periode Kepengurusan</h3>
                                    <p className="text-xs text-slate-500">Kelola daftar seluruh periode organisasi.</p>
                                </div>
                                <PrimaryButton onClick={() => openPeriodModal()}>+ Tambah Periode</PrimaryButton>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="bg-slate-50 border-b border-slate-100 text-slate-500">
                                        <tr>
                                            <th className="px-6 py-3 font-semibold">Nama Periode</th>
                                            <th className="px-6 py-3 font-semibold">Status</th>
                                            <th className="px-6 py-3 font-semibold text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {periods.map(period => (
                                            <tr key={period.id} className="hover:bg-slate-50">
                                                <td className="px-6 py-4 font-bold text-slate-900">Periode {period.name}</td>
                                                <td className="px-6 py-4">
                                                    {period.is_active ? <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">Aktif</span> : <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full">Nonaktif</span>}
                                                </td>
                                                <td className="px-6 py-4 text-right space-x-3">
                                                    <button onClick={() => { setSelectedPeriodId(period.id); setActiveTab('divisions'); }} className="text-emerald-600 font-bold hover:text-emerald-900">Kelola Data &rarr;</button>
                                                    <button onClick={() => openPeriodModal(period)} className="text-indigo-600 font-medium hover:text-indigo-900">Edit</button>
                                                    <button onClick={() => deletePeriod(period.id)} className="text-rose-600 font-medium hover:text-rose-900">Hapus</button>
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
                            <TextInput id="p_name" className="mt-1 block w-full" value={periodData.name} onChange={e => setPeriodData('name', e.target.value)} required />
                            <InputError message={periodErrors.name} className="mt-2" />
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="p_active" checked={periodData.is_active} onChange={e => setPeriodData('is_active', e.target.checked)} className="rounded border-slate-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                            <InputLabel htmlFor="p_active" value="Jadikan Periode Aktif" />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                        <button type="button" onClick={closePeriodModal} className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200">Batal</button>
                        <PrimaryButton disabled={periodProcessing}>Simpan</PrimaryButton>
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
                        <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100 text-xs font-semibold text-indigo-900">
                            Terikat pada Periode: <span className="font-bold">{selectedPeriod?.name}</span>
                        </div>
                        <div>
                            <InputLabel htmlFor="d_name" value="Nama Divisi" />
                            <TextInput id="d_name" className="mt-1 block w-full" value={divData.name} onChange={e => setDivData('name', e.target.value)} required />
                            <InputError message={divErrors.name} className="mt-1" />
                        </div>
                        <div>
                            <InputLabel htmlFor="d_desc" value="Deskripsi" />
                            <textarea id="d_desc" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500" rows={3} value={divData.description} onChange={e => setDivData('description', e.target.value)} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="d_sort" value="Urutan" />
                                <TextInput id="d_sort" type="number" className="mt-1 block w-full" value={divData.sort_order} onChange={e => setDivData('sort_order', parseInt(e.target.value))} />
                            </div>
                            <div className="flex items-center gap-2 mt-7">
                                <input type="checkbox" id="d_active" checked={divData.is_active} onChange={e => setDivData('is_active', e.target.checked)} className="rounded border-slate-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                                <InputLabel htmlFor="d_active" value="Status Aktif" />
                            </div>
                        </div>
                        <div>
                            <InputLabel value="Icon Divisi (Gambar)" />
                            <div className="mt-2 flex items-center gap-4">
                                <div className="w-16 h-16 bg-slate-100 border border-slate-200 rounded flex items-center justify-center overflow-hidden">
                                    {divIconPreview ? <img src={divIconPreview} className="w-full h-full object-contain p-1" /> : <span className="text-xs text-slate-400">Kosong</span>}
                                </div>
                                <div>
                                    <input type="file" ref={divIconRef} onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) { setDivData('icon', file); setDivIconPreview(URL.createObjectURL(file)); }
                                    }} className="hidden" accept="image/*" />
                                    <button type="button" onClick={() => divIconRef.current?.click()} className="px-3 py-1.5 bg-white border border-slate-200 rounded text-sm hover:bg-slate-50">Upload Icon</button>
                                </div>
                            </div>
                            <InputError message={divErrors.icon} className="mt-1" />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                        <button type="button" onClick={closeDivisionModal} className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200">Batal</button>
                        <PrimaryButton disabled={divProcessing}>Simpan Divisi</PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Member Modal (Locked to Selected Period & Filtered Divisions) */}
            <Modal show={isMemberModalOpen} onClose={closeMemberModal} maxWidth="2xl">
                <form onSubmit={submitMember} className="p-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-6">
                        {editingMember ? 'Edit Pengurus' : `Tambah Pengurus (Periode ${selectedPeriod?.name})`}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100 text-xs font-semibold text-indigo-900">
                                Terikat pada Periode: <span className="font-bold">{selectedPeriod?.name}</span>
                            </div>
                            <div>
                                <InputLabel htmlFor="m_name" value="Nama Lengkap" />
                                <TextInput id="m_name" className="mt-1 block w-full" value={memData.name} onChange={e => setMemData('name', e.target.value)} required />
                                <InputError message={memErrors.name} className="mt-1" />
                            </div>
                            <div>
                                <InputLabel htmlFor="m_nim" value="NIM (Nomor Induk Mahasiswa)" />
                                <TextInput id="m_nim" className="mt-1 block w-full" value={memData.nim} onChange={e => setMemData('nim', e.target.value)} placeholder="Contoh: 2105111001" />
                                <InputError message={memErrors.nim} className="mt-1" />
                            </div>
                            <div>
                                <InputLabel htmlFor="m_role" value="Jabatan" />
                                <TextInput id="m_role" className="mt-1 block w-full" value={memData.role_name} onChange={e => setMemData('role_name', e.target.value)} required />
                                <InputError message={memErrors.role_name} className="mt-1" />
                            </div>
                            <div>
                                <InputLabel htmlFor="m_div" value={`Divisi (${selectedPeriod?.name})`} />
                                <select id="m_div" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500" value={memData.division_id} onChange={e => setMemData('division_id', e.target.value)} required>
                                    <option value="">Pilih Divisi...</option>
                                    {filteredDivisions.map(d => (
                                        <option key={d.id} value={d.id}>{d.name}</option>
                                    ))}
                                </select>
                                <InputError message={memErrors.division_id} className="mt-1" />
                            </div>
                            <div>
                                <InputLabel htmlFor="m_bio" value="Bio Singkat" />
                                <textarea id="m_bio" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500" rows={2} value={memData.bio} onChange={e => setMemData('bio', e.target.value)} />
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <InputLabel value="Foto Profil" />
                                <div className="mt-2 flex flex-col gap-3">
                                    <div className="w-32 h-32 bg-slate-100 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center overflow-hidden">
                                        {memPhotoPreview ? <img src={memPhotoPreview} className="w-full h-full object-cover" /> : <span className="text-xs text-slate-400">Pilih Foto</span>}
                                    </div>
                                    <input type="file" ref={memPhotoRef} onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) { setMemData('photo', file); setMemPhotoPreview(URL.createObjectURL(file)); }
                                    }} className="hidden" accept="image/*" />
                                    <button type="button" onClick={() => memPhotoRef.current?.click()} className="self-start px-3 py-1.5 bg-white border border-slate-200 rounded text-sm hover:bg-slate-50">Upload Foto</button>
                                </div>
                                <InputError message={memErrors.photo} className="mt-1" />
                            </div>
                            <div>
                                <InputLabel htmlFor="m_ig" value="Instagram URL" />
                                <TextInput id="m_ig" className="mt-1 block w-full" value={memData.instagram_url} onChange={e => setMemData('instagram_url', e.target.value)} placeholder="https://..." />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <InputLabel htmlFor="m_sort" value="Urutan" />
                                    <TextInput id="m_sort" type="number" className="mt-1 block w-full" value={memData.sort_order} onChange={e => setMemData('sort_order', parseInt(e.target.value))} />
                                </div>
                                <div className="flex items-center gap-2 mt-7">
                                    <input type="checkbox" id="m_active" checked={memData.is_active} onChange={e => setMemData('is_active', e.target.checked)} className="rounded border-slate-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                                    <InputLabel htmlFor="m_active" value="Status Aktif" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end gap-3 border-t border-slate-100 pt-4">
                        <button type="button" onClick={closeMemberModal} className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200">Batal</button>
                        <PrimaryButton disabled={memProcessing}>Simpan Pengurus</PrimaryButton>
                    </div>
                </form>
            </Modal>

        </AuthenticatedLayout>
    );
}
