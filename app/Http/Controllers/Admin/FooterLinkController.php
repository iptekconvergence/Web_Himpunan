<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\FooterLink;

class FooterLinkController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'footer_link_group_id' => 'required|exists:footer_link_groups,id',
            'label' => 'required|string|max:255',
            'url' => 'required|string|max:500',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $validated['is_active'] = $request->boolean('is_active', true);
        $validated['order'] = $request->input('order', 0);

        FooterLink::create($validated);

        return redirect()->back()->with('message', 'Link footer berhasil ditambahkan!');
    }

    public function update(Request $request, FooterLink $footerLink)
    {
        $validated = $request->validate([
            'footer_link_group_id' => 'required|exists:footer_link_groups,id',
            'label' => 'required|string|max:255',
            'url' => 'required|string|max:500',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $validated['is_active'] = $request->boolean('is_active', true);
        $validated['order'] = $request->input('order', 0);

        $footerLink->update($validated);

        return redirect()->back()->with('message', 'Link footer berhasil diperbarui!');
    }

    public function destroy(FooterLink $footerLink)
    {
        $footerLink->delete();

        return redirect()->back()->with('message', 'Link footer berhasil dihapus!');
    }
}
