import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';

// MỚI: Import trang Học Sinh thật vào đây!

import HocSinh from './pages/HocSinh'; 
import LopHoc from './pages/LopHoc';
import MonHoc from './pages/MonHoc';
import DiemSo from './pages/DiemSo';
import HanhKiem from './pages/HanhKiem';
import HocPhi from './pages/HocPhi';
// XÓA cái dòng const HocSinh = () => ... cũ đi nhé. 
// Chỉ giữ lại 2 dòng dưới đây:
const TrangChu = () => <h2 className="text-primary fw-bold">🏠 Đây là Bảng Điều Khiển (Dashboard)</h2>;
const DangPhatTrien = () => <h2 className="text-muted fw-bold">🚧 Chức năng này Tèo đang xây dựng, quay lại sau nhé...</h2>;

function App() {
  // ... (Phần return ở dưới m Giữ nguyên y xì đúc không đổi gì hết) ...
  return (
    // Bọc toàn bộ app trong BrowserRouter để kích hoạt phép thuật chuyển trang
    <BrowserRouter>
      <div className="d-flex bg-light min-vh-100">
        
        {/* Lắp cái Thanh Menu bên trái vào đây */}
        <Sidebar />

        {/* Khu vực nội dung bên phải (Phải cách mép trái 250px vì cái Menu nó chiếm chỗ rồi) */}
        <div className="flex-grow-1 p-4" style={{ marginLeft: '250px' }}>
          
          {/* Routes: Chỗ này sẽ tự động thay đổi ruột tùy theo đường link m bấm */}
          <Routes>
            <Route path="/" element={<TrangChu />} />
            <Route path="/hoc-sinh" element={<HocSinh />} />
            
            {/* Các chức năng khác tạm thời trỏ về trang "Đang xây dựng" */}
            <Route path="/giao-vien" element={<DangPhatTrien />} />
           <Route path="/lop-hoc" element={<LopHoc />} />
            <Route path="/mon-hoc" element={<MonHoc />} />
            <Route path="/diem-so" element={<DiemSo />} />
            <Route path="/hanh-kiem" element={<HanhKiem />} />
            <Route path="/hoc-phi" element={<HocPhi />} />
            <Route path="/tai-khoan" element={<DangPhatTrien />} />
          </Routes>

        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;