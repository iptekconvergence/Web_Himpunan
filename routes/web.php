<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PeriodController;
use App\Http\Controllers\NewsController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $activePeriod = \App\Models\Period::where('is_active', true)->first() ?? \App\Models\Period::orderBy('id', 'desc')->first();
    
    $divisions = \App\Models\Division::where('is_active', true)
        ->when($activePeriod, function($query) use ($activePeriod) {
            $query->where(function($q) use ($activePeriod) {
                $q->where('period_id', $activePeriod->id)->orWhereNull('period_id');
            });
        })
        ->orderBy('sort_order')
        ->get();

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'settings' => \App\Models\Setting::pluck('value', 'key')->toArray(),
        'missions' => \App\Models\Mission::orderBy('sort_order')->get(),
        'divisions' => $divisions,
        'activePeriod' => $activePeriod,
        'news' => \App\Models\News::with('category')->where('status', 'published')->orderBy('published_at', 'desc')->take(3)->get(),
    ]);
})->name('home');

// Navigation Alur Baru: Periode -> Divisi -> Profil Anggota
Route::get('/periode', [PeriodController::class, 'index'])->name('periode.index');
Route::get('/periode/{period}', [PeriodController::class, 'divisions'])->name('periode.divisions');
Route::get('/periode/{period}/divisi/{division}', [PeriodController::class, 'members'])->name('periode.members');

Route::get('/struktur-organisasi/{slug}', function ($slug) {
    $division = \App\Models\Division::where('slug', $slug)->where('is_active', true)->firstOrFail();
    
    $activePeriod = \App\Models\Period::where('is_active', true)->first();
    $members = [];
    if ($activePeriod) {
        $members = \App\Models\Member::where('division_id', $division->id)
            ->where('period_id', $activePeriod->id)
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();
    }
    
    return Inertia::render('StrukturOrganisasi', [
        'divisi' => $division->slug,
        'divisiName' => $division->name,
        'division' => $division,
        'members' => $members,
        'activePeriod' => $activePeriod,
    ]);
})->name('struktur-organisasi');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard', [
        'stats' => [
            'total_anggota' => \App\Models\Member::count(),
            'total_divisi' => \App\Models\Division::count(),
            'total_periode' => \App\Models\Period::count(),
            'total_berita' => \App\Models\News::count(),
            'total_admin' => \App\Models\User::count(),
        ]
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/settings', [\App\Http\Controllers\Admin\SettingsController::class, 'index'])->name('settings.index');
    Route::post('/settings', [\App\Http\Controllers\Admin\SettingsController::class, 'update'])->name('settings.update');
    Route::get('/landing', [\App\Http\Controllers\Admin\LandingController::class, 'index'])->name('landing.index');
    Route::post('/landing/hero', [\App\Http\Controllers\Admin\LandingController::class, 'updateHero'])->name('landing.hero');
    Route::post('/landing/about', [\App\Http\Controllers\Admin\LandingController::class, 'updateAbout'])->name('landing.about');
    Route::post('/landing/mission', [\App\Http\Controllers\Admin\LandingController::class, 'storeMission'])->name('landing.mission.store');
    Route::put('/landing/mission/{mission}', [\App\Http\Controllers\Admin\LandingController::class, 'updateMission'])->name('landing.mission.update');
    Route::delete('/landing/mission/{mission}', [\App\Http\Controllers\Admin\LandingController::class, 'destroyMission'])->name('landing.mission.destroy');
    Route::get('/organization', [\App\Http\Controllers\Admin\OrganizationController::class, 'index'])->name('organization.index');
    
    // Periode
    Route::post('/organization/periods', [\App\Http\Controllers\Admin\OrganizationController::class, 'storePeriod'])->name('organization.periods.store');
    Route::put('/organization/periods/{period}', [\App\Http\Controllers\Admin\OrganizationController::class, 'updatePeriod'])->name('organization.periods.update');
    Route::delete('/organization/periods/{period}', [\App\Http\Controllers\Admin\OrganizationController::class, 'destroyPeriod'])->name('organization.periods.destroy');
    
    // Divisi
    Route::post('/organization/divisions', [\App\Http\Controllers\Admin\OrganizationController::class, 'storeDivision'])->name('organization.divisions.store');
    Route::post('/organization/divisions/{division}', [\App\Http\Controllers\Admin\OrganizationController::class, 'updateDivision'])->name('organization.divisions.update');
    Route::delete('/organization/divisions/{division}', [\App\Http\Controllers\Admin\OrganizationController::class, 'destroyDivision'])->name('organization.divisions.destroy');

    // Members
    Route::post('/organization/members', [\App\Http\Controllers\Admin\OrganizationController::class, 'storeMember'])->name('organization.members.store');
    Route::post('/organization/members/{member}', [\App\Http\Controllers\Admin\OrganizationController::class, 'updateMember'])->name('organization.members.update');
    Route::delete('/organization/members/{member}', [\App\Http\Controllers\Admin\OrganizationController::class, 'destroyMember'])->name('organization.members.destroy');
    Route::get('/news', [\App\Http\Controllers\Admin\NewsController::class, 'index'])->name('news.index');
    
    // Categories
    Route::post('/news/categories', [\App\Http\Controllers\Admin\NewsController::class, 'storeCategory'])->name('news.categories.store');
    Route::put('/news/categories/{category}', [\App\Http\Controllers\Admin\NewsController::class, 'updateCategory'])->name('news.categories.update');
    Route::delete('/news/categories/{category}', [\App\Http\Controllers\Admin\NewsController::class, 'destroyCategory'])->name('news.categories.destroy');

    // News
    Route::post('/news/articles', [\App\Http\Controllers\Admin\NewsController::class, 'storeArticle'])->name('news.articles.store');
    Route::put('/news/articles/{news}', [\App\Http\Controllers\Admin\NewsController::class, 'updateArticle'])->name('news.articles.update');
    Route::delete('/news/articles/{news}', [\App\Http\Controllers\Admin\NewsController::class, 'destroyArticle'])->name('news.articles.destroy');
    Route::get('/users', [\App\Http\Controllers\Admin\UserController::class, 'index'])->name('users.index');
    Route::post('/users', [\App\Http\Controllers\Admin\UserController::class, 'store'])->name('users.store');
    Route::put('/users/{user}', [\App\Http\Controllers\Admin\UserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [\App\Http\Controllers\Admin\UserController::class, 'destroy'])->name('users.destroy');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/berita', [NewsController::class, 'index'])->name('berita.index');
Route::get('/berita/{slug}', [NewsController::class, 'show'])->name('berita.show');

require __DIR__.'/auth.php';
