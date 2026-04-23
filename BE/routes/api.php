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

// 🛑 1. Tuyến đường Login (Mở cho tất cả mọi người không cần đăng nhập)
Route::post('/login', [AuthController::class, 'login']);

// 🛑 2. Các Resource API chuẩn
Route::apiResource('hocsinh', HocSinhController::class);
Route::apiResource('lophoc', LopHocController::class);
Route::apiResource('monhoc', MonHocController::class);
Route::apiResource('diemso', DiemSoController::class);
Route::apiResource('hanhkiem', HanhKiemController::class);
Route::apiResource('hocphi', HocPhiController::class);
Route::apiResource('giaovien', GiaoVienController::class);

// 🛑 3. Các route chức năng riêng
Route::get('/phancong', [PhanCongController::class, 'index']);
Route::post('/phancong', [PhanCongController::class, 'store']);
Route::delete('/phancong/{lop_id}/{gv_id}', [PhanCongController::class, 'destroy']);
Route::get('/dashboard-stats', [DashboardController::class, 'index']);

// 🛑 4. NHÓM ROUTE BẢO MẬT BẮT BUỘC ĐĂNG NHẬP (auth:sanctum)
// ... giữ lại phần login bên trên ...

Route::middleware('auth:sanctum')->group(function () {
    // NHÓM QUẢN LÝ (Chủ yếu cho Giáo vụ/Admin)
    Route::apiResource('hocsinh', HocSinhController::class);
    Route::apiResource('lophoc', LopHocController::class);
    Route::apiResource('monhoc', MonHocController::class);
    Route::apiResource('giaovien', GiaoVienController::class);
    
    // PHÂN CÔNG GIẢNG DẠY
    Route::get('/phancong', [PhanCongController::class, 'index']);
    Route::post('/phancong', [PhanCongController::class, 'store']);
    Route::delete('/phancong/{lop_id}/{gv_id}', [PhanCongController::class, 'destroy']);

    // NGHIỆP VỤ GIÁO VIÊN
    Route::apiResource('diemso', DiemSoController::class);
    Route::apiResource('hanhkiem', HanhKiemController::class);
    Route::post('/diemso/batch', [DiemSoController::class, 'storeBatch']);
    Route::get('/my-classes', [GiaoVienController::class, 'myClasses']);
    Route::get('/phieulienlac/lop/{lop_id}', [PhieuLienLacController::class, 'getHocSinhTheoLop']);
    Route::get('/phieulienlac/chitiet/{hoc_sinh_id}', [PhieuLienLacController::class, 'getChiTietPhieu']);

    // THỐNG KÊ (BGH/Giáo vụ)
    Route::get('/thong-ke/tong-quan', [ThongKeController::class, 'getTongQuan']);

    // QUẢN LÝ TÀI KHOẢN (Admin)
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
    Route::post('/users/reset-password/{id}', [UserController::class, 'resetPassword']);
    
    Route::get('/user/profile', [UserController::class, 'profile']);
    Route::post('/logout', [AuthController::class, 'logout']);
});