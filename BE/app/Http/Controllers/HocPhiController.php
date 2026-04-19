<?php

namespace App\Http\Controllers;

use App\Models\HocPhi;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class HocPhiController extends Controller
{
    /**
     * Lấy danh sách phiếu thu kèm thông tin học sinh
     */
    public function index()
    {
        $data = HocPhi::with('hoc_sinh.lop_hoc')->get();
        return response()->json([
            'status' => 'success',
            'data' => $data
        ]);
    }

    /**
     * 🛑 ĐÂY LÀ HÀM QUAN TRỌNG NHẤT M ĐANG THIẾU
     * Hàm này dùng để xử lý khi m bấm nút "Tạo Phiếu" bên React
     */
    public function store(Request $request)
    {
        $request->validate([
            'hoc_sinh_id' => 'required',
            'hoc_ki' => 'required',
            'so_tien' => 'required|numeric',
        ]);

        // Tạo phiếu mới
        $hocPhiMoi = HocPhi::create($request->all());

        // Sau khi lưu xong, mình trả về kèm luôn thông tin học sinh để React hiện lên bảng ngay
$result = HocPhi::with('hoc_sinh.lop_hoc')->find($hocPhiMoi->id);
        return response()->json([
            'status' => 'success',
            'message' => 'Đã tạo phiếu thu thành công!',
            'data' => $result
        ]);
    }

    /**
     * Xem chi tiết 1 phiếu
     */
    public function show($id)
    {
$hocPhi = HocPhi::with('hoc_sinh.lop_hoc')->find($id);
        if (!$hocPhi) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy thông tin học phí này!'
            ], 404);
        }

        return response()->json([
            'status' => 'success', 
            'data' => $hocPhi
        ]);
    }

    /**
     * Cập nhật phiếu thu (Ví dụ: Chuyển sang Đã đóng)
     */
    public function update(Request $request, $id)
    {
        $hp = HocPhi::find($id);
        
        if (!$hp) {
            return response()->json(['status' => 'error', 'message' => 'Không tìm thấy!'], 404);
        }

        $hp->update($request->all());
        
        return response()->json([
            'status' => 'success',
            'message' => 'Cập nhật thành công!'
        ]);
    }

    /**
     * Xóa phiếu thu
     */
    public function destroy($id)
    {
        $hp = HocPhi::find($id);
        if ($hp) {
            $hp->delete();
            return response()->json(['status' => 'success', 'message' => 'Đã xóa phiếu!']);
        }
        return response()->json(['status' => 'error', 'message' => 'Không tìm thấy!'], 404);
    }
}