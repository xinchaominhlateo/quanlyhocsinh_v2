<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Chạy migration để tạo bảng học sinh.
     */
    public function up(): void
    {
        Schema::create('hoc_sinhs', function (Blueprint $table) {
            $table->id();
            
            // Mã học sinh: Duy nhất, dùng để định danh xuyên suốt quá trình học
            $table->string('ma_hoc_sinh', 20)->unique(); 
            
            $table->string('ho_ten');
            $table->date('ngay_sinh');
            $table->string('gioi_tinh');
            
            // Số điện thoại: 
            // - Sử dụng kiểu string(15) để giữ được số 0 ở đầu và hỗ trợ nhiều định dạng.
            // - unique() để đảm bảo mỗi số điện thoại chỉ gắn với một tài khoản học sinh.
            $table->string('sdt', 15)->unique()->nullable();
            
            // Email/Gmail:
            // - unique() để tránh trùng lặp tài khoản.
            // - Ràng buộc kết thúc bằng "@gmail.com" sẽ được xử lý tại Controller/Frontend.
            $table->string('email')->unique()->nullable();
            
            $table->text('dia_chi');
            
            // Khóa ngoại liên kết với bảng lớp học
            $table->unsignedBigInteger('lop_hoc_id')->nullable();
            
            $table->timestamps();

            // Nếu bảng lop_hocs đã được khởi tạo trước đó, bạn có thể kích hoạt dòng dưới đây:
            // $table->foreign('lop_hoc_id')->references('id')->on('lop_hocs')->onDelete('set null');
        });
    }

    /**
     * Hoàn tác migration.
     */
    public function down(): void
    {
        Schema::dropIfExists('hoc_sinhs');
    }
};