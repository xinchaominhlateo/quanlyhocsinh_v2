<?php

namespace App\Http\Controllers;

use App\Models\LopHoc;
use Illuminate\Http\Request;

class LopHocController extends Controller
{
    public function index() {
        return response()->json(['status' => 'success', 'data' => LopHoc::all()]);
    }

    public function store(Request $request) {
        $lopMoi = LopHoc::create($request->all());
        return response()->json(['status' => 'success', 'message' => 'Thêm lớp thành công!', 'data' => $lopMoi]);
    }

    public function update(Request $request, string $id) {
        $lop = LopHoc::find($id);
        if (!$lop) return response()->json(['status' => 'error', 'message' => 'Không tìm thấy lớp!'], 404);
        
        $lop->update($request->all());
        return response()->json(['status' => 'success', 'message' => 'Cập nhật thành công!']);
    }

    public function destroy(string $id) {
        $lop = LopHoc::find($id);
        if ($lop) $lop->delete();
        return response()->json(['status' => 'success', 'message' => 'Xóa lớp thành công!']);
    }
}