<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Period;
use App\Models\Division;
use App\Models\Member;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class OrganizationController extends Controller
{
    public function index()
    {
        $periods = Period::orderBy('id', 'desc')->get();
        $divisions = Division::with('period')->orderBy('sort_order')->get();
        $members = Member::with(['period', 'division'])->orderBy('sort_order')->get();

        return Inertia::render('Admin/Organization/Index', [
            'periods' => $periods,
            'divisions' => $divisions,
            'members' => $members
        ]);
    }

    // --- PERIODS ---
    public function storePeriod(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'is_active' => 'boolean',
            'notes' => 'nullable|string'
        ]);

        if ($data['is_active']) {
            Period::where('is_active', true)->update(['is_active' => false]);
        }

        Period::create($data);
        return redirect()->back()->with('message', 'Periode berhasil ditambahkan!');
    }

    public function updatePeriod(Request $request, Period $period)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'is_active' => 'boolean',
            'notes' => 'nullable|string'
        ]);

        if ($data['is_active'] && !$period->is_active) {
            Period::where('is_active', true)->update(['is_active' => false]);
        }

        $period->update($data);
        return redirect()->back()->with('message', 'Periode berhasil diubah!');
    }

    public function destroyPeriod(Period $period)
    {
        $period->delete();
        return redirect()->back()->with('message', 'Periode berhasil dihapus!');
    }

    // --- DIVISIONS ---
    public function storeDivision(Request $request)
    {
        if ($request->input('icon') === 'null' || $request->input('icon') === null) {
            $request->request->remove('icon');
        }

        $data = $request->validate([
            'period_id' => 'required|exists:periods,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'sort_order' => 'nullable|integer',
            'is_active' => 'boolean',
            'icon' => 'nullable'
        ]);

        $data['slug'] = Str::slug($data['name']);
        
        // Handle file upload icon if it's an image file (fallback to string if it's an SVG string or class)
        if ($request->hasFile('icon')) {
            $path = $request->file('icon')->store('divisions', 'public');
            $data['icon'] = '/storage/' . $path;
        } elseif (is_string($request->input('icon'))) {
            $data['icon'] = $request->input('icon');
        } else {
            unset($data['icon']);
        }

        Division::create($data);
        return redirect()->back()->with('message', 'Divisi berhasil ditambahkan!');
    }

    public function updateDivision(Request $request, Division $division)
    {
        if ($request->input('icon') === 'null' || $request->input('icon') === null) {
            $request->request->remove('icon');
        }

        $data = $request->validate([
            'period_id' => 'required|exists:periods,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'sort_order' => 'nullable|integer',
            'is_active' => 'boolean',
            'icon' => 'nullable'
        ]);

        $data['slug'] = Str::slug($data['name']);

        if ($request->hasFile('icon')) {
            if ($division->icon && str_starts_with($division->icon, '/storage/')) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $division->icon));
            }
            $path = $request->file('icon')->store('divisions', 'public');
            $data['icon'] = '/storage/' . $path;
        } elseif (is_string($request->input('icon'))) {
            $data['icon'] = $request->input('icon');
        } else {
            unset($data['icon']);
        }

        $division->update($data);
        return redirect()->back()->with('message', 'Divisi berhasil diubah!');
    }

    public function destroyDivision(Division $division)
    {
        if ($division->icon && str_starts_with($division->icon, '/storage/')) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $division->icon));
        }
        $division->delete();
        return redirect()->back()->with('message', 'Divisi berhasil dihapus!');
    }

    // --- MEMBERS ---
    public function storeMember(Request $request)
    {
        if ($request->input('photo') === 'null' || $request->input('photo') === null) {
            $request->request->remove('photo');
        }

        $data = $request->validate([
            'period_id' => 'required|exists:periods,id',
            'division_id' => 'required|exists:divisions,id',
            'name' => 'required|string|max:255',
            'nim' => 'nullable|string|max:255',
            'role_name' => 'required|string|max:255',
            'bio' => 'nullable|string',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'instagram_url' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer',
            'is_active' => 'boolean',
            'photo_position_x' => 'nullable|integer|min:0|max:100',
            'photo_position_y' => 'nullable|integer|min:0|max:100',
            'photo_zoom' => 'nullable|integer|min:100|max:200',
        ]);

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('members', 'public');
            $data['photo_path'] = '/storage/' . $path;
        }
        unset($data['photo']);

        $data['photo_position_x'] = $data['photo_position_x'] ?? 50;
        $data['photo_position_y'] = $data['photo_position_y'] ?? 50;
        $data['photo_zoom'] = $data['photo_zoom'] ?? 100;

        Member::create($data);
        return redirect()->back()->with('message', 'Anggota berhasil ditambahkan!');
    }

    public function updateMember(Request $request, Member $member)
    {
        if ($request->input('photo') === 'null' || $request->input('photo') === null) {
            $request->request->remove('photo');
        }

        $data = $request->validate([
            'period_id' => 'required|exists:periods,id',
            'division_id' => 'required|exists:divisions,id',
            'name' => 'required|string|max:255',
            'nim' => 'nullable|string|max:255',
            'role_name' => 'required|string|max:255',
            'bio' => 'nullable|string',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'instagram_url' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer',
            'is_active' => 'boolean',
            'photo_position_x' => 'nullable|integer|min:0|max:100',
            'photo_position_y' => 'nullable|integer|min:0|max:100',
            'photo_zoom' => 'nullable|integer|min:100|max:200',
        ]);

        if ($request->hasFile('photo')) {
            if ($member->photo_path && str_starts_with($member->photo_path, '/storage/')) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $member->photo_path));
            }
            $path = $request->file('photo')->store('members', 'public');
            $data['photo_path'] = '/storage/' . $path;
        }
        unset($data['photo']);

        $data['photo_position_x'] = $data['photo_position_x'] ?? $member->photo_position_x;
        $data['photo_position_y'] = $data['photo_position_y'] ?? $member->photo_position_y;
        $data['photo_zoom'] = $data['photo_zoom'] ?? $member->photo_zoom ?? 100;

        $member->update($data);
        return redirect()->back()->with('message', 'Anggota berhasil diubah!');
    }

    public function destroyMember(Member $member)
    {
        if ($member->photo_path && str_starts_with($member->photo_path, '/storage/')) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $member->photo_path));
        }
        $member->delete();
        return redirect()->back()->with('message', 'Anggota berhasil dihapus!');
    }
}
