<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HocSinh extends Model
{
    use HasFactory;

    protected $fillable = [
        'ma_hoc_sinh', 'ho_ten','user_id', 'ngay_sinh', 'gioi_tinh', 'dia_chi', 'sdt', 'email', 'lop_hoc_id'
    ];

    public function lop_hoc() {
        return $this->belongsTo(LopHoc::class, 'lop_hoc_id');
    }
}