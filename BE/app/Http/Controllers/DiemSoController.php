<?php

namespace App\Http\Controllers;

use App\Models\DiemSo;
use Illuminate\Http\Request;

class DiemSoController extends Controller
{
    // 1. LẤY DANH SÁCH ĐIỂM (ĐÃ FIX PHÂN QUYỀN VÀ HIỂN THỊ)
    public function index(Request $request)
    {
        $user = auth('sanctum')->user() ?? $request->user();
        $query = DiemSo::with(['hoc_sinh', 'mon_hoc']);

        if ($user) {
            if ($user->role === 'student') {
                $query->whereHas('hoc_sinh', function ($q) use ($user) {
                    $q->where('user_id', $user->id);
                });
            } 
            elseif ($user->role === 'teacher') {
                $giaoVien = \App\Models\GiaoVien::where('user_id', $user->id)->first();
                
                if ($giaoVien) {
                    // 1. Lấy danh sách ID các lớp mà giáo viên này làm "Chủ nhiệm"
                    $lopChuNhiemIds = \DB::table('giao_vien_lop_hoc')
                        ->where('giao_vien_id', $giaoVien->id)
                        ->where('vai_tro', 'Chủ nhiệm')
                        ->pluck('lop_hoc_id')
                        ->toArray();

                    // 2. Logic gom nhóm: Được xem ĐIỂM MÔN MÌNH DẠY + TOÀN BỘ ĐIỂM LỚP MÌNH CHỦ NHIỆM
                    $query->where(function ($q) use ($giaoVien, $lopChuNhiemIds) {
                        
                        // Điều kiện A: Lấy điểm của môn do mình dạy (vai trò GVBM)
                        $q->where('mon_hoc_id', $giaoVien->mon_hoc_id);

                        // Điều kiện B: Lấy tất cả môn nếu điểm đó thuộc về lớp mình chủ nhiệm
                        if (!empty($lopChuNhiemIds)) {
                            $q->orWhereHas('hoc_sinh', function ($qHocSinh) use ($lopChuNhiemIds) {
                                $qHocSinh->whereIn('lop_hoc_id', $lopChuNhiemIds);
                            });
                        }
                    });
                }
            }
        }

        $data = $query->latest()->get();
        
        return response()->json([
            'status' => 'success', 
            'data' => $data
        ]);
    }

    private function tinhToanTuDong($request)
    {
        // 1. Ép kiểu để tính toán an toàn
        $mieng = (float)($request->diem_mieng ?? 0);
        $d15p = (float)($request->diem_15_phut ?? 0);
        $d1tiet = (float)($request->diem_1_tiet ?? 0);
        $thi = (float)($request->diem_thi ?? 0);

        // 2. Tính Điểm Trung Bình
        $dtb = round(($mieng + $d15p + ($d1tiet * 2) + ($thi * 3)) / 7, 2);

        // 3. Xếp loại
        $xepLoai = 'Yếu';
        if ($dtb >= 8.0) {
            $xepLoai = 'Giỏi';
        } elseif ($dtb >= 6.5) {
            $xepLoai = 'Khá';
        } elseif ($dtb >= 5.0) {
            $xepLoai = 'Trung bình';
        }

        // 4. Chuẩn bị dữ liệu để lưu vào Database
        $data = $request->all();
        
        $data['diem_mieng'] = $mieng;
        $data['diem_15_phut'] = $d15p;
        $data['diem_1_tiet'] = $d1tiet;
        $data['diem_thi'] = $thi;
        $data['diem_trung_binh'] = $dtb;
        $data['xep_loai'] = $xepLoai;

        return $data;
    }

    // 2. THÊM ĐIỂM MỚI (Lưu lẻ tẻ 1 dòng)
    public function store(Request $request)
    {
        $dataDaTinh = $this->tinhToanTuDong($request);
        $diem = DiemSo::create($dataDaTinh);
        return response()->json(['status' => 'success', 'data' => $diem]);
    }

