<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DiemDanh;
use App\Models\HocSinh;

class DiemDanhController extends Controller
{
    // 1. LẤY DANH SÁCH HỌC SINH ĐỂ ĐIỂM DANH (Theo Lớp & Ngày)
    public function layDanhSach(Request $request)
    {
        $request->validate([
            'lop_hoc_id' => 'required',
            'ngay' => 'required|date'
        ]);

        // Lấy tất cả học sinh của lớp đó
        $hocSinhs = HocSinh::where('lop_hoc_id', $request->lop_hoc_id)->get();

        // Lấy dữ liệu điểm danh cũ (nếu có) của ngày hôm đó
        $diemDanhs = DiemDanh::where('lop_hoc_id', $request->lop_hoc_id)
                             ->where('ngay', $request->ngay)
                             ->get()
                             ->keyBy('hoc_sinh_id');

        // Trộn dữ liệu: Nếu đứa nào chưa có điểm danh thì mặc định là 'Có mặt'
        $data = $hocSinhs->map(function($hs) use ($diemDanhs) {
            $trangThai = isset($diemDanhs[$hs->id]) ? $diemDanhs[$hs->id]->trang_thai : 'Có mặt';
            return [
                'hoc_sinh_id' => $hs->id,
                'ma_hoc_sinh' => $hs->ma_hoc_sinh,
                'ho_ten' => $hs->ho_ten,
                'trang_thai' => $trangThai
            ];
        });

        return response()->json(['status' => 'success', 'data' => $data]);
    }

    // 2. LƯU ĐIỂM DANH HÀNG LOẠT
    public function luuDiemDanh(Request $request)
    {
        $request->validate([
            'lop_hoc_id' => 'required',
            'ngay' => 'required|date',
            'danh_sach' => 'required|array'
        ]);

        // Quét qua mảng dữ liệu gửi lên và Lưu/Cập nhật từng đứa
        foreach ($request->danh_sach as $item) {
            DiemDanh::updateOrCreate(
                [
                    'hoc_sinh_id' => $item['hoc_sinh_id'], 
                    'lop_hoc_id' => $request->lop_hoc_id, 
                    'ngay' => $request->ngay
                ],
                [
                    'trang_thai' => $item['trang_thai']
                ]
            );
        }

        return response()->json(['status' => 'success', 'message' => 'Lưu sổ điểm danh thành công!']);
    }
}