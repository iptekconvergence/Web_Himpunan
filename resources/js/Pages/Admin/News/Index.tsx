import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { FormEventHandler, useState, useRef } from 'react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import Modal from '@/Components/Modal';
import RichTextEditor from '@/Components/RichTextEditor';

interface NewsCategory { id: number; name: string; slug: string; }
interface NewsArticle { id: number; news_category_id: number; title: string; slug: string; thumbnail_path: string | null; content: string; status: 'draft' | 'published'; published_at: string | null; category?: NewsCategory; created_at: string; }

interface PaginationLink { url: string | null; label: string; active: boolean; }
interface PaginatedArticles {
    data: NewsArticle[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
}

interface Props {
    categories: NewsCategory[];
    articles: PaginatedArticles;
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
        news_category_id: categories[0]?.id || '' as string | number, title: '', content: '', status: 'published' as string, thumbnail: null as File | null, published_at: '' as string, _method: 'post'
    });
    const [artThumbPreview, setArtThumbPreview] = useState<string | null>(null);
    const artThumbRef = useRef<HTMLInputElement>(null);

    const openArticleModal = (art?: NewsArticle) => {
        if (art) { 
            setEditingArticle(art); 
            setArtData({ 
                news_category_id: art.news_category_id, 
                title: art.title, 
                content: art.content, 
                status: art.status, 
                thumbnail: null, 
                published_at: art.published_at ? art.published_at.slice(0, 16) : '',
                _method: 'post' 
            }); 
            setArtThumbPreview(art.thumbnail_path);
        }
        else { 
            setEditingArticle(null); 
            setArtData({ news_category_id: categories[0]?.id || '', title: '', content: '', status: 'published', thumbnail: null, published_at: '', _method: 'post' }); 
            setArtThumbPreview(null);
        }
        setIsArticleModalOpen(true);
    };
    const closeArticleModal = () => { setIsArticleModalOpen(false); resetArt(); setEditingArticle(null); setArtThumbPreview(null); };

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

    // --- FLASH MESSAGE AUTO-DISMISS ---
    const [showFlash, setShowFlash] = useState(true);
    if (flash?.message && !showFlash) setShowFlash(true);

    return (
        <AuthenticatedLayout header="Manajemen Berita">
            <Head title="Berita" />

            {flash?.message && showFlash && (
                <div className="mb-4 bg-emerald-50 text-emerald-600 p-4 rounded-xl border border-emerald-100 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                        <span className="font-semibold">{flash.message}</span>
                    </div>
                    <button onClick={() => setShowFlash(false)} className="text-emerald-400 hover:text-emerald-600 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
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
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Daftar Artikel</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Total {articles.total} artikel</p>
                        </div>
                        <PrimaryButton onClick={() => openArticleModal()}>
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                            Tulis Artikel
                        </PrimaryButton>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500">
                                <tr>
                                    <th className="px-6 py-3 font-semibold w-16">Cover</th>
                                    <th className="px-6 py-3 font-semibold">Judul & Kategori</th>
                                    <th className="px-6 py-3 font-semibold">Status</th>
                                    <th className="px-6 py-3 font-semibold">Tanggal Publish</th>
                                    <th className="px-6 py-3 font-semibold text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {articles.data.length === 0 ? (
                                    <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                                            <p className="font-medium">Belum ada artikel</p>
                                            <p className="text-xs">Klik "Tulis Artikel" untuk membuat artikel baru.</p>
                                        </div>
                                    </td></tr>
                                ) : articles.data.map(art => (
                                    <tr key={art.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            {art.thumbnail_path ? <img src={art.thumbnail_path} alt="" className="w-14 h-10 object-cover rounded-lg ring-1 ring-slate-200" /> : <div className="w-14 h-10 bg-slate-100 rounded-lg flex items-center justify-center"><svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>}
                                        </td>
                                        <td className="px-6 py-4 whitespace-normal max-w-xs">
                                            <div className="font-bold text-slate-900 line-clamp-1">{art.title}</div>
                                            {art.category && <div className="text-slate-500 text-xs mt-0.5 flex items-center gap-1.5">
                                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#5B3E93]/60"></span>
                                                {art.category.name}
                                            </div>}
                                        </td>
                                        <td className="px-6 py-4">
                                            {art.status === 'published' ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-100">
                                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                                                    Dipublikasikan
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full border border-amber-100">
                                                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                                                    Draft
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 text-xs">
                                            {art.published_at ? (
                                                <div>
                                                    <div className="font-medium text-slate-700">{new Date(art.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                                                    <div className="text-slate-400 mt-0.5">{new Date(art.published_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</div>
                                                </div>
                                            ) : (
                                                <span className="text-slate-400 italic">Belum dipublikasikan</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={() => openArticleModal(art)} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:text-white hover:bg-indigo-600 rounded-lg transition-colors" title="Edit">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                    Edit
                                                </button>
                                                <button onClick={() => deleteArticle(art.id)} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-white hover:bg-rose-600 rounded-lg transition-colors" title="Hapus">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    Hapus
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {articles.last_page > 1 && (
                        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
                            <p className="text-xs text-slate-500">
                                Menampilkan halaman <strong>{articles.current_page}</strong> dari <strong>{articles.last_page}</strong> ({articles.total} artikel)
                            </p>
                            <div className="flex items-center gap-1">
                                {articles.links.map((link, idx) => (
                                    <span key={idx}>
                                        {link.url ? (
                                            <Link
                                                href={link.url}
                                                preserveScroll
                                                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                                                    link.active 
                                                        ? 'bg-[#5B3E93] text-white shadow' 
                                                        : 'text-slate-600 hover:bg-slate-100'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ) : (
                                            <span 
                                                className="px-3 py-1.5 text-xs font-semibold text-slate-300 cursor-not-allowed"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        )}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* TAB CONTENT: CATEGORIES */}
            {activeTab === 'categories' && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Kategori Berita</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Total {categories.length} kategori</p>
                        </div>
                        <PrimaryButton onClick={() => openCatModal()}>
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                            Tambah Kategori
                        </PrimaryButton>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500">
                                <tr>
                                    <th className="px-6 py-3 font-semibold w-16">No</th>
                                    <th className="px-6 py-3 font-semibold">Nama Kategori</th>
                                    <th className="px-6 py-3 font-semibold">Slug</th>
                                    <th className="px-6 py-3 font-semibold text-center">Jumlah Artikel</th>
                                    <th className="px-6 py-3 font-semibold text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {categories.length === 0 ? (
                                    <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                        <p className="font-medium">Belum ada kategori.</p>
                                    </td></tr>
                                ) : categories.map((cat, idx) => (
                                    <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-500">{idx + 1}</td>
                                        <td className="px-6 py-4 font-bold text-slate-900">{cat.name}</td>
                                        <td className="px-6 py-4 text-slate-500 font-mono text-xs">{cat.slug}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center justify-center min-w-[28px] px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full">
                                                {articles.data.filter(a => a.news_category_id === cat.id).length}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={() => openCatModal(cat)} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:text-white hover:bg-indigo-600 rounded-lg transition-colors">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                    Edit
                                                </button>
                                                <button onClick={() => deleteCat(cat.id)} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-white hover:bg-rose-600 rounded-lg transition-colors">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
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
                        <button type="button" onClick={closeCatModal} className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">Batal</button>
                        <PrimaryButton disabled={catProcessing}>Simpan</PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Article Modal */}
            <Modal show={isArticleModalOpen} onClose={closeArticleModal} maxWidth="2xl">
                <form onSubmit={submitArticle} className="p-6">
                    {/* Modal Header */}
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5B3E93] to-[#06B6D4] flex items-center justify-center shadow-md">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">{editingArticle ? 'Edit Artikel' : 'Tulis Artikel Baru'}</h2>
                            <p className="text-xs text-slate-500">Lengkapi form berikut untuk {editingArticle ? 'mengubah' : 'membuat'} artikel.</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Left column - Main content */}
                        <div className="md:col-span-2 space-y-5">
                            <div>
                                <InputLabel htmlFor="a_title" value="Judul Artikel" />
                                <TextInput id="a_title" className="mt-1 block w-full" value={artData.title} onChange={e => setArtData('title', e.target.value)} required placeholder="Masukkan judul artikel..." />
                                <InputError message={artErrors.title} className="mt-2" />
                            </div>
                            
                            <div>
                                <InputLabel value="Isi Berita" />
                                <RichTextEditor
                                    value={artData.content}
                                    onChange={(html) => setArtData('content', html)}
                                    placeholder="Tulis isi berita di sini..."
                                />
                                <InputError message={artErrors.content} className="mt-2" />
                            </div>
                        </div>
                        
                        {/* Right column - Metadata */}
                        <div className="space-y-5">
                            <div>
                                <InputLabel htmlFor="a_cat" value="Kategori" />
                                <select id="a_cat" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:border-[#5B3E93] focus:ring-[#5B3E93] text-sm" value={artData.news_category_id} onChange={e => setArtData('news_category_id', e.target.value)} required>
                                    <option value="">Pilih kategori...</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                                <InputError message={artErrors.news_category_id} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="a_status" value="Status" />
                                <select id="a_status" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:border-[#5B3E93] focus:ring-[#5B3E93] text-sm" value={artData.status} onChange={e => setArtData('status', e.target.value as any)} required>
                                    <option value="draft">📝 Draft</option>
                                    <option value="published">🌐 Publish</option>
                                </select>
                            </div>

                            <div>
                                <InputLabel htmlFor="a_published_at" value="Tanggal Publish" />
                                <input 
                                    type="datetime-local" 
                                    id="a_published_at" 
                                    className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:border-[#5B3E93] focus:ring-[#5B3E93] text-sm"
                                    value={artData.published_at}
                                    onChange={e => setArtData('published_at', e.target.value)}
                                />
                                <InputError message={artErrors.published_at} className="mt-2" />
                                <p className="text-[11px] text-slate-400 mt-1.5">Opsional — kosongkan untuk otomatis saat dipublish.</p>
                            </div>
                            
                            <div className="pt-1">
                                <InputLabel value="Gambar Cover" />
                                <div className="mt-2 flex flex-col gap-2.5">
                                    <div 
                                        className="w-full h-40 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center overflow-hidden cursor-pointer hover:border-[#5B3E93]/40 hover:bg-[#5B3E93]/5 transition-colors group"
                                        onClick={() => artThumbRef.current?.click()}
                                    >
                                        {artThumbPreview ? (
                                            <img src={artThumbPreview} className="w-full h-full object-cover" alt="Preview" />
                                        ) : (
                                            <div className="text-center">
                                                <svg className="w-8 h-8 mx-auto text-slate-300 mb-1.5 group-hover:text-[#5B3E93]/60 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                <span className="text-xs text-slate-400 group-hover:text-[#5B3E93]/70 transition-colors">Klik untuk pilih gambar</span>
                                            </div>
                                        )}
                                    </div>
                                    <input type="file" ref={artThumbRef} onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) { setArtData('thumbnail', file); setArtThumbPreview(URL.createObjectURL(file)); }
                                    }} className="hidden" accept="image/*" />
                                    {artThumbPreview && (
                                        <button type="button" onClick={() => artThumbRef.current?.click()} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 text-slate-600">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                            Ganti Gambar
                                        </button>
                                    )}
                                    <InputError message={artErrors.thumbnail} className="mt-1" />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Modal Footer */}
                    <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
                        <button type="button" onClick={closeArticleModal} className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">
                            Batal
                        </button>
                        <button 
                            type="submit" 
                            disabled={artProcessing}
                            className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl text-white transition-all shadow-md ${
                                artProcessing 
                                    ? 'bg-[#5B3E93]/60 cursor-not-allowed' 
                                    : 'bg-[#5B3E93] hover:bg-[#4A3280] shadow-[#5B3E93]/25 hover:shadow-lg'
                            }`}
                        >
                            {artProcessing ? (
                                <>
                                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                    Simpan Artikel
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </Modal>

        </AuthenticatedLayout>
    );
}
