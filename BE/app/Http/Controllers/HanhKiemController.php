<?php

namespace App\Http\Controllers;

use App\Models\HanhKiem;
use Illuminate\Http\Request;

class HanhKiemController extends Controller
{
    // 1. Lấy danh sách hạnh kiểm (kèm tên học sinh)
    public function index(Request $request)
    {
        $data = HanhKiem::with('hoc_sinh')->latest()->get();
        return response()->json(['status' => 'success', 'data' => $data]);
    }

    // 2. Lưu hạnh kiểm hàng loạt từ GVCN
    public function storeBatch(Request $request)
    {
        $request->validate([
            'hanh_kiem_data' => 'required|array',
        ]);

        foreach ($request->hanh_kiem_data as $item) {
            // Dùng updateOrCreate: Nếu học sinh này đã có điểm hạnh kiểm rồi thì Cập nhật, chưa có thì Tạo mới
            HanhKiem::updateOrCreate(
                [
                    'hoc_sinh_id' => $item['hoc_sinh_id'],
                    'hoc_ki' => 1
                ],
                [
                    'loai' => $item['xep_loai'],
                    'nhan_xet' => $item['nhan_xet'] ?? null
                ]
            );
        }

        return response()->json(['status' => 'success', 'message' => 'Đã lưu đánh giá hạnh kiểm thành công!']);
    }

    // Các hàm show, update, destroy có thể để trống hoặc viết theo chuẩn resource nếu cần
    public function show($id) { }
    public function update(Request $request, $id) { }
    public function destroy($id) { }
}