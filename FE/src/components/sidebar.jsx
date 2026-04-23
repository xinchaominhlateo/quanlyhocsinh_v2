import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, Users, GraduationCap, BookOpen, Library, 
  FileSpreadsheet, HeartHandshake, UserCog, LogOut, 
  Calendar, Printer, BarChart3, ShieldCheck, User, Banknote
} from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Sidebar = ({ setAuth }) => {
  // --- THÊM STATE LƯU QUYỀN CHỦ NHIỆM ---
  const [isChuNhiem, setIsChuNhiem] = useState(false);
  const userRole = localStorage.getItem('userRole') || 'teacher';

  // --- THÊM EFFECT ĐỂ KIỂM TRA QUYỀN KHI LÀ GIÁO VIÊN ---
  // --- THÊM EFFECT ĐỂ KIỂM TRA QUYỀN KHI LÀ GIÁO VIÊN ---
// --- KẾT QUẢ ĐÃ THÀNH CÔNG: MÌNH GỠ BỎ MẤY CÁI BẢNG THÔNG BÁO TEST ĐI ---
  useEffect(() => {
    if (userRole === 'teacher') {
      axios.get('/my-classes')
        .then(res => {
          setIsChuNhiem(res.data.is_chu_nhiem);
        })
        .catch(err => console.log(err));
    }
  }, [userRole]);
  const allMenuItems = [
    { path: '/', name: 'Trang Chủ', icon: <Home size={20} />, roles: ['admin', 'bgh', 'giaovu', 'teacher'] }, 
    
    // --- 1. ADMIN (Giữ nguyên các mục cũ và thêm 2 mục chuyển từ giáo vụ sang) ---
    { path: '/tai-khoan-he-thong', name: 'Quản Lý Tài Khoản', icon: <ShieldCheck size={20} />, roles: ['admin'] }, 
    { path: '/mon-hoc', name: 'Quản Lý Môn Học', icon: <BookOpen size={20} />, roles: ['admin'] }, // 🔒 Chỉ Admin được vào
    { path: '/hoc-phi', name: 'Quản Lý Học Phí', icon: <Banknote size={20} />, roles: ['admin'] }, // 🔒 Chỉ Admin được vào
    { path: '/ket-chuyen', name: 'Kết Chuyển Năm Học', icon: <GraduationCap size={20} />, roles: ['giaovu', 'admin'] },

    // --- 2. GIÁO VỤ (Đã bỏ bớt 2 mục trên) ---
    { path: '/hoc-sinh', name: 'Quản Lý Học Sinh', icon: <Users size={20} />, roles: ['giaovu'] }, 
    { path: '/giao-vien', name: 'Quản Lý Giáo Viên', icon: <GraduationCap size={20} />, roles: ['admin'] },
    { path: '/lop-hoc', name: 'Quản Lý Lớp Học', icon: <Library size={20} />, roles: ['giaovu'] },
    { path: '/phan-cong', name: 'Phân Công Giảng Dạy', icon: <Calendar size={20} />, roles: ['admin'] },
    
    // --- 3. CHỈ BAN GIÁM HIỆU ĐƯỢC XEM ---
    { path: '/thong-ke', name: 'Báo Cáo Thống Kê', icon: <BarChart3 size={20} />, roles: ['bgh'] }, 

    // --- 4. GIÁO VIÊN ---
    { path: '/diem-so', name: 'Nhập Điểm', icon: <FileSpreadsheet size={20} />, roles: ['teacher'] }, 
    // --- SỬA: Thêm cờ requiresChuNhiem cho 2 menu dưới ---
    { path: '/han-kiem', name: 'Đánh Giá Hạnh Kiểm', icon: <HeartHandshake size={20} />, roles: ['teacher'], requiresChuNhiem: true }, 
    { path: '/phieu-lien-lac', name: 'In Phiếu Liên Lạc', icon: <Printer size={20} />, roles: ['teacher'], requiresChuNhiem: true },

    // --- CHUNG ---
    { path: '/tai-khoan', name: 'Hồ Sơ Cá Nhân', icon: <User size={20} />, roles: ['admin', 'bgh', 'giaovu', 'teacher'] },
  ];

  // --- SỬA LOGIC LỌC MENU ---
  const menuItems = allMenuItems.filter(item => {
    // 1. Kiểm tra role cứng
    if (!item.roles.includes(userRole)) return false;
    // 2. Nếu menu có cờ requiresChuNhiem mà giáo viên này không phải chủ nhiệm -> Xóa khỏi menu
    if (item.requiresChuNhiem && !isChuNhiem) return false;
    return true;
  });

  const handleLogout = () => {
    Swal.fire({
      title: 'Đăng xuất?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#6366f1',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Thoát',
      cancelButtonText: 'Ở lại'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.post('/logout').finally(() => {
          localStorage.clear();
          window.location.href = '/';
          setAuth(false); 
        });
      }
    });
  };

  const roleColors = {
    'admin': 'bg-danger',
    'bgh': 'bg-warning text-dark',
    'giaovu': 'bg-info text-dark',
    'teacher': 'bg-success'
  };

  const roleNames = {
    'admin': 'QUẢN TRỊ VIÊN',
    'bgh': 'BAN GIÁM HIỆU',
    'giaovu': 'GIÁO VỤ',
    'teacher': 'GIÁO VIÊN'
  };

  return (
    <div className="vh-100 p-3 shadow-sm" style={{ width: '250px', position: 'fixed', top: 0, left: 0, overflowY: 'auto', backgroundColor: '#f8fafc', borderRight: '1px solid #e2e8f0' }}>
      <div className="d-flex align-items-center justify-content-center gap-2 mb-4 mt-2">
        <span style={{ fontSize: '1.5rem' }}>🏫</span>
        <h5 className="fw-bold m-0" style={{ color: '#1e293b', letterSpacing: '1px' }}>QUẢN LÝ CẤP 3</h5>
      </div>
      
      <div className="text-center mb-3">
        <span className={`badge px-3 py-2 shadow-sm ${roleColors[userRole] || 'bg-secondary'}`}>
          {roleNames[userRole] || 'VÔ DANH'}
        </span>
      </div>
      
      <hr style={{ color: '#cbd5e1' }} />
      
      <ul className="nav flex-column gap-1">
        {menuItems.map((item, index) => (
          <li className="nav-item" key={index}>
            <NavLink
              to={item.path}
              className={({ isActive }) => `nav-link d-flex align-items-center gap-3 rounded ${isActive ? 'fw-bold shadow-sm' : 'sidebar-hover-item'}`}
              style={({ isActive }) => ({
                transition: 'all 0.2s ease-in-out',
                color: isActive ? '#6366f1' : '#475569', 
                backgroundColor: isActive ? '#ffffff' : 'transparent', 
                borderLeft: isActive ? '4px solid #6366f1' : '4px solid transparent'
              })}
            >
              {item.icon} <span style={{ fontSize: '0.95rem' }}>{item.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-4">
        <hr style={{ color: '#cbd5e1' }} className="mb-4" />
        <button className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2 fw-bold" onClick={handleLogout}>
          <LogOut size={18} /> Đăng Xuất
        </button>
      </div>
    </div>
  );
};

export default Sidebar;