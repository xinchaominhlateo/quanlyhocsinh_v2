<?php

namespace App\Http\Controllers;

use App\Models\HanhKiem;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class HanhKiemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(['status' => 'success', 'data' => \App\Models\HanhKiem::with('hocSinh')->get()]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $hk = \App\Models\HanhKiem::create($request->all());
    return response()->json(['status' => 'success', 'data' => $hk]);
    }

    /**
     * Display the specified resource.
     */
    public function show(HanhKiem $hanhKiem)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, HanhKiem $hanhKiem)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(HanhKiem $hanhKiem)
    {
        \App\Models\HanhKiem::destroy($id);
    return response()->json(['status' => 'success']);
    }
}
