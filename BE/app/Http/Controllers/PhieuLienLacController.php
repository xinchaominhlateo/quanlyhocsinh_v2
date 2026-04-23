<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\HocSinh;
use App\Models\DiemSo;
use App\Models\HanhKiem;
use App\Models\LopHoc;

class PhieuLienLacController extends Controller
{
    // 1. Lấy danh sách học sinh theo lớp
    public function getHocSinhTheoLop($lop_id)
    {
        // Kiểm tra xem cột của em là lop_hoc_id hay lop_id nhé, anh đang để lop_hoc_id theo chuẩn mấy file trước
        $hocSinhs = HocSinh::where('lop_hoc_id', $lop_id)->get();
        return response()->json(['status' => 'success', 'data' => $hocSinhs]);
    }

    // 2. Gom toàn bộ Điểm + Hạnh kiểm của 1 em để in
    public function getChiTietPhieu($hoc_sinh_id)
    {
        $hocSinh = HocSinh::with('lop_hoc')->find($hoc_sinh_id);
        if (!$hocSinh) {
            return response()->json(['message' => 'Không tìm thấy học sinh'], 404);
        }

        // Lấy điểm các môn của học sinh này
        $diemSo = DiemSo::with('mon_hoc')->where('hoc_sinh_id', $hoc_sinh_id)->get();
        
        // Lấy hạnh kiểm
        $hanhKiem = HanhKiem::where('hoc_sinh_id', $hoc_sinh_id)->get();

        return response()->json([
            'status' => 'success',
            'data' => [
                'hoc_sinh' => $hocSinh,
                'diem_so' => $diemSo,
                'hanh_kiem' => $hanhKiem
            ]
        ]);
    }
}