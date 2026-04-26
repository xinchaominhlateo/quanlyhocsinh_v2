<?php

namespace App\Models;

// 👇 Phải có dòng HasApiTokens này ở trên cùng
use Laravel\Sanctum\HasApiTokens; 
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    // 👇 VÀ PHẢI CÓ CHỮ HasApiTokens Ở ĐÂY NỮA
    use HasApiTokens, HasFactory, Notifiable; 

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // ✅ THÊM: Mối quan hệ kết nối tài khoản này với bảng Giáo Viên
    public function giaoVien()
    {
        return $this->hasOne(GiaoVien::class, 'user_id');
    }

    // ✅ THÊM: Mối quan hệ kết nối tài khoản này với bảng Học Sinh
    public function hocSinh()
    {
        return $this->hasOne(HocSinh::class, 'user_id');
    }
}