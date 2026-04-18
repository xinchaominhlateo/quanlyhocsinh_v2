<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Import đầy đủ các Controller
use App\Http\Controllers\HocSinhController;
use App\Http\Controllers\LopHocController;
use App\Http\Controllers\MonHocController;
use App\Http\Controllers\DiemSoController;
use App\Http\Controllers\HanhKiemController;
use App\Http\Controllers\HocPhiController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\GiaoVienController;
use App\Http\Controllers\PhanCongController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// 🛑 1. Tuyến đường Login (Mở cho tất cả mọi người)
Route::post('/login', [AuthController::class, 'login']);

// 🛑 2. Quản lý Tài khoản Admin (T đổi thành /users có chữ 's' để tránh lỗi POST m vừa gặp)
Route::get('/users', [UserController::class, 'index']);
Route::post('/users', [UserController::class, 'store']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);

// 🛑 3. Các Resource API chuẩn
Route::apiResource('hocsinh', HocSinhController::class);
Route::apiResource('lophoc', LopHocController::class);
Route::apiResource('monhoc', MonHocController::class);
Route::apiResource('diemso', DiemSoController::class);
Route::apiResource('hanhkiem', HanhKiemController::class);
Route::apiResource('hocphi', HocPhiController::class);
Route::apiResource('giaovien', GiaoVienController::class);

// 🛑 4. Các route chức năng riêng
Route::get('/phancong', [PhanCongController::class, 'index']);
Route::post('/phancong', [PhanCongController::class, 'store']);
Route::delete('/phancong/{lop_id}/{gv_id}', [PhanCongController::class, 'destroy']);
Route::get('/dashboard-stats', [DashboardController::class, 'index']);

// 🛑 5. Tuyến đường Logout (Bắt buộc phải đang đăng nhập)
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);