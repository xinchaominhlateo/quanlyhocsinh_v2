import { NavLink } from 'react-router-dom';
import { Home, Users, GraduationCap, BookOpen, Library, FileSpreadsheet, HeartHandshake, CreditCard, UserCog, LogOut, Calendar, BarChart3 } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Sidebar = ({ setAuth }) => {
  // 👉 BƯỚC 1: Lấy quyền của người đang đăng nhập từ máy lên
  const userRole = localStorage.getItem('userRole') || 'student'; // Mặc định là student cho an toàn

  // 👉 BƯỚC 2: Định nghĩa danh sách toàn bộ Menu
  const allMenuItems = [
    { path: '/', name: 'Trang Chủ', icon: <Home size={20} />, roles: ['admin', 'teacher', 'student'] }, // Ai cũng thấy
    { path: '/thong-ke', name: 'Thống Kê', icon: <BarChart3 size={20} />, roles: ['admin'] },
    { path: '/hoc-sinh', name: 'Học Sinh', icon: <Users size={20} />, roles: ['admin', 'teacher'] }, // Giáo viên cũng có thể xem ds HS
    { path: '/giao-vien', name: 'Giáo Viên', icon: <GraduationCap size={20} />, roles: ['admin'] },
    { path: '/lop-hoc', name: 'Lớp Học', icon: <Library size={20} />, roles: ['admin'] },
    { path: '/phan-cong', name: 'Phân Công', icon: <Calendar size={20} />, roles: ['admin'] },
    { path: '/mon-hoc', name: 'Môn Học', icon: <BookOpen size={20} />, roles: ['admin'] },
    { path: '/diem-so', name: 'Điểm Số', icon: <FileSpreadsheet size={20} />, roles: ['admin', 'teacher', 'student'] }, // Điểm số ai cũng có phần, nhưng bên trong file DiemSo.jsx sẽ tự chia tiếp
{ path: '/hanh-kiem', name: 'Hạnh Kiểm', icon: <HeartHandshake size={20} />, roles: ['admin', 'teacher', 'student'] },    { path: '/hoc-phi', name: 'Học Phí', icon: <CreditCard size={20} />, roles: ['admin', 'student'] },
    { path: '/tai-khoan', name: 'Tài Khoản', icon: <UserCog size={20} />, roles: ['admin', 'teacher', 'student'] },
  ];

  // 👉 BƯỚC 3: Lọc ra những menu mà người này được phép xem
  const menuItems = allMenuItems.filter(item => item.roles.includes(userRole));

  const handleLogout = () => {
    Swal.fire({
      title: 'Đăng xuất?',
      text: "Bạn có muốn thoát hệ thống ?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#6366f1',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Thoát',
      cancelButtonText: 'Ở lại',
      background: '#ffffff'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.post('/logout')
          .then(() => {
            // 👉 BƯỚC 4: Khi đăng xuất, nhớ xóa luôn quyền trong máy
            localStorage.removeItem('token');
            localStorage.removeItem('userRole'); 
            window.location.href = '/';
            setAuth(false); 
            Swal.fire('Tạm biệt!', 'Hẹn gặp lại bạn.', 'success');
          })
          .catch((err) => {
            console.error("Lỗi đăng xuất:", err);
            localStorage.removeItem('token');
            localStorage.removeItem('userRole'); // Xóa cho chắc chắn
            window.location.href = '/';
            setAuth(false);
          });
      }
    });
  };

  return (
    <div 
      className="vh-100 p-3 shadow-sm" 
      style={{ 
        width: '250px', position: 'fixed', top: 0, left: 0, overflowY: 'auto',
        backgroundColor: '#f8fafc', borderRight: '1px solid #e2e8f0' 
      }}
    >
      <div className="d-flex align-items-center justify-content-center gap-2 mb-4 mt-2">
        <span style={{ fontSize: '1.5rem' }}>🏫</span>
        <h5 className="fw-bold m-0" style={{ color: '#1e293b', letterSpacing: '1px' }}>QUẢN LÝ CẤP 3</h5>
        {/* 👉 THÊM TÊN QUYỀN VÀO ĐÂY ĐỂ DỄ NHÌN NHẬN BIẾT */}
        <span className="badge bg-primary ms-1">{userRole.toUpperCase()}</span>
      </div>
      
      <hr style={{ color: '#cbd5e1' }} />
      
      <ul className="nav flex-column gap-1">
        {menuItems.map((item, index) => (
          <li className="nav-item" key={index}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-3 rounded ${
                  isActive ? 'fw-bold shadow-sm' : 'sidebar-hover-item'
                }`
              }
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
        <button 
          className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2 fw-bold"
          style={{ 
            borderRadius: '8px', border: '1px solid #fee2e2', transition: 'all 0.3s ease' 
          }}
          onClick={handleLogout}
        >
          <LogOut size={18} /> Đăng Xuất
        </button>
      </div>
    </div>
  );
};

export default Sidebar;