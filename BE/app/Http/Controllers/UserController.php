<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    // 1. Lấy thông tin tài khoản đang đăng nhập
    public function profile(Request $request)
    {
        $user = $request->user();
        
        // Nếu là học sinh hoặc giáo viên, mình có thể lấy thêm thông tin chi tiết từ bảng liên quan
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

    // 4. Admin Reset mật khẩu cho một tài khoản bất kỳ
    public function resetPassword(Request $request, $id)
    {
        if (Auth::user()->role !== 'admin') return response()->json(['message' => 'Cấm'], 403);

        $user = User::find($id);
        $user->update(['password' => Hash::make('123456')]);

        return response()->json(['status' => 'success', 'message' => 'Mật khẩu đã về mặc định: 123456']);
    }
}
// 5. Admin tạo tài khoản mới
    public function store(Request $request)
    {
        // Kiểm tra quyền
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Không có quyền truy cập'], 403);
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

        return response()->json(['status' => 'success', 'message' => 'Tạo tài khoản thành công', 'data' => $user]);
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
            return response()->json(['message' => 'Không thể tự xóa chính mình!'], 400);
        }

        $user->delete();
        return response()->json(['status' => 'success', 'message' => 'Đã xóa tài khoản thành công!']);
    }
    // Admin tạo tài khoản mới
    public function store(Request $request)
    {
        if (auth()->user()->role !== 'admin') return response()->json(['message' => 'Cấm'], 403);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'role' => 'required|in:admin,bgh,giaovu,teacher',
            'password' => 'required|min:6'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
            'password' => Hash::make($request->password),
        ]);

        return response()->json(['status' => 'success', 'message' => 'Tạo tài khoản thành công!']);
    }

    // Admin xóa tài khoản
    public function destroy($id)
    {
        if (auth()->user()->role !== 'admin') return response()->json(['message' => 'Cấm'], 403);
        
        $user = User::find($id);
        if (!$user || $user->id === auth()->id()) {
            return response()->json(['message' => 'Không thể xóa tài khoản này'], 400);
        }

        $user->delete();
        return response()->json(['status' => 'success', 'message' => 'Đã xóa tài khoản!']);
    }