<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\News;
use App\Models\NewsCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class NewsController extends Controller
{
    public function index()
    {
        $categories = NewsCategory::orderBy('name')->get();
        $articles = News::with('category')->orderBy('id', 'desc')->get();

        return Inertia::render('Admin/News/Index', [
            'categories' => $categories,
            'articles' => $articles
        ]);
    }

    // --- CATEGORIES ---
    public function storeCategory(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
        ]);
        $data['slug'] = Str::slug($data['name']);

        NewsCategory::create($data);
        return redirect()->back()->with('message', 'Kategori berita berhasil ditambahkan!');
    }

    public function updateCategory(Request $request, NewsCategory $category)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
        ]);
        $data['slug'] = Str::slug($data['name']);

        $category->update($data);
        return redirect()->back()->with('message', 'Kategori berita berhasil diubah!');
    }

    public function destroyCategory(NewsCategory $category)
    {
        // Articles will be cascade deleted based on migration
        $category->delete();
        return redirect()->back()->with('message', 'Kategori berita beserta artikelnya berhasil dihapus!');
    }

    // --- ARTICLES ---
    public function storeArticle(Request $request)
    {
        if ($request->input('thumbnail') === 'null' || $request->input('thumbnail') === null) {
            $request->request->remove('thumbnail');
        }

        $data = $request->validate([
            'news_category_id' => 'required|exists:news_categories,id',
            'title'            => 'required|string|max:255',
            'content'          => 'required|string',
            'status'           => 'required|in:draft,published',
            'thumbnail'        => 'nullable|image|mimes:jpeg,png,jpg,webp|max:10240',
        ]);

        $data['slug'] = Str::slug($data['title']) . '-' . time();
        if ($data['status'] === 'published') {
            $data['published_at'] = now();
        }

        if ($request->hasFile('thumbnail')) {
            $data['thumbnail_path'] = $this->processAndStoreImage($request->file('thumbnail'));
        }
        unset($data['thumbnail']);

        News::create($data);
        return redirect()->back()->with('message', 'Artikel berhasil ditambahkan!');
    }

    public function updateArticle(Request $request, News $news)
    {
        if ($request->input('thumbnail') === 'null' || $request->input('thumbnail') === null) {
            $request->request->remove('thumbnail');
        }

        $data = $request->validate([
            'news_category_id' => 'required|exists:news_categories,id',
            'title'            => 'required|string|max:255',
            'content'          => 'required|string',
            'status'           => 'required|in:draft,published',
            'thumbnail'        => 'nullable|image|mimes:jpeg,png,jpg,webp|max:10240',
        ]);

        $data['slug'] = Str::slug($data['title']) . '-' . $news->id;
        
        if ($data['status'] === 'published' && !$news->published_at) {
            $data['published_at'] = now();
        }

        if ($request->hasFile('thumbnail')) {
            // Delete old image
            if ($news->thumbnail_path && str_starts_with($news->thumbnail_path, '/storage/')) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $news->thumbnail_path));
            }
            $data['thumbnail_path'] = $this->processAndStoreImage($request->file('thumbnail'));
        }
        unset($data['thumbnail']);

        $news->update($data);
        return redirect()->back()->with('message', 'Artikel berhasil diubah!');
    }

    /**
     * Process and store an uploaded image.
     * Resizes large images (max 1920px wide) and saves as optimized JPEG.
     * Returns the public URL path like /storage/news/filename.jpg
     */
    private function processAndStoreImage(\Illuminate\Http\UploadedFile $file): string
    {
        $filename = 'news_' . time() . '_' . Str::random(8) . '.jpg';
        $destPath = storage_path('app/public/news/' . $filename);

        // Ensure the directory exists
        if (!file_exists(storage_path('app/public/news'))) {
            mkdir(storage_path('app/public/news'), 0755, true);
        }

        // Use GD to load, resize, and save the image
        $mimeType = $file->getMimeType();
        $sourcePath = $file->getRealPath();

        // Load source image based on mime type
        if ($mimeType === 'image/png') {
            $src = @imagecreatefrompng($sourcePath);
        } elseif ($mimeType === 'image/webp') {
            $src = @imagecreatefromwebp($sourcePath);
        } else {
            $src = @imagecreatefromjpeg($sourcePath);
        }

        if (!$src) {
            // Fallback: just move the file as-is
            $path = $file->storeAs('news', $filename, 'public');
            return '/storage/' . $path;
        }

        $origW = imagesx($src);
        $origH = imagesy($src);

        // Resize if wider than 1920px, maintaining aspect ratio
        $maxWidth = 1920;
        if ($origW > $maxWidth) {
            $newW = $maxWidth;
            $newH = (int) round($origH * $maxWidth / $origW);
        } else {
            $newW = $origW;
            $newH = $origH;
        }

        $dst = imagecreatetruecolor($newW, $newH);

        // Handle transparency for PNG
        if ($mimeType === 'image/png') {
            imagealphablending($dst, false);
            imagesavealpha($dst, true);
            $white = imagecolorallocate($dst, 255, 255, 255);
            imagefill($dst, 0, 0, $white);
        }

        imagecopyresampled($dst, $src, 0, 0, 0, 0, $newW, $newH, $origW, $origH);
        imagejpeg($dst, $destPath, 85);

        imagedestroy($src);
        imagedestroy($dst);

        return '/storage/news/' . $filename;
    }

    public function destroyArticle(News $news)
    {
        if ($news->thumbnail_path && str_starts_with($news->thumbnail_path, '/storage/')) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $news->thumbnail_path));
        }
        $news->delete();
        return redirect()->back()->with('message', 'Artikel berhasil dihapus!');
    }
}
