<?php

namespace App\Http\Controllers;

use App\Models\LopHoc;
use Illuminate\Http\Request;

class LopHocController extends Controller
{
    public function index() {
        return response()->json(['status' => 'success', 'data' => LopHoc::all()]);
    }

    public function store(Request $request) {
        // 🛑 1. BẮT LỖI: Kiểm tra tên lớp không được trùng trong bảng lop_hocs
        $request->validate([
            'ten_lop' => 'required|unique:lop_hocs,ten_lop',
            'khoi' => 'required'
        ], [
            'ten_lop.unique' => 'Lớp ' . $request->ten_lop . ' này đã có trong danh sách rồi Tèo ơi!',
        ]);

        $data = $request->all();

        // 🤖 2. TỰ ĐỘNG SINH MÃ LỚP (LH + Năm + 4 số thứ tự)
        $namHienTai = date('Y');
        $lopCuoi = LopHoc::orderBy('id', 'desc')->first();
        $soThuTu = $lopCuoi ? ($lopCuoi->id + 1) : 1;
        $maTuDong = 'LH' . $namHienTai . str_pad($soThuTu, 4, '0', STR_PAD_LEFT);

        $data['ma_lop'] = $maTuDong;

        // 3. Lưu vào Database
        $lopMoi = LopHoc::create($data);
        
        return response()->json([
            'status' => 'success', 
            'message' => 'Thêm lớp thành công! Mã hệ thống: ' . $maTuDong, 
            'data' => $lopMoi
        ]);
    }

    public function update(Request $request, string $id) {
        $lop = LopHoc::find($id);
        if (!$lop) return response()->json(['status' => 'error', 'message' => 'Không tìm thấy lớp!'], 404);

        // 🛑 BẮT LỖI KHI SỬA: Không cho phép đổi tên lớp trùng với một lớp khác đã có
        $request->validate([
            'ten_lop' => 'required|unique:lop_hocs,ten_lop,' . $id,
        ], [
            'ten_lop.unique' => 'Không thể đổi tên vì lớp này đã tồn tại trong hệ thống!',
        ]);
        
        // Loại bỏ mã lớp ra khỏi dữ liệu cập nhật để giữ tính nhất quán
        $dataCapNhat = $request->except(['ma_lop']);
        
        $lop->update($dataCapNhat);
        return response()->json(['status' => 'success', 'message' => 'Cập nhật thành công!']);
    }

    public function destroy(string $id) {
        $lop = LopHoc::find($id);
        if ($lop) {
            $lop->delete();
            return response()->json(['status' => 'success', 'message' => 'Xóa lớp thành công!']);
        }
        return response()->json(['status' => 'error', 'message' => 'Lớp không tồn tại!'], 404);
    }
}