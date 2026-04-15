<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Tạo 1 tài khoản Admin mặc định
        User::create([
            'name' => 'Admin Trường Học',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('123456'), // Mật khẩu là 123456
        ]);
    }
}