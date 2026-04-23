<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('hoc_phis', function (Blueprint $table) {
            // Kiểm tra xem nếu chưa có cột thì mới thêm vào để không bị lỗi
            if (!Schema::hasColumn('hoc_phis', 'so_tien')) {
                $table->decimal('so_tien', 12, 2)->default(0);
            }
            if (!Schema::hasColumn('hoc_phis', 'ngay_dong')) {
                $table->dateTime('ngay_dong')->nullable();
            }
            if (!Schema::hasColumn('hoc_phis', 'trang_thai')) {
                $table->string('trang_thai')->default('Chưa thanh toán');
            }
            if (!Schema::hasColumn('hoc_phis', 'noi_dung')) {
                $table->text('noi_dung')->nullable();
            }
        });
    }

    public function down()
    {
        Schema::table('hoc_phis', function (Blueprint $table) {
            $table->dropColumn(['so_tien', 'ngay_dong', 'trang_thai', 'noi_dung']);
        });
    }
};