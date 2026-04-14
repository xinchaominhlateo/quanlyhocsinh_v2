<?php
namespace App\Http\Controllers;

use App\Models\MonHoc;
use Illuminate\Http\Request;

class MonHocController extends Controller
{
    public function index() {
        return response()->json(['status' => 'success', 'data' => MonHoc::all()]);
    }

    public function store(Request $request) {
        $monMoi = MonHoc::create($request->all());
        return response()->json(['status' => 'success', 'data' => $monMoi]);
    }

    public function update(Request $request, string $id) {
        $mon = MonHoc::find($id);
        if (!$mon) return response()->json(['status' => 'error'], 404);

        $mon->update($request->all());
        return response()->json(['status' => 'success']);
    }

    public function destroy(string $id) {
        $mon = MonHoc::find($id);
        if ($mon) $mon->delete();
        return response()->json(['status' => 'success']);
    }
}