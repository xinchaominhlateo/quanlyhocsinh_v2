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
        Schema::create('diem_sos', function (Blueprint $table) {
            $table->id();
            
            // 2 sợi dây xích nối với Học Sinh và Môn Học
     // 1. Dây xích nối với Học Sinh (Ép về kiểu INT cho khớp với bảng cũ m tự tạo)
$table->integer('hoc_sinh_id');
            $table->integer('mon_hoc_id');
            
            $table->integer('hoc_ki'); // Học kì 1 hoặc 2
            
            // Các cột điểm
            $table->float('diem_tx')->nullable(); // Thường xuyên
            $table->float('diem_gk')->nullable(); // Giữa kì
            $table->float('diem_ck')->nullable(); // Cuối kì
            $table->float('diem_tb')->nullable(); // Trung bình (Tự tính)
            
            $table->string('nhan_xet')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('diem_sos');
    }
};