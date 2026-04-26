<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GiaoVien extends Model {
    use HasFactory;
    
    protected $fillable = ['ma_giao_vien','gioi_tinh', 'ho_ten', 'email', 'sdt', 'mon_hoc_id','user_id'];
    
    // Thiết lập quan hệ: 1 Giáo viên dạy 1 Môn học
    public function mon_hoc() {
        return $this->belongsTo(MonHoc::class, 'mon_hoc_id');
    }
    
    // Thiết lập quan hệ: Giáo viên phụ trách những lớp nào
    public function lop_hocs() {
        return $this->belongsToMany(LopHoc::class, 'giao_vien_lop_hoc', 'giao_vien_id', 'lop_hoc_id')
                    ->withPivot('vai_tro');
    }

    // ✅ ĐÃ THÊM: Liên kết với bảng User để lấy tên đăng nhập hiển thị ra màn hình
    public function user() {
        return $this->belongsTo(User::class, 'user_id');
    }
}