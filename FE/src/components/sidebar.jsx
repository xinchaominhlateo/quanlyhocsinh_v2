import { NavLink } from 'react-router-dom';
import { Home, Users, GraduationCap, BookOpen, Library, FileSpreadsheet, HeartHandshake, CreditCard, UserCog, LogOut } from 'lucide-react';

const Sidebar = () => {
  // Danh sách 9 chức năng chính (Chức năng đăng xuất để riêng ở dưới cùng)
  const menuItems = [
    { path: '/', name: 'Trang Chủ', icon: <Home size={20} /> },
    { path: '/hoc-sinh', name: 'Học Sinh', icon: <Users size={20} /> },
    { path: '/giao-vien', name: 'Giáo Viên', icon: <GraduationCap size={20} /> },
    { path: '/lop-hoc', name: 'Lớp Học', icon: <Library size={20} /> },
    { path: '/mon-hoc', name: 'Môn Học', icon: <BookOpen size={20} /> },
    { path: '/diem-so', name: 'Điểm Số', icon: <FileSpreadsheet size={20} /> },
    { path: '/hanh-kiem', name: 'Hạnh Kiểm', icon: <HeartHandshake size={20} /> },
    { path: '/hoc-phi', name: 'Học Phí', icon: <CreditCard size={20} /> },
    { path: '/tai-khoan', name: 'Tài Khoản', icon: <UserCog size={20} /> },
  ];

  return (
    <div className="bg-dark text-white vh-100 p-3 shadow" style={{ width: '250px', position: 'fixed', top: 0, left: 0, overflowY: 'auto' }}>
      <h4 className="text-center text-warning fw-bold mb-4 mt-2">🏫 TRƯỜNG CẤP 3</h4>
      <hr className="text-secondary" />
      
      <ul className="nav flex-column gap-2">
        {menuItems.map((item, index) => (
          <li className="nav-item" key={index}>
            {/* NavLink là phép thuật của React Router, nó sẽ tự biết m đang ở trang nào để bôi màu xanh (active) */}
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-3 rounded text-white ${isActive ? 'bg-primary fw-bold shadow-sm' : 'hover-bg-secondary'}`
              }
              style={{ transition: 'all 0.3s' }}
            >
              {item.icon} {item.name}
            </NavLink>
          </li>
        ))}
      </ul>

      <hr className="text-secondary mt-4" />
      
      {/* Nút Đăng Xuất nằm ở dưới cùng */}
      <button className="btn btn-danger w-100 d-flex align-items-center justify-content-center gap-2 fw-bold mt-auto mb-3 shadow-sm">
        <LogOut size={20} /> Đăng Xuất
      </button>
    </div>
  );
};

export default Sidebar;