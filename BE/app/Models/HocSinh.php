<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HocSinh extends Model
{
    use HasFactory;
protected $fillable = [
        'ho_ten', 
        'ngay_sinh', 
        'gioi_tinh', 
        'dia_chi', 
        'lop_hoc_id'
    ];
    // Danh sách các cột được phép "đổ" dữ liệu từ Form vào
    protected $fillable = [
        'ho_ten', 
        'ngay_sinh', 
        'gioi_tinh', 
        'dia_chi', 
        'lop_hoc_id' // Cột này cực kỳ quan trọng để nối với bảng Lớp
    ];

    // Khai báo mối quan hệ với bảng Lớp Học (để hàm index() của m chạy được)
    public function lopHoc() {
        return $this->belongsTo(LopHoc::class, 'lop_hoc_id');
    }
}