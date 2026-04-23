<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HanhKiem extends Model
{
    use HasFactory;

    // Cho phép lưu các cột này
    protected $fillable = ['hoc_sinh_id', 'xep_loai', 'nhan_xet'];

    // Mối quan hệ: Hạnh kiểm thuộc về 1 Học sinh
    public function hoc_sinh()
    {
        return $this->belongsTo(HocSinh::class, 'hoc_sinh_id');
    }
}