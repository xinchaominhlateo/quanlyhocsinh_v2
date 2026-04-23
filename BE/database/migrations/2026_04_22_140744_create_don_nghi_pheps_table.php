<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up()
    {
        Schema::create('don_nghi_pheps', function (Blueprint $table) {
            $table->id();
            // Nối với bảng hoc_sinhs
            $table->foreignId('hoc_sinh_id')->constrained('hoc_sinhs')->onDelete('cascade');
            
            $table->date('ngay_bat_dau');
            $table->date('ngay_ket_thuc');
            $table->text('ly_do');
            // Trạng thái: Chờ duyệt, Đã duyệt, Từ chối
            $table->string('trang_thai')->default('Chờ duyệt'); 
            
            $table->timestamps();
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('don_nghi_pheps');
    }
};
