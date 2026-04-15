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
            $table->unsignedBigInteger('hoc_sinh_id');
            $table->unsignedBigInteger('mon_hoc_id');
            
            // 👇 THÊM ĐẦY ĐỦ CÁC CỘT ĐIỂM VÀO ĐÂY (Kiểu float để chứa số thập phân) 👇
            $table->float('diem_mieng')->nullable();
            $table->float('diem_15_phut')->nullable();
            $table->float('diem_1_tiet')->nullable();
            $table->float('diem_thi')->nullable();
            $table->float('diem_trung_binh')->nullable();
            $table->string('xep_loai')->nullable();
            
            $table->timestamps();

            // Khóa ngoại liên kết
            $table->foreign('hoc_sinh_id')->references('id')->on('hoc_sinhs')->onDelete('cascade');
            $table->foreign('mon_hoc_id')->references('id')->on('mon_hocs')->onDelete('cascade');
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