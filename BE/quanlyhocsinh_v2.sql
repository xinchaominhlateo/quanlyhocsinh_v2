-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th4 15, 2026 lúc 03:57 PM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `quanlyhocsinh_v2`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `diem_sos`
--

CREATE TABLE `diem_sos` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `hoc_sinh_id` bigint(20) UNSIGNED NOT NULL,
  `mon_hoc_id` bigint(20) UNSIGNED NOT NULL,
  `diem_mieng` double DEFAULT NULL,
  `diem_15_phut` double DEFAULT NULL,
  `diem_1_tiet` double DEFAULT NULL,
  `diem_thi` double DEFAULT NULL,
  `diem_trung_binh` double DEFAULT NULL,
  `xep_loai` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `diem_sos`
--

INSERT INTO `diem_sos` (`id`, `hoc_sinh_id`, `mon_hoc_id`, `diem_mieng`, `diem_15_phut`, `diem_1_tiet`, `diem_thi`, `diem_trung_binh`, `xep_loai`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 9, 8, 9, 9, 8.9, 'Giỏi', '2026-04-14 21:53:46', '2026-04-14 21:53:46');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `giao_viens`
--

CREATE TABLE `giao_viens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `ho_ten` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `sdt` varchar(255) NOT NULL,
  `mon_hoc_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `giao_vien_lop_hoc`
--

CREATE TABLE `giao_vien_lop_hoc` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `giao_vien_id` bigint(20) UNSIGNED NOT NULL,
  `lop_hoc_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hanh_kiems`
--

CREATE TABLE `hanh_kiems` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `hoc_sinh_id` int(11) NOT NULL,
  `hoc_ki` int(11) NOT NULL,
  `loai` varchar(255) NOT NULL,
  `nhan_xet` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `hanh_kiems`
--

INSERT INTO `hanh_kiems` (`id`, `hoc_sinh_id`, `hoc_ki`, `loai`, `nhan_xet`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'Tốt', NULL, '2026-04-14 22:16:58', '2026-04-14 22:16:58');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hoc_phis`
--

CREATE TABLE `hoc_phis` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `hoc_sinh_id` int(11) NOT NULL,
  `hoc_ki` varchar(255) NOT NULL,
  `so_tien` decimal(15,2) NOT NULL,
  `trang_thai` varchar(255) NOT NULL DEFAULT 'Chưa đóng',
  `ngay_dong` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `hoc_phis`
--

INSERT INTO `hoc_phis` (`id`, `hoc_sinh_id`, `hoc_ki`, `so_tien`, `trang_thai`, `ngay_dong`, `created_at`, `updated_at`) VALUES
(1, 1, 'Học kỳ 2', 9999999999.00, 'Chưa đóng', NULL, '2026-04-15 02:08:54', '2026-04-15 02:08:54');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hoc_sinhs`
--

CREATE TABLE `hoc_sinhs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `ho_ten` varchar(255) NOT NULL,
  `ngay_sinh` date NOT NULL,
  `gioi_tinh` varchar(255) NOT NULL,
  `dia_chi` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `lop_hoc_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `hoc_sinhs`
--

