<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FooterLinkSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $links = [
            // Organisasi
            ['group' => 'organisasi', 'label' => 'Tentang Kami', 'url' => '/#about', 'order' => 1, 'is_active' => true],
            ['group' => 'organisasi', 'label' => 'Kepengurusan', 'url' => '/#Kepengurusan', 'order' => 2, 'is_active' => true],
            ['group' => 'organisasi', 'label' => 'Divisi Utama', 'url' => '/#Divisi', 'order' => 3, 'is_active' => true],
            ['group' => 'organisasi', 'label' => 'Berita & Kegiatan', 'url' => '/berita', 'order' => 4, 'is_active' => true],

            // Mahasiswa
            ['group' => 'mahasiswa', 'label' => 'Panduan Akademik', 'url' => '#', 'order' => 1, 'is_active' => true],
            ['group' => 'mahasiswa', 'label' => 'Jadwal Kuliah', 'url' => '#', 'order' => 2, 'is_active' => true],
            ['group' => 'mahasiswa', 'label' => 'Lomba & Prestasi', 'url' => '#', 'order' => 3, 'is_active' => true],
            ['group' => 'mahasiswa', 'label' => 'Alumni', 'url' => '#', 'order' => 4, 'is_active' => true],

            // Resources
            ['group' => 'resources', 'label' => 'Help Center', 'url' => '#', 'order' => 1, 'is_active' => true],
            ['group' => 'resources', 'label' => 'Docs & Tutorials', 'url' => '#', 'order' => 2, 'is_active' => true],
            ['group' => 'resources', 'label' => 'Community', 'url' => '#', 'order' => 3, 'is_active' => true],
            ['group' => 'resources', 'label' => 'Assets', 'url' => '#', 'order' => 4, 'is_active' => true],

            // Legal
            ['group' => 'legal', 'label' => 'Privacy Policy', 'url' => '#', 'order' => 1, 'is_active' => true],
            ['group' => 'legal', 'label' => 'Terms of Service', 'url' => '#', 'order' => 2, 'is_active' => true],
            ['group' => 'legal', 'label' => 'Cookie Policy', 'url' => '#', 'order' => 3, 'is_active' => true],
        ];

        foreach ($links as $link) {
            \App\Models\FooterLink::create($link);
        }
    }
}
