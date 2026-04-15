<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{
    // Hàm xử lý đăng nhập
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        // Kiểm tra xem email và pass có khớp trong DB không
        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            // Tạo ra 1 cái vé (token) cho React lưu lại
            $token = $user->createToken('admin_token')->plainTextToken;

            return response()->json([
                'status' => 'success',
                'message' => 'Đăng nhập thành công',
                'user' => $user,
                'token' => $token
            ]);
        }

        // Nếu sai pass thì đuổi về
        return response()->json([
            'status' => 'error',
            'message' => 'Sai email hoặc mật khẩu!'
        ], 401);
    }

    // Hàm xử lý đăng xuất
    public function logout(Request $request)
    {
        // Xóa cái vé (token) hiện tại
        $request->user()->currentAccessToken()->delete();
        
        return response()->json([
            'status' => 'success',
            'message' => 'Đã đăng xuất!'
        ]);
    }
}