INSERT INTO `hoc_sinhs` (`id`, `ho_ten`, `ngay_sinh`, `gioi_tinh`, `dia_chi`, `created_at`, `updated_at`, `lop_hoc_id`) VALUES
(1, 'Anh tên là Tèo', '2005-03-23', 'Nam', 'cs', '2026-04-14 21:52:54', '2026-04-14 21:52:54', 1),
(2, 'Anh tên là Tèo', '2005-03-23', 'Nam', 'cs', '2026-04-14 23:18:04', '2026-04-14 23:18:04', NULL),
(3, 'Anh tên là Tèo', '2005-03-23', 'Nam', 'cs', '2026-04-15 02:02:00', '2026-04-15 02:02:00', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `lop_hocs`
--

CREATE TABLE `lop_hocs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `ma_lop` varchar(255) NOT NULL,
  `ten_lop` varchar(255) NOT NULL,
  `khoi` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `lop_hocs`
--

INSERT INTO `lop_hocs` (`id`, `ma_lop`, `ten_lop`, `khoi`, `created_at`, `updated_at`) VALUES
(1, 'sc', '12a2', 10, '2026-04-14 21:52:43', '2026-04-14 21:52:43');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_04_14_043639_create_hoc_sinhs_table', 1),
(5, '2026_04_14_044340_create_personal_access_tokens_table', 1),
(6, '2026_04_14_081610_create_lop_hocs_table', 1),
(7, '2026_04_14_083253_add_lop_hoc_id_to_hoc_sinhs_table', 1),
(8, '2026_04_14_085018_create_mon_hocs_table', 1),
(9, '2026_04_14_090308_create_diem_sos_table', 1),
(10, '2026_04_14_093551_create_hanh_kiems_table', 1),
(11, '2026_04_14_105301_create_hoc_phis_table', 1),
(12, '2026_04_15_023730_create_giao_viens_table', 1),
(13, '2026_04_15_034817_create_giao_vien_lop_hoc_table', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `mon_hocs`
--

CREATE TABLE `mon_hocs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `ma_mon` varchar(255) NOT NULL,
  `ten_mon` varchar(255) NOT NULL,
  `khoi` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `mon_hocs`
--

INSERT INTO `mon_hocs` (`id`, `ma_mon`, `ten_mon`, `khoi`, `created_at`, `updated_at`) VALUES
(1, 'Toán', 'Toán học', 10, '2026-04-14 21:53:23', '2026-04-14 21:53:23');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(4, 'App\\Models\\User', 1, 'admin_token', '4c6083c6f9856eb472a74222de4e87df5a4618051c36dc3f72f0a7d741fe51e8', '[\"*\"]', NULL, NULL, '2026-04-14 23:14:12', '2026-04-14 23:14:12'),
(5, 'App\\Models\\User', 1, 'admin_token', '58f7ed664a68907ccc344c671dbf3dc634a70dbff3206a895297ad474cacacce', '[\"*\"]', NULL, NULL, '2026-04-14 23:21:36', '2026-04-14 23:21:36'),
(6, 'App\\Models\\User', 1, 'admin_token', '6ceff1cfd4bbc9d49f8bc3fe6a5d8cc64f678fe3250c23ade5ec5794f68fba14', '[\"*\"]', NULL, NULL, '2026-04-15 02:03:38', '2026-04-15 02:03:38');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('fAmjtqaPb9aRPsQ8phJXU0FizUjTV759m6m64sAm', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 Edg/147.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRXF2MmpReG1zb05FT01QYldNalpqQU5xaE04SVVoZWFzZUxudEFoQyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDk6Imh0dHA6Ly9iYWNrcGVkYWwtZW5kcG9pbnQtbW9ua2hvb2Qubmdyb2stZnJlZS5kZXYiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1776247896);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Admin Trường Học', 'admin@gmail.com', NULL, '$2y$12$bXBqbm1nmBjDn5EZoI4eOuFAHnvQm0PfCmygVXQmtsbdQpJTHCMma', NULL, '2026-04-14 21:51:38', '2026-04-14 21:51:38');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Chỉ mục cho bảng `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Chỉ mục cho bảng `diem_sos`
--
ALTER TABLE `diem_sos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `diem_sos_hoc_sinh_id_foreign` (`hoc_sinh_id`),
  ADD KEY `diem_sos_mon_hoc_id_foreign` (`mon_hoc_id`);

--
-- Chỉ mục cho bảng `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Chỉ mục cho bảng `giao_viens`
--
ALTER TABLE `giao_viens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `giao_viens_email_unique` (`email`),
  ADD KEY `giao_viens_mon_hoc_id_foreign` (`mon_hoc_id`);

--
-- Chỉ mục cho bảng `giao_vien_lop_hoc`
--
ALTER TABLE `giao_vien_lop_hoc`
  ADD PRIMARY KEY (`id`),
  ADD KEY `giao_vien_lop_hoc_giao_vien_id_foreign` (`giao_vien_id`),
  ADD KEY `giao_vien_lop_hoc_lop_hoc_id_foreign` (`lop_hoc_id`);

--
-- Chỉ mục cho bảng `hanh_kiems`
--
ALTER TABLE `hanh_kiems`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `hoc_phis`
--
ALTER TABLE `hoc_phis`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `hoc_sinhs`
--
ALTER TABLE `hoc_sinhs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `hoc_sinhs_lop_hoc_id_foreign` (`lop_hoc_id`);

--
-- Chỉ mục cho bảng `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Chỉ mục cho bảng `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `lop_hocs`
--
ALTER TABLE `lop_hocs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `lop_hocs_ma_lop_unique` (`ma_lop`);

--
-- Chỉ mục cho bảng `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `mon_hocs`
--
ALTER TABLE `mon_hocs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `mon_hocs_ma_mon_unique` (`ma_mon`);

--
-- Chỉ mục cho bảng `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Chỉ mục cho bảng `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Chỉ mục cho bảng `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `diem_sos`
--
ALTER TABLE `diem_sos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `giao_viens`
--
ALTER TABLE `giao_viens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `giao_vien_lop_hoc`
--
ALTER TABLE `giao_vien_lop_hoc`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `hanh_kiems`
--
ALTER TABLE `hanh_kiems`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `hoc_phis`
--
ALTER TABLE `hoc_phis`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `hoc_sinhs`
--
ALTER TABLE `hoc_sinhs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `lop_hocs`
--
ALTER TABLE `lop_hocs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT cho bảng `mon_hocs`
--
ALTER TABLE `mon_hocs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `diem_sos`
--
ALTER TABLE `diem_sos`
  ADD CONSTRAINT `diem_sos_hoc_sinh_id_foreign` FOREIGN KEY (`hoc_sinh_id`) REFERENCES `hoc_sinhs` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `diem_sos_mon_hoc_id_foreign` FOREIGN KEY (`mon_hoc_id`) REFERENCES `mon_hocs` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `giao_viens`
--
ALTER TABLE `giao_viens`
  ADD CONSTRAINT `giao_viens_mon_hoc_id_foreign` FOREIGN KEY (`mon_hoc_id`) REFERENCES `mon_hocs` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `giao_vien_lop_hoc`
--
ALTER TABLE `giao_vien_lop_hoc`
  ADD CONSTRAINT `giao_vien_lop_hoc_giao_vien_id_foreign` FOREIGN KEY (`giao_vien_id`) REFERENCES `giao_viens` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `giao_vien_lop_hoc_lop_hoc_id_foreign` FOREIGN KEY (`lop_hoc_id`) REFERENCES `lop_hocs` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `hoc_sinhs`
--
ALTER TABLE `hoc_sinhs`
  ADD CONSTRAINT `hoc_sinhs_lop_hoc_id_foreign` FOREIGN KEY (`lop_hoc_id`) REFERENCES `lop_hocs` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
