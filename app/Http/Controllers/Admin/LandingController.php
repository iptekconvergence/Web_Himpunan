<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Models\Mission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LandingController extends Controller
{
    public function index()
    {
        $settings = Setting::pluck('value', 'key')->toArray();
        $missions = Mission::orderBy('sort_order')->get();

        return Inertia::render('Admin/Landing/Index', [
            'settings' => $settings,
            'missions' => $missions
        ]);
    }

    public function updateHero(Request $request)
    {
        $data = $request->validate([
            'hero_title' => 'nullable|string|max:255',
            'hero_subtitle' => 'nullable|string|max:255',
            'hero_desc' => 'nullable|string',
            'hero_decrypted_1' => 'nullable|string|max:255',
            'hero_decrypted_2' => 'nullable|string|max:255',
            'hero_circular_text' => 'nullable|string|max:255',
            'hero_btn1_text' => 'nullable|string|max:50',
            'hero_btn1_link' => 'nullable|string|max:255',
            'hero_btn2_text' => 'nullable|string|max:50',
            'hero_btn2_link' => 'nullable|string|max:255',
            'hero_logo' => 'nullable|image|mimes:jpeg,png,jpg,svg|max:2048',
        ]);

        if ($request->hasFile('hero_logo')) {
            $path = $request->file('hero_logo')->store('landing', 'public');
            $data['hero_logo'] = '/storage/' . $path;
        } else {
            unset($data['hero_logo']);
        }

        foreach ($data as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value ?? '']);
        }

        return redirect()->back()->with('message', 'Hero section berhasil diperbarui!');
    }

    public function updateAbout(Request $request)
    {
        $data = $request->validate([
            'about_title' => 'nullable|string|max:255',
            'about_desc' => 'nullable|string',
            'about_vision' => 'nullable|string',
            'about_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        if ($request->hasFile('about_image')) {
            $path = $request->file('about_image')->store('landing', 'public');
            $data['about_image'] = '/storage/' . $path;
        } else {
            unset($data['about_image']);
        }

        foreach ($data as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value ?? '']);
        }

        return redirect()->back()->with('message', 'Tentang dan Visi berhasil diperbarui!');
    }

    public function storeMission(Request $request)
    {
        $data = $request->validate([
            'content' => 'required|string',
            'sort_order' => 'nullable|integer'
        ]);

        Mission::create($data);
        return redirect()->back()->with('message', 'Misi berhasil ditambahkan!');
    }

    public function updateMission(Request $request, Mission $mission)
    {
        $data = $request->validate([
            'content' => 'required|string',
            'sort_order' => 'nullable|integer'
        ]);

        $mission->update($data);
        return redirect()->back()->with('message', 'Misi berhasil diubah!');
    }

    public function destroyMission(Mission $mission)
    {
        $mission->delete();
        return redirect()->back()->with('message', 'Misi berhasil dihapus!');
    }
}
