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

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Đống Resource API chuẩn đét đây Tèo
Route::apiResource('hocsinh', HocSinhController::class);
Route::apiResource('lophoc', LopHocController::class);
Route::apiResource('monhoc', MonHocController::class);
Route::apiResource('diemso', DiemSoController::class);
Route::apiResource('hanhkiem', HanhKiemController::class);
Route::apiResource('hocphi', HocPhiController::class);