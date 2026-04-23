<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Import các Controller
use App\Http\Controllers\AuthController;
use App\Http\Controllers\HocSinhController;
use App\Http\Controllers\LopHocController;
use App\Http\Controllers\MonHocController;
use App\Http\Controllers\DiemSoController;
use App\Http\Controllers\HanhKiemController;
use App\Http\Controllers\HocPhiController;
use App\Http\Controllers\GiaoVienController;
use App\Http\Controllers\PhanCongController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PhieuLienLacController;
use App\Http\Controllers\ThongKeController;
use App\Http\Controllers\Api\DashboardController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// 🛑 1. Tuyến đường công khai
Route::post('/login', [AuthController::class, 'login']);

// 🛑 2. Nhóm Route bắt buộc phải đăng nhập
Route::middleware('auth:sanctum')->group(function () {
    
    // Các tài nguyên chung
    Route::apiResource('hocsinh', HocSinhController::class);
    Route::apiResource('lophoc', LopHocController::class);
    Route::apiResource('giaovien', GiaoVienController::class);
    Route::apiResource('diemso', DiemSoController::class);
    Route::apiResource('hanhkiem', HanhKiemController::class);
    Route::apiResource('users', UserController::class);

    // Nghiệp vụ
    Route::get('/phancong', [PhanCongController::class, 'index']);
    Route::post('/phancong', [PhanCongController::class, 'store']);
    Route::delete('/phancong/{lop_id}/{gv_id}', [PhanCongController::class, 'destroy']);
    Route::get('/my-classes', [GiaoVienController::class, 'myClasses']);
    Route::post('/diemso/batch', [DiemSoController::class, 'storeBatch']);
    Route::post('/hanhkiem/batch', [HanhKiemController::class, 'storeBatch']);
    Route::get('/phieulienlac/lop/{lop_id}', [PhieuLienLacController::class, 'getHocSinhTheoLop']);
    Route::get('/phieulienlac/chitiet/{hoc_sinh_id}', [PhieuLienLacController::class, 'getChiTietPhieu']);
    Route::get('/thong-ke/tong-quan', [ThongKeController::class, 'getTongQuan']);
    Route::get('/thongke/dashboard', [ThongKeController::class, 'getDashboardStats']);
    Route::get('/dashboard-stats', [DashboardController::class, 'index']);
    Route::get('/user/profile', [UserController::class, 'profile']);
    Route::post('/users/reset-password/{id}', [UserController::class, 'resetPassword']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // 🛡️ CHỈ ADMIN MỚI ĐƯỢC VÀO
    Route::middleware([\App\Http\Middleware\AdminMiddleware::class])->group(function () {
        Route::apiResource('hocphi', HocPhiController::class);
        Route::apiResource('monhoc', MonHocController::class);
        Route::post('/hocsinh/ket-chuyen', [HocSinhController::class, 'ketChuyenNamHoc']);
    });
});