import { NavLink } from 'react-router-dom';
import { 
  Home, Users, GraduationCap, BookOpen, Library, 
  FileSpreadsheet, HeartHandshake, UserCog, LogOut, 
  Calendar, Printer, BarChart3, ShieldCheck, User 
} from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Sidebar = ({ setAuth }) => {
  // 4 quyền chính thức: 'admin', 'bgh', 'giaovu', 'teacher'
  // Nếu ai đó cố tình đăng nhập bằng nick student, menu sẽ trống trơn!
  const userRole = localStorage.getItem('userRole') || 'teacher';

  // 👉 BẢNG PHÂN QUYỀN CHUẨN 100% THEO USE CASE
  const allMenuItems = [
    { path: '/', name: 'Trang Chủ', icon: <Home size={20} />, roles: ['admin', 'bgh', 'giaovu', 'teacher'] }, 
    
    // --- 1. ADMIN ---
    // Admin chỉ lo việc hệ thống, cấp tài khoản
    { path: '/tai-khoan-he-thong', name: 'Quản Lý Tài Khoản', icon: <ShieldCheck size={20} />, roles: ['admin'] }, 

    // --- 2. GIÁO VỤ ---
    // Giáo vụ lo toàn bộ danh mục và sắp xếp phân công
    { path: '/hoc-sinh', name: 'Quản Lý Học Sinh', icon: <Users size={20} />, roles: ['giaovu'] }, 
    { path: '/giao-vien', name: 'Quản Lý Giáo Viên', icon: <GraduationCap size={20} />, roles: ['giaovu'] },
    { path: '/lop-hoc', name: 'Quản Lý Lớp Học', icon: <Library size={20} />, roles: ['giaovu'] },
    { path: '/mon-hoc', name: 'Quản Lý Môn Học', icon: <BookOpen size={20} />, roles: ['giaovu'] },
    { path: '/phan-cong', name: 'Phân Công Giảng Dạy', icon: <Calendar size={20} />, roles: ['giaovu'] },
    
    // --- 3. BAN GIÁM HIỆU & GIÁO VỤ ---
    // Cả 2 role này đều được phép xem thống kê
    { path: '/thong-ke', name: 'Báo Cáo Thống Kê', icon: <BarChart3 size={20} />, roles: ['bgh', 'giaovu'] },

    // --- 4. GIÁO VIÊN ---
    { path: '/diem-so', name: 'Nhập Điểm', icon: <FileSpreadsheet size={20} />, roles: ['teacher'] }, 
    { path: '/hanh-kiem', name: 'Đánh Giá Hạnh Kiểm', icon: <HeartHandshake size={20} />, roles: ['teacher'] }, 
    { path: '/phieu-lien-lac', name: 'In Phiếu Liên Lạc', icon: <Printer size={20} />, roles: ['teacher'] },

    // --- CHUNG (Hồ sơ cá nhân của người đăng nhập) ---
    { path: '/tai-khoan', name: 'Hồ Sơ Cá Nhân', icon: <User size={20} />, roles: ['admin', 'bgh', 'giaovu', 'teacher'] },
  ];

  // Lọc menu: Mày có quyền gì thì tao cho hiện menu đó
  const menuItems = allMenuItems.filter(item => item.roles.includes(userRole));

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

  // Xác định màu badge cho từng Role
  const roleColors = {
    'admin': 'bg-danger',
    'bgh': 'bg-warning text-dark',
    'giaovu': 'bg-info text-dark',
    'teacher': 'bg-success'
  };

  // Đổi tên Role hiển thị cho đẹp
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
      
      {/* HUY HIỆU ROLE ĐẸP MẮT */}
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