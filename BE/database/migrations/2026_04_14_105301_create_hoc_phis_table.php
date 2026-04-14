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
        Schema::create('hoc_phis', function (Blueprint $table) {
            $table->id();
            $table->integer('hoc_sinh_id'); // ID học sinh
        $table->string('hoc_ki');       // Ví dụ: "Học kỳ 1 - 2025"
        $table->decimal('so_tien', 15, 2); // Số tiền (dùng decimal cho chính xác)
        $table->string('trang_thai')->default('Chưa đóng'); // Đã đóng / Chưa đóng
        $table->date('ngay_dong')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hoc_phis');
    }
};
