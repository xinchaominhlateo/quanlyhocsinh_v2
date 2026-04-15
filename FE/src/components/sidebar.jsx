import { NavLink } from 'react-router-dom';
import { Home, Users, GraduationCap, BookOpen, Library, FileSpreadsheet, HeartHandshake, CreditCard, UserCog, LogOut, Calendar } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';

// Đừng quên thêm { setAuth } ở đây để nhận chìa khóa từ App.jsx
const Sidebar = ({ setAuth }) => {
  // Danh sách menu (Trang Chủ bây giờ sẽ trỏ về màn hình Thống kê/Dashboard)
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

  // Hàm xử lý Đăng xuất
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
        // Gọi API xóa token trên Laravel
        axios.post('/logout')
          .then(() => {
            // Xóa sạch két sắt trên trình duyệt
            localStorage.removeItem('token');
            // Khóa cửa lại, React sẽ tự động đá m ra trang Login
            setAuth(false); 
            Swal.fire('Tạm biệt!', 'Hẹn gặp lại sếp.', 'success');
          })
          .catch((err) => {
            console.error("Lỗi đăng xuất:", err);
            // Kể cả khi mất mạng thì cũng phải xóa thẻ để an toàn
            localStorage.removeItem('token');
            setAuth(false);
          });
      }
    });
  };

  return (
    <div className="bg-dark text-white vh-100 p-3 shadow" style={{ width: '250px', position: 'fixed', top: 0, left: 0, overflowY: 'auto' }}>
      <h4 className="text-center text-warning fw-bold mb-4 mt-2">🏫 TRƯỜNG CẤP 3</h4>
      <hr className="text-secondary" />
      
      <ul className="nav flex-column gap-2">
        {menuItems.map((item, index) => (
          <li className="nav-item" key={index}>
            <NavLink
              to={item.path}
              // Nếu m ở đúng trang đó, nó sẽ bôi xanh (bg-primary), nếu không nó sẽ dùng class hover m tự chế
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-3 rounded text-white ${isActive ? 'bg-primary fw-bold shadow-sm' : 'sidebar-hover-item'}`
              }
              style={{ transition: 'all 0.3s' }}
            >
              {item.icon} {item.name}
            </NavLink>
          </li>
        ))}
      </ul>

      <hr className="text-secondary mt-4" />
      
      <button 
        className="btn btn-danger w-100 d-flex align-items-center justify-content-center gap-2 fw-bold mt-auto mb-3 shadow-sm"
        onClick={handleLogout}
      >
        <LogOut size={20} /> Đăng Xuất
      </button>
    </div>
  );
};

export default Sidebar;