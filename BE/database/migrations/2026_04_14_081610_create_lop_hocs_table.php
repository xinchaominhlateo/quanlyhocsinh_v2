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
        Schema::create('lop_hocs', function (Blueprint $table) {
            $table->id();
            $table->string('ma_lop')->unique(); // Mã lớp không được trùng nhau
       $table->string('ten_lop')->unique();     // Ví dụ: 10A1, 11B2
        $table->integer('khoi');            // Khối 10, 11, 12
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lop_hocs');
    }
};
