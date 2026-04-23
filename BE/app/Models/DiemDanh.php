<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DiemDanh extends Model
{
    protected $table = 'diem_danhs';

    protected $fillable = [
        'hoc_sinh_id', 'lop_hoc_id', 'ngay', 'trang_thai'
    ];

    public function hoc_sinh() {
        return $this->belongsTo(HocSinh::class, 'hoc_sinh_id');
    }

    public function lop_hoc() {
        return $this->belongsTo(LopHoc::class, 'lop_hoc_id');
    }
}