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
        Schema::create('giao_vien_lop_hoc', function (Blueprint $table) {
            $table->id();
            // Cột nối với ID của Giáo Viên
        $table->unsignedBigInteger('giao_vien_id');
        // Cột nối với ID của Lớp Học
        $table->unsignedBigInteger('lop_hoc_id');
            $table->timestamps();
            $table->foreign('giao_vien_id')->references('id')->on('giao_viens')->onDelete('cascade');
        $table->foreign('lop_hoc_id')->references('id')->on('lop_hocs')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('giao_vien_lop_hoc');
    }
};
