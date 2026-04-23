<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\GiaoVien;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB; // Thêm để dùng Transaction

class GiaoVienController extends Controller
{
    // 1. LẤY DANH SÁCH GIÁO VIÊN
    public function index()
    {
        $data = GiaoVien::with('mon_hoc')->get();
        return response()->json(['status' => 'success', 'data' => $data]);
    }

    // 2. THÊM MỚI GIÁO VIÊN (Đã thêm Transaction để tránh lỗi tạo User rác)
    public function store(Request $request)
    {
        $request->validate([
            'ho_ten' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email|unique:giao_viens,email',
            'sdt' => 'required|numeric|digits_between:10,11',
            'mon_hoc_id' => 'required|exists:mon_hocs,id',
        ], [
            'ho_ten.required' => 'Họ tên không được để trống!',
            'email.unique' => 'Email này đã tồn tại trong hệ thống!',
            'sdt.numeric' => 'Số điện thoại chỉ được chứa các chữ số!',
            'sdt.digits_between' => 'Số điện thoại phải có độ dài từ 10 đến 11 số!',
        ]);

        DB::beginTransaction(); // Bắt đầu Transaction
        try {
            // Tạo tài khoản User
            $user = User::create([
                'name' => $request->ho_ten,
                'email' => $request->email,
                'password' => Hash::make('123456'), 
                'role' => 'teacher' 
            ]);

            // Tự động sinh mã giáo viên
            $namHienTai = date('Y');
            $gvCuoi = GiaoVien::orderBy('id', 'desc')->first();
            $soThuTu = $gvCuoi ? ($gvCuoi->id + 1) : 1;
            $maTuDong = 'GV' . $namHienTai . str_pad($soThuTu, 4, '0', STR_PAD_LEFT);

            // Tạo thông tin giáo viên
            $gv = GiaoVien::create([
                'user_id' => $user->id,
                'ma_giao_vien' => $maTuDong,
                'ho_ten' => $request->ho_ten,
                'email' => $request->email,
                'sdt' => $request->sdt,
                'mon_hoc_id' => $request->mon_hoc_id,
            ]);

            DB::commit(); // Lưu mọi thứ nếu thành công
            return response()->json(['status' => 'success', 'data' => $gv]);

        } catch (\Exception $e) {
            DB::rollBack(); // Xóa sạch dữ liệu vừa tạo nếu có bất kỳ lỗi nào xảy ra
            return response()->json(['status' => 'error', 'message' => 'Lỗi: ' . $e->getMessage()], 500);
        }
    }

    // 3. XEM CHI TIẾT
    public function show($id)
    {
        $gv = GiaoVien::with('mon_hoc')->find($id);
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

        $request->validate([
            'ho_ten' => 'required|string|max:255',
            'email' => 'required|email|unique:giao_viens,email,' . $id,
            'sdt' => 'required|numeric|digits_between:10,11',
            'mon_hoc_id' => 'required|exists:mon_hocs,id',
        ], [
            'sdt.numeric' => 'Số điện thoại phải là định dạng số!',
        ]);

        $gv->update($request->except(['ma_giao_vien']));

        if ($gv->user_id) {
            User::where('id', $gv->user_id)->update([
                'name' => $request->ho_ten,
                'email' => $request->email,
            ]);
        }

        return response()->json(['status' => 'success', 'data' => $gv]);
    }

    // 5. XÓA GIÁO VIÊN
    public function destroy($id)
    {
        $gv = GiaoVien::find($id);
        if (!$gv) {
            return response()->json(['status' => 'error', 'message' => 'Giáo viên không tồn tại!'], 404);
        }

        if ($gv->user_id) {
            User::where('id', $gv->user_id)->delete();
        }

        $gv->delete();
        return response()->json(['status' => 'success', 'message' => 'Đã xóa giáo viên thành công!']);
    }

    // 6. LẤY LỚP VÀ MÔN CHO GIÁO VIÊN ĐANG ĐĂNG NHẬP (Đã sửa)
    public function myClasses(Request $request) 
    {
        $user = $request->user();
        
        // Load kèm môn học của giáo viên này
        $gv = GiaoVien::with('mon_hoc')->where('user_id', $user->id)->first();
        
        if (!$gv) {
            return response()->json([
                'status' => 'success', 
                'data' => [], 
                'mon_hoc' => null
            ]);
        }
        
        // Lấy danh sách các lớp đã được phân công
        $lops = $gv->lopHocs; 
        
        return response()->json([
            'status' => 'success', 
            'data' => $lops,
            'mon_hoc' => $gv->mon_hoc // TRẢ VỀ MÔN HỌC RIÊNG CỦA GV NÀY
        ]);
    }
}