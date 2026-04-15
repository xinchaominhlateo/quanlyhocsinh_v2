<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DiemSo extends Model
{
    use HasFactory;
protected $fillable = ['hoc_sinh_id', 'mon_hoc_id', 'diem_mieng', 'diem_15_phut', 'diem_1_tiet', 'diem_thi', 'diem_trung_binh', 'xep_loai'];
    // Khai báo để lúc lấy điểm, lấy luôn được Tên học sinh và Tên môn
    public function hocSinh() { return $this->belongsTo(HocSinh::class, 'hoc_sinh_id'); }
    public function monHoc() { return $this->belongsTo(MonHoc::class, 'mon_hoc_id'); }
}