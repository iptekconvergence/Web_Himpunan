<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Step 1: Create footer_link_groups table
        Schema::create('footer_link_groups', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->string('label');
            $table->string('description')->nullable();
            $table->integer('order')->default(0);
            $table->timestamps();
        });

        // Step 2: Seed the 4 existing groups
        $now = now();
        $groups = [
            ['key' => 'organisasi', 'label' => 'Organisasi', 'description' => 'Menu profil organisasi & kepengurusan', 'order' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['key' => 'mahasiswa', 'label' => 'Mahasiswa', 'description' => 'Panduan, jadwal, lomba & alumni', 'order' => 2, 'created_at' => $now, 'updated_at' => $now],
            ['key' => 'resources', 'label' => 'Resources', 'description' => 'Pusat bantuan, dokumentasi & aset', 'order' => 3, 'created_at' => $now, 'updated_at' => $now],
            ['key' => 'legal', 'label' => 'Legal', 'description' => 'Kebijakan privasi, syarat ketentuan & cookie', 'order' => 4, 'created_at' => $now, 'updated_at' => $now],
        ];
        DB::table('footer_link_groups')->insert($groups);

        // Step 3: Add footer_link_group_id column to footer_links
        Schema::table('footer_links', function (Blueprint $table) {
            $table->unsignedBigInteger('footer_link_group_id')->nullable()->after('id');
        });

        // Step 4: Migrate existing data — map group string to footer_link_group_id
        $groupMap = DB::table('footer_link_groups')->pluck('id', 'key');
        foreach ($groupMap as $key => $id) {
            DB::table('footer_links')
                ->where('group', $key)
                ->update(['footer_link_group_id' => $id]);
        }

        // Step 5: Drop old group string column and add foreign key
        Schema::table('footer_links', function (Blueprint $table) {
            $table->dropIndex(['group']); // drop the index on 'group' column
            $table->dropColumn('group');
            $table->foreign('footer_link_group_id')
                ->references('id')
                ->on('footer_link_groups')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Reverse: re-add group string column to footer_links
        Schema::table('footer_links', function (Blueprint $table) {
            $table->dropForeign(['footer_link_group_id']);
            $table->string('group')->default('')->after('id');
        });

        // Migrate data back
        $groupMap = DB::table('footer_link_groups')->pluck('key', 'id');
        foreach ($groupMap as $id => $key) {
            DB::table('footer_links')
                ->where('footer_link_group_id', $id)
                ->update(['group' => $key]);
        }

        // Add index back and remove foreign key column
        Schema::table('footer_links', function (Blueprint $table) {
            $table->index('group');
            $table->dropColumn('footer_link_group_id');
        });

        Schema::dropIfExists('footer_link_groups');
    }
};
