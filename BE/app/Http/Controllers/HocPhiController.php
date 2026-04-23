<?php

namespace App\Http\Controllers;

use App\Models\HocPhi;
use App\Models\HocSinh;
use App\Models\MonHoc;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class HocPhiController extends Controller
{
    // 1. Lấy danh sách phiếu thu
    public function index(Request $request)
    {
        $user = auth('sanctum')->user();
        $query = HocPhi::with('hoc_sinh.lop_hoc');

        if ($user && $user->role === 'student') {
            $query->whereHas('hoc_sinh', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            });
        }

        return response()->json([
            'status' => 'success',
            'data' => $query->latest()->get()
        ]);
    }

    // 2. Hàm TẠO PHIẾU THÔNG MINH (Sửa lỗi dính ngoặc của em)
    public function store(Request $request)
    {
        $request->validate([
            'hoc_sinh_id' => 'required|exists:hoc_sinhs,id',
            'selected_mon_hoc' => 'required|array' // Nhận danh sách ID môn học từ React
        ]);

        $hocSinhId = $request->hoc_sinh_id;
        $monHocIds = $request->selected_mon_hoc;

        // Tính tổng tiền dựa trên giá tiền của từng môn đã chọn
        $tongTien = MonHoc::whereIn('id', $monHocIds)->sum('hoc_phi'); 

        // Tạo bản ghi học phí
        $hocPhi = HocPhi::create([
            'hoc_sinh_id' => $hocSinhId,
            'so_tien' => $tongTien,
            'ngay_dong' => now(),
            'trang_thai' => 'Chưa thanh toán',
            'noi_dung' => 'Học phí học kỳ 1 (Các môn: ' . count($monHocIds) . ' môn)',
            'hoc_ki' => 'Học kỳ 1'
        ]);

        // Trả về kết quả kèm thông tin học sinh để hiện lên bảng
        $result = HocPhi::with('hoc_sinh.lop_hoc')->find($hocPhi->id);

        return response()->json([
            'status' => 'success',
            'message' => 'Đã tạo phiếu thu tự động thành công!',
            'data' => $result
        ]);
    }

    public function show($id)
    {
        $hocPhi = HocPhi::with('hoc_sinh.lop_hoc')->find($id);
        return $hocPhi ? response()->json(['status' => 'success', 'data' => $hocPhi]) 
                        : response()->json(['status' => 'error', 'message' => 'Không tìm thấy!'], 404);
    }

    public function update(Request $request, $id)
    {
        $hp = HocPhi::find($id);
        if (!$hp) return response()->json(['status' => 'error', 'message' => 'Không tìm thấy!'], 404);
        
        $hp->update($request->all());
        return response()->json(['status' => 'success', 'message' => 'Cập nhật thành công!']);
    }

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