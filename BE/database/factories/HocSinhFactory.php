<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class HocSinhFactory extends Factory
{
    public function definition(): array
    {
        // Lưu ý: Tên cột (ho_ten, ngay_sinh...) m phải sửa lại cho ĐÚNG Y CHANG 
        // với tên cột m đã tạo trong file Migration bảng học sinh nhé!
        return [
            'ho_ten' => fake()->name(), // Tự bịa tên thật
            'ngay_sinh' => fake()->date('Y-m-d', '2008-12-31'), // Tự bịa ngày sinh (thế hệ 200X)
            'gioi_tinh' => fake()->randomElement(['Nam', 'Nữ']), // Bốc ngẫu nhiên Nam hoặc Nữ
            'dia_chi' => fake()->address(), // Tự bịa địa chỉ
        ];
    }
}