<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GiaoVien extends Model {
    use HasFactory;
protected $fillable = ['ma_giao_vien','gioi_tinh', 'ho_ten', 'email', 'sdt', 'mon_hoc_id'];
    // Thiết lập quan hệ: 1 Giáo viên dạy 1 Môn học
    public function mon_Hoc() {
        return $this->belongsTo(MonHoc::class, 'mon_hoc_id');
    }
    // Một giáo viên dạy nhiều lớp
    public function lopHocs() {
        return $this->belongsToMany(LopHoc::class, 'giao_vien_lop_hoc');
    }
}