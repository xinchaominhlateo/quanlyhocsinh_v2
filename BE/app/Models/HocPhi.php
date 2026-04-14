<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HocPhi extends Model
{
    protected $fillable = ['hoc_sinh_id', 'hoc_ki', 'so_tien', 'trang_thai', 'ngay_dong'];

public function hocSinh() {
    return $this->belongsTo(HocSinh::class, 'hoc_sinh_id');
}
}
