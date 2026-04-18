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
    Schema::create('hanh_kiems', function (Blueprint $table) {
        $table->id();
        $table->integer('hoc_ki'); // 1 hoặc 2
        $table->unsignedBigInteger('hoc_sinh_id');
        $table->string('loai'); // Tốt, Khá, Trung bình, Yếu
        $table->string('nhan_xet')->nullable();
        $table->timestamps();

        // 🛑 ĐÂY LÀ CHỖ QUAN TRỌNG NHẤT:
        // Ràng buộc: Một học sinh chỉ có DUY NHẤT một loại hạnh kiểm TRONG MỘT HỌC KỲ
        $table->unique(['hoc_sinh_id', 'hoc_ki']);

        // Nên thêm khóa ngoại để dữ liệu chắc chắn (nếu bảng học sinh bị xóa thì hạnh kiểm cũng bay màu)
        $table->foreign('hoc_sinh_id')->references('id')->on('hoc_sinhs')->onDelete('cascade');
    });
}    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hanh_kiems');
    }
};
