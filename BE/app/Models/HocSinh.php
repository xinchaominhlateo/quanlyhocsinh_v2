<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HocSinh extends Model
{
    use HasFactory;
protected $fillable = [
        'ho_ten', 
        'ngay_sinh', 
        'gioi_tinh', 
        'dia_chi', 
        'lop_hoc_id'
    ];

    public function lopHoc() {
        return $this->belongsTo(LopHoc::class, 'lop_hoc_id');
    }
}