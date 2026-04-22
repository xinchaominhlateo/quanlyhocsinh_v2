import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Login = ({ setAuth }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userRole', res.data.role);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      setAuth(true);
      Swal.fire({
        icon: 'success',
        title: 'Chào mừng trở lại!',
        text: 'Đăng nhập thành công',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      Swal.fire('Thất bại', 'Tài khoản hoặc mật khẩu không đúng', 'error');
    }
  };

  return (
    <div className="vh-100 d-flex align-items-center justify-content-center" 
         style={{ 
           backgroundColor: '#f3f4f6', // Nền xám cực nhạt, dịu mắt
           fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
         }}>
      
      <div className="d-flex shadow-lg bg-white" style={{ width: '850px', borderRadius: '20px', overflow: 'hidden', minHeight: '500px' }}>
        
        {/* Bên trái: Hình ảnh/Màu sắc trang trí */}
        <div className="d-none d-md-flex col-md-6 align-items-center justify-content-center" 
             style={{ background: 'linear-gradient(45deg, #0ea5e9, #6366f1)' }}>
          <div className="text-center text-white p-4">
            <h1 className="fw-bold">Welcome!</h1>
            <p className="opacity-75">Hệ thống quản lý giáo dục thông minh v2.0</p>
            <div style={{ fontSize: '100px' }}>🎓</div>
          </div>
        </div>

        {/* Bên phải: Form đăng nhập */}
        <div className="col-12 col-md-6 p-5 d-flex flex-column justify-content-center">
          <div className="mb-4">
            <h2 className="fw-bold text-dark">Đăng Nhập</h2>
            <p className="text-muted small">Vui lòng nhập thông tin tài khoản của bạn</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label small fw-bold">EMAIL</label>
              <input 
                type="email" 
                className="form-control p-3 border-0 bg-light" 
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ borderRadius: '12px' }}
                required 
              />
            </div>
            <div className="mb-4">
              <label className="form-label small fw-bold">MẬT KHẨU</label>
              <input 
                type="password" 
                className="form-control p-3 border-0 bg-light" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ borderRadius: '12px' }}
                required 
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary w-100 p-3 fw-bold border-0 shadow-sm"
              style={{ 
                borderRadius: '12px', 
                backgroundColor: '#6366f1',
                backgroundImage: 'linear-gradient(to right, #6366f1, #a855f7)'
              }}
            >
              ĐĂNG NHẬP
            </button>
          </form>

          <div className="mt-4 text-center">
            <small className="text-muted">Quên mật khẩu? Liên hệ Admin </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;