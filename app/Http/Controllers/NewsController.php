<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\News;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NewsController extends Controller
{
    public function index()
    {
        $news = News::with('category')
            ->where('status', 'published')
            ->orderBy('published_at', 'desc')
            ->paginate(9);

        return Inertia::render('Berita/Index', [
            'news' => $news,
        ]);
    }

    public function show(string $slug)
    {
        $newsItem = News::with('category')
            ->where('slug', $slug)
            ->where('status', 'published')
            ->firstOrFail();

        $relatedNews = News::with('category')
            ->where('status', 'published')
            ->where('id', '!=', $newsItem->id)
            ->orderBy('published_at', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('Berita/Show', [
            'news' => $newsItem,
            'relatedNews' => $relatedNews,
            'latestNews' => $relatedNews,
        ]);
    }
}
