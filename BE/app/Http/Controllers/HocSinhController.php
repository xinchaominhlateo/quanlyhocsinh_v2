<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\HocSinh; 
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class HocSinhController extends Controller
{
    // 1. LẤY DANH SÁCH CÓ PHÂN TRANG VÀ TÌM KIẾM
    public function index(Request $request) {
        $search = $request->query('search');

        $query = HocSinh::with('lop_hoc')->latest();

        if ($search) {
            $query->where('ho_ten', 'LIKE', "%{$search}%")
                  ->orWhere('ma_hoc_sinh', 'LIKE', "%{$search}%");
        }

        $danhSach = $query->paginate(10); 
        
        return response()->json($danhSach); 
    }

    // 2. HÀM THÊM MỚI HỌC SINH & TẠO TÀI KHOẢN
    public function store(Request $request) 
    {
        $request->validate([
            'ho_ten' => 'required|string',
            'ngay_sinh' => 'required|date',
            'gioi_tinh' => 'required',
            'dia_chi' => 'required|string',
            'lop_hoc_id' => 'required|exists:lop_hocs,id',
            'email' => [
                'required', 'email', 
                'unique:users,email', 
                'unique:hoc_sinhs,email',
                'regex:/^[a-zA-Z0-9._%+-]+@gmail\.com$/'
            ],
            'sdt' => 'required|numeric|digits_between:10,11',
        ], [
            'email.unique' => 'Email này đã có người sử dụng rồi nhé!! Vui lòng đổi email khác',
            'email.regex' => 'Email bắt buộc phải có định dạng @gmail.com!',
            'sdt.digits_between' => 'Số điện thoại phải từ 10 đến 11 số!',
        ]);

        // Tạo tài khoản cho học sinh
        $user = User::create([
            'name' => $request->ho_ten,
            'email' => $request->email,
            'password' => Hash::make('123456'), // Mật khẩu mặc định
            'role' => 'student' // Cấp quyền học sinh
        ]);

        $data = $request->all();

        // TỰ ĐỘNG SINH MÃ HỌC SINH
        $namHienTai = date('Y');
        $hocSinhCuoi = HocSinh::orderBy('id', 'desc')->first();
        $soThuTu = $hocSinhCuoi ? ($hocSinhCuoi->id + 1) : 1;
        $maTuDong = 'HS' . $namHienTai . str_pad($soThuTu, 4, '0', STR_PAD_LEFT); 

        $data['ma_hoc_sinh'] = $maTuDong;
        $data['user_id'] = $user->id; // Gắn ID tài khoản vừa tạo

        $hocSinhMoi = HocSinh::create($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Đã thêm thành công! Mã: ' . $maTuDong,
            'data' => $hocSinhMoi
        ]);
    }

    // 3. HÀM CẬP NHẬT THÔNG TIN HỌC SINH & ĐỒNG BỘ TÀI KHOẢN
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

        // 👉 THÊM MỚI LÚC CẬP NHẬT: Đồng bộ qua bảng users
        if ($hocSinh->user_id) {
            User::where('id', $hocSinh->user_id)->update([
                'name' => $request->ho_ten,
                'email' => $request->email
            ]);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Đã cập nhật thành công!',
            'data' => $hocSinh
        ]);
    }

    // 4. HÀM XÓA HỌC SINH & XÓA LUÔN TÀI KHOẢN
    public function destroy(string $id)
    {
        $hocSinh = HocSinh::find($id);
        if (!$hocSinh) {
            return response()->json(['status' => 'error', 'message' => 'Không tìm thấy!'], 404);
        }

        // Lấy ID tài khoản trước khi xóa học sinh
        $userId = $hocSinh->user_id;

        // Xóa thông tin học sinh
        $hocSinh->delete();

        // 👉 THÊM MỚI LÚC XÓA: Xóa tài khoản đăng nhập để tránh rác database
        if ($userId) {
            User::where('id', $userId)->delete();
        }

        return response()->json(['status' => 'success', 'message' => 'Đã xóa học sinh và tài khoản thành công!']);
    }
}