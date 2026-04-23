<?php

namespace App\Http\Controllers;

use App\Models\HocSinh;
use App\Models\DiemSo;
use App\Models\HanhKiem;
use Illuminate\Http\Request;

class PhieuLienLacController extends Controller
{
    public function getHocSinhTheoLop($lop_id)
    {
        $hocSinhs = HocSinh::where('lop_hoc_id', $lop_id)->get();
        return response()->json(['status' => 'success', 'data' => $hocSinhs]);
    }

    public function getChiTietPhieu($hoc_sinh_id)
    {
        // Gọi đúng 'lop_hoc' đã định nghĩa trong Model
        $hocSinh = HocSinh::with('lop_hoc')->find($hoc_sinh_id);
        
        if (!$hocSinh) {
            return response()->json(['status' => 'error', 'message' => 'Không tìm thấy học sinh'], 404);
        }

        // Gọi đúng 'mon_hoc'
        $diemSo = DiemSo::with('mon_hoc')->where('hoc_sinh_id', $hoc_sinh_id)->get();
        $hanhKiem = HanhKiem::where('hoc_sinh_id', $hoc_sinh_id)->first();

        $tongDiem = 0;
        $soMon = count($diemSo);
        foreach ($diemSo as $diem) {
            $tongDiem += (float)($diem->diem_trung_binh ?? 0);
        }
        $dtb_hk = $soMon > 0 ? round($tongDiem / $soMon, 2) : 0;

        return response()->json([
            'status' => 'success',
            'data' => [
                'hoc_sinh' => [
                    'ho_ten' => $hocSinh->ho_ten,
                    'ten_lop' => $hocSinh->lop_hoc->ten_lop ?? 'Chưa xếp lớp',
                    'ngay_sinh' => $hocSinh->ngay_sinh,
                    'gioi_tinh' => $hocSinh->gioi_tinh
                ],
                'diem_so' => $diemSo,
                'hanh_kiem' => $hanhKiem,
                'dtb_hoc_ky' => $dtb_hk
            ]
        ]);
    }
}