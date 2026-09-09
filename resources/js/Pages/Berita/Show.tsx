import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function Show({ news, relatedNews }: { news: any, relatedNews: any[] }) {
    return (
        <PublicLayout>
            <Head title={`${news.title} | Berita`} />
            
            <article className="mx-auto max-w-4xl px-6 lg:px-8 mt-10">
                <div className="text-center mb-10">
                    <div className="flex items-center justify-center gap-x-4 text-sm mb-6">
                        <time dateTime={news.published_at || news.created_at} className="text-slate-400">
                            {new Date(news.published_at || news.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </time>
                        {news.category && (
                            <span className="relative z-10 rounded-full bg-cyan-500/10 text-cyan-400 px-3 py-1.5 font-medium border border-cyan-500/20">
                                {news.category.name}
                            </span>
                        )}
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl leading-tight mb-8">
                        {news.title}
                    </h1>
                </div>

                <div className="relative w-full mb-12 shadow-2xl rounded-3xl overflow-hidden ring-1 ring-white/10">
                    <img
                        src={news.thumbnail_path || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80'}
                        alt={news.title}
                        className="w-full aspect-video object-cover"
                    />
                </div>

                <div 
                    className="mx-auto mt-8 text-slate-300 leading-relaxed space-y-6 [&>p]:mb-4 [&>h2]:text-2xl [&>h2]:text-white [&>h2]:font-bold [&>h2]:mt-8 [&>h2]:mb-4 [&>h3]:text-xl [&>h3]:text-white [&>h3]:font-bold [&>h3]:mt-6 [&>h3]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>a]:text-cyan-400 hover:[&>a]:text-cyan-300 [&>img]:rounded-xl [&>img]:my-6 [&>blockquote]:border-l-4 [&>blockquote]:border-cyan-500 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-slate-400"
                    dangerouslySetInnerHTML={{ __html: news.content }}
                />
            </article>

            {/* Related News Section */}
            {relatedNews && relatedNews.length > 0 && (
                <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-32 pt-16 border-t border-white/10">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-2xl font-bold tracking-tight text-white">Berita Lainnya</h2>
                        <Link href="/berita" className="text-sm font-semibold leading-6 text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-2 group">
                            Lihat semua <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">&rarr;</span>
                        </Link>
                    </div>

                    <div className="grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 lg:max-w-none lg:grid-cols-3">
                        {relatedNews.map((post) => (
                            <article key={post.id} className="flex flex-col items-start justify-between group h-full">
                                <div className="relative w-full">
                                    <img
                                        src={post.thumbnail_path || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80'}
                                        alt={post.title}
                                        className="aspect-[16/9] w-full rounded-2xl bg-slate-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2] transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-slate-900/10 pointer-events-none" />
                                </div>
                                <div className="max-w-xl w-full mt-6">
                                    <div className="flex items-center gap-x-4 text-xs">
                                        <time dateTime={post.published_at || post.created_at} className="text-slate-400">
                                            {new Date(post.published_at || post.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </time>
                                    </div>
                                    <div className="group relative">
                                        <h3 className="mt-3 text-lg font-semibold leading-6 text-white group-hover:text-cyan-400 transition-colors">
                                            <Link href={`/berita/${post.slug}`}>
                                                <span className="absolute inset-0" />
                                                {post.title}
                                            </Link>
                                        </h3>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            )}
        </PublicLayout>
    );
}
