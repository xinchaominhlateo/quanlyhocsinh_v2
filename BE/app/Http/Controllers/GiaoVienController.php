<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\GiaoVien;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class GiaoVienController extends Controller
{
    // 1. LẤY DANH SÁCH GIÁO VIÊN
    public function index()
    {
        $data = GiaoVien::with('mon_hoc')->get();
        return response()->json(['status' => 'success', 'data' => $data]);
    }

    // 2. THÊM MỚI GIÁO VIÊN
    public function store(Request $request)
    {
        // Bắt lỗi dữ liệu đầu vào
        $request->validate([
            'ho_ten' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email|unique:giao_viens,email',
            'sdt' => 'required|numeric|digits_between:10,11',
            'mon_hoc_id' => 'required|exists:mon_hocs,id',
        ], [
            'ho_ten.required' => 'Họ tên không được để trống!',
            'email.unique' => 'Email này đã tồn tại trong hệ thống!',
            'sdt.numeric' => 'Số điện thoại chỉ được chứa các chữ số!',
            'sdt.digits_between' => 'Số điện thoại phải có độ dài từ 10 đến 11 số!',
        ]);

        // Tạo tài khoản User để đăng nhập
        $user = User::create([
            'name' => $request->ho_ten,
            'email' => $request->email,
            'password' => Hash::make('123456'), // Mật khẩu mặc định
            'role' => 'teacher' 
        ]);

        $data = $request->all();

        // Tự động sinh mã giáo viên
        $namHienTai = date('Y');
        $gvCuoi = GiaoVien::orderBy('id', 'desc')->first();
        $soThuTu = $gvCuoi ? ($gvCuoi->id + 1) : 1;
        $maTuDong = 'GV' . $namHienTai . str_pad($soThuTu, 4, '0', STR_PAD_LEFT);

        $data['ma_giao_vien'] = $maTuDong;
        $data['user_id'] = $user->id; // Gắn ID tài khoản vào giáo viên
        
        $gv = GiaoVien::create($data);
        return response()->json(['status' => 'success', 'data' => $gv]);
    }

    // 3. XEM CHI TIẾT
    public function show($id)
    {
        $gv = GiaoVien::with('mon_hoc')->find($id);
        if (!$gv) {
            return response()->json(['status' => 'error', 'message' => 'Không tìm thấy giáo viên này!'], 404);
        }
        return response()->json(['status' => 'success', 'data' => $gv]);
    }

    // 4. CẬP NHẬT THÔNG TIN
    public function update(Request $request, $id)
    {
        $gv = GiaoVien::find($id);
        if (!$gv) {
            return response()->json(['status' => 'error', 'message' => 'Không tìm thấy giáo viên!'], 404);
        }

        $request->validate([
            'ho_ten' => 'required|string|max:255',
            'email' => 'required|email|unique:giao_viens,email,' . $id,
            'sdt' => 'required|numeric|digits_between:10,11',
            'mon_hoc_id' => 'required|exists:mon_hocs,id',
        ], [
            'sdt.numeric' => 'Số điện thoại phải là định dạng số!',
        ]);

        // Cấm sửa mã giáo viên
        $dataCapNhat = $request->except(['ma_giao_vien']);
        $gv->update($dataCapNhat);

        // 👉 ĐÃ TỐI ƯU: Đồng bộ cập nhật thông tin sang bảng User
        if ($gv->user_id) {
            User::where('id', $gv->user_id)->update([
                'name' => $request->ho_ten,
                'email' => $request->email,
            ]);
        }

        return response()->json(['status' => 'success', 'data' => $gv]);
    }

    // 5. XÓA GIÁO VIÊN
    public function destroy($id)
    {
        $gv = GiaoVien::find($id);
        if (!$gv) {
            return response()->json(['status' => 'error', 'message' => 'Giáo viên không tồn tại!'], 404);
        }

        // 👉 ĐÃ TỐI ƯU: Xóa tận gốc tài khoản đăng nhập của giáo viên này
        if ($gv->user_id) {
            User::where('id', $gv->user_id)->delete();
        }

        $gv->delete();
        return response()->json(['status' => 'success', 'message' => 'Đã xóa giáo viên thành công!']);
    }

    // 6. LẤY DANH SÁCH LỚP DO GIÁO VIÊN ĐÓ PHỤ TRÁCH (DÙNG ĐỂ NHẬP ĐIỂM)
public function myClasses(Request $request) 
    {
        // 1. Lấy thông tin tài khoản đang đăng nhập
        $user = $request->user();
        
        // 2. Tìm thông tin Giáo viên dựa vào user_id
        $gv = GiaoVien::where('user_id', $user->id)->first();
        
        // Nếu tài khoản này chưa được liên kết với Giáo viên nào
        if (!$gv) {
            return response()->json(['status' => 'success', 'data' => []]);
        }
        
        // 3. Gọi qua bảng phân công (Relationship lopHocs) để lấy các lớp MÀ GIÁO VIÊN NÀY DẠY
        $lops = $gv->lopHocs; 
        
        return response()->json(['status' => 'success', 'data' => $lops]);
    }
    }