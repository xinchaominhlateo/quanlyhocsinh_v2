<?php

namespace App\Http\Controllers;

use App\Models\DiemSo;
use Illuminate\Http\Request;

class DiemSoController extends Controller
{
    // 1. LẤY DANH SÁCH ĐIỂM
    public function index()
    {
        // Lấy điểm kèm theo tên học sinh và tên môn học để hiển thị ra bảng
        $data = DiemSo::with(['hocSinh', 'monHoc'])->get();
        return response()->json(['status' => 'success', 'data' => $data]);
    }

    // --- HÀM BÍ MẬT: TỰ ĐỘNG TÍNH TOÁN (ĐÃ FIX LỖI ÉP KIỂU) ---
// --- HÀM BÍ MẬT: TỰ ĐỘNG TÍNH TOÁN VÀ CHUẨN HÓA DỮ LIỆU ---
    private function tinhToanTuDong($request)
    {
        // 1. Ép kiểu để tính toán an toàn
        $mieng = (float)($request->diem_mieng ?? 0);
        $d15p = (float)($request->diem_15_phut ?? 0);
        $d1tiet = (float)($request->diem_1_tiet ?? 0);
        $thi = (float)($request->diem_thi ?? 0);

        // 2. Tính Điểm Trung Bình
        $dtb = round(($mieng + $d15p + ($d1tiet * 2) + ($thi * 3)) / 7, 1);

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
        
        // 👇 THÊM 4 DÒNG NÀY ĐỂ ÉP SỐ CHUẨN VÀO DB (Tránh lỗi MySQL) 👇
        $data['diem_mieng'] = $mieng;
        $data['diem_15_phut'] = $d15p;
        $data['diem_1_tiet'] = $d1tiet;
        $data['diem_thi'] = $thi;
        $data['diem_trung_binh'] = $dtb;
        $data['xep_loai'] = $xepLoai;

        return $data;
    }

    // 2. THÊM ĐIỂM MỚI
    public function store(Request $request)
    {
        // Gọi hàm tính toán trước khi insert vào DB
        $dataDaTinh = $this->tinhToanTuDong($request);
        $diem = DiemSo::create($dataDaTinh);
        
        return response()->json(['status' => 'success', 'data' => $diem]);
    }

    // 3. CẬP NHẬT ĐIỂM
    public function update(Request $request, $id)
    {
        $diem = DiemSo::find($id);
        if ($diem) {
            // Khi sửa điểm thành phần, ĐTB cũng phải nhảy theo
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
}