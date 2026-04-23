<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DonNghiPhep;
use App\Models\HocSinh;

class DonNghiPhepController extends Controller
{
    // 1. LẤY DANH SÁCH ĐƠN (Có phân quyền)
    public function index(Request $request)
    {
        $user = auth('sanctum')->user() ?? $request->user();
        
        // Lấy đơn kèm thông tin học sinh và lớp học
        $query = DonNghiPhep::with(['hoc_sinh.lop_hoc']);

        // Nếu là HỌC SINH: Chỉ lấy những đơn do chính mình tạo
        if ($user->role === 'student') {
            $query->whereHas('hoc_sinh', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            });
        }
        // Nếu là GV/Admin: Lấy tất cả để duyệt

        $data = $query->latest()->get();
        return response()->json(['status' => 'success', 'data' => $data]);
    }

    // 2. HỌC SINH NỘP ĐƠN MỚI
    public function store(Request $request)
    {
        $user = auth('sanctum')->user() ?? $request->user();
        
        if ($user->role !== 'student') {
            return response()->json(['message' => 'Chỉ học sinh mới được nộp đơn!'], 403);
        }

        // Tìm thông tin học sinh đang đăng nhập
        $hocSinh = HocSinh::where('user_id', $user->id)->first();
        if (!$hocSinh) {
            return response()->json(['message' => 'Không tìm thấy hồ sơ học sinh!'], 404);
        }

        $request->validate([
            'ngay_bat_dau' => 'required|date',
            'ngay_ket_thuc' => 'required|date|after_or_equal:ngay_bat_dau',
            'ly_do' => 'required|string|max:255',
        ]);

        $don = DonNghiPhep::create([
            'hoc_sinh_id' => $hocSinh->id,
            'ngay_bat_dau' => $request->ngay_bat_dau,
            'ngay_ket_thuc' => $request->ngay_ket_thuc,
            'ly_do' => $request->ly_do,
            'trang_thai' => 'Chờ duyệt' // Mặc định khi mới nộp
        ]);

        return response()->json(['status' => 'success', 'data' => $don]);
    }

    // 3. GIÁO VIÊN / ADMIN DUYỆT ĐƠN
    public function update(Request $request, $id)
    {
        $don = DonNghiPhep::find($id);
        if (!$don) {
            return response()->json(['message' => 'Không tìm thấy đơn!'], 404);
        }

        // Cập nhật trạng thái (Đã duyệt / Từ chối)
        $don->update([
            'trang_thai' => $request->trang_thai
        ]);

        return response()->json(['status' => 'success', 'message' => 'Đã cập nhật trạng thái đơn!']);
    }

    // 4. HỌC SINH HỦY ĐƠN (Xóa)
    public function destroy($id)
    {
        $don = DonNghiPhep::find($id);
        if ($don && $don->trang_thai === 'Chờ duyệt') {
            $don->delete();
            return response()->json(['status' => 'success']);
        }
        return response()->json(['message' => 'Chỉ có thể xóa đơn đang chờ duyệt!'], 400);
    }
}