<?php

namespace App\Http\Controllers;

use App\Models\MonHoc;
use App\Models\GiaoVien;
use Illuminate\Http\Request;

class MonHocController extends Controller
{
  public function index(Request $request) {
        // Lấy người đang đăng nhập
        $user = auth('sanctum')->user() ?? $request->user();

        // NẾU LÀ GIÁO VIÊN: Chỉ lấy đúng 1 môn mà họ dạy
        if ($user && $user->role === 'teacher') {
            $giaoVien = GiaoVien::where('user_id', $user->id)->first();
            
            if ($giaoVien) {
                // Trả về đúng môn của giáo viên đó (Dùng get() để React đổ vào mảng không bị lỗi)
                $data = MonHoc::where('id', $giaoVien->mon_hoc_id)->get();
            } else {
                $data = [];
            }
        } 
        // NẾU LÀ ADMIN HOẶC HỌC SINH: Cho xem toàn bộ danh sách môn
        else {
            $data = MonHoc::all();
        }

        return response()->json(['status' => 'success', 'data' => $data]);
    }
   public function store(Request $request)
    {
        // Nhận TOÀN BỘ dữ liệu từ React (Bao gồm cả hoc_phi)
        $data = $request->all();
        
        // Tự động tạo mã môn học nếu chưa có
        if (empty($data['ma_mon'])) {
            $data['ma_mon'] = 'MH' . time();
        }

        $monHoc = \App\Models\MonHoc::create($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Đã thêm môn học!',
            'data' => $monHoc
        ]);
    }
    public function update(Request $request, $id)
    {
        $monHoc = \App\Models\MonHoc::find($id);
        if (!$monHoc) {
            return response()->json(['status' => 'error', 'message' => 'Không tìm thấy môn học'], 404);
        }

        // Cập nhật TOÀN BỘ dữ liệu (Bao gồm cả hoc_phi mới nếu có sửa)
        $monHoc->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Cập nhật thành công!'
        ]);
    }

    public function destroy(string $id) {
        $mon = MonHoc::find($id);
        if ($mon) {
            $mon->delete();
            return response()->json(['status' => 'success', 'message' => 'Xóa môn thành công!']);
        }
        return response()->json(['status' => 'error', 'message' => 'Môn học không tồn tại!'], 404);
    }
}