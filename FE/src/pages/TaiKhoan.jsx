import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { User, Lock, Shield, Key, RefreshCcw } from 'lucide-react';

const TaiKhoan = () => {
  const [userData, setUserData] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [passwordForm, setPasswordForm] = useState({ old_password: '', new_password: '', new_password_confirmation: '' });
  
  const userRole = localStorage.getItem('userRole') || 'student';

  useEffect(() => {
    layThongTinCaNhan();
    if (userRole === 'admin') layDanhSachUsers();
  }, []);

  const layThongTinCaNhan = () => {
    axios.get('/user/profile').then(res => setUserData(res.data.data));
  };

  const layDanhSachUsers = () => {
    axios.get('/users').then(res => setAllUsers(res.data.data));
  };

  const handleDoiMatKhau = (e) => {
    e.preventDefault();
    axios.post('/user/change-password', passwordForm)
      .then(() => {
        Swal.fire('Thành công', 'Mật khẩu đã được thay đổi!', 'success');
        setPasswordForm({ old_password: '', new_password: '', new_password_confirmation: '' });
      })
      .catch(err => Swal.fire('Lỗi', err.response.data.message, 'error'));
  };

  const handleAdminReset = (id) => {
    Swal.fire({
      title: 'Reset mật khẩu?',
      text: "Mật khẩu sẽ trở về mặc định: 123456",
      icon: 'warning',
      showCancelButton: true
    }).then(result => {
      if (result.isConfirmed) {
        axios.post(`/users/reset-password/${id}`).then(() => Swal.fire('Xong!', 'Đã reset thành công', 'success'));
      }
    });
  };

  // ==========================================
  // GIAO DIỆN ADMIN (QUẢN TRỊ DANH SÁCH)
  // ==========================================
  if (userRole === 'admin') {
    return (
      <div className="container-fluid">
        <h2 className="text-primary fw-bold mb-4"><Shield size={28} className="me-2" />QUẢN TRỊ TÀI KHOẢN HỆ THỐNG</h2>
        <div className="card shadow-sm border-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 text-center">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th className="text-start">Tên Người Dùng</th>
                  <th>Email</th>
                  <th>Vai Trò</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map(u => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td className="text-start fw-bold">{u.name}</td>
                    <td>{u.email}</td>
                    <td><span className={`badge ${u.role === 'admin' ? 'bg-danger' : u.role === 'teacher' ? 'bg-primary' : 'bg-success'}`}>{u.role.toUpperCase()}</span></td>
                    <td>
                      <button className="btn btn-sm btn-outline-warning fw-bold" onClick={() => handleAdminReset(u.id)}>
                        <RefreshCcw size={14} className="me-1" /> Reset Pass
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // GIAO DIỆN GIÁO VIÊN & HỌC SINH (HỒ SƠ CÁ NHÂN)
  // ==========================================
  return (
    <div className="container-fluid">
      <h2 className="text-primary fw-bold mb-4"><User size={28} className="me-2" />THÔNG TIN TÀI KHOẢN</h2>
      <div className="row">
        {/* Cột trái: Thông tin cá nhân */}
        <div className="col-md-5 mb-4">
          <div className="card border-0 shadow-sm text-center p-4">
            <div className="mx-auto mb-3 bg-light rounded-circle d-flex align-items-center justify-content-center" style={{width: '80px', height: '80px'}}>
               <User size={40} className="text-primary" />
            </div>
            <h4 className="fw-bold mb-1">{userData?.name}</h4>
            <p className="text-muted">{userData?.email}</p>
            <hr />
            <div className="text-start">
              <p><strong>Quyền:</strong> <span className="badge bg-info text-dark">{userRole.toUpperCase()}</span></p>
              {userRole === 'student' && <p><strong>Mã học sinh:</strong> {userData?.hoc_sinh?.ma_hoc_sinh}</p>}
              {userRole === 'teacher' && <p><strong>Mã giáo viên:</strong> {userData?.giao_vien?.ma_giao_vien}</p>}
            </div>
          </div>
        </div>

        {/* Cột phải: Đổi mật khẩu */}
        <div className="col-md-7">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white fw-bold border-0 pt-3">
               <Lock size={18} className="me-2" /> ĐỔI MẬT KHẨU
            </div>
            <div className="card-body">
              <form onSubmit={handleDoiMatKhau}>
                <div className="mb-3">
                  <label className="form-label">Mật khẩu cũ</label>
                  <input type="password" name="old_password" placeholder="Nhập mật khẩu hiện tại" className="form-control" value={passwordForm.old_password} onChange={e => setPasswordForm({...passwordForm, old_password: e.target.value})} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Mật khẩu mới</label>
                  <input type="password" name="new_password" placeholder="Tối thiểu 6 ký tự" className="form-control" value={passwordForm.new_password} onChange={e => setPasswordForm({...passwordForm, new_password: e.target.value})} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Xác nhận mật khẩu mới</label>
                  <input type="password" name="new_password_confirmation" placeholder="Nhập lại mật khẩu mới" className="form-control" value={passwordForm.new_password_confirmation} onChange={e => setPasswordForm({...passwordForm, new_password_confirmation: e.target.value})} required />
                </div>
                <button type="submit" className="btn btn-primary w-100 fw-bold"><Key size={18} className="me-2" />CẬP NHẬT MẬT KHẨU</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaiKhoan;