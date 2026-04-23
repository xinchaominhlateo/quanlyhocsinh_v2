<?php

namespace App\Http\Controllers;

use App\Models\HocSinh;
use App\Models\GiaoVien;
use App\Models\LopHoc;
use App\Models\DiemSo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ThongKeController extends Controller
{
    public function getDashboardStats()
    {
        // 1. Thống kê số lượng tổng quát
        $tongHocSinh = HocSinh::count();
        $tongGiaoVien = GiaoVien::count();
        $tongLopHoc = LopHoc::count();

        // 2. Thống kê xếp loại học lực toàn trường
        $xepLoai = DiemSo::select('xep_loai', DB::raw('count(*) as so_luong'))
            ->groupBy('xep_loai')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => [
                'counts' => [
                    'hoc_sinh' => $tongHocSinh,
                    'giao_vien' => $tongGiaoVien,
                    'lop_hoc' => $tongLopHoc
                ],
                'academic_stats' => $xepLoai
            ]
        ]);
    }
}