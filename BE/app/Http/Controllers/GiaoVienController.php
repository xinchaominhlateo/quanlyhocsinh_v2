<?php

namespace App\Http\Controllers;

use App\Models\GiaoVien;
use Illuminate\Http\Request;

class GiaoVienController extends Controller
{
    // 1. LẤY DANH SÁCH GIÁO VIÊN
    public function index()
    {
        $data = GiaoVien::with('monHoc')->get();
        return response()->json(['status' => 'success', 'data' => $data]);
    }

    // 2. THÊM MỚI GIÁO VIÊN
    public function store(Request $request)
    {
        // 🛑 BẮT LỖI DỮ LIỆU ĐẦU VÀO
        $request->validate([
            'ho_ten' => 'required|string|max:255',
            'email' => 'required|email|unique:giao_viens,email',
            'sdt' => 'required|numeric|digits_between:10,11', // Bắt buộc là số, từ 10-11 ký tự
            'mon_hoc_id' => 'required|exists:mon_hocs,id',
        ], [
            'ho_ten.required' => 'Họ tên không được để trống!',
            'email.unique' => 'Email này đã tồn tại trong hệ thống!',
            'sdt.numeric' => 'Số điện thoại chỉ được chứa các chữ số!',
            'sdt.digits_between' => 'Số điện thoại phải có độ dài từ 10 đến 11 số!',
        ]);

        $data = $request->all();

        // TỰ ĐỘNG SINH MÃ GIÁO VIÊN (VD: GV20260001)
        $namHienTai = date('Y');
        $gvCuoi = GiaoVien::orderBy('id', 'desc')->first();
        $soThuTu = $gvCuoi ? ($gvCuoi->id + 1) : 1;
        $maTuDong = 'GV' . $namHienTai . str_pad($soThuTu, 4, '0', STR_PAD_LEFT);

        $data['ma_giao_vien'] = $maTuDong;

        $gv = GiaoVien::create($data);
        return response()->json(['status' => 'success', 'data' => $gv]);
    }

    // 3. XEM CHI TIẾT
    public function show($id)
    {
        $gv = GiaoVien::with('monHoc')->find($id);

        if (!$gv) {
            return response()->json(['status' => 'error', 'message' => 'Không tìm thấy giáo viên này!'], 404);
        }

        return response()->json(['status' => 'success', 'data' => $gv]);
    }

    // 4. CẬP NHẬT THÔNG TIN
    public function update(Request $request, $id)
    {
        $gv = GiaoVien::find($id);
        
        if (!$gv) {
            return response()->json(['status' => 'error', 'message' => 'Không tìm thấy giáo viên!'], 404);
        }

        // 🛑 BẮT LỖI DỮ LIỆU KHI SỬA
        $request->validate([
            'ho_ten' => 'required|string|max:255',
            'email' => 'required|email|unique:giao_viens,email,' . $id, // Bỏ qua chính nó khi kiểm tra trùng email
            'sdt' => 'required|numeric|digits_between:10,11',
            'mon_hoc_id' => 'required|exists:mon_hocs,id',
        ], [
            'sdt.numeric' => 'Số điện thoại phải là định dạng số!',
        ]);

        // Cấm tuyệt đối không cho sửa mã giáo viên (Giữ tính nhất quán)
        $dataCapNhat = $request->except(['ma_giao_vien']);

        $gv->update($dataCapNhat);
        return response()->json(['status' => 'success', 'data' => $gv]);
    }

    // 5. XÓA GIÁO VIÊN
    public function destroy($id)
    {
        $gv = GiaoVien::find($id);
        if (!$gv) {
            return response()->json(['status' => 'error', 'message' => 'Giáo viên không tồn tại!'], 404);
        }

        $gv->delete();
        return response()->json(['status' => 'success', 'message' => 'Đã xóa giáo viên thành công!']);
    }
}