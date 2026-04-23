<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
public function run(): void
{
    // Xóa user cũ nếu có để tránh trùng lặp email
    \App\Models\User::where('email', 'admin@gmail.com')->delete();

    // Tạo tài khoản Admin mới có role
    \App\Models\User::create([
        'name' => 'Admin Trường Học',
        'email' => 'admin@gmail.com',
        'password' => \Illuminate\Support\Facades\Hash::make('123456'),
        'role' => 'admin', // PHẢI CÓ DÒNG NÀY
    ]);
}
}