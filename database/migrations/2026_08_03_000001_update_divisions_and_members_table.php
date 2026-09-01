<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('divisions', function (Blueprint $table) {
            if (!Schema::hasColumn('divisions', 'period_id')) {
                $table->foreignId('period_id')->nullable()->after('id')->constrained('periods')->onDelete('cascade');
            }
        });

        Schema::table('members', function (Blueprint $table) {
            if (!Schema::hasColumn('members', 'nim')) {
                $table->string('nim')->nullable()->after('name');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('divisions', function (Blueprint $table) {
            if (Schema::hasColumn('divisions', 'period_id')) {
                $table->dropForeign(['period_id']);
                $table->dropColumn('period_id');
            }
        });

        Schema::table('members', function (Blueprint $table) {
            if (Schema::hasColumn('members', 'nim')) {
                $table->dropColumn('nim');
            }
        });
    }
};
