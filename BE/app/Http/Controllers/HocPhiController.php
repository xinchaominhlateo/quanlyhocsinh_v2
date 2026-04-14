<?php

namespace App\Http\Controllers;

use App\Models\HocPhi;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class HocPhiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(['status' => 'success', 'data' => \App\Models\HocPhi::with('hocSinh')->get()]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $hp = \App\Models\HocPhi::create($request->all());
    return response()->json(['status' => 'success', 'data' => $hp]);
    }

    /**
     * Display the specified resource.
     */
    public function show(HocPhi $hocPhi)
    {
        // Tìm học phí theo ID và lấy luôn thông tin học sinh đi kèm
    $hocPhi = \App\Models\HocPhi::with('hocSinh')->find($id);

    // Nếu không tìm thấy thì báo lỗi 404
    if (!$hocPhi) {
        return response()->json([
            'status' => 'error',
            'message' => 'Không tìm thấy thông tin học phí này!'
        ], 404);
    }

    // Nếu thấy thì trả về dữ liệu
    return response()->json([
        'status' => 'success', 
        'data' => $hocPhi
    ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, HocPhi $hocPhi)
    {
        $hp = \App\Models\HocPhi::find($id);
    $hp->update($request->all());
    return response()->json(['status' => 'success']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(HocPhi $hocPhi)
    {
        \App\Models\HocPhi::destroy($id);
    return response()->json(['status' => 'success']);
    }
}