    // 3. CẬP NHẬT ĐIỂM
    public function update(Request $request, $id)
    {
        // --- SỬA THÊM: Khóa cửa sau, chặn giáo viên dùng postman/tools sửa ngầm ---
        $user = auth('sanctum')->user() ?? $request->user();
        if ($user && $user->role === 'teacher') {
            return response()->json(['status' => 'error', 'message' => 'Giáo viên không được phép sửa điểm trực tiếp! Vui lòng nộp đơn.'], 403);
        }
        // ----------------------------------------------------------------------

        $diem = DiemSo::find($id);
        if ($diem) {
            $dataDaTinh = $this->tinhToanTuDong($request);
            $diem->update($dataDaTinh);
            return response()->json(['status' => 'success', 'data' => $diem]);
        }
        return response()->json(['status' => 'error', 'message' => 'Không tìm thấy ID'], 404);
    }

    // 4. XÓA ĐIỂM
    public function destroy($id)
    {
        DiemSo::destroy($id);
        return response()->json(['status' => 'success']);
    }

    // 5. LƯU ĐIỂM HÀNG LOẠT VÀ TỰ ĐỘNG TÍNH ĐIỂM TRUNG BÌNH (DÀNH CHO BẢNG EXCEL)
    public function storeBatch(Request $request)
    {
        $request->validate([
            'mon_hoc_id' => 'required|exists:mon_hocs,id',
            'diem_data' => 'required|array',
        ]);

        // Lấy thông tin user hiện tại
        $user = auth('sanctum')->user() ?? $request->user();

        foreach ($request->diem_data as $item) {
            
            // --- SỬA THÊM: Kiểm tra nếu là giáo viên và điểm ĐÃ TỒN TẠI thì BỎ QUA ---
            if ($user && $user->role === 'teacher') {
                $daCoDiem = \App\Models\DiemSo::where('hoc_sinh_id', $item['hoc_sinh_id'])
                                              ->where('mon_hoc_id', $request->mon_hoc_id)
                                              ->exists();
                if ($daCoDiem) {
                    // Nếu dòng điểm này đã có trong DB, skip vòng lặp (không update)
                    // Giáo viên bắt buộc phải nộp đơn xin sửa điểm
                    continue; 
                }
            }
            // -----------------------------------------------------------------------

            // Chuyển dữ liệu về kiểu số để tính toán
            $m = (float)($item['diem_mieng'] ?? 0);
            $p = (float)($item['diem_15_phut'] ?? 0);
            $t = (float)($item['diem_1_tiet'] ?? 0);
            $hk = (float)($item['diem_thi'] ?? 0);

            // Công thức tính ĐTB: (Miệng + 15' + 1 tiết*2 + Thi*3) / 7
            $dtb = round(($m + $p + ($t * 2) + ($hk * 3)) / 7, 2);

            // Xếp loại dựa trên ĐTB
            $xepLoai = 'Yếu';
            if ($dtb >= 8) $xepLoai = 'Giỏi';
            elseif ($dtb >= 6.5) $xepLoai = 'Khá';
            elseif ($dtb >= 5) $xepLoai = 'Trung bình';

            // Lưu hoặc Cập nhật vào Database
            \App\Models\DiemSo::updateOrCreate(
                [
                    'hoc_sinh_id' => $item['hoc_sinh_id'], 
                    'mon_hoc_id' => $request->mon_hoc_id
                ],
                [
                    'diem_mieng' => $item['diem_mieng'],
                    'diem_15_phut' => $item['diem_15_phut'],
                    'diem_1_tiet' => $item['diem_1_tiet'],
                    'diem_thi' => $item['diem_thi'],
                    'diem_trung_binh' => $dtb,
                    'xep_loai' => $xepLoai
                ]
            );
        }

        return response()->json(['status' => 'success', 'message' => 'Đã lưu điểm thành công! Các ô bị khóa sẽ không thay đổi.']);
    }
}