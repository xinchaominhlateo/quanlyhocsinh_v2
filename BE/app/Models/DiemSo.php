<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DiemSo extends Model
{
    use HasFactory;

    protected $table = 'diem_sos';

    protected $fillable = [
        'hoc_sinh_id',
        'mon_hoc_id',
        'diem_mieng',
        'diem_15_phut', // Sửa lại cho chuẩn
        'diem_1_tiet',  // Sửa lại cho chuẩn
        'diem_thi',     // Sửa lại cho chuẩn
        'diem_trung_binh',
        'xep_loai'
    ];

    public function mon_hoc()
    {
        return $this->belongsTo(MonHoc::class, 'mon_hoc_id');
    }

    public function hoc_sinh()
    {
        return $this->belongsTo(HocSinh::class, 'hoc_sinh_id');
    }
}