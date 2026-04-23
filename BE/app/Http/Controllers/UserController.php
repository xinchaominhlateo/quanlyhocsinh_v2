<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    // 1. Lấy thông tin tài khoản đang đăng nhập (Profile)
    public function profile(Request $request)
    {
        $user = $request->user();
        
        if ($user->role === 'student') {
            $user->load('hocSinh');
        } elseif ($user->role === 'teacher') {
            $user->load('giaoVien');
        }

        return response()->json(['status' => 'success', 'data' => $user]);
    }

    // 2. Lấy danh sách tất cả người dùng (Chỉ dành cho Admin)
    public function index()
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Không có quyền truy cập'], 403);
        }
        
        $users = User::orderBy('id', 'desc')->get();
        return response()->json(['status' => 'success', 'data' => $users]);
    }

    // 3. Đổi mật khẩu cho người dùng hiện tại
    public function changePassword(Request $request)
    {
        $request->validate([
            'old_password' => 'required',
            'new_password' => 'required|min:6|confirmed',
        ]);

        $user = Auth::user();

        if (!Hash::check($request->old_password, $user->password)) {
            return response()->json(['message' => 'Mật khẩu cũ không chính xác'], 400);
        }

        $user->update(['password' => Hash::make($request->new_password)]);

        return response()->json(['status' => 'success', 'message' => 'Đổi mật khẩu thành công!']);
    }

    // 4. Admin Reset mật khẩu cho một tài khoản bất kỳ về 123456
    public function resetPassword(Request $request, $id)
    {
        if (Auth::user()->role !== 'admin') return response()->json(['message' => 'Cấm'], 403);

        $user = User::find($id);
        if (!$user) return response()->json(['message' => 'Không tìm thấy user'], 404);
        
        $user->update(['password' => Hash::make('123456')]);

        return response()->json(['status' => 'success', 'message' => 'Mật khẩu đã về mặc định: 123456']);
    }

    // 5. Admin tạo tài khoản mới (Hàm store chuẩn nhất)
    public function store(Request $request)
    {
        // Kiểm tra quyền Admin
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Không có quyền thực hiện'], 403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'role' => 'required|in:admin,bgh,giaovu,teacher',
            'password' => 'required|min:6'
        ], [
            'email.unique' => 'Email này đã tồn tại trong hệ thống.',
            'password.min' => 'Mật khẩu phải có ít nhất 6 ký tự.'
        ]);

       $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
            'password' => Hash::make($request->password),
        ]);

        // 2. ⚡ TỰ ĐỘNG TẠO HỒ SƠ NẾU LÀ GIÁO VIÊN
        if ($request->role === 'teacher') {
            // Em dùng Model GiaoVien để tạo hồ sơ rỗng
            \App\Models\GiaoVien::create([
                'user_id' => $user->id, // Kết nối với tài khoản vừa tạo
                'ho_ten'  => $user->name,
                'email'        => $user->email,
                'ma_giao_vien'   => 'GV' . str_pad($user->id, 4, '0', STR_PAD_LEFT), // Tự tạo mã GV kiểu GV0001
                'sdt'          => '', // 👈 Bổ sung giá trị rỗng để tránh lỗi SQL
                'mon_hoc_id'   => 1,  // 👈 Bổ sung ID môn học mặc định (đảm bảo ID này có trong bảng mon_hocs)
                // Các trường khác như sđt, địa chỉ để null hoặc mặc định
            ]);
        }

        return response()->json([
            'status' => 'success', 
            'message' => 'Tạo tài khoản và hồ sơ giáo viên thành công!',
            'data' => $user
        ]);
    }

    // 6. Admin xóa tài khoản
    public function destroy($id)
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Không có quyền truy cập'], 403);
        }

        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Không tìm thấy tài khoản'], 404);
        }

        // Chống lỗi: Không cho phép Admin tự xóa chính mình
        if ($user->id === Auth::id()) {
            return response()->json(['message' => 'Bạn không thể tự xóa tài khoản của chính mình!'], 400);
        }

        $user->delete();
        return response()->json(['status' => 'success', 'message' => 'Đã xóa tài khoản thành công!']);
    }
} // 👈 ĐÂY LÀ DẤU NGOẶC CUỐI CÙNG ĐÓNG CLASS, KHÔNG ĐƯỢC VIẾT GÌ DƯỚI ĐÂY NỮA