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
use App\Http\Controllers\DonXinSuaDiemController; // Khai báo ở đầu file

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// 🛑 1. Tuyến đường công khai
Route::post('/login', [AuthController::class, 'login']);

// 🛑 2. Nhóm Route bắt buộc phải đăng nhập (Dành cho tất cả các vai trò)
Route::middleware('auth:sanctum')->group(function () {
    
    // Các tài nguyên chung
    Route::apiResource('hocsinh', HocSinhController::class);
    Route::apiResource('lophoc', LopHocController::class);
    
    // ✅ THÊM DÒNG NÀY: Cho phép tất cả người dùng đã đăng nhập xem danh sách giáo viên
    // Điều này giúp trang "Phân công" hiện được danh sách giáo viên để chọn
    Route::get('/giaovien', [GiaoVienController::class, 'index']); 

    Route::apiResource('diemso', DiemSoController::class);
    Route::apiResource('hanhkiem', HanhKiemController::class);
    Route::apiResource('users', UserController::class);

    // Nghiệp vụ
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

    // 🛡️ 3. CHỈ ADMIN MỚI ĐƯỢC VÀO CÁC CHỨC NĂNG QUẢN TRỊ
    Route::middleware([\App\Http\Middleware\AdminMiddleware::class])->group(function () {
        Route::apiResource('hocphi', HocPhiController::class);        
        Route::post('/hocsinh/ket-chuyen', [HocSinhController::class, 'ketChuyenNamHoc']);
        Route::get('/phancong', [PhanCongController::class, 'index']);
        Route::post('/phancong', [PhanCongController::class, 'store']);
        Route::delete('/phancong/{lop_id}/{gv_id}', [PhanCongController::class, 'destroy']);
        Route::get('/don-sua-diem', [DonXinSuaDiemController::class, 'index']);
        Route::post('/don-sua-diem', [DonXinSuaDiemController::class, 'store']);
    });

    // 🛡️ 4. NHÓM DÀNH CHO CẢ ADMIN VÀ GIÁO VỤ
    Route::middleware([\App\Http\Middleware\AdminMiddleware::class . ':admin,giaovu'])->group(function () {
        // Đã chuyển route quản lý giáo viên xuống đây để Giáo vụ cũng dùng được
        Route::apiResource('giaovien', GiaoVienController::class)->except(['index']);
        Route::apiResource('monhoc', MonHocController::class);
        
        // Đã gộp các route duyệt đơn vào chung nhóm này (xóa bỏ đoạn khai báo lặp middleware)
        Route::put('/don-sua-diem/{id}/duyet', [DonXinSuaDiemController::class, 'duyetDon']);
        Route::put('/don-sua-diem/{id}/tu-choi', [DonXinSuaDiemController::class, 'tuChoiDon']);
    });

}); // <--- ĐÂY LÀ DẤU ĐÓNG CHO NHÓM auth:sanctum ĐÃ BỊ THIẾU