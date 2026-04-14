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
        Schema::table('hoc_sinhs', function (Blueprint $table) {
            // Tạo cột khóa ngoại, cho phép để trống (nullable) để tránh lỗi dữ liệu cũ
        $table->foreignId('lop_hoc_id')->nullable()->constrained('lop_hocs')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('hoc_sinhs', function (Blueprint $table) {
            $table->dropForeign(['lop_hoc_id']);
        $table->dropColumn('lop_hoc_id');
        });
    }
};
