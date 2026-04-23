<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\HocSinh;
use App\Models\User;
use App\Models\LopHoc;
use App\Models\MonHoc;

class ThongKeController extends Controller
{
    public function getTongQuan()
    {
        // Đếm tổng số lượng từ các bảng
        $data = [
            'tong_hoc_sinh' => HocSinh::count(),
            'tong_giao_vien' => User::where('role', 'teacher')->count(),
            'tong_lop_hoc' => LopHoc::count(),
            'tong_mon_hoc' => MonHoc::count(),
        ];

        return response()->json(['status' => 'success', 'data' => $data]);
    }
}