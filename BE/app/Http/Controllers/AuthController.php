<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{
    /**
     * Xử lý Đăng nhập và Cấp Token
     */
    public function login(Request $request)
    {
        // 1. Kiểm tra đầu vào (Email phải đúng định dạng, Pass không được để trống)
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // 2. Thử đăng nhập
        if (Auth::attempt($credentials)) {
            $user = Auth::user();

            // 🔑 TẠO TOKEN: Đây là cái "vé" để React lưu vào localStorage
            // M có thể đặt tên token là bất cứ gì, ở đây t đặt là 'AdminToken'
            $token = $user->createToken('AdminToken')->plainTextToken;

            return response()->json([
                'status' => 'success',
                'message' => 'Đăng nhập thành công!',
                'token' => $token, // Gửi vé về cho React
                'user' => $user,    // Gửi kèm thông tin user để hiện tên lên Sidebar
                'role' => $user->role
            ]);
        }

        // 3. Nếu sai tài khoản/mật khẩu
        return response()->json([
            'status' => 'error',
            'message' => 'Email hoặc mật khẩu không đúng Tèo ơi!'
        ], 401);
    }

    /**
     * Xử lý Đăng xuất (Xóa token)
     */
    public function logout(Request $request)
    {
        // Xóa cái token hiện tại của user để lần sau vào phải đăng nhập lại
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Đã đăng xuất, hẹn gặp lại nhé!'
        ]);
    }
}