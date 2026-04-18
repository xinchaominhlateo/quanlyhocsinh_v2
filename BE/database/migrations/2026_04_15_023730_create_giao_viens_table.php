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
        Schema::create('giao_viens', function (Blueprint $table) {
           $table->id();
           $table->string('ma_giao_vien', 20)->unique(); // THÊM MÃ GIÁO VIÊN
        $table->string('ho_ten');
        $table->string('email')->unique();
        $table->string('sdt');
        $table->unsignedBigInteger('mon_hoc_id'); // Khóa ngoại liên kết bảng môn học
            $table->timestamps();
            $table->foreign('mon_hoc_id')->references('id')->on('mon_hocs')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('giao_viens');
    }
};
