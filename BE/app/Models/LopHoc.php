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
}