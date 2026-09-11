import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function Show({ news, relatedNews }: { news: any, relatedNews: any[] }) {
    // calculate reading time
    const wordCount = news.content ? news.content.replace(/<[^>]*>?/gm, '').split(/\s+/).length : 0;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));
    
    // copy link functionality
    const handleCopyLink = () => {
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href);
            alert('Link berhasil disalin!');
        }
    };

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

    return (
        <PublicLayout>
            <Head title={`${news.title} | Berita`} />
            
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                
                {/* Breadcrumb */}
                <nav className="flex mb-8 text-sm text-slate-400 font-medium">
                    <ol className="flex items-center space-x-2">
                        <li>
                            <Link href="/" className="hover:text-cyan-400 transition-colors">Home</Link>
                        </li>
                        <li><span className="mx-2 text-slate-600">/</span></li>
                        <li>
                            <Link href="/berita" className="hover:text-cyan-400 transition-colors">Berita</Link>
                        </li>
                        <li><span className="mx-2 text-slate-600">/</span></li>
                        <li className="text-slate-200 truncate max-w-[200px] sm:max-w-xs" aria-current="page">
                            {news.title}
                        </li>
                    </ol>
                </nav>

                <div className="flex flex-col lg:flex-row gap-12">
                    
                    {/* Main Content - Left Column */}
                    <article className="w-full lg:w-2/3">
                        <header className="mb-10">
                            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl leading-tight mb-6">
                                {news.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-400 font-medium">
                                <span>Dikelola oleh <strong className="text-slate-200">{news.category?.name || 'Admin'}</strong></span>
                                <span className="hidden sm:inline text-slate-600">&bull;</span>
                                <time dateTime={news.published_at || news.created_at}>
                                    {new Date(news.published_at || news.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </time>
                                <span className="hidden sm:inline text-slate-600">&bull;</span>
                                <span>{readingTime} Menit Baca</span>
                            </div>
                        </header>

                        <div className="relative w-full mb-10 shadow-2xl rounded-2xl overflow-hidden ring-1 ring-white/10">
                            <img
                                src={news.thumbnail_path || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80'}
                                alt={news.title}
                                className="w-full aspect-video object-cover"
                            />
                        </div>

                        <div 
                            className="prose prose-invert prose-cyan max-w-none mb-12 prose-img:rounded-2xl"
                            dangerouslySetInnerHTML={{ __html: news.content }}
                        />

                        {/* Category Label */}
                        {news.category && (
                            <div className="mb-8 border-b border-slate-800 pb-8">
                                <span className="inline-block rounded-full bg-cyan-500/10 text-cyan-400 px-3 py-1 font-medium border border-cyan-500/20 text-sm">
                                    {news.category.name}
                                </span>
                            </div>
                        )}

                        {/* Share Buttons */}
                        <div className="flex items-center gap-4">
                            <span className="text-slate-300 font-medium text-sm">Bagikan:</span>
                            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 transition-colors ring-1 ring-white/10" aria-label="Share on Facebook">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/></svg>
                            </a>
                            <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(news.title)}`} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 transition-colors ring-1 ring-white/10" aria-label="Share on Twitter/X">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                            </a>
                            <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(news.title + ' ' + shareUrl)}`} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 transition-colors ring-1 ring-white/10" aria-label="Share on WhatsApp">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 0C5.385 0 0 5.383 0 12.031c0 2.115.553 4.148 1.603 5.952L.15 24l6.183-1.428A11.966 11.966 0 0012.031 24c6.645 0 12.028-5.383 12.028-12.031C24.059 5.383 18.676 0 12.031 0zm0 22.015c-1.815 0-3.593-.487-5.15-1.408l-.37-.218-3.826.885.899-3.731-.24-.38a9.98 9.98 0 01-1.528-5.263c0-5.525 4.498-10.022 10.026-10.022 5.527 0 10.025 4.497 10.025 10.022 0 5.526-4.498 10.022-10.025 10.022zm5.503-7.518c-.302-.15-1.785-.88-2.062-.982-.277-.101-.478-.15-.68.151-.201.302-.78 1.002-.956 1.203-.175.202-.352.227-.654.076-2.124-1.066-3.418-1.921-4.708-3.82-.176-.252-.02-.387.13-.538.135-.135.302-.353.453-.529.151-.176.202-.301.302-.503.1-.202.05-.378-.025-.529-.076-.151-.68-1.637-.932-2.242-.244-.588-.492-.508-.68-.517-.175-.009-.377-.01-.578-.01-.202 0-.529.076-.805.378-.277.302-1.057 1.033-1.057 2.518s1.082 2.92 1.233 3.12c.151.202 2.124 3.243 5.143 4.544 2.253.974 3.013.882 3.541.73.592-.172 1.785-.73 2.037-1.434.252-.705.252-1.31.176-1.435-.076-.126-.277-.202-.579-.353z"/></svg>
                            </a>
                            <button onClick={handleCopyLink} className="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 transition-colors ring-1 ring-white/10" aria-label="Copy Link">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
                            </button>
                        </div>
                    </article>

                    {/* Sidebar - Right Column */}
                    <aside className="w-full lg:w-1/3 mt-12 lg:mt-0">
                        <div className="bg-slate-800 rounded-2xl p-6 ring-1 ring-white/10 sticky top-24">
                            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700">
                                <h2 className="text-lg font-bold tracking-tight text-white">Berita Terbaru</h2>
                                <Link href="/berita" className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 group">
                                    Semua <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
                                </Link>
                            </div>

                            {relatedNews && relatedNews.length > 0 ? (
                                <div className="space-y-6">
                                    {relatedNews.map((post) => (
                                        <article key={post.id} className="flex items-start gap-4 group relative">
                                            <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden ring-1 ring-white/10 bg-slate-700">
                                                <img
                                                    src={post.thumbnail_path || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=200&q=80'}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            </div>
                                            <div className="flex flex-col pt-1">
                                                <time dateTime={post.published_at || post.created_at} className="text-[11px] font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
                                                    {new Date(post.published_at || post.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </time>
                                                <h3 className="text-sm font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors line-clamp-2 leading-snug">
                                                    <Link href={`/berita/${post.slug}`}>
                                                        <span className="absolute inset-0" />
                                                        {post.title}
                                                    </Link>
                                                </h3>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-400">Belum ada berita lainnya.</p>
                            )}
                        </div>
                    </aside>
                </div>
            </div>
            
            {/* Added bottom spacing */}
            <div className="pb-24"></div>
        </PublicLayout>
    );
}
