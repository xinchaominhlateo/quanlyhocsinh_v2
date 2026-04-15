<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HocSinh;
use App\Models\LopHoc;
use App\Models\HocPhi;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index() {
        return response()->json([
            'status' => 'success',
            'data' => [
                'tong_hoc_sinh' => HocSinh::count(),
                'tong_lop' => LopHoc::count(),
                'doanh_thu' => HocPhi::where('trang_thai', 'Đã đóng')->sum('so_tien'),
                'ti_le_gioi_tinh' => [
                    ['name' => 'Nam', 'value' => HocSinh::where('gioi_tinh', 'Nam')->count()],
                    ['name' => 'Nữ', 'value' => HocSinh::where('gioi_tinh', 'Nữ')->count()],
                ]
            ]
        ]);
    }
}