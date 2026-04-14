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
            $table->integer('hoc_sinh_id'); 
        $table->integer('hoc_ki'); // 1 hoặc 2
        
        // Loại hạnh kiểm: Tốt, Khá, Trung bình, Yếu
        $table->string('loai'); 
        $table->string('nhan_xet')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hanh_kiems');
    }
};
