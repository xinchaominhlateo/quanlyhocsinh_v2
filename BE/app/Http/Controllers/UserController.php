<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth; // Nhớ thêm dòng này để dùng Auth

class UserController extends Controller
{
    // Lấy danh sách admin
    public function index() {
        return response()->json(['status' => 'success', 'data' => User::all()]);
    }

    // Thêm Admin mới
    public function store(Request $request) {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
        ], [
            'email.unique' => 'Email này đã được đăng ký tài khoản rồi!',
            'password.min' => 'Mật khẩu ít nhất phải 6 ký tự Tèo nhé!'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password), 
            'role' => $request->role ?? 'admin',
        ]);

        return response()->json(['status' => 'success', 'message' => 'Đã tạo tài khoản admin!', 'data' => $user]);
    }

    /**
     * ✅ HÀM DESTROY ĐÃ NÂNG CẤP BẢO HIỂM
     */
    public function destroy($id) {
        // 1. Kiểm tra tự sát: Lấy ID của ông đang đăng nhập để so sánh
        if (Auth::id() == $id) {
            return response()->json([
                'status' => 'error', 
                'message' => 'M định tự sát hả Tèo? Không được xóa tài khoản đang đăng nhập nha!'
            ], 400);
        }

        // 2. Kiểm tra độc đạo: Đếm xem còn bao nhiêu ông Admin trong bảng
        if (User::count() <= 1) {
            return response()->json([
                'status' => 'error', 
                'message' => 'Hệ thống phải có ít nhất 1 Admin để quản lý, không được xóa hết đâu!'
            ], 400);
        }

        // 3. Nếu vượt qua 2 bước trên thì mới tiến hành xóa
        $user = User::find($id);
        if ($user) {
            $user->delete();
            return response()->json(['status' => 'success', 'message' => 'Đã xóa tài khoản thành công!']);
        }

        return response()->json(['status' => 'error', 'message' => 'Không tìm thấy tài khoản này!'], 404);
    }
}