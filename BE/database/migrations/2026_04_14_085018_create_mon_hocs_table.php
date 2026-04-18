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
        Schema::create('mon_hocs', function (Blueprint $table) {
            $table->id();
            $table->string('ma_mon')->unique(); // VD: TOAN10
        $table->string('ten_mon'); 
        $table->integer('so_tiet');         // VD: Toán Học
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mon_hocs');
    }
};
