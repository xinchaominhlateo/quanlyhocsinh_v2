<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('giao_vien_lop_hoc', function (Blueprint $table) {
            // Thêm cột vai_tro, mặc định là Giáo viên bộ môn
            $table->string('vai_tro')->default('Bộ môn')->after('giao_vien_id');
        });
    }

    public function down(): void
    {
        Schema::table('giao_vien_lop_hoc', function (Blueprint $table) {
            $table->dropColumn('vai_tro');
        });
    }
};