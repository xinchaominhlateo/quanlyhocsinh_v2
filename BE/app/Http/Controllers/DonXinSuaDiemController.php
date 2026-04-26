<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DonXinSuaDiem;
use App\Models\DiemSo;
use App\Models\GiaoVien;

class DonXinSuaDiemController extends Controller
{
    /**
     * 1. LẤY DANH SÁCH ĐƠN
     * - Giáo viên: Chỉ xem các đơn do chính mình tạo.
     * - Giáo vụ / Admin: Xem toàn bộ đơn của toàn trường để duyệt.
     */
public function index(Request $request)
    {
        try {
            // Lấy thông tin user an toàn nhất
            $user = auth('sanctum')->user() ?? $request->user();
            
            if (!$user) {
                return response()->json(['message' => 'Lỗi: Không tìm thấy thông tin phiên đăng nhập.'], 401);
            }

            $query = DonXinSuaDiem::with(['giao_vien.user', 'diem_so.hoc_sinh', 'diem_so.mon_hoc']);

            if ($user->role === 'teacher') {
                $giaoVien = GiaoVien::where('user_id', $user->id)->first();
                if ($giaoVien) {
                    $query->where('giao_vien_id', $giaoVien->id);
                } else {
                    return response()->json(['status' => 'success', 'data' => []]);
                }
            }

            $data = $query->latest()->get();

            return response()->json([
                'status' => 'success',
                'data' => $data
            ]);

        } catch (\Exception $e) {
            // Bắt mọi loại lỗi (Lỗi thiếu file Model, lỗi Database...) và in thẳng ra màn hình
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi ở Backend: ' . $e->getMessage() . ' (Dòng ' . $e->getLine() . ')'
            ], 500);
        }
    }

    /**
     * 2. GIÁO VIÊN NỘP ĐƠN
     */
    public function store(Request $request)
    {
        $request->validate([
            'diem_so_id' => 'required|exists:diem_sos,id',
            'cot_diem_sai' => 'required|string', // VD: 'diem_15_phut', 'diem_thi'
            'diem_moi' => 'required|numeric|min:0|max:10',
            'ly_do' => 'required|string',
        ]);

        $user = $request->user();
        $giaoVien = GiaoVien::where('user_id', $user->id)->first();

        if (!$giaoVien) {
            return response()->json(['message' => 'Chỉ giáo viên mới được quyền nộp đơn!'], 403);
        }

        // Lấy điểm cũ hiện tại đang lưu trong DB
        $diemSo = DiemSo::find($request->diem_so_id);
        $cot = $request->cot_diem_sai;
        $diemCu = $diemSo->$cot ?? 0;

        // Lưu đơn mới vào CSDL
        $don = DonXinSuaDiem::create([
            'giao_vien_id' => $giaoVien->id,
            'diem_so_id' => $request->diem_so_id,
            'cot_diem_sai' => $request->cot_diem_sai,
            'diem_cu' => (float) $diemCu,
            'diem_moi' => (float) $request->diem_moi,
            'ly_do' => $request->ly_do,
            'trang_thai' => 'Chờ duyệt' // Trạng thái mặc định
        ]);

        return response()->json([
            'status' => 'success', 
            'message' => 'Đã gửi yêu cầu sửa điểm thành công. Vui lòng chờ Giáo vụ duyệt!',
            'data' => $don
        ]);
    }

    /**
     * 3. GIÁO VỤ / ADMIN DUYỆT ĐƠN VÀ TỰ ĐỘNG CẬP NHẬT ĐIỂM
     */
    public function duyetDon(Request $request, $id)
    {
        $don = DonXinSuaDiem::find($id);

        if (!$don || $don->trang_thai !== 'Chờ duyệt') {
            return response()->json(['message' => 'Đơn này không tồn tại hoặc đã được xử lý!'], 400);
        }

        // Lấy bảng điểm cần sửa
        $diemSo = DiemSo::find($don->diem_so_id);
        
        // Ghi đè điểm mới vào cột bị sai
        $cotDiem = $don->cot_diem_sai; 
        $diemSo->$cotDiem = $don->diem_moi;

        // Ép kiểu an toàn để tính lại ĐTB
        $mieng = (float)($diemSo->diem_mieng ?? 0);
        $d15p = (float)($diemSo->diem_15_phut ?? 0);
        $d1tiet = (float)($diemSo->diem_1_tiet ?? 0);
        $thi = (float)($diemSo->diem_thi ?? 0);

        // Tính lại Điểm Trung Bình và Xếp Loại
        $dtb = round(($mieng + $d15p + ($d1tiet * 2) + ($thi * 3)) / 7, 2);
        $diemSo->diem_trung_binh = $dtb;
        
        $xepLoai = 'Yếu';
        if ($dtb >= 8.0) $xepLoai = 'Giỏi';
        elseif ($dtb >= 6.5) $xepLoai = 'Khá';
        elseif ($dtb >= 5.0) $xepLoai = 'Trung bình';
        
        $diemSo->xep_loai = $xepLoai;

        // Lưu bảng điểm mới
        $diemSo->save();
        
        // Đổi trạng thái đơn thành Đã duyệt
        $don->trang_thai = 'Đã duyệt';
        $don->save();

        return response()->json([
            'status' => 'success', 
            'message' => 'Đã duyệt đơn và hệ thống đã tự động tính lại ĐTB cho học sinh!'
        ]);
    }

    /**
     * 4. GIÁO VỤ / ADMIN TỪ CHỐI ĐƠN
     */
    public function tuChoiDon(Request $request, $id)
    {
        $don = DonXinSuaDiem::find($id);

        if (!$don || $don->trang_thai !== 'Chờ duyệt') {
            return response()->json(['message' => 'Đơn này không tồn tại hoặc đã được xử lý!'], 400);
        }

        $don->trang_thai = 'Từ chối';
        $don->save();

        return response()->json([
            'status' => 'success', 
            'message' => 'Đã từ chối yêu cầu sửa điểm!'
        ]);
    }
}