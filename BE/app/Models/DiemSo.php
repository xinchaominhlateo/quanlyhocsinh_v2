<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DiemSo extends Model
{
    use HasFactory;
    protected $fillable = ['hoc_sinh_id', 'mon_hoc_id', 'hoc_ki', 'diem_tx', 'diem_gk', 'diem_ck', 'diem_tb', 'nhan_xet'];

    // Khai báo để lúc lấy điểm, lấy luôn được Tên học sinh và Tên môn
    public function hocSinh() { return $this->belongsTo(HocSinh::class, 'hoc_sinh_id'); }
    public function monHoc() { return $this->belongsTo(MonHoc::class, 'mon_hoc_id'); }
}