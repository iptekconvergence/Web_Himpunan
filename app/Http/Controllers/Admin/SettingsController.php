<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index()
    {
        // Get all settings as key-value pairs
        $settings = Setting::pluck('value', 'key')->toArray();

        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,svg|max:2048',
            'site_name' => 'nullable|string|max:255',
            'campus_name' => 'nullable|string|max:255',
            'footer_text' => 'nullable|string',
            'copyright_text' => 'nullable|string|max:255',
            
            'email' => 'nullable|email|max:255',
            'whatsapp' => 'nullable|string|max:50',
            'instagram' => 'nullable|string|max:255',
            'youtube' => 'nullable|string|max:255',
            'tiktok' => 'nullable|string|max:255',
        ]);

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('settings', 'public');
            $data['logo'] = '/storage/' . $path;
        } else {
            // Unset logo so it doesn't overwrite if not uploaded
            unset($data['logo']);
        }

        foreach ($data as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value ?? '']);
        }

        return redirect()->back()->with('message', 'Pengaturan berhasil diperbarui!');
    }
}
