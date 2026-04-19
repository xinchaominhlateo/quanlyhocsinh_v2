<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\HocSinh; 

class HocSinhController extends Controller
{
    // 1. LẤY DANH SÁCH CÓ PHÂN TRANG VÀ TÌM KIẾM
    public function index(Request $request) {
        $search = $request->query('search'); // Lấy từ khóa tìm kiếm từ React gửi lên

        $query = HocSinh::with('lop_hoc')->latest();// Sửa thành lop_hoc cho chuẩn model

        // Nếu có từ khóa tìm kiếm thì lọc theo Tên hoặc Mã
        if ($search) {
            $query->where('ho_ten', 'LIKE', "%{$search}%")
                  ->orWhere('ma_hoc_sinh', 'LIKE', "%{$search}%");
        }

        // Dùng paginate(10) để kích hoạt tính năng qua trang (10 em mỗi trang)
        $danhSach = $query->paginate(10); 
        
        return response()->json($danhSach); // Laravel Paginate tự đóng gói status success rồi
    }

    // 2. HÀM THÊM MỚI (ĐÃ BỎ VALIDATE MÃ TỰ ĐỘNG)
    public function store(Request $request) 
    {
        $request->validate([
            'ho_ten' => 'required|string',
            'ngay_sinh' => 'required|date',
            'gioi_tinh' => 'required',
            'dia_chi' => 'required|string',
            'lop_hoc_id' => 'required|exists:lop_hocs,id',
            'email' => [
                'required', 'email', 'unique:hoc_sinhs,email',
                'regex:/^[a-zA-Z0-9._%+-]+@gmail\.com$/'
            ],

            'sdt' => 'required|numeric|digits_between:10,11',
        ], [
            'email.unique' => 'Email này đã có người sử dụng rồi nhé!! Vui lòng đổi email khác',
            'email.regex' => 'Email bắt buộc phải có định dạng @gmail.com!',
            'sdt.digits_between' => 'Số điện thoại phải từ 10 đến 11 số!',
        ]);
        

        $data = $request->all();

        // TỰ ĐỘNG SINH MÃ HỌC SINH
        $namHienTai = date('Y');
        $hocSinhCuoi = HocSinh::orderBy('id', 'desc')->first();
        $soThuTu = $hocSinhCuoi ? ($hocSinhCuoi->id + 1) : 1;
        $maTuDong = 'HS' . $namHienTai . str_pad($soThuTu, 4, '0', STR_PAD_LEFT); 

        $data['ma_hoc_sinh'] = $maTuDong;

        $hocSinhMoi = HocSinh::create($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Đã thêm thành công! Mã: ' . $maTuDong,
            'data' => $hocSinhMoi
        ]);
    }

    // 3. HÀM CẬP NHẬT (SỬA LẠI CHO CHUẨN)
    public function update(Request $request, string $id) {
        $hocSinh = HocSinh::find($id);

        if (!$hocSinh) {
            return response()->json(['status' => 'error', 'message' => 'Không tìm thấy!'], 404);
        }

        $request->validate([
            'ho_ten' => 'required|string',
            'email' => [
                'required', 'email', 'unique:hoc_sinhs,email,' . $id,
                'regex:/^[a-zA-Z0-9._%+-]+@gmail\.com$/'
            ],
            'sdt' => 'required|numeric|digits_between:10,11',
            'lop_hoc_id' => 'required|exists:lop_hocs,id',
        ]);
        
        $dataCapNhat = $request->except(['ma_hoc_sinh']);
        $hocSinh->update($dataCapNhat);

        return response()->json([
            'status' => 'success',
            'message' => 'Đã cập nhật thành công!',
            'data' => $hocSinh
        ]);
    }

    // 4. HÀM XÓA
    public function destroy(string $id)
    {
        $hocSinh = HocSinh::find($id);
        if (!$hocSinh) {
            return response()->json(['status' => 'error', 'message' => 'Không tìm thấy!'], 404);
        }
        $hocSinh->delete();
        return response()->json(['status' => 'success', 'message' => 'Đã xóa học sinh thành công!']);
    }
}