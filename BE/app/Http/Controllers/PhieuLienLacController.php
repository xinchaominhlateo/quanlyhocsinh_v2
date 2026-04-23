<?php

namespace App\Http\Controllers;

use App\Models\HocSinh;
use App\Models\LopHoc;
use App\Models\DiemSo;
use App\Models\HanhKiem;
use Illuminate\Http\Request;

class PhieuLienLacController extends Controller
{
    // 1. Lấy danh sách học sinh theo lớp
    public function getHocSinhTheoLop($lop_id)
    {
        // Anh dùng where cho chắc chắn, khớp với cột trong Database của em
        $hocSinhs = \App\Models\HocSinh::where('lop_hoc_id', $lop_id)->get();
        
        return response()->json([
            'status' => 'success', 
            'data' => $hocSinhs
        ]);
    }

    // 2. Lấy chi tiết phiếu liên lạc của 1 học sinh
    public function getChiTietPhieu($hoc_sinh_id)
    {
        // Lấy thông tin cơ bản
        $hocSinh = HocSinh::find($hoc_sinh_id);
        if (!$hocSinh) {
            return response()->json(['message' => 'Không tìm thấy học sinh'], 404);
        }

        // Lấy Tên Lớp gán thẳng vào học sinh
        $lopHoc = LopHoc::find($hocSinh->lop_hoc_id);
        $hocSinh->ten_lop = $lopHoc ? $lopHoc->ten_lop : 'Chưa xếp lớp';

        // Lấy toàn bộ Điểm và Hạnh kiểm
        $diemSo = DiemSo::with('mon_hoc')->where('hoc_sinh_id', $hoc_sinh_id)->get();
        $hanhKiem = HanhKiem::where('hoc_sinh_id', $hoc_sinh_id)->first();

        // Tự động tính Điểm Trung Bình Học Kỳ (cộng dồn chia trung bình)
        $tongDiem = 0;
        $soMon = count($diemSo);
        foreach ($diemSo as $diem) {
            $tongDiem += $diem->diem_trung_binh;
        }
        $dtb_hk = $soMon > 0 ? round($tongDiem / $soMon, 2) : 0;

        return response()->json([
            'status' => 'success',
            'data' => [
                'hoc_sinh' => $hocSinh,
                'diem_so' => $diemSo,
                'hanh_kiem' => $hanhKiem,
                'dtb_hoc_ky' => $dtb_hk
            ]
        ]);
    }
}