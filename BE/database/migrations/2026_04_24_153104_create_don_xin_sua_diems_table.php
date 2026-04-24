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
    Schema::create('don_xin_sua_diems', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('giao_vien_id');
        $table->unsignedBigInteger('diem_so_id'); // Trỏ vào ID của dòng điểm bị sai
        $table->string('cot_diem_sai'); // Ví dụ: 'diem_15_phut', 'diem_thi'
        $table->float('diem_cu');
        $table->float('diem_moi');
        $table->text('ly_do');
        $table->string('trang_thai')->default('Chờ duyệt'); // Chờ duyệt, Đã duyệt, Từ chối
        $table->timestamps();

        // Khóa ngoại
        $table->foreign('giao_vien_id')->references('id')->on('giao_viens')->onDelete('cascade');
        $table->foreign('diem_so_id')->references('id')->on('diem_sos')->onDelete('cascade');
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('don_xin_sua_diems');
    }
};
