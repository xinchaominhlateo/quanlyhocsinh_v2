<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\HocSinh; 
use App\Models\User;
use App\Models\LopHoc; // ✅ Đã thêm Model lớp học
use Illuminate\Support\Facades\Hash;

class HocSinhController extends Controller
{
    // 1. LẤY DANH SÁCH CÓ PHÂN TRANG VÀ TÌM KIẾM
    public function index(Request $request) {
        $search = $request->query('search');

        $query = HocSinh::with('lop_hoc')->latest();

        if ($search) {
            $query->where('ho_ten', 'LIKE', "%{$search}%")
                  ->orWhere('ma_hoc_sinh', 'LIKE', "%{$search}%");
        }

        $danhSach = $query->paginate(10); 
        
        return response()->json($danhSach); 
    }

    // 2. HÀM THÊM MỚI HỌC SINH & TẠO TÀI KHOẢN
    public function store(Request $request) 
    {
        $request->validate([
            'ho_ten' => 'required|string',
            'ngay_sinh' => 'required|date',
            'gioi_tinh' => 'required',
            'dia_chi' => 'required|string',
            'lop_hoc_id' => 'required|exists:lop_hocs,id',
            'email' => [
                'required', 'email', 
                'unique:users,email', 
                'unique:hoc_sinhs,email',
                'regex:/^[a-zA-Z0-9._%+-]+@gmail\.com$/'
            ],
            'sdt' => 'required|numeric|digits_between:10,11',
        ], [
            'email.unique' => 'Email này đã có người sử dụng rồi nhé!! Vui lòng đổi email khác',
            'email.regex' => 'Email bắt buộc phải có định dạng @gmail.com!',
            'sdt.digits_between' => 'Số điện thoại phải từ 10 đến 11 số!',
        ]);

        // Tạo tài khoản cho học sinh
        $user = User::create([
            'name' => $request->ho_ten,
            'email' => $request->email,
            'password' => Hash::make('123456'), // Mật khẩu mặc định
            'role' => 'student' // Cấp quyền học sinh
        ]);

        $data = $request->all();

        // TỰ ĐỘNG SINH MÃ HỌC SINH
        $namHienTai = date('Y');
        $hocSinhCuoi = HocSinh::orderBy('id', 'desc')->first();
        $soThuTu = $hocSinhCuoi ? ($hocSinhCuoi->id + 1) : 1;
        $maTuDong = 'HS' . $namHienTai . str_pad($soThuTu, 4, '0', STR_PAD_LEFT); 

        $data['ma_hoc_sinh'] = $maTuDong;
        $data['user_id'] = $user->id; // Gắn ID tài khoản vừa tạo

        $hocSinhMoi = HocSinh::create($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Đã thêm thành công! Mã: ' . $maTuDong,
            'data' => $hocSinhMoi
        ]);
    }

    // 3. HÀM CẬP NHẬT THÔNG TIN HỌC SINH & ĐỒNG BỘ TÀI KHOẢN
    public function update(Request $request, string $id) {
        $hocSinh = HocSinh::find($id);

        if (!$hocSinh) {
            return response()->json(['status' => 'error', 'message' => 'Không tìm thấy!'], 404);
        }

        $request->validate([
            'ho_ten' => 'required|string',
            'email' => [
                'required', 'email', 'unique:hoc_sinhs,email,' . $id,
                'regex:/^[a-zA-Z0-9._%+-]+@gmail\.com$/'
            ],
            'sdt' => 'required|numeric|digits_between:10,11',
            'lop_hoc_id' => 'required|exists:lop_hocs,id',
        ]);
        
        $dataCapNhat = $request->except(['ma_hoc_sinh']);
        $hocSinh->update($dataCapNhat);

        // 👉 ĐỒNG BỘ QUA BẢNG USERS
        if ($hocSinh->user_id) {
            User::where('id', $hocSinh->user_id)->update([
                'name' => $request->ho_ten,
                'email' => $request->email
            ]);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Đã cập nhật thành công!',
            'data' => $hocSinh
        ]);
    }

    // 4. HÀM XÓA HỌC SINH & XÓA LUÔN TÀI KHOẢN
    public function destroy(string $id)
    {
        $hocSinh = HocSinh::find($id);
        if (!$hocSinh) {
            return response()->json(['status' => 'error', 'message' => 'Không tìm thấy!'], 404);
        }

        $userId = $hocSinh->user_id;
        $hocSinh->delete();

        if ($userId) {
            User::where('id', $userId)->delete();
        }

        return response()->json(['status' => 'success', 'message' => 'Đã xóa học sinh và tài khoản thành công!']);
    }

    // 5. CHỨC NĂNG XUẤT FILE EXCEL (CSV) THEO LỚP ✅ MỚI THÊM
    public function exportExcel($lop_id)
    {
        $lop = LopHoc::findOrFail($lop_id);
        $hocSinhs = HocSinh::where('lop_hoc_id', $lop_id)->get();

        $fileName = 'Danh_sach_lop_' . $lop->ten_lop . '.csv';

        $headers = [
            "Content-type"        => "text/csv; charset=utf-8",
            "Content-Disposition" => "attachment; filename=$fileName",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $callback = function() use($hocSinhs, $lop) {
            $file = fopen('php://output', 'w');
            
            // Xuất BOM để Excel hiểu là UTF-8 (Hiện đúng tiếng Việt)
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));

            // Dòng tiêu đề file
            fputcsv($file, ['DANH SÁCH HỌC SINH LỚP: ' . $lop->ten_lop]);
            fputcsv($file, []); // Dòng trống

            // Tiêu đề các cột
            fputcsv($file, ['STT', 'Mã Học Sinh', 'Họ Và Tên', 'Giới Tính', 'Ngày Sinh', 'Số Điện Thoại', 'Email', 'Địa Chỉ']);

            // Đổ dữ liệu
            foreach ($hocSinhs as $key => $hs) {
                fputcsv($file, [
                    $key + 1,
                    $hs->ma_hoc_sinh,
                    $hs->ho_ten,
                    $hs->gioi_tinh,
                    $hs->ngay_sinh,
                    $hs->sdt,
                    $hs->email,
                    $hs->dia_chi
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    // 6. CHỨC NĂNG KẾT CHUYỂN NĂM HỌC
    public function ketChuyenNamHoc(Request $request)
    {
        $request->validate([
            'lop_cu_id' => 'required|exists:lop_hocs,id',
            'lop_moi_id' => 'required|exists:lop_hocs,id',
        ]);

        if ($request->lop_cu_id == $request->lop_moi_id) {
            return response()->json(['status' => 'error', 'message' => 'Lớp mới phải khác lớp cũ!'], 400);
        }

        $updatedCount = HocSinh::where('lop_hoc_id', $request->lop_cu_id)
            ->update(['lop_hoc_id' => $request->lop_moi_id]);

        return response()->json([
            'status' => 'success',
            'message' => "Đã kết chuyển thành công $updatedCount học sinh lên lớp mới!"
        ]);
    }
}