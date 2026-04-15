<?php

namespace App\Http\Controllers;

use App\Models\GiaoVien;
use Illuminate\Http\Request;

class GiaoVienController extends Controller
{
    // 1. LẤY DANH SÁCH GIÁO VIÊN
    public function index()
    {
        $data = GiaoVien::with('monHoc')->get();
        return response()->json(['status' => 'success', 'data' => $data]);
    }

    // 2. THÊM MỚI GIÁO VIÊN
    public function store(Request $request)
    {
        $gv = GiaoVien::create($request->all());
        return response()->json(['status' => 'success', 'data' => $gv]);
    }

    // 3. XEM CHI TIẾT 1 GIÁO VIÊN (HÀM SHOW M CẦN TÌM ĐÂY NÈ)
    public function show($id)
    {
        // Lấy giáo viên theo ID, kèm theo thông tin môn học
        $gv = GiaoVien::with('monHoc')->find($id);

        if (!$gv) {
            return response()->json(['status' => 'error', 'message' => 'Không tìm thấy giáo viên này!'], 404);
        }

        return response()->json(['status' => 'success', 'data' => $gv]);
    }

    // 4. CẬP NHẬT (SỬA) THÔNG TIN (Đã sửa lại ($id) cho khớp)
    public function update(Request $request, $id)
    {
        $gv = GiaoVien::find($id);
        
        if (!$gv) {
            return response()->json(['status' => 'error', 'message' => 'Không tìm thấy giáo viên!'], 404);
        }

        $gv->update($request->all());
        return response()->json(['status' => 'success', 'data' => $gv]);
    }

    // 5. XÓA GIÁO VIÊN (Đã sửa lại ($id) cho khớp)
    public function destroy($id)
    {
        $gv = GiaoVien::find($id);
        
        if ($gv) {
            $gv->delete();
        }

        return response()->json(['status' => 'success', 'message' => 'Đã xóa thành công!']);
    }
}