<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Gom hết tất cả các "địa chỉ" vào đây
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
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Đống Resource API chuẩn đét đây Tèo
Route::apiResource('hocsinh', HocSinhController::class);
Route::apiResource('lophoc', LopHocController::class);
Route::get('/phancong', [PhanCongController::class, 'index']);
Route::post('/phancong', [PhanCongController::class, 'store']);
Route::delete('/phancong/{lop_id}/{gv_id}', [PhanCongController::class, 'destroy']);
Route::apiResource('monhoc', MonHocController::class);
Route::apiResource('diemso', DiemSoController::class);
Route::apiResource('hanhkiem', HanhKiemController::class);
Route::apiResource('hocphi', HocPhiController::class);
Route::apiResource('giaovien', GiaoVienController::class);
Route::get('/dashboard-stats', [DashboardController::class, 'index']);
// Tuyến đường cho Login (Không cần bảo vệ vì chưa đăng nhập mà)
Route::post('/login', [AuthController::class, 'login']);

// Tuyến đường Logout (Bắt buộc phải đang đăng nhập mới được logout)
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);