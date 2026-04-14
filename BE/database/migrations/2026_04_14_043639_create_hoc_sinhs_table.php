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
        Schema::create('hocsinh', function (Blueprint $table) {
            $table->id();
            $table->string('ho_ten');
            $table->date('ngay_sinh');
            $table->string('gioi_tinh');
            $table->text('dia_chi');
            $table->timestamps();
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hoc_sinhs');
    }
};
