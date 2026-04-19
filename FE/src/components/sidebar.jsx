import { NavLink } from 'react-router-dom';
import { Home, Users, GraduationCap, BookOpen, Library, FileSpreadsheet, HeartHandshake, CreditCard, UserCog, LogOut, Calendar, BarChart3 } from 'lucide-react';import axios from 'axios';
import Swal from 'sweetalert2';

const Sidebar = ({ setAuth }) => {
  const menuItems = [
    { path: '/', name: 'Trang Chủ', icon: <Home size={20} /> },
    { path: '/thong-ke', name: 'Thống Kê', icon: <BarChart3 size={20} /> },
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
            localStorage.removeItem('token');
            setAuth(false); 
            Swal.fire('Tạm biệt!', 'Hẹn gặp lại bạn.', 'success');
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
    <div 
      className="vh-100 p-3 shadow-sm" 
      style={{ 
        width: '250px', 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        overflowY: 'auto',
        backgroundColor: '#f8fafc', 
        borderRight: '1px solid #e2e8f0' 
      }}
    >
      <div className="d-flex align-items-center justify-content-center gap-2 mb-4 mt-2">
        <span style={{ fontSize: '1.5rem' }}>🏫</span>
        <h5 className="fw-bold m-0" style={{ color: '#1e293b', letterSpacing: '1px' }}>QUẢN LÝ CẤP 3</h5>
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
    borderRadius: '8px',
    border: '1px solid #fee2e2',
    // ❌ XÓA dòng backgroundColor: '#fff' ở đây đi Tèo nhé
    transition: 'all 0.3s ease' // Thêm cái này cho nó mượt
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