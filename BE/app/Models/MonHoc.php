<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MonHoc extends Model
{
    use HasFactory;

    protected $table = 'mon_hocs';

    // Đã khai báo chuẩn xác cột hoc_phi
    protected $fillable = [
        'ma_mon',
        'ten_mon',
        'so_tiet',
        'hoc_phi'
    ];
}