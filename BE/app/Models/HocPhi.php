<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HocPhi extends Model
{
    use HasFactory;

    protected $table = 'hoc_phis';

    // Đã MỞ KHÓA cho phép lưu Tiền, Trạng thái, Nội dung
    protected $fillable = [
        'hoc_sinh_id',
        'so_tien',
        'ngay_dong',
        'trang_thai',
        'noi_dung',
        'hoc_ki'
    ];

    // Quan hệ với bảng Học Sinh
    public function hoc_sinh() {
        return $this->belongsTo(HocSinh::class, 'hoc_sinh_id');
    }
}