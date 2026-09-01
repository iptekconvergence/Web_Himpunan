<?php

namespace App\Http\Controllers;

use App\Models\Period;
use App\Models\Division;
use App\Models\Member;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PeriodController extends Controller
{
    /**
     * Halaman 1: Tampilkan seluruh periode kepengurusan.
     */
    public function index()
    {
        $periods = Period::withCount('divisions')
            ->orderBy('is_active', 'desc')
            ->orderBy('id', 'desc')
            ->get();

        return Inertia::render('Periode/Index', [
            'periods' => $periods,
        ]);
    }

    /**
     * Halaman 2: Tampilkan seluruh divisi pada periode tertentu.
     */
    public function divisions(Period $period)
    {
        // Divisi yang terkait dengan periode terpilih, atau divisi umum tanpa period_id jika ada
        $divisions = Division::where(function($query) use ($period) {
                $query->where('period_id', $period->id)
                      ->orWhereNull('period_id');
            })
            ->where('is_active', true)
            ->withCount(['members' => function($query) use ($period) {
                $query->where('period_id', $period->id);
            }])
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('Periode/Divisions', [
            'period' => $period,
            'divisions' => $divisions,
        ]);
    }

    /**
     * Halaman 3: Tampilkan seluruh anggota pada divisi dan periode tertentu.
     */
    public function members(Period $period, Division $division)
    {
        $members = Member::where('period_id', $period->id)
            ->where('division_id', $division->id)
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('Periode/Members', [
            'period' => $period,
            'division' => $division,
            'members' => $members,
        ]);
    }
}
