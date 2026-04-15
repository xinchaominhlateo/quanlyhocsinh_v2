# 🎓 Hệ Thống Quản Lý Học Sinh (Fullstack)

Đây là dự án hệ thống quản lý học sinh trường THPT, cho phép quản lý thông tin học sinh, điểm số và các tác vụ giáo vụ.

## 🛠️ Công nghệ sử dụng
- **Backend:** Laravel (PHP)
- **Frontend:** ReactJS (Vite)
- **Database:** MySQL

---

## 🛠️ Hướng dẫn cài đặt chi tiết công cụ hỗ trợ

Nếu máy bạn chưa có sẵn môi trường để chạy Laravel và React, hãy cài đặt theo hướng dẫn dưới đây:

### 1. Cài đặt Node.js (Để chạy Frontend React)
- **Bước 1:** Truy cập trang chủ [Node.js](https://nodejs.org/).
- **Bước 2:** Chọn nút tải bản **LTS** (Recommended For Most Users). Đây là bản ổn định nhất.
- **Bước 3:** Mở file `.msi` vừa tải về, nhấn **Next** liên tục và **Finish**.
- **Kiểm tra:** Mở Terminal/Command Prompt, gõ `node -v`. Nếu hiện phiên bản (ví dụ: `v20.x.x`) là xong.

### 2. Cài đặt Composer (Để chạy Backend Laravel)
- **Bước 1:** Tải bộ cài tại: [Composer-Setup.exe](https://getcomposer.org/Composer-Setup.exe).
- **Bước 2:** Chạy file `.exe`. Trong quá trình cài, nếu nó hỏi đường dẫn đến file `php.exe`, hãy trỏ vào thư mục XAMPP của bạn (Thường là: `C:\xampp\php\php.exe`).
- **Bước 3:** Nhấn **Next** cho đến khi hoàn tất.
- **Kiểm tra:** Mở Terminal, gõ `composer -v`. Nếu hiện logo chữ **Composer** bằng ký tự đặc biệt là thành công.

---

## 🚀 Các bước khởi chạy dự án (Sau khi đã có công cụ)

### Bước 1: Thiết lập Database
1. Mở XAMPP Control Panel, nhấn **Start** cho cả **Apache** và **MySQL**.
2. Vào trình duyệt, mở: `http://localhost/phpmyadmin`.
3. Tạo database mới tên là: `quanlyhocsinh_v2`.
4. Chọn database vừa tạo -> Chọn tab **Import** -> Chọn file `quanlyhocsinh_v2.sql` (trong thư mục `BE`) -> Nhấn **Go**.

### Bước 2: Chạy Backend (Laravel)
Mở Terminal, di chuyển vào thư mục gốc và chạy các lệnh sau:
```bash
cd BE
composer install
copy .env.example .env
php artisan key:generate
php artisan serve