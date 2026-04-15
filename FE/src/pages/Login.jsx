import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Login = ({ setAuth }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Gửi email và pass xuống Laravel để check
    axios.post('/login', { email, password })
      .then((res) => {
        // 1. Nếu đúng, cất cái "Vé" (Token) vào két sắt của trình duyệt
        localStorage.setItem('token', res.data.token);
        
        // 2. Gắn Token này vào mọi chuyến xe Axios tiếp theo
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        
        Swal.fire({ icon: 'success', title: 'Chào mừng sếp!', timer: 1500, showConfirmButton: false });
        
        // 3. Báo cho App.jsx mở cửa
        setAuth(true); 
      })
      .catch((err) => {
        console.error(err);
        Swal.fire('Từ chối', 'Sai Email hoặc Mật khẩu rùi Tèo ơi!', 'error');
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
      <div className="card shadow-lg p-4" style={{ width: '400px', borderRadius: '15px' }}>
        <h2 className="text-center text-primary fw-bold mb-4">🏫 TRƯỜNG CẤP 3</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="fw-bold">Email quản trị:</label>
            <input 
              type="email" 
              className="form-control" 
              placeholder="admin@gmail.com"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="mb-4">
            <label className="fw-bold">Mật khẩu:</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="******"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 fw-bold fs-5">
            🔑 Đăng Nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;