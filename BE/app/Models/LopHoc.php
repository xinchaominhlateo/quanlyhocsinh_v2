<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LopHoc extends Model
{
    use HasFactory;
    protected $fillable = ['ma_lop', 'ten_lop', 'khoi'];
    public function hocSinhs() {
    return $this->hasMany(HocSinh::class, 'lop_hoc_id');
}
// Một lớp học có nhiều giáo viên
   public function giao_viens() {
        return $this->belongsToMany(GiaoVien::class, 'giao_vien_lop_hoc', 'lop_hoc_id', 'giao_vien_id')
        ->withPivot('vai_tro');
    }
}