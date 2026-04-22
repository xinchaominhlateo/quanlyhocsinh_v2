<?php

namespace App\Http\Controllers;

use App\Models\DiemSo;
use Illuminate\Http\Request;

class DiemSoController extends Controller
{
    // 1. LẤY DANH SÁCH ĐIỂM
// 1. LẤY DANH SÁCH ĐIỂM (ĐÃ FIX PHÂN QUYỀN VÀ HIỂN THỊ)
    public function index(Request $request)
    {
        // 1. Lấy thông tin user an toàn (auth('sanctum') giúp tránh lỗi 500 nếu mất token)
        $user = auth('sanctum')->user() ?? $request->user();

        // 2. Chuẩn bị câu lệnh lấy điểm
        $query = DiemSo::with(['hocSinh', 'monHoc']);

        // 3. Phân quyền hiển thị
        if ($user) {
            if ($user->role === 'student') {
                $query->whereHas('hocSinh', function ($q) use ($user) {
                    $q->where('user_id', $user->id);
                });
            } 
            elseif ($user->role === 'teacher') {
                $query->whereHas('monHoc', function ($q) use ($user) {
                    $q->whereHas('giao_viens', function ($q2) use ($user) {
                        $q2->where('user_id', $user->id);
                    });
                });
            }
        }

        // 4. 👉 SỬ DỤNG LẠI get() THAY VÌ paginate() ĐỂ REACT KHÔNG BỊ LỖI MẤT DATA
        $data = $query->latest()->get();
        
        return response()->json([
            'status' => 'success', 
            'data' => $data
        ]);
    }    private function tinhToanTuDong($request)
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
    public function storeBatch(Request $request) {
    $request->validate([
        'mon_hoc_id' => 'required',
        'diem_data' => 'required|array' // Mảng chứa thông tin điểm của nhiều HS
    ]);

    foreach ($request->diem_data as $item) {
        // Tận dụng hàm tính toán tự động đã viết hôm qua
        $tempRequest = new Request($item);
        $tempRequest->merge(['mon_hoc_id' => $request->mon_hoc_id]);
        
        $dataDaTinh = $this->tinhToanTuDong($tempRequest);

        // Nếu đã có điểm môn này rồi thì cập nhật, chưa thì tạo mới
        DiemSo::updateOrCreate(
            [
                'hoc_sinh_id' => $item['hoc_sinh_id'],
                'mon_hoc_id' => $request->mon_hoc_id
            ],
            $dataDaTinh
        );
    }

    return response()->json(['status' => 'success', 'message' => 'Đã lưu điểm cho cả lớp!']);
}
}