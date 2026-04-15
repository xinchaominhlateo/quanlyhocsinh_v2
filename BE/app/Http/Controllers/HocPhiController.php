<?php

namespace App\Http\Controllers;

use App\Models\HocPhi;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class HocPhiController extends Controller
{
    /**
     * Lấy danh sách phiếu thu
     */
    public function index()
    {
        return response()->json(['status' => 'success', 'data' => HocPhi::with('hocSinh')->get()]);
    }

    /**
     * Tạo phiếu thu mới
     */
    public function store(Request $request)
    {
        $hp = HocPhi::create($request->all());
        return response()->json(['status' => 'success', 'data' => $hp]);
    }

    /**
     * Xem chi tiết 1 phiếu (Sửa thành $id)
     */
    public function show($id)
    {
        $hocPhi = HocPhi::with('hocSinh')->find($id);

        if (!$hocPhi) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy thông tin học phí này!'
            ], 404);
        }

        return response()->json([
            'status' => 'success', 
            'data' => $hocPhi
        ]);
    }

    /**
     * Cập nhật phiếu thu - Nút THU TIỀN gọi hàm này (Sửa thành $id)
     */
    public function update(Request $request, $id)
    {
        $hp = HocPhi::find($id);
        
        if ($hp) {
            $hp->update($request->all());
        }
        
        return response()->json(['status' => 'success']);
    }

    /**
     * Xóa phiếu thu - Nút XÓA gọi hàm này (Sửa thành $id)
     */
    public function destroy($id)
    {
        HocPhi::destroy($id);
        return response()->json(['status' => 'success']);
    }
}   