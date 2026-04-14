<?php
namespace App\Http\Controllers;

use App\Models\DiemSo;
use Illuminate\Http\Request;

class DiemSoController extends Controller
{
    public function index() {
        // Lấy danh sách điểm, kèm theo thông tin Học sinh và Môn học
        $danhSach = DiemSo::with(['hocSinh', 'monHoc'])->get();
        return response()->json(['status' => 'success', 'data' => $danhSach]);
    }

    public function store(Request $request) {
        $diemMoi = DiemSo::create($request->all());
        return response()->json(['status' => 'success', 'data' => $diemMoi]);
    }

    public function update(Request $request, string $id) {
        $diem = DiemSo::find($id);
        if ($diem) {
            $diem->update($request->all());
            return response()->json(['status' => 'success']);
        }
        return response()->json(['status' => 'error'], 404);
    }

    public function destroy(string $id) {
        $diem = DiemSo::find($id);
        if ($diem) $diem->delete();
        return response()->json(['status' => 'success']);
    }
}