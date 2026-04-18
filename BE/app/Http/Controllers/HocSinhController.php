<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\HocSinh; 

class HocSinhController extends Controller
{
    // Lấy danh sách học sinh kèm thông tin lớp
    public function index() {
        $danhSach = HocSinh::with('lopHoc')->get(); 
        return response()->json(['status' => 'success', 'data' => $danhSach]);
    }

    // HÀM THÊM MỚI HỌC SINH
    public function store(Request $request) 
    {
        // 🛑 BƯỚC BẮT LỖI (VALIDATE)
        $request->validate([
            'ho_ten' => 'required|string',
            'ngay_sinh' => 'required|date',
            'gioi_tinh' => 'required',
            'dia_chi' => 'required|string',
            'lop_hoc_id' => 'required|exists:lop_hocs,id',
            // Kiểm tra Gmail: Đúng định dạng, duy nhất, và phải có đuôi @gmail.com
            'email' => [
                'required',
                'email',
                'unique:hoc_sinhs,email',
                'regex:/^[a-zA-Z0-9._%+-]+@gmail\.com$/'
            ],
            // Kiểm tra SĐT: Chỉ nhập số, độ dài từ 10-11 số
            'sdt' => 'required|numeric|digits_between:10,11',
        ], [
            'email.regex' => 'Email bắt buộc phải có định dạng @gmail.com!',
            'email.unique' => 'Gmail này đã có học sinh khác sử dụng!',
            'sdt.numeric' => 'Số điện thoại chỉ được chứa các chữ số!',
            'sdt.digits_between' => 'Số điện thoại phải có độ dài từ 10 đến 11 số!',
        ]);

        $data = $request->all();

        // TỰ ĐỘNG SINH MÃ HỌC SINH (Chuẩn: HS + Năm + 4 số thứ tự)
        $namHienTai = date('Y');
        $hocSinhCuoi = HocSinh::orderBy('id', 'desc')->first();
        $soThuTu = $hocSinhCuoi ? ($hocSinhCuoi->id + 1) : 1;
        $maTuDong = 'HS' . $namHienTai . str_pad($soThuTu, 4, '0', STR_PAD_LEFT); 

        $data['ma_hoc_sinh'] = $maTuDong;

        // Lưu vào Database
        $hocSinhMoi = HocSinh::create($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Đã thêm học sinh thành công! Mã hệ thống: ' . $maTuDong,
            'data' => $hocSinhMoi
        ]);
    }

    public function show(string $id) {
        $hocSinh = HocSinh::with('lopHoc')->find($id);
        if (!$hocSinh) {
            return response()->json(['status' => 'error', 'message' => 'Không tìm thấy!'], 404);
        }
        return response()->json(['status' => 'success', 'data' => $hocSinh]);
    }
    
    // HÀM CẬP NHẬT THÔNG TIN
    public function update(Request $request, string $id) {
        $hocSinh = HocSinh::find($id);

        if (!$hocSinh) {
            return response()->json(['status' => 'error', 'message' => 'Không tìm thấy học sinh này!'], 404);
        }

        // 🛑 BẮT LỖI KHI SỬA
        $request->validate([
            'email' => [
                'required',
                'email',
                'unique:hoc_sinhs,email,' . $id, // Bỏ qua kiểm tra trùng với chính nó
                'regex:/^[a-zA-Z0-9._%+-]+@gmail\.com$/'
            ],
            'sdt' => 'required|numeric|digits_between:10,11',
        ], [
            'email.regex' => 'Email phải có định dạng @gmail.com!',
            'sdt.numeric' => 'SĐT phải là định dạng số!',
        ]);
        
        // Loại bỏ trường 'ma_hoc_sinh' để tuyệt đối không cho đổi mã cũ
        $dataCapNhat = $request->except(['ma_hoc_sinh']);
        
        $hocSinh->update($dataCapNhat);

        return response()->json([
            'status' => 'success',
            'message' => 'Đã cập nhật thành công!',
            'data' => $hocSinh
        ]);
    }

    // HÀM XÓA HỌC SINH
    public function destroy(string $id)
    {
        $hocSinh = HocSinh::find($id);

        if (!$hocSinh) {
            return response()->json(['status' => 'error', 'message' => 'Không tìm thấy học sinh này!'], 404);
        }

        $hocSinh->delete();

        return response()->json(['status' => 'success', 'message' => 'Đã xóa học sinh thành công!']);
    }
}