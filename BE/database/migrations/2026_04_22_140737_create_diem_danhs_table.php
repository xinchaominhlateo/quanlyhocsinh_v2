<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Chạy migration để tạo bảng diem_danhs
     */
    public function up(): void
    {
        Schema::create('diem_danhs', function (Blueprint $table) {
            $table->id();
            // Khóa ngoại liên kết tới bảng học sinh
            $table->foreignId('hoc_sinh_id')->constrained('hoc_sinhs')->onDelete('cascade');
            // Khóa ngoại liên kết tới bảng lớp học
            $table->foreignId('lop_hoc_id')->constrained('lop_hocs')->onDelete('cascade');
            // Ngày điểm danh
            $table->date('ngay');
            // Trạng thái: Có mặt, Vắng, Muộn...
            $table->string('trang_thai')->default('Có mặt');
            $table->timestamps();
        });
    }

    /**
     * Xóa bảng khi rollback
     */
    public function down(): void
    {
        Schema::dropIfExists('diem_danhs');
    }
};