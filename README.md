# 🎓 Hệ Thống Quản Lý Học Sinh (Fullstack)

Đây là dự án hệ thống quản lý học sinh trường THPT, cho phép quản lý thông tin học sinh, điểm số và các tác vụ giáo vụ.

## 🛠️ Công nghệ sử dụng
- **Backend:** Laravel (PHP)
- **Frontend:** ReactJS (Vite)
- **Database:** MySQL

---

## 🚀 Hướng dẫn cài đặt và chạy dự án (Local)

Để chạy được dự án này trên máy của bạn, hãy đảm bảo máy đã cài đặt sẵn **XAMPP**, **Composer** và **Node.js**.

### 1. Cấu hình Database
1. Mở XAMPP, bật Apache và MySQL.
2. Truy cập `http://localhost/phpmyadmin` và tạo một database mới tên là `quanlyhocsinh_v2`.
3. Import file `database.sql` (nằm trong thư mục `BE`) vào database vừa tạo.

### 2. Khởi chạy Backend (Laravel)
Mở Terminal, di chuyển vào thư mục `BE` và chạy các lệnh sau:

```bash
cd BE
composer install
copy .env.example .env
php artisan key:generate
php artisan serve