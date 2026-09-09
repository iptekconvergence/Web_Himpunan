import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function Index({ news }: { news: any }) {
    return (
        <PublicLayout>
            <Head title="Berita & Kegiatan" />
            
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <h2 className="text-base font-semibold leading-7 text-cyan-400 uppercase tracking-wide">Update Terbaru</h2>
                    <p className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                        Berita & Kegiatan
                    </p>
                    <p className="mt-4 text-lg leading-8 text-slate-300">
                        Ikuti terus perkembangan dan kegiatan terbaru dari HMPS Manajemen Informatika.
                    </p>
                </div>

                <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    {news.data && news.data.length > 0 ? news.data.map((post: any) => (
                        <article key={post.id} className="flex flex-col items-start justify-between group h-full">
                            <div className="relative w-full">
                                <img
                                    src={post.thumbnail_path || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80'}
                                    alt={post.title}
                                    className="aspect-[16/9] w-full rounded-2xl bg-slate-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2] transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-slate-900/10 pointer-events-none" />
                            </div>
                            <div className="max-w-xl w-full mt-8 flex flex-col flex-1">
                                <div className="flex items-center gap-x-4 text-xs">
                                    <time dateTime={post.published_at || post.created_at} className="text-slate-400">
                                        {new Date(post.published_at || post.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </time>
                                    {post.category && (
                                        <span className="relative z-10 rounded-full bg-white/10 px-3 py-1.5 font-medium text-slate-300 hover:bg-white/20 transition-colors">
                                            {post.category.name}
                                        </span>
                                    )}
                                </div>
                                <div className="group relative flex-1">
                                    <h3 className="mt-3 text-lg font-semibold leading-6 text-white group-hover:text-cyan-400 transition-colors">
                                        <Link href={`/berita/${post.slug}`}>
                                            <span className="absolute inset-0" />
                                            {post.title}
                                        </Link>
                                    </h3>
                                    <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-400">
                                        {post.content.replace(/<[^>]*>?/gm, '')}
                                    </p>
                                </div>
                            </div>
                        </article>
                    )) : (
                        <div className="col-span-3 text-center text-slate-400 py-12 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
                            Belum ada berita yang dipublikasikan.
                        </div>
                    )}
                </div>

                {/* Pagination Controls */}
                {news.links && news.links.length > 3 && (
                    <div className="mt-16 flex justify-center">
                        <div className="flex flex-wrap items-center gap-2">
                            {news.links.map((link: any, i: number) => (
                                <Link
                                    key={i}
                                    href={link.url || '#'}
                                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                                        link.active 
                                            ? 'bg-cyan-500 text-slate-900 shadow-lg shadow-cyan-500/30' 
                                            : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                                    } ${!link.url ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
