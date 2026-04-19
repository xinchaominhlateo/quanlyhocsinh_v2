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
    Schema::table('giao_viens', function (Blueprint $table) {
        // Thêm cột gioi_tinh ngay sau cột 'ten' (Nếu cột họ tên m đặt tên khác thì nhớ sửa chữ 'ten' lại nhé)
        $table->string('gioi_tinh', 10)->nullable()->after('ho_ten'); 
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('giao_viens', function (Blueprint $table) {
            //
        });
    }
};
