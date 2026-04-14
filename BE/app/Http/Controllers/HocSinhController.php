<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\HocSinh; 

class HocSinhController extends Controller
{
    // Hàm này sẽ lấy toàn bộ danh sách học sinh
  public function index() {
    // Dùng with('lopHoc') để lấy luôn dữ liệu lớp, đỡ phải gọi nhiều lần (Eager Loading)
    $danhSach = HocSinh::with('lopHoc')->get(); 
    return response()->json(['status' => 'success', 'data' => $danhSach]);
}

    public function store(Request $request) 
    {
       
        // 1. Nhận toàn bộ dữ liệu từ React gửi sang và lưu thẳng vào Database
        $hocSinhMoi = HocSinh::create($request->all());

        // 2. Báo cáo lại cho React biết là đã lưu thành công
        return response()->json([
            'status' => 'success',
            'message' => 'Đã thêm học sinh thành công!',
            'data' => $hocSinhMoi
        ]);
    }

    public function show(string $id) {}
    
    public function update(Request $request, string $id) {
        // 1. Tìm đứa cần sửa
        $hocSinh = HocSinh::find($id);

        if (!$hocSinh) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy học sinh này!'
            ], 404);
    }
    $hocSinh->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Đã cập nhật thành công!',
            'data' => $hocSinh
        ]);
    }

    // HÀM XÓA CHUẨN ĐÂY NÈ
    public function destroy(string $id)
    {
        // 1. Tìm học sinh theo ID
        $hocSinh = HocSinh::find($id);

        // Nếu không tìm thấy thì báo lỗi
        if (!$hocSinh) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy học sinh này!'
            ], 404);
        }

        // 2. Nếu thấy thì "xử tử" nó khỏi Database
        $hocSinh->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Đã xóa học sinh thành công!'
        ]);
    }
}