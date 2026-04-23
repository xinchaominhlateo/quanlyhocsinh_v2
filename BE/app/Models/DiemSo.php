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
        'diem_15p',
        'diem_1tiet',
        'diem_hocky',
        'diem_trungbinh'
    ];

    // 👇 CHÈN THÊM ĐOẠN NÀY VÀO ĐỂ FIX LỖI 👇
    public function mon_hoc()
    {
        return $this->belongsTo(MonHoc::class, 'mon_hoc_id');
    }

    // Tiện tay thì chèn luôn cái này để nó biết điểm này của học sinh nào nhé
    public function hoc_sinh()
    {
        return $this->belongsTo(HocSinh::class, 'hoc_sinh_id');
    }
}