<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HanhKiem extends Model
{
    protected $fillable = ['hoc_sinh_id', 'hoc_ki', 'loai', 'nhan_xet'];

public function hocSinh() {
    return $this->belongsTo(HocSinh::class, 'hoc_sinh_id');
}
}
