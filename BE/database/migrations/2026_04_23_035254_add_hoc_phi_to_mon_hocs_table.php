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
        Schema::table('mon_hocs', function (Blueprint $table) {
            // Kiểm tra: Nếu CHƯA CÓ cột hoc_phi thì mới tạo
            if (!Schema::hasColumn('mon_hocs', 'hoc_phi')) {
                $table->decimal('hoc_phi', 12, 2)->default(0);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('mon_hocs', function (Blueprint $table) {
            if (Schema::hasColumn('mon_hocs', 'hoc_phi')) {
                $table->dropColumn('hoc_phi');
            }
        });
    }
};