import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

// Import giao diện
import Sidebar from './components/sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import HocSinh from './pages/Hocsinh';
import LopHoc from './pages/LopHoc';
import MonHoc from './pages/MonHoc';
import DiemSo from './pages/DiemSo';
import HanhKiem from './pages/HanhKiem';
import HocPhi from './pages/HocPhi';
import GiaoVien from './pages/GiaoVien'; // Nhớ có trang Giáo viên nhé
import PhanCong from './pages/PhanCong';
import TaiKhoan from './pages/TaiKhoan';
function App() {
  // Trạng thái kiểm tra xem đã đăng nhập chưa
  const [isAuth, setIsAuth] = useState(false);

  // Khi vừa mở web lên, tìm xem trong két sắt có vé (token) chưa
// Nối vào trong useEffect của App.jsx
  useEffect(() => {
    // 1. Cấu hình lại toàn bộ Axios dùng chung 1 cái gốc URL này
    axios.defaults.baseURL = import.meta.env.VITE_API_URL;

    // 2. Kiểm tra Token (Code cũ của m)
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuth(true); 
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);
  // NẾU CHƯA ĐĂNG NHẬP -> CHỈ HIỆN ĐÚNG MÀN HÌNH LOGIN
  if (!isAuth) {
    return <Login setAuth={setIsAuth} />;
  }

  // NẾU ĐÃ ĐĂNG NHẬP -> HIỆN BỘ KHUNG GIAO DIỆN
  return (
    <Router>
      <div className="d-flex">
        <Sidebar setAuth={setIsAuth} /> {/* Truyền setAuth vào Sidebar để lát làm nút Đăng Xuất */}
        <div className="content p-4 w-100">
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
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;