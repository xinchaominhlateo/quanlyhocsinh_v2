<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DonNghiPhep extends Model
{
    protected $table = 'don_nghi_pheps';
    
    protected $fillable = [
        'hoc_sinh_id', 'ngay_bat_dau', 'ngay_ket_thuc', 'ly_do', 'trang_thai'
    ];

    public function hoc_sinh() {
        return $this->belongsTo(HocSinh::class, 'hoc_sinh_id');
    }
}