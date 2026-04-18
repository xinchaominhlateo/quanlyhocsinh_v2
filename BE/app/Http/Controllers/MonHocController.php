<?php

namespace App\Http\Controllers;

use App\Models\MonHoc;
use Illuminate\Http\Request;

class MonHocController extends Controller
{
    public function index() {
        return response()->json(['status' => 'success', 'data' => MonHoc::all()]);
    }

    public function store(Request $request) {
        // 🛑 1. BẮT LỖI: Tên môn học không được trùng
        $request->validate([
            'ten_mon' => 'required|unique:mon_hocs,ten_mon',
        ], [
            'ten_mon.unique' => 'Môn ' . $request->ten_mon . ' đã có trong hệ thống rồi!',
        ]);

        $data = $request->all();

        // 🤖 2. TỰ ĐỘNG SINH MÃ MÔN (MH + Năm + 4 số thứ tự)
        $namHienTai = date('Y');
        $monCuoi = MonHoc::orderBy('id', 'desc')->first();
        $soThuTu = $monCuoi ? ($monCuoi->id + 1) : 1;
        $maTuDong = 'MH' . $namHienTai . str_pad($soThuTu, 4, '0', STR_PAD_LEFT);

        $data['ma_mon'] = $maTuDong;

        $monMoi = MonHoc::create($data);
        return response()->json([
            'status' => 'success', 
            'message' => 'Thêm môn thành công! Mã môn: ' . $maTuDong, 
            'data' => $monMoi
        ]);
    }

    public function update(Request $request, string $id) {
        $mon = MonHoc::find($id);
        if (!$mon) return response()->json(['status' => 'error', 'message' => 'Không tìm thấy môn!'], 404);

        // 🛑 BẮT LỖI KHI SỬA: Không cho phép đổi tên môn trùng với môn khác
        $request->validate([
            'ten_mon' => 'required|unique:mon_hocs,ten_mon,' . $id,
        ], [
            'ten_mon.unique' => 'Tên môn học này đã tồn tại!',
        ]);
        
        // Không cho sửa mã môn
        $dataCapNhat = $request->except(['ma_mon']);
        
        $mon->update($dataCapNhat);
        return response()->json(['status' => 'success', 'message' => 'Cập nhật môn thành công!']);
    }

    public function destroy(string $id) {
        $mon = MonHoc::find($id);
        if ($mon) {
            $mon->delete();
            return response()->json(['status' => 'success', 'message' => 'Xóa môn thành công!']);
        }
        return response()->json(['status' => 'error', 'message' => 'Môn học không tồn tại!'], 404);
    }
}