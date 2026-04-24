<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DonXinSuaDiem extends Model
{
    use HasFactory;

    protected $fillable = [
        'giao_vien_id',
        'diem_so_id',
        'cot_diem_sai',
        'diem_cu',
        'diem_moi',
        'ly_do',
        'trang_thai'
    ];

    // Đơn này do Giáo viên nào viết?
    public function giao_vien()
    {
        return $this->belongsTo(GiaoVien::class, 'giao_vien_id');
    }

    // Đơn này xin sửa cho cột điểm nào của học sinh nào?
    public function diem_so()
    {
        return $this->belongsTo(DiemSo::class, 'diem_so_id');
    }
}