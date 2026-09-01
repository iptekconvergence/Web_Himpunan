import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import Modal from '@/Components/Modal';

interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'super_admin';
    created_at: string;
}

interface Props {
    users: User[];
    flash?: {
        message?: string;
        error?: string;
    };
}

export default function UsersIndex({ users, flash }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        email: '',
        role: 'admin',
        password: '',
        password_confirmation: '',
    });

    const openModal = (user?: User) => {
        if (user) {
            setEditingUser(user);
            setData({
                name: user.name,
                email: user.email,
                role: user.role,
                password: '',
                password_confirmation: '',
            });
        } else {
            setEditingUser(null);
            setData({
                name: '',
                email: '',
                role: 'admin',
                password: '',
                password_confirmation: '',
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
        setEditingUser(null);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (editingUser) {
            put(route('admin.users.update', editingUser.id), {
                onSuccess: () => closeModal()
            });
        } else {
            post(route('admin.users.store'), {
                onSuccess: () => closeModal()
            });
        }
    };

    const deleteUser = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
            router.delete(route('admin.users.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout header="Manajemen Pengguna">
            <Head title="Pengguna" />

            {flash?.message && (
                <div className="mb-4 bg-emerald-50 text-emerald-600 p-4 rounded-xl border border-emerald-100 flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    <span className="font-semibold">{flash.message}</span>
                </div>
            )}

            {flash?.error && (
                <div className="mb-4 bg-rose-50 text-rose-600 p-4 rounded-xl border border-rose-100 flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    <span className="font-semibold">{flash.error}</span>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Daftar Pengguna</h3>
                        <p className="text-sm text-slate-500">Kelola admin dan super admin sistem.</p>
                    </div>
                    <PrimaryButton onClick={() => openModal()}>Tambah Pengguna</PrimaryButton>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 border-b border-slate-100 text-slate-500">
                            <tr>
                                <th className="px-6 py-3 font-semibold">Nama</th>
                                <th className="px-6 py-3 font-semibold">Email</th>
                                <th className="px-6 py-3 font-semibold">Role</th>
                                <th className="px-6 py-3 font-semibold">Tgl Daftar</th>
                                <th className="px-6 py-3 font-semibold text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.length === 0 ? (
                                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Belum ada pengguna.</td></tr>
                            ) : users.map(user => (
                                <tr key={user.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-900">{user.name}</td>
                                    <td className="px-6 py-4 text-slate-500">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'super_admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {user.role.replace('_', ' ').toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">{new Date(user.created_at).toLocaleDateString('id-ID')}</td>
                                    <td className="px-6 py-4 text-right space-x-3">
                                        <button onClick={() => openModal(user)} className="text-indigo-600 hover:text-indigo-900 font-medium">Edit</button>
                                        <button onClick={() => deleteUser(user.id)} className="text-rose-600 hover:text-rose-900 font-medium">Hapus</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={closeModal} maxWidth="md">
                <form onSubmit={submit} className="p-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-6">{editingUser ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}</h2>
                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="name" value="Nama Lengkap" />
                            <TextInput id="name" className="mt-1 block w-full" value={data.name} onChange={e => setData('name', e.target.value)} required />
                            <InputError message={errors.name} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput id="email" type="email" className="mt-1 block w-full" value={data.email} onChange={e => setData('email', e.target.value)} required />
                            <InputError message={errors.email} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="role" value="Role" />
                            <select id="role" className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm" value={data.role} onChange={e => setData('role', e.target.value as any)}>
                                <option value="admin">Admin</option>
                                <option value="super_admin">Super Admin</option>
                            </select>
                            <InputError message={errors.role} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="password" value={editingUser ? "Password Baru (Biarkan kosong jika tidak diubah)" : "Password"} />
                            <TextInput id="password" type="password" className="mt-1 block w-full" value={data.password} onChange={e => setData('password', e.target.value)} required={!editingUser} />
                            <InputError message={errors.password} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="password_confirmation" value="Konfirmasi Password" />
                            <TextInput id="password_confirmation" type="password" className="mt-1 block w-full" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} required={!editingUser && data.password.length > 0} />
                            <InputError message={errors.password_confirmation} className="mt-2" />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                        <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200">Batal</button>
                        <PrimaryButton disabled={processing}>Simpan</PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
