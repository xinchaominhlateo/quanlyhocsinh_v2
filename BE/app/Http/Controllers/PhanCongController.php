<?php

namespace App\Http\Controllers;

use App\Models\LopHoc;
use App\Models\GiaoVien;
use Illuminate\Http\Request;

class PhanCongController extends Controller
{
    // 1. Lấy danh sách Lớp kèm theo các Giáo viên đang dạy lớp đó
    public function index()
    {
        $data = LopHoc::with('giaoViens.monHoc')->get();
        return response()->json(['status' => 'success', 'data' => $data]);
    }

    // 2. Thêm một Giáo viên vào dạy một Lớp
    public function store(Request $request)
    {
        $lop = LopHoc::find($request->lop_hoc_id);
        
        if(!$lop) {
            return response()->json(['status' => 'error', 'message' => 'Không tìm thấy lớp!'], 404);
        }

        // Dùng syncWithoutDetaching để chèn vào bảng trung gian (nếu có rồi thì không chèn trùng)
        $lop->giaoViens()->syncWithoutDetaching([$request->giao_vien_id]);

        return response()->json(['status' => 'success', 'message' => 'Phân công thành công!']);
    }

    // 3. Hủy phân công (Xóa giáo viên khỏi lớp)
    public function destroy($lop_id, $gv_id)
    {
        $lop = LopHoc::find($lop_id);
        
        if($lop) {
            // Lệnh detach dùng để gỡ liên kết trong bảng trung gian
            $lop->giaoViens()->detach($gv_id);
        }

        return response()->json(['status' => 'success', 'message' => 'Đã hủy phân công!']);
    }
}