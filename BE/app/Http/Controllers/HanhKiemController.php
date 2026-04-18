<?php

namespace App\Http\Controllers;

use App\Models\HanhKiem;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class HanhKiemController extends Controller
{
    /**
     * Lấy danh sách kèm thông tin học sinh
     */
    public function index()
    {
        $data = HanhKiem::with('hocSinh')->get();
        return response()->json(['status' => 'success', 'data' => $data]);
    }

    /**
     * Lưu đánh giá mới
     */
    public function store(Request $request)
    {
        // 🛑 Sửa từ 'xep_loai' thành 'loai' cho khớp với Migration và React
        $request->validate([
            'hoc_sinh_id' => [
                'required',
                // Quy tắc: Một học sinh chỉ được xếp loại 1 lần trong 1 học kỳ
                Rule::unique('hanh_kiems')->where(function ($query) use ($request) {
                    return $query->where('hoc_sinh_id', $request->hoc_sinh_id)
                                 ->where('hoc_ki', $request->hoc_ki);
                }),
            ],
            'hoc_ki' => 'required',
            'loai' => 'required', // 👈 Đã đổi từ xep_loai thành loai
        ], [
            'loai.required' => 'M chưa chọn xếp loại kìa Tèo ơi!',
            'hoc_sinh_id.unique' => 'Học sinh này đã được xếp loại cho học kỳ này rồi!',
        ]);

        $hanhKiem = HanhKiem::create($request->all());
        
        return response()->json([
            'status' => 'success', 
            'message' => 'Lưu hạnh kiểm thành công!',
            'data' => $hanhKiem
        ]);
    }

    /**
     * Xóa đánh giá (Fix lại tham số $id cho chuẩn)
     */
    public function destroy($id)
    {
        $hanhKiem = HanhKiem::find($id);
        
        if (!$hanhKiem) {
            return response()->json(['status' => 'error', 'message' => 'Không tìm thấy dữ liệu!'], 404);
        }

        $hanhKiem->delete();
        
        return response()->json([
            'status' => 'success',
            'message' => 'Đã xóa đánh giá thành công!'
        ]);
    }
}