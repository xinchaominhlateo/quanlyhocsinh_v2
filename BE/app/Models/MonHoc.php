<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MonHoc extends Model
{
    use HasFactory;
    protected $fillable = ['ma_mon', 'ten_mon', 'so_tiet'];
    public function giao_viens()
{
    // Một môn học có thể có nhiều giáo viên dạy
    return $this->hasMany(GiaoVien::class, 'mon_hoc_id');
}
}
