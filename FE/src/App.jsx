import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

// Import giao diện của m
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
function App() {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    // Giữ nguyên cấu hình Axios của m
    axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

    const token = localStorage.getItem('token');
    if (token) {
      setIsAuth(true); 
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  // 🛑 NẾU CHƯA ĐĂNG NHẬP -> CHỈ HIỆN ĐÚNG MÀN HÌNH LOGIN (Không có Sidebar)
  if (!isAuth) {
    return <Login setAuth={setIsAuth} />;
  }

  // 🛑 NẾU ĐÃ ĐĂNG NHẬP -> HIỆN NGUYÊN BẢN GIAO DIỆN CŨ CỦA M
  return (
    <Router>
      <div className="d-flex"> {/* Giữ nguyên class d-flex cũ */}
        <Sidebar setAuth={setIsAuth} /> {/* Sidebar nằm bên trái */}
        
        <div className="content p-4 w-100"> {/* Vùng nội dung bên phải y hệt cũ */}
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/hoc-sinh" element={<HocSinh />} />
            <Route path="/giao-vien" element={<GiaoVien />} />
            <Route path="/lop-hoc" element={<LopHoc />} />
            <Route path="/mon-hoc" element={<MonHoc />} />
            <Route path="/diem-so" element={<DiemSo />} />
            <Route path="/hanh-kiem" element={<HanhKiem />} />
            <Route path="/hoc-phi" element={<HocPhi />} />
            <Route path="/phan-cong" element={<PhanCong />} />
            <Route path="/tai-khoan" element={<TaiKhoan />} />
            <Route path="/xin-nghi-phep" element={<XinNghiPhep />} />
            <Route path="/diem-danh" element={<DiemDanh />} />
            <Route path="/phieu-lien-lac" element={<PhieuLienLac />} />
            <Route path="/thong-ke" element={<ThongKe />} />
            <Route path="/tai-khoan-he-thong" element={<QuanLyTaiKhoan />} />
            {/* Nếu gõ sai đường dẫn, tự quay về dashboard */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;