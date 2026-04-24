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
import DuyetDonSuaDiem from './pages/DuyetDonSuaDiem';
function App() {
  // Kiểm tra trạng thái đăng nhập dựa trên token trong localStorage
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    // Thiết lập Interceptor để bắt lỗi 401 (Hết hạn phiên đăng nhập)
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
          localStorage.clear(); // Xóa dữ liệu cũ
          setIsAuth(false);     // Chuyển trạng thái về chưa đăng nhập
        //  window.location.href = '/'; // Đẩy về trang chủ/đăng nhập
        }
        return Promise.reject(error);
      }
    );

    // Hủy bỏ interceptor khi component unmount để tránh rò rỉ bộ nhớ
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  // Nếu chưa đăng nhập -> Hiển thị trang Login
  if (!isAuth) {
    return <Login setAuth={setIsAuth} />;
  }

  const userRole = localStorage.getItem('userRole');

  return (
    <Router>
      <div className="d-flex">
        <Sidebar setAuth={setIsAuth} />
        
        {/* Nội dung chính, căn lề trái để không bị Sidebar che khuất */}
        <div className="content p-4 w-100" style={{ marginLeft: '250px' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/hoc-sinh" element={<HocSinh />} />
        <Route 
  path="/giao-vien" 
  // Cho phép cả admin và giaovu truy cập vào trang này
  element={['admin', 'giaovu'].includes(userRole) ? <GiaoVien /> : <Navigate to="/" />} 
/>
            <Route path="/lop-hoc" element={<LopHoc />} />
            
<Route 
              path="/mon-hoc" 
              element={['admin', 'giaovu'].includes(userRole) ? <MonHoc /> : <Navigate to="/" />} 
            />
                        <Route path="/diem-so" element={<DiemSo />} />
            <Route path="/hanh-kiem" element={<HanhKiem />} />
            
            <Route 
              path="/hoc-phi" 
              element={userRole === 'admin' ? <HocPhi /> : <Navigate to="/" />} 
            />

            <Route 
              path="/thong-ke" 
              element={userRole === 'bgh' ? <ThongKe /> : <Navigate to="/" />} 
            />

<Route 
      path="/phan-cong" 
      element={userRole === 'admin' ? <PhanCong /> : <Navigate to="/" />} 
    />            <Route path="/tai-khoan" element={<TaiKhoan />} />
            <Route path="/xin-nghi-phep" element={<XinNghiPhep />} />
            <Route path="/diem-danh" element={<DiemDanh />} />
            <Route path="/phieu-lien-lac" element={<PhieuLienLac />} />
            <Route path="/ket-chuyen" element={<KetChuyenNamHoc />} />
            
            <Route 
              path="/tai-khoan-he-thong" 
              element={userRole === 'admin' ? <QuanLyTaiKhoan /> : <Navigate to="/" />} 
            />
          <Route 
              path="/duyet-sua-diem" 
              element={['admin', 'giaovu', 'teacher'].includes(userRole) ? <DuyetDonSuaDiem /> : <Navigate to="/" />} 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;