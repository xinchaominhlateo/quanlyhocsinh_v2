import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

// Import các trang
import Dashboard from './pages/Dashboard';
import HocSinh from './pages/Hocsinh';
import Sidebar from './components/sidebar';
import Login from './pages/Login';
import LopHoc from './pages/LopHoc';
import MonHoc from './pages/MonHoc';
import DiemSo from './pages/DiemSo';
import HanhKiem from './pages/HanhKiem';
import HocPhi from './pages/HocPhi';
import GiaoVien from './pages/GiaoVien';
import PhanCong from './pages/PhanCong';
import TaiKhoan from './pages/TaiKhoan';
import XinNghiPhep from './pages/XinNghiPhep';
import DiemDanh from './pages/DiemDanh';
import PhieuLienLac from './pages/PhieuLienLac';
import ThongKe from './pages/ThongKe';
import QuanLyTaiKhoan from './pages/QuanLyTaiKhoan';
import KetChuyenNamHoc from './pages/KetChuyenNamHoc';

function App() {
  // ✅ CẢI TIẾN: Kiểm tra token ngay lập tức để tránh hiện màn hình Login khi F5
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
          localStorage.clear(); // Xóa sạch token "ma"
          setIsAuth(false);     // Đẩy về trang Login
          window.location.href = '/';
        }
        return Promise.reject(error);
      }
    );
  }, [isAuth]);

  // Nếu chưa đăng nhập -> Chỉ hiện Login
  if (!isAuth) {
    return <Login setAuth={setIsAuth} />;
  }

  const userRole = localStorage.getItem('userRole');

  return (
    <Router>
      <div className="d-flex">
        <Sidebar setAuth={setIsAuth} />
        
        <div className="content p-4 w-100" style={{ marginLeft: '250px' }}> {/* Đảm bảo không bị Sidebar đè lên */}
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/hoc-sinh" element={<HocSinh />} />
            <Route path="/giao-vien" element={<GiaoVien />} />
            <Route path="/lop-hoc" element={<LopHoc />} />
            
            {/* 🛡️ ROUTE BẢO MẬT: CHỈ ADMIN MỚI ĐƯỢC VÀO MÔN HỌC */}
            <Route 
              path="/mon-hoc" 
              element={userRole === 'admin' ? <MonHoc /> : <Navigate to="/" />} 
            />

            <Route path="/diem-so" element={<DiemSo />} />
            <Route path="/hanh-kiem" element={<HanhKiem />} />
            
            {/* 🛡️ ROUTE BẢO MẬT: CHỈ ADMIN MỚI ĐƯỢC VÀO HỌC PHÍ (ĐÃ ĐỔI TỪ GIAOVU SANG ADMIN) */}
            <Route 
              path="/hoc-phi" 
              element={userRole === 'admin' ? <HocPhi /> : <Navigate to="/" />} 
            />

            {/* 🛡️ ROUTE BẢO MẬT: CHỈ BAN GIÁM HIỆU */}
            <Route 
              path="/thong-ke" 
              element={userRole === 'bgh' ? <ThongKe /> : <Navigate to="/" />} 
            />

            <Route path="/phan-cong" element={<PhanCong />} />
            <Route path="/tai-khoan" element={<TaiKhoan />} />
            <Route path="/xin-nghi-phep" element={<XinNghiPhep />} />
            <Route path="/diem-danh" element={<DiemDanh />} />
            <Route path="/phieu-lien-lac" element={<PhieuLienLac />} />
            <Route path="/ket-chuyen" element={<KetChuyenNamHoc />} />
            
            {/* 🛡️ ROUTE BẢO MẬT: CHỈ ADMIN MỚI ĐƯỢC VÀO QUẢN LÝ TÀI KHOẢN */}
            <Route 
              path="/tai-khoan-he-thong" 
              element={userRole === 'admin' ? <QuanLyTaiKhoan /> : <Navigate to="/" />} 
            />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;