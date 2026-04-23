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
        // 🛑 QUAN TRỌNG: Phải dùng 'giao_viens.mon_hoc' (có gạch dưới) 
        // để khớp với tên hàm đã đặt trong Model
        // Laravel sẽ tự động lấy hết các cột bao gồm cả 'gioi_tinh' cho m.
        $data = LopHoc::with('giao_viens.mon_hoc')->get();
        
        return response()->json(['status' => 'success', 'data' => $data]);
    }

    // 2. Thêm một Giáo viên vào dạy một Lớp
// 2. Thêm một Giáo viên vào dạy một Lớp
    public function store(Request $request)
    {
        // 1. Tìm lớp
        $lop = LopHoc::find($request->lop_hoc_id);
        
        if(!$lop) {
            return response()->json(['status' => 'error', 'message' => 'Không tìm thấy lớp!'], 404);
        }

        // Lấy vai trò (nếu ko truyền thì mặc định là Bộ môn)
        $vai_tro = $request->vai_tro ?? 'Bộ môn';

        // 2. Lưu giáo viên vào lớp kèm theo VAI TRÒ
        // Truyền thêm mảng array chứa data cho bảng Pivot
        $lop->giao_viens()->syncWithoutDetaching([
            $request->giao_vien_id => ['vai_tro' => $vai_tro]
        ]);

        // 3. Lấy lại toàn bộ danh sách lớp đã được cập nhật
        $dataCapNhat = LopHoc::with('giao_viens.mon_hoc')->get();

        return response()->json([
            'status' => 'success', 
            'message' => 'Phân công thành công!',
            'data' => $dataCapNhat 
        ]);
    }
    // 3. Hủy phân công (Xóa giáo viên khỏi lớp)
    public function destroy($lop_id, $gv_id)
    {
        $lop = LopHoc::find($lop_id);
        
        if($lop) {
            // Đổi thành giao_viens() cho đồng bộ
            $lop->giao_viens()->detach($gv_id);
            return response()->json(['status' => 'success', 'message' => 'Đã hủy phân công!']);
        }

        return response()->json(['status' => 'error', 'message' => 'Không tìm thấy lớp!'], 404);
    }
}