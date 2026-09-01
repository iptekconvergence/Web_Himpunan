import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { FormEventHandler, useState, useRef } from 'react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import Modal from '@/Components/Modal';

interface NewsCategory { id: number; name: string; slug: string; }
interface NewsArticle { id: number; news_category_id: number; title: string; slug: string; thumbnail_path: string | null; content: string; status: 'draft' | 'published'; published_at: string | null; category?: NewsCategory; created_at: string; }

interface Props {
    categories: NewsCategory[];
    articles: NewsArticle[];
    flash?: { message?: string; error?: string; };
}

export default function NewsIndex({ categories, articles, flash }: Props) {
    const [activeTab, setActiveTab] = useState<'articles' | 'categories'>('articles');

    // --- CATEGORY STATE & FORM ---
    const [isCatModalOpen, setIsCatModalOpen] = useState(false);
    const [editingCat, setEditingCat] = useState<NewsCategory | null>(null);
    const { data: catData, setData: setCatData, post: postCat, put: putCat, processing: catProcessing, errors: catErrors, reset: resetCat } = useForm({
        name: ''
    });

    const openCatModal = (cat?: NewsCategory) => {
        if (cat) { setEditingCat(cat); setCatData({ name: cat.name }); }
        else { setEditingCat(null); setCatData({ name: '' }); }
        setIsCatModalOpen(true);
    };
    const closeCatModal = () => { setIsCatModalOpen(false); resetCat(); setEditingCat(null); };

    const submitCat: FormEventHandler = (e) => {
        e.preventDefault();
        if (editingCat) putCat(route('admin.news.categories.update', editingCat.id), { onSuccess: () => closeCatModal() });
        else postCat(route('admin.news.categories.store'), { onSuccess: () => closeCatModal() });
    };

    const deleteCat = (id: number) => { if (confirm('Yakin ingin menghapus kategori ini? Semua artikel dalam kategori ini juga akan terhapus.')) router.delete(route('admin.news.categories.destroy', id)); };

    // --- ARTICLE STATE & FORM ---
    const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
    const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
    const { data: artData, setData: setArtData, post: postArt, processing: artProcessing, errors: artErrors, reset: resetArt } = useForm({
        news_category_id: categories[0]?.id || '', title: '', content: '', status: 'published', thumbnail: null as File | null, _method: 'post'
    });
    const [artThumbPreview, setArtThumbPreview] = useState<string | null>(null);
    const artThumbRef = useRef<HTMLInputElement>(null);

    const openArticleModal = (art?: NewsArticle) => {
        if (art) { 
            setEditingArticle(art); 
            setArtData({ news_category_id: art.news_category_id, title: art.title, content: art.content, status: art.status, thumbnail: null, _method: 'post' }); 
            setArtThumbPreview(art.thumbnail_path);
        }
        else { 
            setEditingArticle(null); 
            setArtData({ news_category_id: categories[0]?.id || '', title: '', content: '', status: 'published', thumbnail: null, _method: 'post' }); 
            setArtThumbPreview(null);
        }
        setIsArticleModalOpen(true);
    };
    const closeArticleModal = () => { setIsArticleModalOpen(false); resetArt(); setEditingArticle(null); };

    const submitArticle: FormEventHandler = (e) => {
        e.preventDefault();
        if (editingArticle) {
            setArtData('_method', 'PUT');
            postArt(route('admin.news.articles.update', editingArticle.id), { onSuccess: () => closeArticleModal(), forceFormData: true });
        } else {
            postArt(route('admin.news.articles.store'), { onSuccess: () => closeArticleModal(), forceFormData: true });
        }
    };

    const deleteArticle = (id: number) => { if (confirm('Yakin ingin menghapus artikel ini?')) router.delete(route('admin.news.articles.destroy', id)); };

    return (
        <AuthenticatedLayout header="Manajemen Berita">
            <Head title="Berita" />

            {flash?.message && (
                <div className="mb-4 bg-emerald-50 text-emerald-600 p-4 rounded-xl border border-emerald-100 flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    <span className="font-semibold">{flash.message}</span>
                </div>
            )}

            {/* TABS */}
            <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm border border-slate-100 mb-6 w-full md:w-fit">
                <button onClick={() => setActiveTab('articles')} className={`flex-1 md:px-8 py-2.5 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'articles' ? 'bg-[#5B3E93] text-white shadow' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}>Daftar Artikel</button>
                <button onClick={() => setActiveTab('categories')} className={`flex-1 md:px-8 py-2.5 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'categories' ? 'bg-[#5B3E93] text-white shadow' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}>Kategori Berita</button>
            </div>

            {/* TAB CONTENT: ARTICLES */}
            {activeTab === 'articles' && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-slate-900">Daftar Artikel</h3>
                        <PrimaryButton onClick={() => openArticleModal()}>Tulis Artikel</PrimaryButton>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500">
                                <tr>
                                    <th className="px-6 py-3 font-semibold w-16">Cover</th>
                                    <th className="px-6 py-3 font-semibold">Judul & Kategori</th>
                                    <th className="px-6 py-3 font-semibold">Status</th>
                                    <th className="px-6 py-3 font-semibold">Tanggal</th>
                                    <th className="px-6 py-3 font-semibold text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {articles.length === 0 ? (
                                    <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Belum ada artikel.</td></tr>
                                ) : articles.map(art => (
                                    <tr key={art.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4">
                                            {art.thumbnail_path ? <img src={art.thumbnail_path} alt="" className="w-12 h-12 object-cover rounded-lg" /> : <div className="w-12 h-12 bg-slate-200 rounded-lg"></div>}
                                        </td>
                                        <td className="px-6 py-4 whitespace-normal">
                                            <div className="font-bold text-slate-900">{art.title}</div>
                                            <div className="text-slate-500 text-xs mt-0.5">{art.category?.name}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {art.status === 'published' ? <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">Dipublikasikan</span> : <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">Draft</span>}
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 text-xs">
                                            {new Date(art.created_at).toLocaleDateString('id-ID')}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-3">
                                            <button onClick={() => openArticleModal(art)} className="text-indigo-600 font-medium hover:text-indigo-900">Edit</button>
                                            <button onClick={() => deleteArticle(art.id)} className="text-rose-600 font-medium hover:text-rose-900">Hapus</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: CATEGORIES */}
            {activeTab === 'categories' && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-slate-900">Kategori Berita</h3>
                        <PrimaryButton onClick={() => openCatModal()}>Tambah Kategori</PrimaryButton>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500">
                                <tr>
                                    <th className="px-6 py-3 font-semibold w-16">No</th>
                                    <th className="px-6 py-3 font-semibold">Nama Kategori</th>
                                    <th className="px-6 py-3 font-semibold">Slug</th>
                                    <th className="px-6 py-3 font-semibold text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {categories.map((cat, idx) => (
                                    <tr key={cat.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 font-medium text-slate-500">{idx + 1}</td>
                                        <td className="px-6 py-4 font-bold text-slate-900">{cat.name}</td>
                                        <td className="px-6 py-4 text-slate-500">{cat.slug}</td>
                                        <td className="px-6 py-4 text-right space-x-3">
                                            <button onClick={() => openCatModal(cat)} className="text-indigo-600 font-medium hover:text-indigo-900">Edit</button>
                                            <button onClick={() => deleteCat(cat.id)} className="text-rose-600 font-medium hover:text-rose-900">Hapus</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* MODALS */}
            
            {/* Category Modal */}
            <Modal show={isCatModalOpen} onClose={closeCatModal} maxWidth="sm">
                <form onSubmit={submitCat} className="p-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-6">{editingCat ? 'Edit Kategori' : 'Tambah Kategori'}</h2>
                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="c_name" value="Nama Kategori" />
                            <TextInput id="c_name" className="mt-1 block w-full" value={catData.name} onChange={e => setCatData('name', e.target.value)} required />
                            <InputError message={catErrors.name} className="mt-2" />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                        <button type="button" onClick={closeCatModal} className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200">Batal</button>
                        <PrimaryButton disabled={catProcessing}>Simpan</PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Article Modal */}
            <Modal show={isArticleModalOpen} onClose={closeArticleModal} maxWidth="2xl">
                <form onSubmit={submitArticle} className="p-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-6">{editingArticle ? 'Edit Artikel' : 'Tulis Artikel'}</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-4">
                            <div>
                                <InputLabel htmlFor="a_title" value="Judul Artikel" />
                                <TextInput id="a_title" className="mt-1 block w-full" value={artData.title} onChange={e => setArtData('title', e.target.value)} required />
                                <InputError message={artErrors.title} className="mt-1" />
                            </div>
                            
                            <div>
                                <InputLabel htmlFor="a_content" value="Isi Berita" />
                                <textarea id="a_content" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 font-mono text-sm" rows={12} value={artData.content} onChange={e => setArtData('content', e.target.value)} required placeholder="Tulis konten dengan HTML atau Text biasa..." />
                                <InputError message={artErrors.content} className="mt-1" />
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <InputLabel htmlFor="a_cat" value="Kategori" />
                                <select id="a_cat" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500" value={artData.news_category_id} onChange={e => setArtData('news_category_id', e.target.value)} required>
                                    <option value="">Pilih...</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                                <InputError message={artErrors.news_category_id} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel htmlFor="a_status" value="Status" />
                                <select id="a_status" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500" value={artData.status} onChange={e => setArtData('status', e.target.value as any)} required>
                                    <option value="draft">Draft</option>
                                    <option value="published">Publish</option>
                                </select>
                            </div>
                            
                            <div className="pt-2">
                                <InputLabel value="Gambar Cover / Thumbnail" />
                                <div className="mt-2 flex flex-col gap-3">
                                    <div className="w-full h-40 bg-slate-100 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center overflow-hidden">
                                        {artThumbPreview ? <img src={artThumbPreview} className="w-full h-full object-cover" /> : <span className="text-xs text-slate-400">Pilih Gambar</span>}
                                    </div>
                                    <input type="file" ref={artThumbRef} onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) { setArtData('thumbnail', file); setArtThumbPreview(URL.createObjectURL(file)); }
                                    }} className="hidden" accept="image/*" />
                                    <button type="button" onClick={() => artThumbRef.current?.click()} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors">Upload Cover Baru</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-8 flex justify-end gap-3 border-t border-slate-100 pt-4">
                        <button type="button" onClick={closeArticleModal} className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200">Batal</button>
                        <PrimaryButton disabled={artProcessing}>Simpan Artikel</PrimaryButton>
                    </div>
                </form>
            </Modal>

        </AuthenticatedLayout>
    );
}
