import { NavLink } from 'react-router-dom';
import { Home, Users, GraduationCap, BookOpen, Library, FileSpreadsheet, HeartHandshake, CreditCard, UserCog, LogOut, Calendar } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Sidebar = ({ setAuth }) => {
  const menuItems = [
    { path: '/', name: 'Trang Chủ', icon: <Home size={20} /> },
    { path: '/hoc-sinh', name: 'Học Sinh', icon: <Users size={20} /> },
    { path: '/giao-vien', name: 'Giáo Viên', icon: <GraduationCap size={20} /> },
    { path: '/lop-hoc', name: 'Lớp Học', icon: <Library size={20} /> },
    { path: '/phan-cong', name: 'Phân Công', icon: <Calendar size={20} /> },
    { path: '/mon-hoc', name: 'Môn Học', icon: <BookOpen size={20} /> },
    { path: '/diem-so', name: 'Điểm Số', icon: <FileSpreadsheet size={20} /> },
    { path: '/hanh-kiem', name: 'Hạnh Kiểm', icon: <HeartHandshake size={20} /> },
    { path: '/hoc-phi', name: 'Học Phí', icon: <CreditCard size={20} /> },
    { path: '/tai-khoan', name: 'Tài Khoản', icon: <UserCog size={20} /> },
  ];

  const handleLogout = () => {
    Swal.fire({
      title: 'Đăng xuất?',
      text: "M muốn thoát hệ thống hả?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Thoát',
      cancelButtonText: 'Ở lại'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.post('/logout')
          .then(() => {
            localStorage.removeItem('token');
            setAuth(false); 
            Swal.fire('Tạm biệt!', 'Hẹn gặp lại sếp.', 'success');
          })
          .catch((err) => {
            console.error("Lỗi đăng xuất:", err);
            localStorage.removeItem('token');
            setAuth(false);
          });
      }
    });
  };

  return (
    /* Chỗ này t đã đổi bg-dark thành style màu xanh Navy (#1e293b) */
    <div 
      className="text-white vh-100 p-3 shadow" 
      style={{ 
        width: '250px', 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        overflowY: 'auto',
        backgroundColor: '#1e293b' // Màu xanh Navy cực xịn
      }}
    >
      <h4 className="text-center text-info fw-bold mb-4 mt-2">🏫 TRƯỜNG CẤP 3</h4>
      <hr style={{ backgroundColor: '#475569' }} />
      
      <ul className="nav flex-column gap-2">
        {menuItems.map((item, index) => (
          <li className="nav-item" key={index}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-3 rounded text-white ${
                  isActive ? 'fw-bold shadow-sm' : 'sidebar-hover-item'
                }`
              }
              style={({ isActive }) => ({
                transition: 'all 0.3s',
                backgroundColor: isActive ? '#334155' : 'transparent', // Màu nền khi đang chọn
                borderLeft: isActive ? '4px solid #0dcaf0' : '4px solid transparent' // Vạch xanh bên trái
              })}
            >
              {item.icon} {item.name}
            </NavLink>
          </li>
        ))}
      </ul>

      <hr style={{ backgroundColor: '#475569' }} className="mt-4" />
      
      <button 
        className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2 fw-bold mt-auto mb-3"
        onClick={handleLogout}
      >
        <LogOut size={20} /> Đăng Xuất
      </button>
    </div>
  );
};

export default Sidebar;