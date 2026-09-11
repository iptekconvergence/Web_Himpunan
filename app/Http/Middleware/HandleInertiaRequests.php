<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $settings = \App\Models\Setting::pluck('value', 'key')->toArray();
        if (!empty($settings['logo'])) {
            $settings['logo_url'] = $settings['logo'];
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'message' => fn () => $request->session()->get('message'),
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'global_divisions' => \App\Models\Division::where('is_active', true)->orderBy('sort_order')->get(['name', 'slug']),
            'global_settings' => $settings,
            'global_footer_links' => \App\Models\FooterLinkGroup::with(['links' => function ($q) {
                $q->where('is_active', true)->orderBy('order')->orderBy('id');
            }])->orderBy('order')->orderBy('id')->get(),
        ];
    }
}
