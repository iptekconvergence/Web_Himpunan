<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FooterLinkGroup;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class FooterLinkGroupController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'label' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
            'order' => 'nullable|integer',
        ]);

        // Auto-generate key from label
        $key = Str::slug($validated['label']);
        // Ensure uniqueness
        $baseKey = $key;
        $counter = 1;
        while (FooterLinkGroup::where('key', $key)->exists()) {
            $key = $baseKey . '-' . $counter;
            $counter++;
        }

        $validated['key'] = $key;
        $validated['order'] = $request->input('order', FooterLinkGroup::max('order') + 1);

        FooterLinkGroup::create($validated);

        return redirect()->back()->with('message', 'Grup footer berhasil ditambahkan!');
    }

    public function update(Request $request, FooterLinkGroup $footerLinkGroup)
    {
        $validated = $request->validate([
            'label' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
            'order' => 'nullable|integer',
        ]);

        $footerLinkGroup->update($validated);

        return redirect()->back()->with('message', 'Grup footer berhasil diperbarui!');
    }

    public function destroy(FooterLinkGroup $footerLinkGroup)
    {
        // Prevent deletion if group still has links
        if ($footerLinkGroup->links()->count() > 0) {
            return redirect()->back()->with('error', 
                "Grup \"{$footerLinkGroup->label}\" tidak bisa dihapus karena masih memiliki {$footerLinkGroup->links()->count()} link di dalamnya. Hapus atau pindahkan semua link terlebih dahulu."
            );
        }

        $footerLinkGroup->delete();

        return redirect()->back()->with('message', 'Grup footer berhasil dihapus!');
    }
}
